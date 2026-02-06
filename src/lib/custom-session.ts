/**
 * Custom Session Management
 *
 * Handles JWT-based session authentication without NextAuth.js
 * to avoid basePath issues.
 */

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

// JWT secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-secret-key-do-not-use-in-production'
);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
}

export interface Session {
  user: SessionUser;
}

/**
 * Create a JWT token for the session
 */
async function createSessionToken(user: {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d') // Session expires in 30 days
    .setIssuedAt()
    .sign(JWT_SECRET);

  return token;
}

/**
 * Create a session by setting JWT cookie
 */
export async function createSession(user: {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}): Promise<void> {
  const token = await createSessionToken(user);
  const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';

  const cookieStore = await cookies();
  cookieStore.set('auraforce-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: basePath,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<Session | null> {
  const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('auraforce-session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<SessionUser>(sessionToken, JWT_SECRET);

    // Get full user info from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      },
    };
  } catch (error: any) {
    // JWT validation failures are expected for old/invalid cookies
    // Only log unexpected errors
    if (error.code !== 'ERR_JWS_INVALID' && error.code !== 'ERR_JWT_EXPIRED' && error.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      console.error('[Session] Failed to verify token:', error);
    }
    // Delete invalid cookie to prevent repeated failures
    const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
    const cookieStore = await cookies();
    cookieStore.delete('auraforce-session');
    return null;
  }
}

/**
 * Require authentication - returns session or null
 *
 * Unlike throw-based requireAuth, this returns null if not authenticated,
 * allowing API routes to handle unauthorized responses explicitly.
 */
export async function requireAuth(): Promise<Session | null> {
  const session = await getSession();
  return session;
}

/**
 * Require authentication or throw error
 *
 * Throws if not authenticated. Use in server components or contexts
 * where you want automatic redirect.
 */
export async function requireAuthOrThrow(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Delete current session (logout)
 */
export async function deleteSession(): Promise<void> {
  const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
  const cookieStore = await cookies();
  // Clear the session cookie with explicit expiration and path
  cookieStore.set('auraforce-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: basePath,
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Authenticate a user with email and password
 *
 * @param email - The user's email
 * @param password - The user's password
 * @returns The user if authenticated, null otherwise
 */
export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return null;
    }

    // Use bcrypt to verify password
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
