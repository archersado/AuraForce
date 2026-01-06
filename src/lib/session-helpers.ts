/**
 * Session Helper Functions for Auth.js v5
 *
 * Provides server-side and client-side session management helpers
 * for Next.js App Router and Client Components.
 *
 * @see https://authjs.dev/getting-started/typescript#module-augmentation
 */

import { redirect } from 'next/navigation'
import { auth, type AuthSession, type AuthUser } from './auth'
import { prisma } from './prisma'

/**
 * Extended session interface that includes user.id
 *
 * Note: This extends NextAuth's Session type with additional properties.
 * After running `npx prisma generate`, this interface will be augmented.
 */
export interface AppSession {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  expires: string
}

/**
 * Get the current session in a Server Component
 *
 * This should be used in Server Components to check authentication status.
 * Returns the full session object or null if not authenticated.
 *
 * @example
 * ```typescript
 * const session = await getServerSession()
 * if (!session) {
 *   redirect('/auth/signin')
 * }
 * ```
 */
export async function getServerSession(): Promise<AuthSession | null> {
  return await auth()
}

/**
 * Get the current authenticated user from database
 *
 * Fetches the full user record from Prisma using the session email.
 * Returns null if not authenticated or user not found.
 *
 * @example
 * ```typescript
 * const user = await getCurrentUser()
 * if (!user) {
 *   redirect('/auth/signin')
 * }
 * console.log('User:', user.name, user.email)
 * ```
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  return user
}

/**
 * Require authentication in a Server Component
 *
 * Helper that redirects to sign-in page if user is not authenticated.
 * Use this in Server Components that require authentication.
 *
 * @example
 * ```typescript
 * const session = await requireAuth()
 * // session is guaranteed to be non-null
 * console.log('Welcome:', session.user.name)
 * ```
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getServerSession()
  if (!session) {
    redirect('/auth/signin')
  }
  return session
}

/**
 * Check if current session has a specific role (future use)
 *
 * This is prepared for future role-based access control.
 * Will be implemented when user roles are added in Epic 2.
 *
 * @param session - The session object
 * @param role - The role to check for
 * @returns true if user has the role, false otherwise
 */
export function hasRole(session: AuthSession | null, role: string): boolean {
  // TODO AURA: Implement role checking in Epic 2 when user roles are added
  return false
}

// Re-export types for convenience
export type { AuthSession, AuthUser }
