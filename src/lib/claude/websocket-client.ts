/**
 * WebSocket Client for Claude Code Streaming
 *
 * Manages WebSocket connection with auto-reconnect, state machine, and event handling.
 * Provides reliable streaming communication with exponential backoff reconnection.
 * Supports the new WebSocket protocol with message types: chat_request, chat_stream, etc.
 */

import type { StreamChunk, StreamError, ConnectionState, StreamEvent, ReconnectConfig, StreamStart, StreamEnd } from './types';
import type { WebSocketMessage, isPing, isPong, isChatStream, isError, isConnectionStatus, isSessionUpdate } from '@/types/websocket';

/**
 * Connection statistics including latency and message tracking
 */
export interface ConnectionStats {
  latency: number; // Ping/pong round-trip time in milliseconds
  lastPingTime: Date | null;
  connectedAt: Date | null;
  messagesSent: number;
  messagesReceived: number;
}

/**
 * Queued message for sending when connection is ready
 */
interface QueuedMessage {
  message: WebSocketMessage;
  resolve: () => void;
  reject: (error: Error) => void;
}

/**
 * Default reconnection configuration
 * Attempts: 3, Initial delay: 1000ms, Max delay: 8000ms, Backoff factor: 2
 */
const DEFAULT_RECONNECT_CONFIG: ReconnectConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 8000,
  backoffFactor: 2,
};

/**
 * WebSocket Client Implementation
 */
class WebSocketClientImpl {
  private ws: WebSocket | null = null;
  private url: string = '';
  private state: ConnectionState = 'disconnected';
  private reconnectConfig: ReconnectConfig;
  private reconnectAttempts: number = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventCallbacks: Map<StreamEvent, Set<(data: unknown) => void>> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isManualDisconnect: boolean = false;
  private messageQueue: QueuedMessage[] = [];
  private pendingPings: Map<string, Date> = new Map();
  private stats: ConnectionStats = {
    latency: 0,
    lastPingTime: null,
    connectedAt: null,
    messagesSent: 0,
    messagesReceived: 0,
  };

  constructor(config?: Partial<ReconnectConfig>) {
    this.reconnectConfig = { ...DEFAULT_RECONNECT_CONFIG, ...config };
    this.initializeEventMap();
  }

  /**
   * Initialize event callback map
   */
  private initializeEventMap(): void {
    const events: StreamEvent[] = [
      'stream-start',
      'stream-chunk',
      'stream-end',
      'stream-error',
      'connection-state-change',
      'session-update',
    ];
    events.forEach((event) => {
      this.eventCallbacks.set(event, new Set());
    });
  }

  /**
   * Connect to WebSocket server
   */
  async connect(url: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('[WebSocketClient] Already connected');
      return Promise.resolve();
    }

    this.url = url;
    this.isManualDisconnect = false;
    this.updateState('connecting');

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.stats.connectedAt = new Date();
          this.updateState('connected');
          this.setupHeartbeat();
          this.sendQueuedMessages();
          this.emit('connection-state-change', {
            state: 'connected',
            reason: 'Connection established',
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocketClient] Error:', error);
          this.updateState('error');
          this.emit('connection-state-change', {
            state: 'error',
            previousState: this.state,
            reason: 'Connection error',
          });
          if (this.reconnectAttempts === 0) {
            reject(new Error('Failed to connect to WebSocket server'));
          }
        };

