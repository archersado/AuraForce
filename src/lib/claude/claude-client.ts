/**
 * Claude Client for Claude Code API Integration
 *
 * Uses @anthropic-ai/claude-agent-sdk for streaming responses.
 * Pattern based on claudecodeui: forward SDK messages directly to frontend.
 *
 * Reference: https://github.com/siteboon/claudecodeui
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type { StreamChunk } from './types';

/**
 * Claude client configuration
 */
export interface ClaudeClientConfig {
  apiKey: string;
  model?: string;
  permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions' | 'dontAsk';
  cwd?: string;
  sessionId?: string;
}

/**
 * SDK message types (from @anthropic-ai/claude-agent-sdk)
 * These are the message types the SDK query returns
 */
export interface SDKMessage {
  type: string;
  session_id?: string;
  [key: string]: unknown;
}

/**
 * Stream callback types - matching claudecodeui pattern
 */
export type StreamCallback = (message: SDKMessage) => void;
export type StreamErrorCallback = (error: Error) => void;

/**
 * Writer interface for sending messages (WebSocket or SSE)
 * Matches claudecodeui pattern
 */
export interface StreamWriter {
  send(data: Record<string, unknown>): void;
  setSessionId?(sessionId: string): void;
  getSessionId?(): string;
}

/**
 * Message format for Claude API (legacy compatibility)
 */
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Claude Client implementation using Agent SDK
 * Following claudecodeui's proven pattern
 */
export class ClaudeClient {
  private config: Required<Pick<ClaudeClientConfig, 'model' | 'permissionMode'>> & { cwd: string; sessionId?: string };

  constructor(config: ClaudeClientConfig) {
    this.config = {
      model: config.model ?? 'sonnet',
      permissionMode: config.permissionMode ?? 'bypassPermissions',
      cwd: config.cwd ?? process.cwd(),
      sessionId: config.sessionId,
    };
  }

