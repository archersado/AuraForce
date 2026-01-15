/**
 * WebSocket Manager
 *
 * Manages the WebSocket connection lifecycle for chat communication.
 * Handles connection establishment, message sending/receiving, automatic reconnection,
 * and fallback to SSE when WebSocket is unavailable.
 *
 * Features:
 * - Automatic connection management with exponential backoff
 * - Latency monitoring through ping/pong
 * - Message queuing during disconnection
 * - Falls back to SSE when WebSocket fails
 * - Integration with Claude store for state management
 */

import { useEffect, useRef, useCallback } from 'react';
import { createWebSocketClient, type WebSocketClientImpl, type ConnectionStats } from '@/lib/claude/websocket-client';
import { useClaudeStore } from '@/lib/store/claude-store';
import type { ConnectionState, StreamChunk, StreamStart, StreamEnd, StreamError as StreamErrorType } from '@/lib/claude/types';
import { createChatRequest, type WebSocketMessage } from '@/types/websocket';

/**
 * WebSocket manager configuration
 */
export interface WebSocketManagerConfig {
  wsUrl?: string;
  enableWebSocket?: boolean;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  // Project context
  projectPath?: string;
  projectId?: string;
  projectName?: string;
  // Callbacks for stream events (to integrate with existing stream manager)
  onStreamStart?: (start: StreamStart) => void;
  onStreamChunk?: (chunk: StreamChunk, messageId?: string) => void;
  onStreamEnd?: (end: StreamEnd) => void;
  onStreamError?: (error: StreamErrorType) => void;
  // Fallback to SSE when WebSocket fails
  onFallbackToSSE?: () => void;
}

/**
 * Default WebSocket URL from environment
 */
