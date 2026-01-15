/**
 * WebSocket Protocol Type Definitions
 *
 * Defines the message protocol for WebSocket communication between
 * the client and server, including all message types and their payload structures.
 */

/**
 * WebSocket message type enumeration
 */
export type WebSocketMessageType =
  | 'chat_request'      // Client requests a chat message
  | 'chat_response'     // Server responds with a complete message
  | 'chat_stream'       // Server streams a partial message chunk
  | 'session_update'    // Server notifies of session state changes
  | 'connection_status' // Server notifies of connection state
  | 'ping'              // Client or server sends a ping
  | 'pong'              // Client or server responds to a ping
  | 'error'             // Server sends an error message;

/**
 * Base WebSocket message interface
 * All messages have a standardized structure with id, type, payload, and timestamp
 */
export interface WebSocketMessage<T extends WebSocketMessageType = WebSocketMessageType> {
  /** Unique message ID for correlation and debugging */
  id: string;
  /** Message type determining the payload structure */
  type: T;
  /** Message payload, structure varies by type */
  payload: WebSocketMessagePayloads[T];
  /** ISO 8601 timestamp when the message was created */
  timestamp: string;
}

/**
 * Discriminated union for all message payloads
 */
export type WebSocketMessagePayloads = {
  chat_request: ChatRequestPayload;
  chat_response: ChatResponsePayload;
  chat_stream: ChatStreamPayload;
  session_update: SessionUpdatePayload;
  connection_status: ConnectionStatusPayload;
  ping: PingPongPayload;
  pong: PingPongPayload;
  error: ErrorPayload;
};

/**
 * ============================================
 * Chat Request Payload
 * ============================================
 * Sent by client to initiate a chat conversation or send a new message
 */
export interface ChatRequestPayload {
  /** User's message content */
  content: string;
  /** Anthropic API key (optional, will use server default if not provided) */
  apiKey?: string;
  /** Model to use (e.g., 'sonnet', 'haiku', 'opus') */
  model?: string;
  /** Permission mode for the Claude Agent SDK */
  permissionMode?: string;
  /** Resume existing session ID to maintain conversation context */
  sessionId?: string;
  /** Optional session ID for this application */
  appSessionId?: string;
  /** Project path for Claude Agent SDK working directory */
  projectPath?: string;
  /** Project ID for session isolation */
  projectId?: string;
  /** Project name for display */
  projectName?: string;
}

/**
 * ============================================
 * Chat Response Payload
 * ============================================
 * Sent by server with a complete response message
 */
