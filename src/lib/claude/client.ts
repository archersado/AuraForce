/**
 * Claude Agent SDK Client
 *
 * Main Claude client for sending messages and handling responses.
 * Currently using @anthropic-ai/sdk v0.9.1 API.
 */

import Anthropic from '@anthropic-ai/sdk'

import type {
  ClaudeClientConfig,
  ClaudeMessage,
  ClaudeResponse,
  SendMessageOptions,
  ClaudeUsage,
  ClaudeStreamEvent,
} from '@/types/claude'
import { DEFAULT_CLAUDE_CONFIG } from '@/types/claude'
import { ClaudeSDKError, withRetry, withTimeout } from './errors'

/**
 * Validate API key configuration
 */
function validateApiKey(apiKey: string): void {
  if (!apiKey || apiKey.trim().length === 0) {
    throw ClaudeSDKError.invalidKey('ANTHROPIC_API_KEY is not configured')
  }
  // Claude API keys start with 'sk-ant-' (Anthropic) or are otherwise formatted
  // For v0.9.1, accept any non-empty string
}

/**
 * Create Claude client instance
 */
export function createClaudeClient(config: Partial<ClaudeClientConfig> = {}): Anthropic {
  const apiKey = config.apiKey || DEFAULT_CLAUDE_CONFIG.apiKey

  validateApiKey(apiKey)

  return new Anthropic({
    apiKey,
    maxRetries: config.maxRetries ?? DEFAULT_CLAUDE_CONFIG.maxRetries,
  })
}

/**
 * Default Claude client instance
 */
export const claudeClient = createClaudeClient()

/**
 * Convert Claude messages to SDK prompt format
 * For Messages API v0.9.1 with completions
 */
function convertToPrompt(messages: ClaudeMessage[]): string {
  return messages
    .map((msg) => {
      const roleCapitalized = msg.role.charAt(0).toUpperCase() + msg.role.slice(1)
      return `${roleCapitalized}: ${msg.content}`
    })
    .join('\n\n')
}

/**
 * Convert SDK response to Claude response
 */
function convertSDKResponse(
  completion: Anthropic.Completion,
  model: string
): ClaudeResponse {
  return {
    content: completion.completion,
    model,
    stopReason: completion.stop_reason as any,
  }
}

/**
 * Send a message to Claude
 */
export async function sendMessage(
  messages: ClaudeMessage[],
  options: SendMessageOptions = {}
): Promise<ClaudeResponse> {
  const model = options.model || DEFAULT_CLAUDE_CONFIG.model
  const maxTokens = options.maxTokens || DEFAULT_CLAUDE_CONFIG.maxTokens
  const prompt = convertToPrompt(messages)

  const response = await withRetry(async () => {
    return await withTimeout(async () => {
      if (options.stream || options.streamCallbacks) {
        // Streaming response
        const stream = await claudeClient.completions.create({
          model: model as any,
          max_tokens_to_sample: maxTokens,
          prompt,
          stop_sequences: options.stopSequences,
        })

        return handleStream(stream, {
          onChunk: options.streamCallbacks?.onChunk,
          onComplete: options.streamCallbacks?.onComplete,
          onError: options.streamCallbacks?.onError
            ? (e) => options.streamCallbacks!.onError!(ClaudeSDKError.fromSDKError(e))
            : undefined,
          onClose: options.streamCallbacks?.onClose,
        })
      } else {
        // Non-streaming response
        return await claudeClient.completions.create({
          model: model as any,
          max_tokens_to_sample: maxTokens,
          prompt,
          stop_sequences: options.stopSequences,
        })
      }
    }, options.timeout || DEFAULT_CLAUDE_CONFIG.timeout)
  })

  // Handle non-streaming response
  if (!options.stream && !options.streamCallbacks) {
    return convertSDKResponse(response as Anthropic.Completion, model)
  }

  // Streaming response already handled in handleStream
  return {
    content: '',
    model,
    usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
  }
}

/**
 * Handle streaming response from v0.9.1 API
 */
async function handleStream(
  stream: unknown,
  callbacks: {
    onChunk?: (chunk: string) => void
    onComplete?: (response: ClaudeResponse) => void
    onError?: (error: Error) => void
    onClose?: () => void
  }
): Promise<void> {
  let fullText = ''

  try {
    // Convert stream to async iterator if needed - for SDK v0.9.1
    for await (const event of stream as any) {
      if (event && typeof event === 'object' && 'completion' in event) {
        const chunk = String(event.completion)
        fullText += chunk
        callbacks.onChunk?.(chunk)
      }
    }

    callbacks.onComplete?.({
      content: fullText,
      model: DEFAULT_CLAUDE_CONFIG.model,
    })
  } catch (error) {
    callbacks.onError?.(new Error(String(error)))
    throw error
  } finally {
    callbacks.onClose?.()
  }
}

/**
 * Create a streaming message generator
 */
export async function* sendMessageStream(
  messages: ClaudeMessage[],
  options: SendMessageOptions = {}
): AsyncGenerator<string, ClaudeResponse> {
  const model = options.model || DEFAULT_CLAUDE_CONFIG.model
  const maxTokens = options.maxTokens || DEFAULT_CLAUDE_CONFIG.maxTokens
  const prompt = convertToPrompt(messages)

  const stream = await withRetry(async () => {
    return await claudeClient.completions.create({
      model: model as any,
      max_tokens_to_sample: maxTokens,
      prompt,
      stop_sequences: options.stopSequences,
    })
  })

  let fullText = ''

  try {
    // Stream from SDK v0.9.1
    for await (const event of stream as any) {
      if (event && typeof event === 'object' && 'completion' in event) {
        const chunk = String(event.completion)
        fullText += chunk
        yield chunk
      }
    }

    return {
      content: fullText,
      model,
    }
  } catch (error) {
    throw ClaudeSDKError.fromSDKError(error)
  }
}
