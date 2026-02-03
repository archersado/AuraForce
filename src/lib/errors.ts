/**
 * 错误处理类库
 *
 * 分层错误处理，统一错误响应格式
 */

/**
 * 应用基础错误类
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * 400 Bad Request - 验证错误
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
    this.name = 'ValidationError';
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
  }
}

/**
 * 409 Conflict - 资源冲突（如重复创建）
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
    this.name = 'ConflictError';
  }
}

/**
 * 429 Too Many Requests
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(429, 'TOO_MANY_REQUESTS', 'Too many requests, please try again later');
    this.name = 'RateLimitError';
    // 可以通过 retryAfter 字段传递重试时间
  }
}

/**
 * 处理 API 错误
 *
 * @param error - 错误对象
 * @returns NextResponse JSON 响应
 */
import { NextResponse } from 'next/server';

export function handleApiError(error: unknown): NextResponse {
  // 应用错误
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.errorCode,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  // Prisma 数据库错误
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };

    switch (prismaError.code) {
      case 'P2002':
        // 唯一约束冲突（如重复创建）
        return NextResponse.json(
          {
            error: 'CONFLICT',
            message: 'Resource already exists',
          },
          { status: 409 }
        );

      case 'P2025':
        // 记录未找到
        return NextResponse.json(
          {
            error: 'NOT_FOUND',
            message: 'Resource not found',
          },
          { status: 404 }
        );

      case 'P2003':
        // 外键约束失败
        return NextResponse.json(
          {
            error: 'FOREIGN_KEY_CONSTRAINT',
            message: 'Referenced resource not found',
          },
          { status: 400 }
        );

      default:
        return NextResponse.json(
          {
            error: 'DATABASE_ERROR',
            message: 'Database operation failed',
          },
          { status: 500 }
        );
    }
  }

  // 未知错误
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('[API] Unknown error:', error);

  return NextResponse.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && {
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
    { status: 500 }
  );
}

/**
 * 创建错误响应的辅助函数
 */
export function createErrorResponse(
  statusCode: number,
  errorCode: string,
  message: string,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: errorCode,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && {
        debug: details,
      }),
    },
    { status: statusCode }
  );
}
