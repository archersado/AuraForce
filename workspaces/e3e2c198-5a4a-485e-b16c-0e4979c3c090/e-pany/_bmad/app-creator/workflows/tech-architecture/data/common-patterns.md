# Common Architecture Patterns

Reference implementations for common architecture scenarios.

## Authentication Pattern

### JWT-Based Authentication

```typescript
// Token Generation
function generateToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// Token Verification
function verifyToken(token: string): { uid: string, email: string, role: string } {
  return jwt.verify(token, JWT_SECRET);
}

// Refresh Token
function generateRefreshToken(user: User): string {
  const payload = { sub: user.id };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}
```

## Repository Pattern

### Base Repository Interface

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementation
class UserRepository implements IRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return db.users.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return db.users.findUnique({ where: { id } });
  }

  async create(data: CreateUserDto): Promise<User> {
    return db.users.create({ data });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return db.users.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await db.users.delete({ where: { id } });
  }
}
```

## Error Handling Pattern

### Global Error Handler

```typescript
// Error types
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Error middleware
function errorHandler(err: Error, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Unknown errors
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}

// Usage
throw new AppError(404, 'NOT_FOUND', 'User not found');
```

## Validation Pattern

### Request Validation

```typescript
// Validation schema
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

// Middleware
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors
        }
      });
    }
  };
}

// Usage
router.post('/users', validate(createUserSchema), handler);
```

## Caching Pattern

### Redis Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis();

// Get with cache
async function getCachedUser(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Not in cache, fetch from DB
  const user = await db.users.findUnique({ where: { id } });

  // Cache the result
  if (user) {
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
  }

  return user;
}

// Invalidate cache
async function invalidateUserCache(id: string): Promise<void> {
  await redis.del(`user:${id}`);
}
```

## Rate Limiting Pattern

### Token Bucket Rate Limiter

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests'
      }
    });
  }
});

// Apply to all routes
app.use('/api', limiter);
```

## Logging Pattern

### Structured Logging

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV === 'development'
});

// Usage with context
function logWithContext(context: object) {
  return {
    info: (message: string, data?: object) => {
      logger.info({ ...context, data }, message);
    },
    error: (message: string, error: Error) => {
      logger.error({ ...context, error }, message);
    }
  };
}

// In middleware
app.use((req, res, next) => {
  const log = logWithContext({
    requestId: req.id,
    userId: req.user?.id,
    path: req.path
  });

  log.info('Request received');
  next();
});
```

## API Response Pattern

### Standardized Response Wrapper

```typescript
type ApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
};

function success<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta: { timestamp: new Date().toISOString() }
  };
}

function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    }
  };
}

function error(code: string, message: string, details?: any): ApiError {
  return {
    success: false,
    error: { code, message, details },
    meta: { timestamp: new Date().toISOString() }
  };
}
```
