/**
 * Environment-specific configuration values
 *
 * This file provides environment-specific defaults and helpers.
 * Import from this file instead of directly accessing env values
 * to provide a consistent configuration interface.
 */

import { env, getEnvValue, isDevelopment, isProduction, isStaging } from './env'

/**
 * Application URLs
 */
export const app = {
  url: env.NEXT_PUBLIC_APP_URL,
  baseUrl: env.AUTH_URL,
}

/**
 * Database configuration
 */
export const database = {
  url: env.DATABASE_URL,
  // Enable query logging in development
  logQueries: isDevelopment(),
}

/**
 * Session configuration
 */
export const session = {
  secret: env.AUTH_SECRET,
  cookieName: 'auraforce-session',
  secureCookie: isProduction(),
  sameSite: 'lax' as const,
  // Session expiry durations (in days)
  expiryDays: {
    default: 7,
    rememberMe: 30,
  },
}

/**
 * Email/SMTP configuration
 */
export const email = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASS,
    from: env.SMTP_FROM,
  },
  // Email templates use this URL for links
  appUrl: env.NEXT_PUBLIC_APP_URL,
}

/**
 * Claude API configuration
 */
export const claude = {
  apiKey: env.ANTHROPIC_API_KEY,
  // Legacy alias for backward compatibility
  authToken: env.ANTHROPIC_AUTH_TOKEN || env.ANTHROPIC_API_KEY,
  // Optional custom base URL
  baseUrl: env.ANTHROPIC_BASE_URL,
  // Default model
  defaultModel: env.ANTHROPIC_MODEL,
}

/**
 * OAuth providers configuration
 */
export const oauth = {
  github: {
    clientId: env.AUTH_GITHUB_ID,
    clientSecret: env.AUTH_GITHUB_SECRET,
    enabled: !!env.AUTH_GITHUB_ID && !!env.AUTH_GITHUB_SECRET,
  },
  google: {
    clientId: env.AUTH_GOOGLE_ID,
    clientSecret: env.AUTH_GOOGLE_SECRET,
    enabled: !!env.AUTH_GOOGLE_ID && !!env.AUTH_GOOGLE_SECRET,
  },
}

/**
 * Platform/workspace configuration
 */
export const workspace = {
  root: env.NEXT_PUBLIC_PLATFORM_WORKSPACE_ROOT,
}

/**
 * Feature flags
 */
export const features = {
  // Enable detailed logging in development
  debug: isDevelopment(),

  // OAuth feature (disabled by default, enabled when configured)
  oauth: oauth.github.enabled || oauth.google.enabled,

  // Rate limiting (always enabled but more strict in production)
  rateLimiting: true,

  // Email verification
  emailVerification: true,
}

/**
 * Get configuration by environment
 */
export function getEnvConfig<T>(values: {
  development: T
  staging: T
  production: T
}): T {
  return getEnvValue(values)
}

/**
 * Re-export environment helpers
 */
export { env, isDevelopment, isProduction, isStaging }

/**
 * Get the current environment name
 */
export function getEnvironmentName(): string {
  return env.NODE_ENV
}
