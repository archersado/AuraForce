/**
 * Rate Limiting Utility
 *
 * In-memory rate limiting for API endpoints.
 * In production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  firstRequest: Date;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

// Default configuration: 3 requests per hour
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

// In-memory storage for rate limits
const rateLimits = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = new Date();
  for (const [key, entry] of rateLimits.entries()) {
    if (now.getTime() - entry.firstRequest.getTime() > DEFAULT_CONFIG.windowMs) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a request is allowed based on rate limits
 *
 * @param key - Unique identifier for the rate limit (e.g., IP address or email)
 * @param config - Rate limit configuration (optional)
 * @returns Rate limit result and retry after time in seconds
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { result: RateLimitResult; retryAfter?: number } {
  const now = new Date();
  const entry = rateLimits.get(key);

  // No entry exists, allow the request
  if (!entry) {
    rateLimits.set(key, {
      count: 1,
      firstRequest: now,
    });

    return {
      result: {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: new Date(now.getTime() + config.windowMs),
      },
    };
  }

  // Check if the window has expired
  const timeSinceFirstRequest = now.getTime() - entry.firstRequest.getTime();
  if (timeSinceFirstRequest > config.windowMs) {
    // Reset the counter
    rateLimits.set(key, {
      count: 1,
      firstRequest: now,
    });

    return {
      result: {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: new Date(now.getTime() + config.windowMs),
      },
    };
  }

  // Check if the limit has been exceeded
  if (entry.count >= config.maxRequests) {
    const resetTime = new Date(entry.firstRequest.getTime() + config.windowMs);
    const retryAfter = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);

    return {
      result: {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: resetTime,
      },
      retryAfter,
    };
  }

  // Increment the counter
  entry.count++;
  rateLimits.set(key, entry);

  return {
    result: {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      reset: new Date(entry.firstRequest.getTime() + config.windowMs),
    },
  };
}

/**
 * Reset the rate limit for a specific key
 *
 * @param key - Unique identifier for the rate limit
 */
export function resetRateLimit(key: string): void {
  rateLimits.delete(key);
}

/**
 * Get the current rate limit status for a key
 *
 * @param key - Unique identifier for the rate limit
 * @returns Rate limit status or null if not found
 */
export function getRateLimitStatus(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult | null {
  const entry = rateLimits.get(key);

  if (!entry) {
    return null;
  }

  const now = new Date();
  const timeSinceFirstRequest = now.getTime() - entry.firstRequest.getTime();

  // Check if the window has expired
  if (timeSinceFirstRequest > config.windowMs) {
    rateLimits.delete(key);
    return null;
  }

  const resetTime = new Date(entry.firstRequest.getTime() + config.windowMs);

  return {
    allowed: entry.count < config.maxRequests,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: resetTime,
  };
}

/**
 * Rate limit configuration for password reset
 */
export const PASSWORD_RESET_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Rate limit configuration for email verification
 */
export const EMAIL_VERIFICATION_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Rate limit configuration for login attempts
 */
export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
};
