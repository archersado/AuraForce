/**
 * Stream Manager for orchestrating streaming state
 *
 * Manages the lifecycle of streaming messages, coordinates between
 * WebSocket client, component state, and message formatting.
 */

import type {
  StreamingMessage,
  StreamChunk,
  StreamStart,
  StreamEnd,
  ConnectionState,
  StreamEvent,
  StreamError as StreamErrorType,
  StreamState,
} from './types';
import type { Message } from '@/lib/store/claude-store';

/**
 * Stream manager configuration
 */
interface StreamManagerConfig {
  onMessageUpdate: (message: Message) => void;
  onStreamStart?: (messageId: string) => void;
  onStreamEnd?: (messageId: string) => void;
  onStreamError?: (error: StreamErrorType) => void;
  onConnectionStateChange?: (state: ConnectionState, previousState?: ConnectionState) => void;
  onStreamStateChange?: (state: StreamState, previousState?: StreamState) => void;
}

/**
 * Stream manager coordinates streaming operations
 */
export class StreamManager {
  private activeStreams: Map<string, StreamingMessage> = new Map();
  private config: StreamManagerConfig;
  private pendingChunks: Map<string, string[]> = new Map();
  private updateScheduled: Map<string, boolean> = new Map();
  private streamState: StreamState = 'idle';

  constructor(config: StreamManagerConfig) {
    this.config = config;
  }

  /**
   * Handle stream start event
   */
  handleStreamStart(event: StreamStart): void {
    this.setStreamState('active');

    const streamingMessage: StreamingMessage = {
      id: event.messageId,
      type: 'assistant',
      content: '',
      timestamp: event.timestamp,
      isStreaming: true,
      streamBuffer: '',
      streamStartTime: event.timestamp,
      lastChunkTime: event.timestamp,
    };

    this.activeStreams.set(event.messageId, streamingMessage);
    this.pendingChunks.set(event.messageId, []);
    this.config.onStreamStart?.(event.messageId);
  }

  /**
   * Handle stream chunk event with throttling
   */
  handleStreamChunk(chunk: StreamChunk, streamId?: string): void {
    console.log('[StreamManager] handleStreamChunk called:', { streamId, chunkContentLength: chunk.content?.length, isComplete: chunk.isComplete, streamState: this.streamState, activeStreams: Array.from(this.activeStreams.keys()) });

    // Skip processing if stream is paused
    if (this.streamState === 'paused') {
      console.log('[StreamManager] Stream paused, skipping chunk');
      return;
    }

    if (!streamId && this.activeStreams.size === 0) {
      console.warn('[StreamManager] No streamId and no active streams');
      return;
    }

    const messageId = streamId || Array.from(this.activeStreams.keys())[0];
    if (!messageId) {
      console.warn('[StreamManager] No messageId found');
      return;
    }

    const streamingMessage = this.activeStreams.get(messageId);
    if (!streamingMessage) {
      console.warn('[StreamManager] No streaming message found for:', messageId);
      return;
    }


    // Accumulate chunk in buffer
    const oldLength = streamingMessage.streamBuffer.length;
    streamingMessage.streamBuffer += chunk.content;
    streamingMessage.content = streamingMessage.streamBuffer;
    streamingMessage.lastChunkTime = new Date();


    // Schedule throttled update
    if (!this.updateScheduled.get(messageId)) {
      this.updateScheduled.set(messageId, true);
      requestAnimationFrame(() => {
        this.flushUpdate(messageId);
        this.updateScheduled.delete(messageId);
      });
    }

    // Emit code complete event if code block just finished
    if (chunk.isCodeComplete) {
      this.handleCodeBlockComplete(messageId, streamingMessage.content);
    }
  }

  /**
   * Handle stream end event
   */
  handleStreamEnd(event: StreamEnd): void {
    const streamingMessage = this.activeStreams.get(event.messageId);
    if (!streamingMessage) return;

    // Use the accumulated streamBuffer as final content (not the empty finalContent param)
    const finalContent = streamingMessage.streamBuffer;

    // Final update with complete content
    streamingMessage.isStreaming = false;
    streamingMessage.content = finalContent;
    streamingMessage.streamBuffer = '';

    // Emit final update
    this.config.onMessageUpdate(streamingMessage as Message);

    // Cleanup
    this.activeStreams.delete(event.messageId);
    this.pendingChunks.delete(event.messageId);
    this.updateScheduled.delete(event.messageId);

    // Set stream state to completed
    this.setStreamState('completed');

    this.config.onStreamEnd?.(event.messageId);
  }

