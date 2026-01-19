/**
 * Prisma Client Singleton
 *
 * Provides a single Prisma client instance to avoid
 * multiple database connections during development.
 */

import { PrismaClient } from '@prisma/client';
import { database } from '@/lib/config';

/**
 * Global variable for Prisma client
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Get Prisma client instance
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: database.logQueries ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
