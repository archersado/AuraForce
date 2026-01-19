/**
 * WebSocket Server - Claude Chat Interface
 *
 * Implements a WebSocket server for real-time bidirectional communication
 * with Claude Agent SDK. Supports streaming responses, session management,
 * and health checks via ping/pong.
 *
 * Runtime: Node.js environment (server-side only)
 *
 * Story 3.7: WebSocket Connection Management
 */

import { NextRequest } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { createServer } from 'http';
import type { Server as HTTPServer } from 'http';
import { WebSocketServer as WSS, WebSocket as WS } from 'ws';
import { claude as claudeConfig } from '@/lib/config';
import type {
  WebSocketMessage,
  ChatRequestPayload,
  ChatStreamPayload,
  ConnectionStatusPayload,
  PingPongPayload,
  ErrorPayload,
  ConnectionError,
} from '@/types/websocket';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

/**
 * Extended WebSocket interface with custom properties
 */
interface ExtendedWebSocket extends WS {
  /** Unique connection ID */
  connectionId: string;
  /** Claude SDK session ID */
  sessionId?: string;
  /** Application session ID */
  appSessionId?: string;
  /** Timestamp when connection was established */
  connectedAt: Date;
  /** Last activity timestamp */
  lastActivityAt: Date;
  /** Whether currently processing a chat request */
  isProcessing: boolean;
  /** Health check interval ID */
  healthCheckInterval?: NodeJS.Timeout;
  /** Current query instance for cancellation */
  currentQuery?: AsyncIterator<unknown>;
  /** Update activity timestamp */
  updateActivity: () => void;
}

/**
 * Connection state
 */
interface ConnectionState {
  connectionId: string;
  sessionId?: string;
  appSessionId?: string;
  connectedAt: Date;
  lastActivityAt: Date;
  isProcessing: boolean;
}

/**
 * ============================================
 * Constants and Configuration
 * ============================================
 */

/** Health check interval in milliseconds (30 seconds) */
const HEALTH_CHECK_INTERVAL = 30000;

/** Maximum concurrent connections */
const MAX_CONCURRENT_CONNECTIONS = 100;

/** Connection timeout in milliseconds */
const CONNECTION_TIMEOUT = 120000; // 2 minutes

/**
 * ============================================
 * Global State Management
 * ============================================
 */

/** Map of all active connections by connection ID */
const activeConnections = new Map<string, ExtendedWebSocket>();

/** Set of all active connection IDs */
export const activeConnectionIds: Set<string> = new Set();

/** Global WebSocket server instance */
let wss: WSS | null = null;

/** Global HTTP server instance */
let httpServer: HTTPServer | null = null;

/**
 * ============================================
 * Utility Functions
 * ============================================
 */

/**
 * Validate API key from message payload
 */
function validateApiKey(apiKey?: string): boolean {
  const envApiKey = claudeConfig.apiKey;

  // Accept if provided API key and looks valid
  if (apiKey && apiKey.length > 5 && !apiKey.includes('your-')) {
    return true;
  }

  // Accept if environment variable is set and looks valid
  if (envApiKey && envApiKey.length > 5 && !envApiKey.includes('your-')) {
    return true;
  }

  // For MVP testing, allow bypass
  console.warn('[WS] No valid API key found, allowing request for testing');
  return true;
}

/**
 * Send a message to a WebSocket connection
 */
