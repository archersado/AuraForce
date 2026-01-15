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
import { hash } from 'bcryptjs'

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
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          return null
        }

        // Check if user has a password
        if (!user.password) {
          return null
        }

        // Verify password using bcryptjs
        const { compare } = await import('bcryptjs')
        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Return user object (without password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
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