export interface ChatResponsePayload {
  /** Claude SDK session ID */
  sessionId: string;
  /** Application session ID */
  appSessionId?: string;
  /** The complete assistant response message */
  message: {
    role: 'assistant';
    content: Array<{ type: string; text: string }>;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  /** Whether more content may follow */
  done: boolean;
}

/**
 * ============================================
 * Chat Stream Payload
 * ============================================
 * Sent by server for streaming partial message chunks
 */
export interface ChatStreamPayload {
  /** Claude SDK session ID */
  sessionId: string;
  /** Application session ID */
  appSessionId?: string;
  /** Message ID for this stream */
  messageId?: string;
  /** The streamed data from Claude SDK */
  data: {
    /** Message type from Claude SDK */
    type: string;
    /** Additional properties depending on the message type */
    [key: string]: unknown;
  };
  /** Whether this is the final chunk */
  isFinal?: boolean;
}

/**
 * ============================================
 * Session Update Payload
 * ============================================
 * Sent by server to notify of session state changes
 */
export interface SessionUpdatePayload {
  /** Claude SDK session ID */
  sessionId: string;
  /** Application session ID */
  appSessionId?: string;
  /** Current session status */
  status: 'created' | 'updated' | 'completed' | 'errored';
  /** Optional status message */
  message?: string;
  /** Optional metadata about the session */
  metadata?: {
    messageCount?: number;
    duration?: number;
    [key: string]: unknown;
  };
}

/**
 * ============================================
 * Connection Status Payload
 * ============================================
 * Sent by server to notify of connection state changes
 */

/** Error details in connection status */
export interface ConnectionError {
  code: string;
  message: string;
}

export interface ConnectionStatusPayload {
  /** Current connection status */
  status: 'connected' | 'disconnected' | 'reconnecting' | 'error';
  /** Human-readable status message */
  message: string;
  /** Additional error details if status is 'error' */
  error?: ConnectionError;
  /** Server-provided connection ID */
  connectionId: string;
}

/**
 * ============================================
 * Ping/Pong Payload
 * ============================================
 * Used for health checks and connection keepalive
 */
export interface PingPongPayload {
  /** ISO 8601 timestamp of the original ping */
  originalTimestamp?: string;
  /** Optional data echoed back */
  data?: string;
}

/**
 * ============================================
 * Error Payload
 * ============================================
 * Sent by server when an error occurs
 */
export interface ErrorPayload {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: {
    [key: string]: unknown;
  };
  /** Whether the error is recoverable */
  recoverable: boolean;
}

/**
 * ============================================
 * Type Guards
 * ============================================
 * Helper functions to safely validate message types
 */

/**
 * Check if a message is a chat request
 */
export function isChatRequest(msg: WebSocketMessage): msg is WebSocketMessage<'chat_request'> {
  return msg.type === 'chat_request';
}

/**
 * Check if a message is a chat response
 */
export function isChatResponse(msg: WebSocketMessage): msg is WebSocketMessage<'chat_response'> {
  return msg.type === 'chat_response';
}

/**
 * Check if a message is a chat stream
 */
export function isChatStream(msg: WebSocketMessage): msg is WebSocketMessage<'chat_stream'> {
  return msg.type === 'chat_stream';
}

/**
 * Check if a message is a session update
 */
export function isSessionUpdate(msg: WebSocketMessage): msg is WebSocketMessage<'session_update'> {
  return msg.type === 'session_update';
}

/**
 * Check if a message is a connection status
 */
export function isConnectionStatus(msg: WebSocketMessage): msg is WebSocketMessage<'connection_status'> {
  return msg.type === 'connection_status';
}

/**
 * Check if a message is a ping
 */
export function isPing(msg: WebSocketMessage): msg is WebSocketMessage<'ping'> {
  return msg.type === 'ping';
}

/**
 * Check if a message is a pong
 */
export function isPong(msg: WebSocketMessage): msg is WebSocketMessage<'pong'> {
  return msg.type === 'pong';
}

/**
 * Check if a message is an error
 */
export function isError(msg: WebSocketMessage): msg is WebSocketMessage<'error'> {
  return msg.type === 'error';
}

/**
 * ============================================
 * Message Factory Functions
 * ============================================
 * Helper functions to create properly formatted messages
 */

/**
 * Create a chat request message
 */
export function createChatRequest(payload: ChatRequestPayload): WebSocketMessage<'chat_request'> {
  return {
    id: crypto.randomUUID(),
    type: 'chat_request',
    payload,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a chat response message
 */
export function createChatResponse(payload: ChatResponsePayload): WebSocketMessage<'chat_response'> {
  return {
    id: crypto.randomUUID(),
    type: 'chat_response',
    payload,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a chat stream message
 */
export function createChatStream(payload: ChatStreamPayload): WebSocketMessage<'chat_stream'> {
  return {
    id: crypto.randomUUID(),
    type: 'chat_stream',
    payload,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a session update message
 */
export function createSessionUpdate(payload: SessionUpdatePayload): WebSocketMessage<'session_update'> {
  return {
    id: crypto.randomUUID(),
    type: 'session_update',
    payload,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a connection status message
 */
export function createConnectionStatus(payload: ConnectionStatusPayload): WebSocketMessage<'connection_status'> {
  return {
    id: crypto.randomUUID(),
    type: 'connection_status',
    payload,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a ping message
 */
export function createPing(payload?: PingPongPayload): WebSocketMessage<'ping'> {
  return {
    id: crypto.randomUUID(),
    type: 'ping',
    payload: payload || {},
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a pong message
 */
export function createPong(payload?: PingPongPayload): WebSocketMessage<'pong'> {
  return {
    id: crypto.randomUUID(),
    type: 'pong',
    payload: payload || {},
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error message
 */
export function createError(payload: ErrorPayload): WebSocketMessage<'error'> {
  return {
    id: crypto.randomUUID(),
    type: 'error',
    payload,
    timestamp: new Date().toISOString(),
  };
}
