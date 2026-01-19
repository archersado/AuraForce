# Authentication Code Snippets

Complete authentication implementation patterns.

## JWT Token Generation

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface TokenPayload {
  sub: string;      // user id
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(sub: string): string {
  return jwt.sign({ sub }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
}
```

## Password Hashing

```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

## Authentication Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No token provided',
      },
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
    }

    next();
  };
}
```

## Auth Controller

```typescript
// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { userRepository } from '../repositories/UserRepository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          },
        });
        return;
      }

      // Create user
      const user = await userRepository.create({
        email,
        password: await hashPassword(password),
        firstName,
        lastName,
      });

      // Generate tokens
      const accessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken(user.id);

      // Return response (without password)
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Registration failed',
        },
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken(user.id);

      // Return response
      const { password: _, ...userResponse } = user;

      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Login failed',
        },
      });
    }
  }

  async getMe(req: any, res: Response): Promise<void> {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      const { password: _, ...userResponse } = user;
      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user',
        },
      });
    }
  }
}

export const authController = new AuthController();
```

## Auth Routes

```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', requireAuth, authController.getMe);

export default router;
```