  /**
   * Send a message and receive streaming response using Agent SDK
   * This is the main streaming method that mirrors claudecodeui's queryClaudeSDK pattern
   */
  async sendMessageStream(
    prompt: string,
    callbacks: {
      onMessage: StreamCallback;
      onError?: StreamErrorCallback;
    }
  ): Promise<string> {
    let capturedSessionId = this.config.sessionId || '';

    try {
      console.log('[ClaudeClient] Starting query with model:', this.config.model);
      console.log('[ClaudeClient] Prompt:', prompt);

      // Set up PATH for Claude Code CLI (same as claudecodeui)
      const sdkOptions: Record<string, unknown> = {
        model: this.config.model,
        permissionMode: this.config.permissionMode,
        cwd: this.config.cwd,
        systemPrompt: {
          type: 'preset',
          preset: 'claude_code'
        },
        settingSources: ['project', 'user', 'local'],
      };

      // Add sessionId if provided (resume existing session)
      if (capturedSessionId) {
        sdkOptions.resume = capturedSessionId;
      }

      // Create SDK query instance (async generator)
      const queryInstance = query({
        prompt,
        options: sdkOptions
      });

      console.log('[ClaudeClient] Starting message iteration...');

      let totalMessages = 0;

      // Process streaming messages from SDK (same pattern as claudecodeui)
      for await (const message of queryInstance) {
        totalMessages++;
        console.log(`[ClaudeClient] Received message #${totalMessages}:`, message.type, 'sessionId:', message.session_id);

        // Capture session ID from first message (same as claudecodeui)
        if (message.session_id && !capturedSessionId) {
          capturedSessionId = message.session_id;
          console.log('[ClaudeClient] Captured session ID:', capturedSessionId);
        }

        // Forward message directly to callbacks (claudecodeui pattern)
        callbacks.onMessage(message);
      }

      console.log(`[ClaudeClient] Streaming complete, total messages: ${totalMessages}`);

      return capturedSessionId;

    } catch (error) {
      console.error('[ClaudeClient] Stream error:', error);
      if (error instanceof Error) {
        console.error('[ClaudeClient] Error stack:', error.stack);
      }
      callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Legacy streaming method for backward compatibility
   * Converts SDK messages to StreamChunk format
   */
  async sendMessageStreamLegacy(
    message: string,
    callbacks: {
      onStreamChunk: (chunk: StreamChunk) => void;
      onStreamStart?: (messageId: string) => void;
      onStreamEnd?: (messageId: string, finalContent: string) => void;
      onStreamError?: (error: Error) => void;
    }
  ): Promise<void> {
    const messageId = crypto.randomUUID();
    callbacks.onStreamStart?.(messageId);

    try {
      await this.sendMessageStream(message, {
        onMessage: (sdkMessage: SDKMessage) => {
          console.log('[ClaudeClient] SDK message:', sdkMessage.type);

          // Handle different message types from SDK
          // Use unknown intermediate type for safe casting
          const msg = sdkMessage as unknown;

          if (sdkMessage.type === 'stream_event') {
            const eventData = msg as { event: { type: string; delta?: unknown; text?: string } };
            const event = eventData.event;

            // Handle text streaming
            if (event.type === 'content_block_delta' && event.delta) {
              const delta = event.delta as { type?: string; text?: string };
              if (delta.type === 'text_delta' && delta.text) {
                callbacks.onStreamChunk({
                  content: delta.text,
                  isComplete: false,
                });
              }
            }
            // Handle text content
            else if (event.type === 'text_delta' && event.text) {
              callbacks.onStreamChunk({
                content: event.text,
                isComplete: false,
              });
            }
          }
          // Handle result message
          else if (sdkMessage.type === 'result') {
            const resultMsg = msg as { subtype: string; result?: string; errors?: string[] };
            if (resultMsg.subtype === 'success') {
              callbacks.onStreamEnd?.(messageId, resultMsg.result || '');
            } else {
              const error = new Error(resultMsg.errors?.join(', ') || 'Query failed');
              callbacks.onStreamError?.(error);
            }
          }
        },
        onError: (error: Error) => {
          callbacks.onStreamError?.(error);
        }
      });

    } catch (error) {
      console.error('[ClaudeClient] Legacy stream error:', error);
      callbacks.onStreamError?.(error as Error);
    }
  }

  /**
   * Send a regular (non-streaming) message using Agent SDK
   */
  async sendMessage(prompt: string): Promise<string> {
    try {
      console.log('[ClaudeClient] Non-streaming query with model:', this.config.model);

      const sdkOptions: Record<string, unknown> = {
        model: this.config.model,
        permissionMode: this.config.permissionMode,
        cwd: this.config.cwd,
        systemPrompt: {
          type: 'preset',
          preset: 'claude_code'
        },
        settingSources: ['project', 'user', 'local'],
      };

      const queryInstance = query({
        prompt,
        options: sdkOptions
      });

      let result = '';
      let errorMessage = '';
      let completed = false;

      // Process messages until we get the final result
      for await (const msg of queryInstance) {
        console.log('[ClaudeClient] Message in non-streaming mode:', msg.type);

        // Use unknown intermediate type for safe casting
        const resultMsg = msg as unknown as { subtype: string; result?: string; errors?: string[] };

        if (msg.type === 'result') {
          if (resultMsg.subtype === 'success') {
            result = resultMsg.result || '';
            completed = true;
          } else {
            errorMessage = resultMsg.errors?.join(', ') || 'Query failed';
            completed = true;
          }
          break; // Exit after receiving result
        }
      }

      if (!completed && !result) {
        throw new Error('Query completed without result');
      }

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      return result;

    } catch (error) {
      console.error('[ClaudeClient] Message error:', error);
      throw error;
    }
  }

  /**
   * Abort the current streaming query
   */
  async abort(): Promise<void> {
    // Note: Query objects don't expose interrupt directly in async iteration
    // The query will be aborted when the connection closes or timeout
    console.log('[ClaudeClient] Abort called (connection will close on next request)');
  }

  /**
   * Clear conversation context (Agent SDK handles this internally)
   */
  clearContext(): void {
    console.log('[ClaudeClient] Clear context called (handled by Agent SDK per-session)');
  }

  /**
   * Get current conversation context (not supported in query mode)
   */
  getContext(): ClaudeMessage[] {
    throw new Error('getContext not supported in one-shot query mode. Use unstable_v2 API for multi-turn conversations.');
  }

  /**
   * Get context length (not supported in one-shot query mode)
   */
  getContextLength(): number {
    throw new Error('getContextLength not supported in one-shot query mode');
  }

  /**
   * Add system message to context
   */
  addSystemMessage(_content: string): void {
    console.log('[ClaudeClient] System prompt should be set via options.systemPrompt');
  }

  /**
   * Truncate context (not applicable with one-shot query mode)
   */
  truncateContext(_lastN: number): void {
    throw new Error('truncateContext not supported in one-shot query mode');
  }

  /**
   * Set custom system prompt
   */
  setSystemPrompt(_content: string): void {
    console.log('[ClaudeClient] System prompt should be set via options.systemPrompt in query()');
  }
}

/**
 * Create a new Claude client instance
 */
export function createClaudeClient(config: ClaudeClientConfig): ClaudeClient {
  return new ClaudeClient(config);
}
