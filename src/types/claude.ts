/**
 * Claude Agent SDK Type Definitions
 *
 * Provides TypeScript types for Claude Agent SDK integration
 * including messages, responses, streaming events, and errors.
 */

/**
 * Claude message role
 */
export type ClaudeRole = 'user' | 'assistant' | 'system'

/**
 * Claude message structure
 */
export interface ClaudeMessage {
  /** Message role */
  role: ClaudeRole
  /** Message content (text only) */
  content: string
  /** Optional timestamp for tracking */
  timestamp?: number
}

/**
 * Claude response metadata
 */
export interface ClaudeResponse {
  /** Response content */
  content: string
  /** Model used */
  model: string
  /** Stop reason if conversation ended */
  stopReason?: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use'
  /** Token usage information */
  usage?: ClaudeUsage
}

/**
 * Token usage information
 */
export interface ClaudeUsage {
  /** Input tokens consumed */
  inputTokens: number
  /** Output tokens generated */
  outputTokens: number
  /** Total tokens */
  totalTokens: number
}

/**
 * Stream event types
 */
export type ClaudeStreamEvent =
  | TextDeltaEvent
  | MessageStartEvent
  | ContentBlockStartEvent
  | ContentBlockDeltaEvent
  | ContentBlockStopEvent
  | MessageDeltaEvent
  | MessageStopEvent
  | ErrorEvent

/** Text delta event - streaming response chunk */
export interface TextDeltaEvent {
  type: 'content_block_delta'
  index: number
  delta: {
    type: 'text_delta'
    text: string
  }
}

/** Message start event */
export interface MessageStartEvent {
  type: 'message_start'
  message: ClaudeMessage
}

/** Content block start event */
export interface ContentBlockStartEvent {
  type: 'content_block_start'
  index: number
  content_block: {
    type: 'text'
    text: string
  }
}

/** Content block delta event - streaming content */
export interface ContentBlockDeltaEvent {
  type: 'content_block_delta'
  index: number
  delta: {
    type: 'text_delta'
    text: string
  }
}

/** Content block stop event */
export interface ContentBlockStopEvent {
  type: 'content_block_stop'
  index: number
}

/** Message delta event - metadata updates */
export interface MessageDeltaEvent {
  type: 'message_delta'
  delta: {
    stop_reason?: string
    stop_sequence?: string
  }
  usage?: ClaudeUsage
}

/** Message stop event - response complete */
export interface MessageStopEvent {
  type: 'message_stop'
}

/** Error event */
export interface ErrorEvent {
  type: 'error'
  error: {
    type: string
    message: string
  }
}

/**
 * Stream callback functions
 */
export interface StreamCallbacks {
  /** Called when new text chunk arrives */
  onChunk?: (chunk: string) => void
  /** Called when complete message is received */
  onComplete?: (response: ClaudeResponse) => void
  /** Called when an error occurs */
  onError?: (error: Error) => void
  /** Called when stream closes */
  onClose?: () => void
}

/**
 * Client configuration options
 */
export interface ClaudeClientConfig {
  /** Anthropic API key (from env or provided) */
  apiKey?: string
  /** Model to use */
  model?: string
  /** Maximum tokens for response */
  maxTokens?: number
  /** Request timeout in milliseconds */
  timeout?: number
  /** Number of retry attempts */
  maxRetries?: number
  /** Enable in dev mode */
  dangerouslyAllowBrowser?: boolean
}

/**
 * Send message options
 */
export interface SendMessageOptions {
  /** Model to use */
  model?: string
  /** Maximum tokens for response */
  maxTokens?: number
  /** System prompt */
  system?: string
  /** Temperature for response randomness */
  temperature?: number
  /** Top-p sampling */
  topP?: number
  /** Stop sequences */
  stopSequences?: string[]
  /** Request timeout in milliseconds */
  timeout?: number
  /** Stream response */
  stream?: boolean
  /** Stream callbacks */
  streamCallbacks?: StreamCallbacks
}

/**
 * Session configuration
 */
export interface ClaudeSession {
  /** Unique session ID */
  id: string
  /** Session title (optional) */
  title?: string
  /** User identifier */
  userId: string
  /** Messages in session */
  messages: ClaudeMessage[]
  /** Session creation timestamp */
  createdAt: number
  /** Last activity timestamp */
  lastActivityAt: number
  /** Session metadata */
  metadata?: Record<string, unknown>
}

/**
 * Session list filter options
 */
export interface SessionFilter {
  /** Filter by user ID */
  userId?: string
  /** Limit number of results */
  limit?: number
  /** Filter by minimum last activity time */
  minLastActivityAt?: number
}

/**
 * Error types
 */
export interface ClaudeError extends Error {
  /** Error type */
  type: ClaudeErrorType
  /** Original error (if available) */
  cause?: unknown
}

export type ClaudeErrorType =
  | 'timeout'
  | 'rate_limit'
  | 'invalid_key'
  | 'network'
  | 'invalid_request'
  | 'overloaded'
  | 'unknown'

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum retry attempts */
  maxAttempts: number
  /** Base delay in milliseconds */
  baseDelay: number
  /** Maximum delay in milliseconds */
  maxDelay: number
  /** Exponential backoff multiplier */
  backoffMultiplier: number
}

/**
 * Default configurations
 */
export const DEFAULT_CLAUDE_CONFIG: Required<ClaudeClientConfig> = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 4096,
  timeout: 30000,
  maxRetries: 3,
  dangerouslyAllowBrowser: true,
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
}
