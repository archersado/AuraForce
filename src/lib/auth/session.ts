import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { session } from '@/lib/config';

export interface SessionData {
  userId: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: Date | null;
  };
}

/**
 * Generate a cryptographically secure session token
 * Uses Web Crypto API for Edge Runtime compatibility
 */
export async function generateSessionToken(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new session for a user
 *
 * @param userId - The user's ID
 * @param rememberMe - If true, session expires in 30 days, otherwise 7 days
 * @returns The session token
 */
export async function createSession(
  userId: string,
  rememberMe = false
): Promise<string> {
  const token = await generateSessionToken();
  const expires = new Date();

  // Session expires in 7 days by default, or 30 days if remember me is checked
  const daysToExpire = rememberMe ? 30 : 7;
  expires.setDate(expires.getDate() + daysToExpire);

  // Create session in database
  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auraforce-session', token, {
    httpOnly: true,
    secure: session.secureCookie,
    sameSite: session.sameSite,
    path: '/',
    maxAge: daysToExpire * 24 * 60 * 60, // Convert days to seconds
  });

  return token;
}

/**
 * Get the current session from the request
 *
 * @returns The session data or null if not authenticated
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('auraforce-session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (session.expires < new Date()) {
      // Clean up expired session
      await prisma.session.delete({
        where: { id: session.id },
      });
      return null;
    }

    return {
      userId: session.userId,
      user: session.user,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Delete the current session (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('auraforce-session')?.value;

  if (sessionToken) {
    try {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    } catch (error) {
      console.error('Error deleting session:', error);
    }

    // Clear session cookie
    cookieStore.delete('auraforce-session');
  }
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

/**
 * Require authentication and redirect if not authenticated
 *
 * @param redirectTo - The URL to redirect to after login (default: /login)
 * @returns The session data or redirects
 */
export async function requireAuth(redirectTo?: string): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    // Build redirect URL with returnTo parameter
    const cookieStore = await cookies();
    const currentPath = cookieStore.get('pathname')?.value || '/';
    const loginUrl = new URL('/login');
    loginUrl.searchParams.set('redirect', redirectTo || currentPath);

    // Note: This will be handled by the middleware in actual implementation
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Get a session by token
 *
 * @param token - The session token
 * @returns The session or null
 */
export async function getSessionByToken(token: string) {
  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (session.expires < new Date()) {
      await prisma.session.delete({
        where: { id: session.id },
      });
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session by token:', error);
    return null;
  }
}

/**
 * Clean up expired sessions
 * This should be run periodically (e.g., via a cron job)
 */
export async function cleanExpiredSessions(): Promise<void> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    console.log(`Cleaned up ${result.count} expired sessions`);
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
  }
}
