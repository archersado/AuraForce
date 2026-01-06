/**
 * Auth.js v5 Configuration with Prisma Adapter
 *
 * This file exports the Auth.js configuration for AuraForce authentication.
 * Integrates with Prisma for database-backed session management using
 * the User, Account, and Session models defined in prisma/schema.prisma.
 *
 * @see https://authjs.dev/
 * @see https://authjs.dev/reference/adapter/prisma
 */

import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

/**
 * AuthConfig for Auth.js v5
 *
 * Configuration options:
 * - adapter: Uses Prisma adapter for database-backed sessions
 * - session: Strategy is "database" for persistent sessions in MySQL
 * - pages: Custom sign-in page routes (can be configured later)
 * - callbacks: Session callback extends user.id into session.user.id
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    // Credentials provider for email/password authentication
    // Note: Password hashing and validation will be implemented in Epic 2
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO AURA: Implement actual authentication in Epic 2 (Story 2.2)
        // For now, this is a placeholder that accepts any credentials
        // In production, this should validate against Prisma User model
        if (!credentials?.email) {
          return null
        }

        // Placeholder implementation - will be replaced in Epic 2
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        // TODO AURA: Add bcryptjs password comparison in Epic 2
        // For foundation setup, return null to require production implementation
        return null
      },
    }),
  ],
  callbacks: {
    /**
     * Session callback extends user.id into session
     *
     * This is required to make the user.id available in client-side
     * session objects via useSession() hook.
     */
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
}

// Export NextAuth handlers for app router authentication
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

/**
 * Type definitions for Auth.js session and user
 *
 * These types provide TypeScript intellisense for session objects.
 * Compatible with Auth.js v5 beta 30+
 */
import type { Session, User } from 'next-auth'

export type AuthSession = Session | null
export type AuthUser = User
