/**
 * Session Helper Functions for JWT Auth
 *
 * Provides server-side session management helpers
 * using the custom JWT-based authentication system.
 */

import { redirect } from 'next/navigation'
import { getSession } from './custom-session'
import { prisma } from './prisma'

export interface AppSession {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    emailVerified: Date | null | string | null
  }
  expires: string
}

export type AuthUser = {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: Date | null
}

/**
 * Returns current session data using custom JWT authentication
 */
export async function getServerSession(): Promise<AppSession | null> {
  const session = await getSession()
  if (!session) return null

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || null,
      emailVerified: session.user.emailVerified,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

/**
 * Get the current authenticated user from database
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return user
}

/**
 * Require authentication and redirect if not authenticated
 */
export async function requireAuth(): Promise<AppSession> {
  const session = await getServerSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

// Re-export types for convenience
export type { Session } from './custom-session'
