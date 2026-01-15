/**
 * Session Persistence Type Definitions
 *
 * Types for session storage, API requests/responses, and data transfer objects.
 */

/**
 * Session status types
 */
export type SessionStatus = 'active' | 'completed' | 'aborted';

/**
 * Session control state types (transient, stored in metadata)
 */
export type SessionControlState = 'idle' | 'streaming' | 'paused' | 'terminated';

/**
 * Session metadata for transient control state
 */
export interface SessionMetadata {
  controlState?: SessionControlState;
  pausedAt?: string; // ISO timestamp
  resumedAt?: string; // ISO timestamp
  terminatedAt?: string; // ISO timestamp
  terminatedReason?: 'user' | 'error' | 'timeout';
  streamId?: string; // Track current stream
}

/**
 * Message role types
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Command type imported from claude types
 */
import type { Command } from '@/lib/claude/types';
import type { ToolUseData } from '@/types/tool-use';

/**
 * Message stored in database
 */
export interface StoredMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  command?: Command; // Use full Command type from claude
  toolUseData?: ToolUseData; // Tool use data for system messages
}

/**
 * Session data transfer object (API response)
 */
export interface SessionDTO {
  id: string;
  title: string;
  sessionId: string | null; // Claude SDK session ID
  userId: string;
  skillId: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessagePreview?: string; // Preview of last user message (Story 3.6)
}

/**
 * Session detail with messages (API response)
 */
export interface SessionDetailDTO extends SessionDTO {
  messages: StoredMessage[];
  metadata?: SessionMetadata;
}

/**
 * Create session request payload
 */
export interface CreateSessionRequest {
  title?: string;
  skillId?: string;
  messages?: StoredMessage[]; // Optional initial messages
  projectId?: string; // Project ID for session isolation
}

/**
 * Update session request payload
 */
export interface UpdateSessionRequest {
  title?: string;
  status?: SessionStatus;
  sessionId?: string; // Claude SDK session ID
  messages?: StoredMessage[];
  metadata?: SessionMetadata;
}

/**
 * API error response structure
 */
export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * API error types
 */
export type ApiErrorType =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

/**
 * Unified API response
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Session list response
 */
export interface SessionsListResponse {
  sessions: SessionDTO[];
  total: number;
}

/**
 * Session save result
 */
export interface SessionSaveResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}
