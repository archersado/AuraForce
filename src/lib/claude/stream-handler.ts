/**
 * Claude Stream Handler
 *
 * Processes streaming responses from Claude,
 * accumulating text chunks and providing callback interfaces.
 */

import type {
  ClaudeStreamEvent,
  ClaudeMessage,
  ClaudeResponse,
  StreamCallbacks,
  ClaudeUsage,
} from '@/types/claude'

/**
 * Stream accumulator state
 */
interface StreamState {
  /** Accumulated text */
  text: string
  /** Start timestamp */
  startTime: number
  /** End timestamp */
  endTime?: number
  /** Token usage */
  usage?: ClaudeUsage
  /** Stop reason */
  stopReason?: string
}

/**
 * Parse a stream event and convert to ClaudeStreamEvent
 */
export function parseStreamEvent(event: unknown): ClaudeStreamEvent | null {
  if (!event || typeof event !== 'object') {
    return null
  }

  const obj = event as Record<string, unknown>

  switch (obj.type) {
    case 'text_chunk':
      // Convert text_chunk to our internal format
      return {
        type: 'content_block_delta' as const,
        index: 0,
        delta: {
          type: 'text_delta',
          text: String(obj.text || ''),
        },
      } as any

    case 'content_block_delta':
      if (obj.delta && typeof obj.delta === 'object') {
        const delta = obj.delta as Record<string, unknown>
        if (delta.type === 'text_delta') {
          return {
            type: 'content_block_delta',
            index: Number(obj.index || 0),
            delta: {
              type: 'text_delta',
              text: String(delta.text || ''),
            },
          } as any
        }
      }
      break

    case 'message_start':
      return {
        type: 'message_start',
        message: obj.message as ClaudeMessage,
      } as any

    case 'content_block_start':
      return {
        type: 'content_block_start',
        index: Number(obj.index || 0),
        content_block: obj.content_block as {
          type: 'text'
          text: string
        },
      } as any

    case 'content_block_stop':
      return {
        type: 'content_block_stop',
        index: Number(obj.index || 0),
      } as any

    case 'message_delta':
      return {
        type: 'message_delta',
        delta: {
          stop_reason: obj.stop_reason as string | undefined,
        },
        usage: obj.usage as ClaudeUsage | undefined,
      } as any

    case 'message_stop':
      return {
        type: 'message_stop',
      } as any

    case 'error':
      return {
        type: 'error',
        error: obj.error as {
          type: string
          message: string
        },
      }
  }

  return null
}

/**
 * Process a stream of events with callbacks
 */
export async function processStream(
  eventStream: AsyncGenerator<unknown> | ReadableStream<unknown>,
  model: string,
  callbacks: StreamCallbacks = {}
): Promise<ClaudeResponse> {
  const state: StreamState = {
    text: '',
    startTime: Date.now(),
  }

  try {
    if ('next' in eventStream) {
      // AsyncGenerator
      for await (const event of eventStream) {
        const streamEvent = parseStreamEvent(event)
        if (streamEvent) {
          handleStreamEvent(streamEvent, state, callbacks)
        }
      }
    } else if ('getReader' in eventStream) {
      // ReadableStream
      const reader = (eventStream as ReadableStream<unknown>).getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const text = decoder.decode(value as AllowSharedBufferSource)
        try {
          const event = JSON.parse(text)
          const streamEvent = parseStreamEvent(event)
          if (streamEvent) {
            handleStreamEvent(streamEvent, state, callbacks)
          }
        } catch {
          // Skip invalid JSON
          continue
        }
      }
    }
  } catch (error) {
    callbacks.onError?.(new Error(String(error)))
    throw error
  } finally {
    state.endTime = Date.now()
    callbacks.onClose?.()
  }

  // Build final response
  const response: ClaudeResponse = {
    content: state.text,
    model,
    stopReason: state.stopReason as any,
    usage: state.usage,
  }

  callbacks.onComplete?.(response)

  return response
}

/**
 * Handle a single stream event
 */
function handleStreamEvent(
  event: ClaudeStreamEvent,
  state: StreamState,
  callbacks: StreamCallbacks
): void {
  switch (event.type) {
    case 'content_block_delta':
      if (event.delta.type === 'text_delta') {
        state.text += event.delta.text
        callbacks.onChunk?.(event.delta.text)
      }
      break

    case 'message_delta':
      if (event.delta.stop_reason) {
        state.stopReason = event.delta.stop_reason
      }
      if (event.usage) {
        state.usage = event.usage
      }
      break

    case 'message_stop':
      // Stream complete
      break

    case 'error':
      callbacks.onError?.(new Error(event.error.message))
      break

    // Other events are informational
    default:
      break
  }
}

/**
 * Create a buffered stream for processing
 */
export function createBufferedStream(
  chunks: AsyncIterable<string>
): AsyncGenerator<ClaudeStreamEvent> {
  return (async function* () {
    for await (const chunk of chunks) {
      try {
        const event = JSON.parse(chunk) as Record<string, unknown>
        const streamEvent = parseStreamEvent(event)
        if (streamEvent) {
          yield streamEvent
        }
      } catch {
        // Skip invalid JSON
        continue
      }
    }
  })()
}

/**
 * Create ReadableStream from AsyncGenerator
 */
export function generatorToReadableStream<T>(
  generator: AsyncGenerator<T>
): ReadableStream<T> {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const item of generator) {
          controller.enqueue(item)
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

/**
 * Create streaming response handler for Next.js API
 */
export function createStreamingResponseHandler(
  generator: AsyncGenerator<string>,
  callbacks: StreamCallbacks = {}
): Response {
  const stream = generatorToReadableStream(generator)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

/**
 * Parse Server-Sent Events (SSE) format
 */
export function parseSSEEvent(line: string): ServerSentEvent | null {
  if (!line.startsWith('data: ')) {
    return null
  }

  const data = line.slice(6).trim()

  if (data === '[DONE]') {
    return { type: 'done', data: null }
  }

  try {
    return {
      type: 'data',
      data: JSON.parse(data),
    }
  } catch {
    return null
  }
}

/**
 * SSE event structure
 */
interface ServerSentEvent {
  type: 'data' | 'done'
  data: unknown | null
}

/**
 * Format SSE event for streaming
 */
export function formatSSEEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

/**
 * Format SSE done event
 */
export function formatSSEDone(): string {
  return 'data: [DONE]\n\n'
}
