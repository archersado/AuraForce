/**
 * Claude Agent SDK Error Handling
 *
 * Provides custom error types and error handling utilities
 * for Claude Agent SDK integration.
 */

import type { ClaudeError, ClaudeErrorType } from '@/types/claude'

/**
 * Custom Claude SDK error class
 */
export class ClaudeSDKError extends Error implements ClaudeError {
  readonly type: ClaudeErrorType
  readonly cause?: unknown

  constructor(type: ClaudeErrorType, message: string, cause?: unknown) {
    super(message)
    this.name = 'ClaudeSDKError'
    this.type = type
    this.cause = cause

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClaudeSDKError)
    }
  }

  /**
   * Create a timeout error
   */
  static timeout(message: string = 'Request timed out'): ClaudeSDKError {
    return new ClaudeSDKError('timeout', message)
  }

  /**
   * Create a rate limit error
   */
  static rateLimit(message: string = 'Rate limit exceeded'): ClaudeSDKError {
    return new ClaudeSDKError('rate_limit', message)
  }

  /**
   * Create an invalid key error
   */
  static invalidKey(message: string = 'Invalid API key'): ClaudeSDKError {
    return new ClaudeSDKError('invalid_key', message)
  }

  /**
   * Create a network error
   */
  static network(message: string, cause?: unknown): ClaudeSDKError {
    return new ClaudeSDKError('network', message, cause)
  }

  /**
   * Create an invalid request error
   */
  static invalidRequest(message: string): ClaudeSDKError {
    return new ClaudeSDKError('invalid_request', message)
  }

  /**
   * Create an overloaded error (service unavailable)
   */
  static overloaded(message: string = 'Service overloaded'): ClaudeSDKError {
    return new ClaudeSDKError('overloaded', message)
  }

  /**
   * Parse SDK error and return appropriate ClaudeError
   */
  static fromSDKError(error: unknown): ClaudeSDKError {
    if (error instanceof ClaudeSDKError) {
      return error
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (message.includes('timeout') || message.includes('timed out')) {
        return this.timeout(error.message)
      }
      if (message.includes('rate limit') || message.includes('429')) {
        return this.rateLimit(error.message)
      }
      if (message.includes('unauthorized') || message.includes('401') || message.includes('invalid api key')) {
        return this.invalidKey(error.message)
      }
      if (message.includes('network') || message.includes('fetch') || message.includes('enotfound')) {
        return this.network(error.message, error)
      }
      if (message.includes('overloaded') || message.includes('503')) {
        return this.overloaded(error.message)
      }
      if (message.includes('bad request') || message.includes('400') || message.includes('invalid')) {
        return this.invalidRequest(error.message)
      }
    }

    return new ClaudeSDKError('unknown', 'Unknown error occurred', error)
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const messages: Record<ClaudeErrorType, string> = {
      timeout: '请求超时，请稍后重试',
      rate_limit: '请求过多，请稍后再试',
      invalid_key: 'API Key 无效，请检查配置',
      network: '网络连接失败，请检查网络设置',
      invalid_request: '请求参数无效',
      overloaded: '服务暂时不可用，请稍后重试',
      unknown: '发生未知错误，请稍后重试',
    }

    return messages[this.type] || messages.unknown
  }
}

/**
 * Retry delay calculation with exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  const delay = baseDelay * Math.pow(backoffMultiplier, attempt)
  return Math.min(delay, maxDelay)
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = ClaudeSDKError.fromSDKError(error)

      // Don't retry on these error types
      if (
        'type' in lastError &&
        (lastError.type === 'invalid_key' ||
          lastError.type === 'invalid_request')
      ) {
        throw lastError
      }

      // Don't wait after last attempt
      if (attempt < maxAttempts - 1) {
        const delay = calculateRetryDelay(attempt, baseDelay, maxDelay, backoffMultiplier)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Retry failed with no error information')
}

/**
 * Execute function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 30000,
  timeoutMessage: string = 'Request timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(ClaudeSDKError.timeout(timeoutMessage))
    }, timeoutMs)
  })

  return Promise.race([fn(), timeoutPromise])
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ClaudeError): boolean {
  return !(
    error.type === 'invalid_key' ||
    error.type === 'invalid_request'
  )
}

/**
 * Get appropriate HTTP status for Claude error
 */
export function getHttpStatusForError(error: ClaudeError): number {
  const statusMap: Record<ClaudeErrorType, number> = {
    timeout: 504,
    rate_limit: 429,
    invalid_key: 401,
    network: 503,
    invalid_request: 400,
    overloaded: 503,
    unknown: 500,
  }

  return statusMap[error.type]
}