function sendMessage(ws: ExtendedWebSocket, message: WebSocketMessage): boolean {
  try {
    if (ws.readyState === WS.OPEN) {
      ws.updateActivity();
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[WS] Error sending message to ${ws.connectionId}:`, error);
    return false;
  }
}

/**
 * Send an error message to a WebSocket connection
 */
function sendError(ws: ExtendedWebSocket, code: string, message: string, recoverable = true): void {
  const errorMessage: WebSocketMessage<'error'> = {
    id: crypto.randomUUID(),
    type: 'error',
    payload: {
      code,
      message,
      recoverable,
    },
    timestamp: new Date().toISOString(),
  };
  sendMessage(ws, errorMessage);
}

/**
 * Send a connection status message
 */
function sendConnectionStatus(ws: ExtendedWebSocket, status: ConnectionStatusPayload['status'], message: string, error?: ConnectionError): void {
  const statusMessage: WebSocketMessage<'connection_status'> = {
    id: crypto.randomUUID(),
    type: 'connection_status',
    payload: {
      status,
      message,
      connectionId: ws.connectionId,
      ...(error && { error }),
    },
    timestamp: new Date().toISOString(),
  };
  sendMessage(ws, statusMessage);
}

/**
 * Set up health check for a WebSocket connection
 */
function setupHealthCheck(ws: ExtendedWebSocket): void {
  // Clear any existing health check
  if (ws.healthCheckInterval) {
    clearInterval(ws.healthCheckInterval);
  }

  // Set up new health check
  ws.healthCheckInterval = setInterval(() => {
    if (ws.readyState === WS.OPEN) {
      const pingMessage: WebSocketMessage<'ping'> = {
        id: crypto.randomUUID(),
        type: 'ping',
        payload: {
          data: `Health check at ${new Date().toISOString()}`,
        },
        timestamp: new Date().toISOString(),
      };
      sendMessage(ws, pingMessage);
    } else {
      // Connection is closed, clear the interval
      if (ws.healthCheckInterval) {
        clearInterval(ws.healthCheckInterval);
      }
    }
  }, HEALTH_CHECK_INTERVAL);
}

/**
 * Clean up a WebSocket connection
 */
function cleanupConnection(ws: ExtendedWebSocket): void {
  console.log(`[WS] Cleaning up connection ${ws.connectionId}`);

  // Cancel any active query
  if (ws.currentQuery) {
    try {
      ws.currentQuery.return?.();
    } catch (error) {
      console.error(`[WS] Error cancelling query for ${ws.connectionId}:`, error);
    }
    ws.currentQuery = undefined;
  }

  // Clear health check interval
  if (ws.healthCheckInterval) {
    clearInterval(ws.healthCheckInterval);
    ws.healthCheckInterval = undefined;
  }

  // Remove from active connections
  activeConnections.delete(ws.connectionId);
  activeConnectionIds.delete(ws.connectionId);

  console.log(`[WS] Active connections: ${activeConnections.size}`);
}

/**
 * ============================================
 * Message Handlers
 * ============================================

/**
 * Handle chat_request message
 */
async function handleChatRequest(ws: ExtendedWebSocket, message: WebSocketMessage<'chat_request'>): Promise<void> {
  const { content, apiKey, model, permissionMode, sessionId: resumeSessionId, appSessionId, projectPath, projectId, projectName } = message.payload;

  console.log(`[WS] Chat request: ${content?.length} bytes, model=${model}, project=${projectName || projectName || 'default'}`);

  // Validate request
  if (!content) {
    sendError(ws, 'INVALID_REQUEST', 'Content is required', false);
    return;
  }

  if (!validateApiKey(apiKey)) {
    sendError(ws, 'UNAUTHORIZED', 'Invalid API key', false);
    return;
  }

  // Set connection as processing
  ws.isProcessing = true;
  ws.appSessionId = appSessionId;

  // Determine API key to use
  const actualApiKey = apiKey || claudeConfig.authToken || claudeConfig.apiKey;
  const useMock = !actualApiKey || actualApiKey.includes('your-');

  // Set environment variable
  if (actualApiKey && !actualApiKey.includes('your-')) {
    process.env.ANTHROPIC_AUTH_TOKEN = actualApiKey;
  }

  try {
    if (useMock) {
      await handleMockChat(ws, content);
    } else {
      await handleRealChat(ws, content, model, permissionMode, resumeSessionId, projectPath, projectId, projectName);
    }
  } catch (error) {
    console.error(`[WS] Error handling chat for ${ws.connectionId}:`, error);
    sendError(
      ws,
      'CHAT_ERROR',
      error instanceof Error ? error.message : 'Unknown error occurred',
      true
    );
  } finally {
    ws.isProcessing = false;
    ws.currentQuery = undefined;
  }
}

/**
 * Handle mock chat (for testing without API key)
 */
async function handleMockChat(ws: ExtendedWebSocket, content: string): Promise<void> {
  console.log(`[WS] Using mock mode for connection ${ws.connectionId}`);

  // Send session update
  const sessionId = `mock-session-${crypto.randomUUID()}`;
  ws.sessionId = sessionId;

  sendMessage(ws, {
    id: crypto.randomUUID(),
    type: 'session_update',
    payload: {
      sessionId,
      status: 'created',
      message: 'Mock session created',
    },
    timestamp: new Date().toISOString(),
  });

  // Stream mock response
  const mockResponse = `This is a mock WebSocket response to demonstrate the streaming functionality.

Your message was: "${content}"

The WebSocket implementation includes:
- Real-time bidirectional communication
- Streaming message chunks using WebSocket
- Session management and context preservation
- Health checks with 30-second ping/pong intervals
- Connection state notifications
- Error handling and graceful shutdown
- Support for multiple concurrent connections

**Note:** This is a MOCK response because no valid ANTHROPIC_API_KEY is configured. To enable real Claude streaming, set a valid API key.`;

  const messageId = crypto.randomUUID();
  const chunks = mockResponse.split('');

  for (let i = 0; i < chunks.length; i++) {
    if (ws.readyState !== WS.OPEN) {
      console.log(`[WS] Connection ${ws.connectionId} closed during streaming`);
      break;
    }

    sendMessage(ws, {
      id: crypto.randomUUID(),
      type: 'chat_stream',
      payload: {
        sessionId,
        messageId,
        data: {
          type: 'text_delta',
          text: chunks[i],
        },
        isFinal: i === chunks.length - 1,
      },
      timestamp: new Date().toISOString(),
    });

    // Simulate typing speed
    await new Promise(resolve => setTimeout(resolve, 30));
  }

  // Send completion
  sendMessage(ws, {
    id: crypto.randomUUID(),
    type: 'session_update',
    payload: {
      sessionId,
      status: 'completed',
      message: 'Mock conversation completed',
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Handle real chat via Claude Agent SDK
 */
async function handleRealChat(
  ws: ExtendedWebSocket,
  content: string,
  model?: string,
  permissionMode?: string,
  resumeSessionId?: string,
  projectPath?: string,
  projectId?: string,
  projectName?: string
): Promise<void> {
  console.log(`[WS] Real Claude: ${ws.connectionId}, project=${projectName || 'default'}`);

  // Use model from request or environment
  const actualModel = model || claudeConfig.defaultModel || 'sonnet';

  // Use project path if provided, otherwise use current working directory
  const workingDir = projectPath || process.cwd();

  // Send session start notification
  sendMessage(ws, {
    id: crypto.randomUUID(),
    type: 'session_update',
    payload: {
      sessionId: resumeSessionId || 'pending',
      appSessionId: ws.appSessionId,
      status: resumeSessionId ? 'updated' : 'created',
      message: resumeSessionId ? 'Resuming session' : 'New session created',
    },
    timestamp: new Date().toISOString(),
  });

  // Configure SDK options
  const sdkOptions: Record<string, unknown> = {
    model: actualModel,
    permissionMode: permissionMode || 'bypassPermissions',
    cwd: workingDir,
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'
    },
    settingSources: ['project', 'user', 'local'],
    includePartialMessages: true,
    ...(resumeSessionId && { resume: resumeSessionId }),
    env: {
      // IMPORTANT: Keep PATH so child processes can find Node.js
      ...(process.env.PATH && { PATH: process.env.PATH }),
      ...(claudeConfig.authToken && { ANTHROPIC_AUTH_TOKEN: claudeConfig.authToken }),
      ...(claudeConfig.baseUrl && { ANTHROPIC_BASE_URL: claudeConfig.baseUrl }),
      ...(claudeConfig.defaultModel && { ANTHROPIC_MODEL: claudeConfig.defaultModel }),
      // IMPORTANT: Use server-side API key only (ignore NEXT_PUBLIC_ for security)
      ANTHROPIC_API_KEY: claudeConfig.apiKey,
      ANTHROPIC_AUTH_TOKEN: claudeConfig.authToken,
      // Add project context to environment
      ...(projectPath && { PROJECT_PATH: projectPath }),
      ...(projectId && { PROJECT_ID: projectId }),
      ...(projectName && { PROJECT_NAME: projectName }),
    },
  };

  try {
    const queryInstance = query({
      prompt: content,
      options: sdkOptions
    });

    ws.currentQuery = queryInstance[Symbol.asyncIterator]?.();

    let sessionId = '';
    let messageCount = 0;

    // Process streaming messages
    for await (const message of queryInstance) {
      if (ws.readyState !== WS.OPEN) {
        break;
      }

      messageCount++;

      // Capture session ID from first message
      if ((message as any).session_id && !sessionId) {
        sessionId = (message as any).session_id;
        ws.sessionId = sessionId;
        sendMessage(ws, {
          id: crypto.randomUUID(),
          type: 'session_update',
          payload: {
            sessionId,
            appSessionId: ws.appSessionId,
            status: 'created',
            message: 'Claude session established',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Forward message as stream
      sendMessage(ws, {
        id: crypto.randomUUID(),
        type: 'chat_stream',
        payload: {
          sessionId: sessionId || resumeSessionId || '',
          appSessionId: ws.appSessionId,
          messageId: crypto.randomUUID(),
          data: message,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Send completion notification
    sendMessage(ws, {
      id: crypto.randomUUID(),
      type: 'session_update',
      payload: {
        sessionId: sessionId || resumeSessionId || 'unknown',
        appSessionId: ws.appSessionId,
        status: 'completed',
        message: 'Conversation completed',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    throw error;
  }
}

/**
 * Handle ping message
 */
function handlePing(ws: ExtendedWebSocket, message: WebSocketMessage<'ping'>): void {
  const pongMessage: WebSocketMessage<'pong'> = {
    id: crypto.randomUUID(),
    type: 'pong',
    payload: {
      originalTimestamp: message.payload.originalTimestamp,
      data: message.payload.data,
    },
    timestamp: new Date().toISOString(),
  };
  sendMessage(ws, pongMessage);
}

/**
 * Handle pong message
 */
function handlePong(ws: ExtendedWebSocket, message: WebSocketMessage<'pong'>): void {
  // Pong is a response to our ping, just log it
  console.log(`[WS] Received pong from ${ws.connectionId}`);
}

/**
 * Handle unknown message type
 */
function handleUnknownMessage(ws: ExtendedWebSocket, message: WebSocketMessage): void {
  console.warn(`[WS] Unknown message type from ${ws.connectionId}:`, message.type);
  sendError(ws, 'UNKNOWN_MESSAGE_TYPE', `Unknown message type: ${message.type}`, false);
}

/**
 * Handle incoming message from client
 */
async function handleMessage(ws: ExtendedWebSocket, rawData: string): Promise<void> {
  try {
    const message: WebSocketMessage = JSON.parse(rawData);

    // Route message to appropriate handler
    switch (message.type) {
      case 'chat_request':
        await handleChatRequest(ws, message as WebSocketMessage<'chat_request'>);
        break;
      case 'ping':
        handlePing(ws, message as WebSocketMessage<'ping'>);
        break;
      case 'pong':
        handlePong(ws, message as WebSocketMessage<'pong'>);
        break;
      default:
        handleUnknownMessage(ws, message);
    }
  } catch (error) {
    console.error(`[WS] Message parse error:`, error);
    sendError(
      ws,
      'MESSAGE_PARSE_ERROR',
      error instanceof Error ? error.message : 'Failed to parse message',
      false
    );
  }
}

/**
 * ============================================
 * WebSocket Server Setup
 * ============================================
 */

/**
 * Create the WebSocket server
 */
function createWebSocketServer(): WSS {
  if (wss) {
    return wss;
  }

  // Create HTTP server
  httpServer = createServer();

  // Create WebSocket server
  wss = new WSS({
    server: httpServer,
    perMessageDeflate: false, // Disable compression for better compatibility
    clientTracking: true,
  });

  wss.on('connection', (ws: ExtendedWebSocket, req) => {
    // Initialize connection properties
    const connectionId = crypto.randomUUID();
    const extension = {
      connectionId,
      connectedAt: new Date(),
      lastActivityAt: new Date(),
      isProcessing: false,
      updateActivity: function(this: ExtendedWebSocket) {
        this.lastActivityAt = new Date();
      },
    };
    Object.assign(ws, extension);

    // Add to active connections
    activeConnections.set(connectionId, ws);
    activeConnectionIds.add(connectionId);

    console.log(`[WS] New connection ${connectionId} established`);
    console.log(`[WS] Total active connections: ${activeConnections.size}`);

    // Check connection limit
    if (activeConnections.size > MAX_CONCURRENT_CONNECTIONS) {
      console.warn(`[WS] Connection limit reached: ${activeConnections.size}/${MAX_CONCURRENT_CONNECTIONS}`);
      sendConnectionStatus(
        ws,
        'error',
        'Maximum connections reached',
        { code: 'CONNECTION_LIMIT', message: 'Server is at capacity' }
      );
      ws.close(1013, 'Try Again Later');
      return;
    }

    // Send connection status
    sendConnectionStatus(ws, 'connected', 'WebSocket connection established');

    // Set up health check
    setupHealthCheck(ws);

    // Handle incoming messages
    ws.on('message', async (data: Buffer) => {
      await handleMessage(ws, data.toString('utf-8'));
    });

    // Handle client pings
    ws.on('ping', () => {
      if (ws.readyState === WS.OPEN) {
        ws.pong();
      }
    });

    // Handle connection close
    ws.on('close', (code, reason) => {
      console.log(`[WS] Connection ${connectionId} closed:`, { code, reason: reason.toString() });
      cleanupConnection(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`[WS] Error on connection ${connectionId}:`, error);
    });
  });

  wss.on('error', (error) => {
    console.error('[WS] WebSocket server error:', error);
  });

  wss.on('close', () => {
    console.log('[WS] WebSocket server closed');
    wss = null;
  });

  // Start HTTP server on a random available port
  const port = Math.floor(Math.random() * 1000) + 4000;
  httpServer.listen(port, () => {
    console.log(`[WS] WebSocket server listening on port ${port}`);
  });

  return wss;
}

/**
 * ============================================
 * Next.js API Route Handler
 * ============================================

/**
 * GET /api/claude/ws
 * This endpoint doesn't actually handle WebSocket connections directly.
 * Instead, it provides information about the WebSocket server status.
 *
 * WebSocket connections should be made to ws://localhost:{port} where the
 * port is obtained from the GET response or predefined configuration.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const server = createWebSocketServer();

  const connectionInfo = {
    status: 'running',
    port: (httpServer?.address() as any)?.port || 'unknown',
    activeConnections: activeConnections.size,
    maxConnections: MAX_CONCURRENT_CONNECTIONS,
    healthCheckInterval: `${HEALTH_CHECK_INTERVAL}ms`,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(connectionInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Upgrade HTTP connection to WebSocket
 * Note: In Next.js, WebSocket upgrades require custom server configuration.
 * For this MVP, we provide a standalone WebSocket server that runs alongside
 * Next.js. This is a common pattern for real-time features in Next.js apps.
 *
 * Future enhancement: Use Next.js custom server with proper WebSocket integration.
 */
export const runtime = 'nodejs';

/**
 * ============================================
 * Export for custom server integration
 * ============================================
 */

/**
 * Get the WebSocket server instance
 */
export function getWebSocketServer(): WSS | null {
  return wss;
}

/**
 * Get current connection statistics
 */
export function getConnectionStats(): {
  total: number;
  active: number;
  processing: number;
  connections: ConnectionState[];
} {
  const connections: ConnectionState[] = Array.from(activeConnections.values()).map(ws => ({
    connectionId: ws.connectionId,
    sessionId: ws.sessionId,
    appSessionId: ws.appSessionId,
    connectedAt: ws.connectedAt,
    lastActivityAt: ws.lastActivityAt,
    isProcessing: ws.isProcessing,
  }));

  return {
    total: connections.length,
    active: connections.filter(c => !c.isProcessing).length,
    processing: connections.filter(c => c.isProcessing).length,
    connections,
  };
}

/**
 * Disconnect all connections (useful for shutdown)
 */
export function disconnectAll(): void {
  console.log('[WS] Disconnecting all connections...');
  activeConnections.forEach(ws => {
    try {
      ws.close(1001, 'Server Shutdown');
    } catch (error) {
      console.error('[WS] Error closing connection:', error);
    }
  });
  activeConnections.clear();
  activeConnectionIds.clear();
}

/**
 * Shutdown WebSocket server
 */
export function shutdownWebSocketServer(): void {
  console.log('[WS] Shutting down WebSocket server...');
  disconnectAll();
  if (wss) {
    wss.close(() => {
      console.log('[WS] WebSocket server closed');
      wss = null;
    });
  }
  if (httpServer) {
    httpServer.close(() => {
      console.log('[WS] HTTP server closed');
      httpServer = null;
    });
  }
}