  /**
   * Handle stream error event
   */
  handleStreamError(event: StreamErrorType): void {
    const streamingMessage = this.activeStreams.get(event.messageId);
    if (streamingMessage) {
      // Preserve partial response
      streamingMessage.isStreaming = false;
      streamingMessage.content = streamingMessage.streamBuffer;
      this.config.onMessageUpdate(streamingMessage as Message);
      this.activeStreams.delete(event.messageId);
    }

    // Set stream state to error
    this.setStreamState('error');

    this.config.onStreamError?.(event);
  }

  /**
   * Handle connection state change
   */
  handleConnectionStateChange(state: ConnectionState, previousState?: ConnectionState): void {
    this.config.onConnectionStateChange?.(state, previousState);

    // Handle reconnection - preserve partial responses
    if (state === 'reconnecting' && previousState === 'error') {
      console.info('[StreamManager] Preserving partial responses for reconnection');
    }
  }

  /**
   * Abort active stream (e.g., when new message sent)
   */
  abortStream(messageId: string): void {
    const streamingMessage = this.activeStreams.get(messageId);
    if (!streamingMessage) return;

    // Preserve partial content
    streamingMessage.isStreaming = false;
    streamingMessage.content = streamingMessage.streamBuffer;

    this.config.onMessageUpdate(streamingMessage as Message);

    // Cleanup
    this.activeStreams.delete(messageId);
    this.pendingChunks.delete(messageId);
    this.updateScheduled.delete(messageId);
  }

  /**
   * Abort all active streams
   */
  abortAllStreams(): void {
    this.activeStreams.forEach((_, messageId) => {
      this.abortStream(messageId);
    });
  }

  /**
   * Get active stream count
   */
  getActiveStreamCount(): number {
    return this.activeStreams.size;
  }

  /**
   * Check if stream is active for message
   */
  isStreamActive(messageId: string): boolean {
    return this.activeStreams.has(messageId);
  }

  /**
   * Pause the current stream
   */
  pauseStream(): void {
    if (this.streamState === 'active' || this.streamState === 'idle') {
      this.setStreamState('paused');
    }
  }

  /**
   * Resume a paused stream
   */
  resumeStream(): void {
    if (this.streamState === 'paused') {
      this.setStreamState('active');
    }
  }

  /**
   * Get current stream state
   */
  getStreamState(): StreamState {
    return this.streamState;
  }

  /**
   * Set stream state and notify listeners
   */
  private setStreamState(state: StreamState): void {
    if (this.streamState !== state) {
      const previousState = this.streamState;
      this.streamState = state;
      this.config.onStreamStateChange?.(state, previousState);
      console.log('[StreamManager] Stream state changed:', { previousState, state });
    }
  }

  /**
   * Flush pending update immediately
   */
  private flushUpdate(messageId: string): void {
    const streamingMessage = this.activeStreams.get(messageId);
    if (!streamingMessage) return;

    this.config.onMessageUpdate(streamingMessage as Message);
  }

  /**
   * Handle code block completion for syntax highlighting
   */
  private handleCodeBlockComplete(messageId: string, content: string): void {
    const streamingMessage = this.activeStreams.get(messageId);
    if (!streamingMessage) return;

    // Force immediate update to apply syntax highlighting
    this.config.onMessageUpdate(streamingMessage as Message);
  }

  /**
   * Detect if code block is complete in content
   */
  detectCodeBlockComplete(content: string): boolean {
    const match = content.match(/```(\w*)$/gm);
    return match !== null && match.length % 2 === 0;
  }

  /**
   * Cleanup manager (remove all state)
   */
  destroy(): void {
    this.activeStreams.clear();
    this.pendingChunks.clear();
    this.updateScheduled.clear();
  }
}

/**
 * Create a new stream manager instance
 */
export function createStreamManager(config: StreamManagerConfig): StreamManager {
  return new StreamManager(config);
}
