/**
 * Claude Command Type Definitions
 *
 * Defines interfaces for command translation and templating system.
 */

/**
 * Command types supported by the translation system
 */
export type CommandType =
  | 'read'
  | 'write'
  | 'execute'
  | 'debug'
  | 'explain'
  | 'refactor'
  | 'test'
  | 'other';

/**
 * Command structure after translation
 */
export interface Command {
  type: CommandType;
  action: string;
  parameters: Record<string, string | string[] | boolean>;
  description: string;
}

/**
 * Translation request from client
 */
export interface TranslationRequest {
  message: string;
  context?: {
    previousCommands?: Command[];
    workingDirectory?: string;
  };
}

/**
 * Translation result with confidence and alternatives
 */
export interface TranslationResult {
  command: Command;
  confidence: number;
  alternatives?: Command[];
  suggestions?: string[];
}

/**
 * Command template for pattern matching
 */
export interface CommandTemplate {
  id: string;
  pattern: RegExp;
  intent: CommandType;
  action: string;
  parameterMatch?: Record<string, RegExp | string>;
  description: string;
  examples: string[];
}

/**
 * Parameter extraction result
 */
export interface ExtractedParameters {
  [key: string]: string | string[] | boolean;
}

/**
 * Translation error types
 */
export interface TranslationError {
  code: 'UNKNOWN_INTENT' | 'MISSING_PARAMETERS' | 'AMBIGUOUS' | 'INVALID_INPUT';
  message: string;
  suggestions?: string[];
  partialCommand?: Command;
}

/**
 * Stream state for pause/resume functionality
 */
export type StreamState = 'idle' | 'active' | 'paused' | 'completed' | 'error';

/**
 * WebSocket connection states
 */
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'reconnecting';

/**
 * Stream event types for WebSocket communication
 */
export type StreamEvent =
  | 'stream-start'
  | 'stream-chunk'
  | 'stream-end'
  | 'stream-error'
  | 'connection-state-change'
  | 'session-update';

/**
 * Stream chunk data from server
 */
export interface StreamChunk {
  content: string;
  isComplete: boolean;
  isCodeComplete?: boolean;
}

/**
 * Stream start event
 */
export interface StreamStart {
  messageId: string;
  timestamp: Date;
}

/**
 * Stream end event
 */
export interface StreamEnd {
  messageId: string;
  timestamp: Date;
  finalContent: string;
}

/**
 * Stream error event
 */
export interface StreamError {
  messageId: string;
  errorCode: string;
  message: string;
  retryable: boolean;
}

/**
 * Connection state change event
 */
export interface ConnectionStateChange {
  state: ConnectionState;
  previousState?: ConnectionState;
  reason?: string;
}

/**
 * Reconnection configuration
 */
export interface ReconnectConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

/**
 * WebSocket client interface
 */
export interface WebSocketClient {
  connect(url: string): Promise<void>;
  disconnect(): void;
  send(data: string): void;
  on(event: StreamEvent, callback: (data: unknown) => void): void;
  off(event: StreamEvent, callback: (data: unknown) => void): void;
  getState(): ConnectionState;
  isConnected(): boolean;
}

/**
 * Streaming message extension
 * Matches Message interface type field
 */
export interface StreamingMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  isStreaming: boolean;
  streamBuffer: string;
  streamStartTime?: Date;
  lastChunkTime?: Date;
  command?: Command;
}
