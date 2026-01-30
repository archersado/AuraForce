/**
 * Environment Configuration Module
 *
 * Centralized environment variable configuration with type safety and validation.
 * All environment variables should be accessed through this module to ensure
 * consistent error handling and validation.
 *
 * Usage:
 *   import { env } from '@/lib/config/env'
 *   const dbUrl = env.DATABASE_URL
 */

import { z } from 'zod'

/**
 * Environment Variables Schema
 *
 * Defines all required and optional environment variables with Zod validation.
 * Add new environment variables here to ensure they are validated at startup.
 */
const envSchema = z.object({
  // ============================================
  // Node Environment
  // ============================================
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),

  // ============================================
  // Database Configuration
  // ============================================
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid MySQL connection string')
    .describe('MySQL connection string'),

  // ============================================
  // Auth.js v5 Configuration
  // ============================================
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET must be at least 32 characters')
    .describe('Secret key for session encryption'),

  AUTH_URL: z
    .string()
    .url('AUTH_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000')
    .describe('Base URL of the application'),

  // ============================================
  // Email/SMTP Configuration
  // ============================================
  SMTP_HOST: z
    .string()
    .min(1, 'SMTP_HOST is required')
    .describe('SMTP server host'),

  SMTP_PORT: z
    .string()
    .default('587')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .describe('SMTP server port'),

  SMTP_USER: z
    .string()
    .min(1, 'SMTP_USER is required')
    .describe('SMTP username'),

  SMTP_PASS: z
    .string()
    .min(1, 'SMTP_PASS is required')
    .describe('SMTP password'),

  SMTP_FROM: z
    .string()
    .email('SMTP_FROM must be a valid email address')
    .default('noreply@auraforce.com')
    .describe('From email address'),

  // ============================================
  // Claude API Configuration
  // ============================================
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required')
    .describe('Claude API key'),

  // Optional legacy API key alias
  ANTHROPIC_AUTH_TOKEN: z
    .string()
    .optional()
    .describe('Legacy Anthropic API token (alias for ANTHROPIC_API_KEY)'),

  // Optional: Custom API base URL (for proxy or alternative endpoints)
  ANTHROPIC_BASE_URL: z
    .string()
    .url('ANTHROPIC_BASE_URL must be a valid URL')
    .optional()
    .describe('Custom Anthropic API base URL'),

  // Optional: Default model to use
  ANTHROPIC_MODEL: z
    .string()
    .optional()
    .default('claude-sonnet-4-20250514')
    .describe('Default Claude model to use'),

  // ============================================
  // Public Client Configuration
  // ============================================
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000')
    .describe('Application public URL'),

  NEXT_PUBLIC_PLATFORM_WORKSPACE_ROOT: z
    .string()
    .optional()
    .describe('Platform workspace root directory'),

  // ============================================
  // Optional OAuth Provider Configuration
  // ============================================
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
})

/**
 * Environment Variables Type
 *
 * Inferred type from the schema above.
 */
type EnvVars = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 *
 * This function is called at application startup to ensure all
 * required environment variables are present and valid.
 */
function parseEnv(): EnvVars {
  try {
    console.info('[Config] Validating environment variables...')

    const parsed = envSchema.parse(process.env)

    console.info('[Config] Environment variables validated successfully')

    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Config] Invalid environment variables:')
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    } else {
      console.error('[Config] Error parsing environment variables:', error)
    }

    // In development, show helpful message
    if (process.env.NODE_ENV === 'development') {
      console.error(`
[Config] Development environment error detected.
Please create a .env.local file with the required variables:

  cp .env.example .env.local
  # Edit .env.local with your values
`)
    }

    // Only throw in production - in dev we want to see what's missing
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration')
    } else {
      // Return a partial env for development with warnings
      console.warn('[Config] Continuing in development mode with partial configuration')
      return process.env as unknown as EnvVars
    }
  }
}

/**
 * Export validated environment variables
 *
 * All environment variables should be accessed through this object.
 * The validation happens once at module load time.
 */
export const env = parseEnv()

/**
 * Re-export the TypeScript type for use in other modules
 */
export type { EnvVars }

/**
 * Helper function to get environment-specific value
 *
 * Returns different values based on NODE_ENV
 */
export function getEnvValue<T>(values: {
  development: T
  staging: T
  production: T
}): T {
  return values[env.NODE_ENV as keyof typeof values] || values.development
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

/**
 * Check if running in staging mode
 */
export function isStaging(): boolean {
  return env.NODE_ENV === 'staging'
}
