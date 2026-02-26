/**
 * Backend Middleware for API Routes
 *
 * Includes: Rate limiting, CORS, authentication, error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';

/**
 * Error Response Helper
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Rate Limiter (Memory-based for development)
 * In production, use Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Rate Limit Middleware
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  options?: { limit?: number; windowMs?: number }
): Promise<NextResponse | null> {
  const { limit = 60, windowMs = 60 * 1000 } = options || {};

  // Get identifier from user session or IP
  const session = await getSession();
  const identifier = session?.user?.id || request.ip || 'anonymous';

  const { allowed, remaining, resetAt } = checkRateLimit(identifier, limit, windowMs);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        resetAt: new Date(resetAt).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAt.toString(),
          'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // Continue to next handler
}

/**
 * Authentication Middleware
 */
export async function authMiddleware(
  request: NextRequest
): Promise<{ session: any; error: NextResponse | null }> {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        session: null,
        error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    return { session, error: null };
  } catch (error) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Authentication failed' }, { status: 401 }),
    };
  }
}

/**
 * Validation Helper
 */
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function validateBody(
  body: unknown,
  schema: ValidationSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = (body as any)?.[field];

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further validation if field is not required and not provided
    if (!rule.required && (value === undefined || value === null)) {
      continue;
    }

    // Type check
    if (rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
        continue;
      }
    }

    // Min length
    if (rule.min !== undefined) {
      if (typeof value === 'string' && value.length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters`);
      } else if (typeof value === 'number' && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      } else if (Array.isArray(value) && value.length < rule.min) {
        errors.push(`${field} must have at least ${rule.min} items`);
      }
    }

    // Max length
    if (rule.max !== undefined) {
      if (typeof value === 'string' && value.length > rule.max) {
        errors.push(`${field} must be at most ${rule.max} characters`);
      } else if (typeof value === 'number' && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      } else if (Array.isArray(value) && value.length > rule.max) {
        errors.push(`${field} can have at most ${rule.max} items`);
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push(`${field} has invalid format`);
      }
    }

    // Enum validation
    if (rule.enum && rule.enum.length > 0) {
      if (!rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
      }
    }
  }

  return errors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors };
}

/**
 * Common validation schemas
 */
export const VALIDATION_SCHEMAS = {
  // Workspace operations
  createFile: {
    path: { required: true, type: 'string' as const, min: 1, max: 500 },
    type: { required: true, type: 'string' as const, enum: ['file', 'folder'] },
    content: { required: false, type: 'string' as const },
  },

  updateFile: {
    path: { required: true, type: 'string' as const, min: 1, max: 500 },
    content: { required: true, type: 'string' as const },
  },

  // Experience operations
  startExperience: {
    caseId: { required: true, type: 'string' as const },
    profile: { required: false, type: 'object' as const },
    industry: { required: false, type: 'string' as const },
  },

  askAI: {
    sessionId: { required: true, type: 'string' as const },
    question: { required: true, type: 'string' as const, min: 1, max: 1000 },
    context: { required: false, type: 'object' as const },
  },

  completeExperience: {
    sessionId: { required: true, type: 'string' as const },
    duration: { required: false, type: 'number' as const },
    score: { required: false, type: 'number' as const, min: 0, max: 100 },
    decisions: { required: false, type: 'array' as const },
  },
};

/**
 * Wrap API handler with common middleware
 */
export function withMiddleware(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options?: {
    requireAuth?: boolean;
    rateLimit?: { limit?: number; windowMs?: number };
    validate?: ValidationSchema;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (options?.rateLimit) {
        const rateLimitResponse = await rateLimitMiddleware(request, options.rateLimit);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      // Authentication
      let session = null;
      if (options?.requireAuth) {
        const authResult = await authMiddleware(request);
        if (authResult.error) {
          return authResult.error;
        }
        session = authResult.session;
      }

      // Request body validation
      let body = null;
      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          body = await request.json();
        } catch (e) {
          return createErrorResponse('Invalid JSON body', 400);
        }

        if (options?.validate) {
          const validation = validateBody(body, options.validate);
          if (!validation.valid) {
            return createErrorResponse(
              'Validation failed',
              400,
              validation.errors.join('; ')
            );
          }
        }
      }

      // Call the actual handler
      return await handler(request, { session, body });
    } catch (error) {
      console.error('[API Middleware] Error:', error);
      return createErrorResponse(
        'Internal server error',
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  };
}

/**
 * CORS Headers
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders });
  }
  return null;
}
