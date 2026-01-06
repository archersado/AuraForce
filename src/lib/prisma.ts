/**
 * Prisma Client Singleton
 *
 * This file exports a singleton Prisma client instance to prevent
 * multiple connections during hot-reload in Next.js development.
 *
 * @see https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma client singleton instance
 *
 * Uses the 'prisma' property on globalThis to preserve the client
 * across hot-reloads during Next.js development.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Only set global.prisma in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Disconnect Prisma client (for testing purposes)
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