const DEFAULT_WS_URL =
  typeof window !== 'undefined' && window.location
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/chat`
    : 'ws://localhost:3000/ws/chat';

/**
 * Create and manage a WebSocket client
 */
export function useWebSocketManager(config: WebSocketManagerConfig = {}) {
  const {
    wsUrl = DEFAULT_WS_URL,
    enableWebSocket = true,
    maxReconnectAttempts = 3,
    heartbeatInterval = 30000,
    projectPath,
    projectId,
    projectName,
    onStreamStart,
    onStreamChunk,
    onStreamEnd,
    onStreamError,
    onFallbackToSSE,
  } = config;

  const wsClientRef = useRef<WebSocketClientImpl | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const claudeSessionIdRef = useRef<string | null>(null); // Store Claude SDK session ID for multi-turn conversations


  // Store selectors
  const {
    connectionState,
    setConnectionState,
    setWebSocketLatency,
    setWebSocketReconnectAttempts,
    setWebSocketConnectionStats,
    useWebSocket,
    setUseWebSocket,
    currentSession,
  } = useClaudeStore();

  // Initialize WebSocket client
  useEffect(() => {
    if (!enableWebSocket || !useWebSocket) {
      console.log('[WebSocketManager] WebSocket disabled or not selected');
      return;
    }

    console.log('[WebSocketManager] Initializing WebSocket client...');

    // Create WebSocket client
    wsClientRef.current = createWebSocketClient({
      maxAttempts: maxReconnectAttempts,
    });

    // Setup event listeners
    const client = wsClientRef.current;

    // Stream start event
    client.on('stream-start', (data: unknown) => {
      const start = data as StreamStart;
      onStreamStart?.(start);
    });

    // Stream chunk event
    client.on('stream-chunk', (data: unknown) => {
      const chunk = data as StreamChunk;
      onStreamChunk?.(chunk);
    });

    // Stream end event
    client.on('stream-end', (data: unknown) => {
      const end = data as StreamEnd;
      onStreamEnd?.(end);
    });

    // Stream error event
    client.on('stream-error', (data: unknown) => {
      const error = data as StreamErrorType;
      onStreamError?.(error);

      // Fallback to SSE on error if configured
      if (onFallbackToSSE) {
        console.log('[WebSocketManager] Error occurred, falling back to SSE');
        setUseWebSocket(false);
        onFallbackToSSE();
      }
    });

    // Connection state change event
    client.on('connection-state-change', (data: unknown) => {
      const change = data as { state: ConnectionState; reason?: string };
      console.log('[WebSocketManager] Connection state changed:', change.state, change.reason);
      setConnectionState(change.state);

      // Update reconnect attempts
      if (change.state === 'reconnecting') {
        setWebSocketReconnectAttempts(client.getReconnectAttempts());
      } else if (change.state === 'connected') {
        setWebSocketReconnectAttempts(0);
      }
    });

    // Session update event - store Claude SDK session ID for multi-turn conversations
    client.on('session-update', (data: unknown) => {
      const payload = data as { sessionId?: string; status?: string };
      if (payload.sessionId) {
        claudeSessionIdRef.current = payload.sessionId;
        console.log('[WebSocketManager] Claude session ID stored:', payload.sessionId);
      }
    });

    // Connect to WebSocket server
    connectToWebSocket();

    return () => {
      cleanup();
    };
  }, [enableWebSocket, useWebSocket, maxReconnectAttempts]);

  // Update connection stats periodically
  useEffect(() => {
    if (!useWebSocket || !wsClientRef.current) {
      return;
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsClientRef.current?.isConnected()) {
        const stats = wsClientRef.current.getStats();
        setWebSocketConnectionStats(stats);

        // Update latency in store
        if (stats.latency > 0) {
          setWebSocketLatency(stats.latency);
        }
      }
    }, heartbeatInterval);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [useWebSocket, heartbeatInterval, setWebSocketConnectionStats, setWebSocketLatency]);

  // Connect to WebSocket server
  const connectToWebSocket = useCallback(async () => {
    if (!wsClientRef.current || !enableWebSocket) {
      return;
    }

    try {
      console.log('[WebSocketManager] Connecting to:', wsUrl);
      await wsClientRef.current.connect(wsUrl);
      console.log('[WebSocketManager] Connected successfully');
    } catch (error) {
      console.error('[WebSocketManager] Connection failed:', error);

      // Fallback to SSE on connection failure
      if (onFallbackToSSE) {
        console.log('[WebSocketManager] Connection failed, falling back to SSE');
        setUseWebSocket(false);
        onFallbackToSSE();
      }
    }
  }, [wsUrl, enableWebSocket, onFallbackToSSE, setUseWebSocket]);

  // Disconnect from WebSocket server
  const disconnectWebSocket = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
    }
  }, []);

  // Manual reconnect
  const reconnectWebSocket = useCallback(async () => {
    if (wsClientRef.current) {
      console.log('[WebSocketManager] Manual reconnect triggered');
      setConnectionState('reconnecting');
      try {
        await wsClientRef.current.reconnect();
      } catch (error) {
        console.error('[WebSocketManager] Manual reconnect failed:', error);
        setConnectionState('error');
      }
    }
  }, [setConnectionState]);

  // Send a chat request via WebSocket
  const sendChatRequest = useCallback(
    async (content: string, sessionId?: string) => {
      if (!wsClientRef.current || !wsClientRef.current.isConnected()) {
        console.warn('[WebSocketManager] Not connected, message will be queued');
        // Message will be queued automatically by the client
      }

      const message = createChatRequest({
        content,
        sessionId: claudeSessionIdRef.current || sessionId || undefined, // Use Claude SDK session ID for multi-turn conversation
        model: 'sonnet',
        permissionMode: 'bypassPermissions',
        projectPath,
        projectId,
        projectName,
      });

      try {
        await wsClientRef.current?.sendWebSocketMessage(message);
        console.log('[WebSocketManager] Chat request sent successfully');
      } catch (error) {
        console.error('[WebSocketManager] Failed to send chat request:', error);

        // Fallback to SSE
        if (onFallbackToSSE) {
          setUseWebSocket(false);
          onFallbackToSSE();
        }

        throw error;
      }
    },
    [currentSession?.id, onFallbackToSSE, setUseWebSocket, projectPath, projectId, projectName]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      wsClientRef.current = null;
    }
  }, []);

  // Reset Claude SDK session ID (for starting new conversations)
  const resetClaudeSession = useCallback(() => {
    claudeSessionIdRef.current = null;
    console.log('[WebSocketManager] Claude session ID reset');
  }, []);

  return {
    // State
    isWebSocketEnabled: enableWebSocket && useWebSocket,
    connectionState,

    // Actions
    connect: connectToWebSocket,
    disconnect: disconnectWebSocket,
    reconnect: reconnectWebSocket,
    sendChatRequest,
    resetClaudeSession,

    // Client instance (for advanced usage)
    wsClient: wsClientRef.current,
  };
}

/**
 * React hook to manually trigger WebSocket connection management
 */
export function useWebSocketControls() {
  const {
    connectionState,
    setConnectionState,
    webSocketLatency,
    webSocketReconnectAttempts,
    webSocketMaxReconnectAttempts,
    webSocketConnectionStats,
    useWebSocket,
    setUseWebSocket,
  } = useClaudeStore();

  // Manual reconnect function (placeholder - actual reconnect should be done through manager)
  const reconnect = useCallback(() => {
    setConnectionState('reconnecting');
    console.log('[useWebSocketControls] Manual reconnect triggered');
    // Note: The actual reconnect should be called from the manager
    // This is a placeholder for UI trigger
  }, [setConnectionState]);

  return {
    connectionState,
    latency: webSocketLatency,
    reconnectAttempts: webSocketReconnectAttempts,
    maxReconnectAttempts: webSocketMaxReconnectAttempts,
    connectionStats: webSocketConnectionStats,
    useWebSocket,
    reconnect,
    toggleWebSocket: () => setUseWebSocket(!useWebSocket),
    setConnectionState,
  };
}