        this.ws.onclose = () => {
          this.clearHeartbeat();
          if (!this.isManualDisconnect && this.state !== 'disconnected') {
            this.attemptReconnect();
          } else {
            this.updateState('disconnected');
          }
        };
      } catch (error) {
        this.updateState('error');
        reject(error);
      }
    });
  }

  /**
   * Manual reconnect method
   */
  async reconnect(): Promise<void> {
    console.log('[WebSocketClient] Manual reconnect requested');
    this.reconnectAttempts = 0;
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    return this.connect(this.url);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualDisconnect = true;
    this.clearReconnectTimer();
    this.clearHeartbeat();
    this.clearPendingPings();
    this.messageQueue = [];

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.updateState('disconnected');
    this.emit('connection-state-change', {
      state: 'disconnected',
      reason: 'Manual disconnect',
    });
  }

  /**
   * Send WebSocket message using the new protocol
   */
  sendWebSocketMessage(message: WebSocketMessage): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.stats.messagesSent++;
        return Promise.resolve();
      } catch (error) {
        console.error('[WebSocketClient] Send error:', error);
        this.emit('stream-error', {
          errorCode: 'SEND_FAILED',
          message: 'Failed to send message',
          retryable: true,
        });
        return Promise.reject(error);
      }
    } else {
      // Queue the message for sending when connection is established
      return new Promise((resolve, reject) => {
        this.messageQueue.push({ message, resolve, reject });
      });
    }
  }

  /**
   * Send data to server (legacy method for backward compatibility)
   */
  send(data: string): Promise<void> {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('Cannot send message: WebSocket is not connected');
    }

    try {
      this.ws.send(data);
      this.stats.messagesSent++;
      return Promise.resolve();
    } catch (error) {
      console.error('[WebSocketClient] Send error:', error);
      this.emit('stream-error', {
        errorCode: 'SEND_FAILED',
        message: 'Failed to send message',
        retryable: true,
      });
      return Promise.reject(error);
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): ConnectionStats {
    return { ...this.stats, latency: this.stats.latency };
  }

  /**
   * Get current reconnection attempts
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Send queued messages when connection is ready
   */
  private sendQueuedMessages(): void {
    if (this.messageQueue.length === 0) return;

    console.log(`[WebSocketClient] Sending ${this.messageQueue.length} queued messages`);

    const queue = [...this.messageQueue];
    this.messageQueue = [];

    for (const item of queue) {
      this.sendWebSocketMessage(item.message)
        .then(() => item.resolve())
        .catch((error) => item.reject(error));
    }
  }

  /**
   * Register event callback
   */
  on(event: StreamEvent, callback: (data: unknown) => void): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.add(callback);
    }
  }

  /**
   * Unregister event callback
   */
  off(event: StreamEvent, callback: (data: unknown) => void): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Update connection state and emit event
   */
  private updateState(newState: ConnectionState): void {
    const previousState = this.state;
    this.state = newState;
    this.emit('connection-state-change', { state: newState, previousState });
  }

  /**
   * Handle incoming WebSocket messages with new protocol support
   */
  private handleIncomingMessage(data: string): void {
    this.stats.messagesReceived++;

    try {
      const message = JSON.parse(data) as WebSocketMessage;

      // Handle ping messages (for latency measurement)
      if (message.type === 'ping') {
        this.handlePing(message as WebSocketMessage<'ping'>);
        return;
      }

      // Handle pong messages (for latency measurement)
      if (message.type === 'pong') {
        this.handlePong(message as WebSocketMessage<'pong'>);
        return;
      }

      // Handle error messages from server
      if (message.type === 'error') {
        this.handleServerError(message as WebSocketMessage<'error'>);
        return;
      }

      // Handle connection status updates from server
      if (message.type === 'connection_status') {
        this.handleConnectionStatus(message as WebSocketMessage<'connection_status'>);
        return;
      }

      // Handle session updates
      if (message.type === 'session_update') {
        console.log('[WebSocketClient] Session update:', message.payload);
        this.emit('session-update', message.payload);
        return;
      }

      // Handle chat stream messages (main use case)
      if (message.type === 'chat_stream') {
        this.handleChatStream(message as WebSocketMessage<'chat_stream'>);
        return;
      }

      // Handle chat response messages (complete messages)
      if (message.type === 'chat_response') {
        this.handleChatResponse(message as WebSocketMessage<'chat_response'>);
        return;
      }

      // Legacy message format support (for backward compatibility)
      const legacyMessage = message as unknown as StreamChunk | StreamError | StreamStart | StreamEnd;

      if (this.isStreamChunk(legacyMessage)) {
        this.emit('stream-chunk', legacyMessage);
      } else if (this.isStreamError(legacyMessage)) {
        this.emit('stream-error', legacyMessage);
      } else if (this.isStreamStart(legacyMessage)) {
        this.emit('stream-start', legacyMessage);
      } else if (this.isStreamEnd(legacyMessage)) {
        this.emit('stream-end', legacyMessage);
      }
    } catch (error) {
      console.error('[WebSocketClient] Failed to parse message:', error);
    }
  }

  /**
   * Handle ping messages
   */
  private handlePing(message: WebSocketMessage<'ping'>): void {
    // Respond with pong including original timestamp
    const pongMessage: WebSocketMessage<'pong'> = {
      id: crypto.randomUUID(),
      type: 'pong',
      payload: {
        originalTimestamp: message.timestamp,
        data: message.payload.data,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendWebSocketMessage(pongMessage).catch((error) => {
      console.error('[WebSocketClient] Failed to send pong:', error);
    });
  }

  /**
   * Handle pong messages and calculate latency
   */
  private handlePong(message: WebSocketMessage<'pong'>): void {
    if (message.payload.originalTimestamp) {
      const pingTime = new Date(message.payload.originalTimestamp);
      const pongTime = new Date(message.timestamp);
      const latency = pongTime.getTime() - pingTime.getTime();

      this.stats.latency = latency;
      this.stats.lastPingTime = pingTime;

      console.log(`[WebSocketClient] Latency: ${latency}ms`);
    }
  }

  /**
   * Handle server error messages
   */
  private handleServerError(message: WebSocketMessage<'error'>): void {
    this.emit('stream-error', {
      errorCode: message.payload.code,
      message: message.payload.message,
      retryable: message.payload.recoverable,
    });
  }

  /**
   * Handle connection status messages from server
   */
  private handleConnectionStatus(message: WebSocketMessage<'connection_status'>): void {
    const { payload } = message;

    // Map server status to client state
    const stateMap: Record<string, ConnectionState> = {
      connected: 'connected',
      disconnected: 'disconnected',
      reconnecting: 'reconnecting',
      error: 'error',
    };

    const state = stateMap[payload.status] || 'disconnected';
    this.updateState(state);

    console.log(`[WebSocketClient] Server status: ${payload.status}, Reason: ${payload.message}`);
  }

  /**
   * Handle chat stream messages
   */
  private handleChatStream(message: WebSocketMessage<'chat_stream'>): void {
    const { payload } = message;

    // Extract content from SDK data stream
    if (payload.data && payload.data.type === 'stream_event' && payload.data.event) {
      const event = payload.data.event as any;

      // Handle content_block_delta - incremental updates
      if (event.type === 'content_block_delta' && event.delta && event.delta.text) {
        const chunk: StreamChunk = {
          content: event.delta.text,
          isComplete: payload.isFinal || false,
        };
        this.emit('stream-chunk', chunk);
      }
    }

    // Handle final chunk
    if (payload.isFinal) {
      const end: StreamEnd = {
        messageId: payload.messageId || '',
        timestamp: new Date(message.timestamp),
        finalContent: '',
      };
      this.emit('stream-end', end);
    }
  }

  /**
   * Handle chat response messages (complete, non-streamed)
   */
  private handleChatResponse(message: WebSocketMessage<'chat_response'>): void {
    const { payload } = message;

    // Extract content from complete message
    let content = '';
    if (payload.message && payload.message.content) {
      content = payload.message.content
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join('');
    }

    // Emit stream start
    const start: StreamStart = {
      messageId: crypto.randomUUID(),
      timestamp: new Date(message.timestamp),
    };
    this.emit('stream-start', start);

    // Emit content as chunk
    const chunk: StreamChunk = {
      content,
      isComplete: true,
    };
    this.emit('stream-chunk', chunk);

    // Emit stream end
    const end: StreamEnd = {
      messageId: payload.sessionId,
      timestamp: new Date(message.timestamp),
      finalContent: content,
    };
    this.emit('stream-end', end);
  }

  /**
   * Type guard for StreamChunk
   */
  private isStreamChunk(message: any): message is StreamChunk {
    return message.hasOwnProperty('content') && message.hasOwnProperty('isComplete');
  }

  /**
   * Type guard for StreamError
   */
  private isStreamError(message: any): message is StreamError {
    return message.hasOwnProperty('errorCode') && message.hasOwnProperty('message');
  }

  /**
   * Type guard for StreamStart
   */
  private isStreamStart(message: any): message is { messageId: string; timestamp: Date } {
    return message.hasOwnProperty('messageId') && message.hasOwnProperty('timestamp');
  }

  /**
   * Type guard for StreamEnd
   */
  private isStreamEnd(message: any): message is StreamEnd {
    return message.hasOwnProperty('messageId') && message.hasOwnProperty('finalContent');
  }

  /**
   * Emit event to all registered callbacks
   */
  private emit(event: StreamEvent, data: unknown): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocketClient] Error in ${event} callback:`, error);
        }
      });
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.reconnectConfig.maxAttempts) {
      console.error('[WebSocketClient] Max reconnection attempts reached');
      this.updateState('error');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.calculateReconnectDelay();

    console.log(
      `[WebSocketClient] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.reconnectConfig.maxAttempts})`
    );

    this.updateState('reconnecting');
    this.emit('connection-state-change', {
      state: 'reconnecting',
      previousState: this.state,
      reason: `Attempt ${this.reconnectAttempts}`,
    });

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.url).catch((error) => {
        console.error('[WebSocketClient] Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateReconnectDelay(): number {
    const delay =
      this.reconnectConfig.initialDelay *
      Math.pow(this.reconnectConfig.backoffFactor, this.reconnectAttempts - 1);
    return Math.min(delay, this.reconnectConfig.maxDelay);
  }

  /**
   * Setup heartbeat interval to detect stale connections
   * Sends ping messages for latency measurement
   */
  private setupHeartbeat(): void {
    this.clearHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendPing();
      }
    }, 30000); // 30 second heartbeat
  }

  /**
   * Send a ping message to measure latency
   */
  private sendPing(): void {
    const pingId = crypto.randomUUID();
    const pingMessage: WebSocketMessage<'ping'> = {
      id: pingId,
      type: 'ping',
      payload: {},
      timestamp: new Date().toISOString(),
    };

    // Track this ping for latency calculation
    this.pendingPings.set(pingId, new Date());

    this.sendWebSocketMessage(pingMessage).catch((error) => {
      console.error('[WebSocketClient] Failed to send ping:', error);
      this.pendingPings.delete(pingId);
    });
  }

  /**
   * Clear pending pings
   */
  private clearPendingPings(): void {
    this.pendingPings.clear();
  }

  /**
   * Clear heartbeat interval
   */
  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

/**
 * Create a new WebSocket client instance
 */
export function createWebSocketClient(config?: Partial<ReconnectConfig>): WebSocketClientImpl {
  return new WebSocketClientImpl(config);
}

export type { WebSocketClientImpl, QueuedMessage };
// ConnectionStats is already defined here as an export
