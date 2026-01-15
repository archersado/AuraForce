/**
 * Test utilities and factories for AuraForce testing
 * Note: This file requires Jest environment to be available
 *
 * @jest-environment node
 */

import type { PrismaClient } from '@prisma/client';

// @ts-ignore - Jest types are only available in test environment
 declare const jest: any;

// Mock types for jest functions - use any to avoid TypeScript errors when jest is not available
type MockFunction<T extends (...args: unknown[]) => unknown> = any & {
  mockReturnValue: any;
  mockImplementation: any;
};

// Use Function type for jest.fn type
const createMockFn: any = (typeof jest !== 'undefined' ? jest.fn : undefined) as any || (() => () => undefined);

/**
 * User factory for creating test users
 */
export function createTestUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Session factory for creating test sessions
 */
export function createTestSession(overrides = {}) {
  return {
    id: 'test-session-id',
    title: 'Test Session',
    status: 'active' as const,
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Message factory for creating test messages
 */
export function createTestMessage(overrides = {}) {
  return {
    id: crypto.randomUUID() || 'test-message-id',
    sessionId: 'test-session-id',
    role: 'user' as const,
    content: 'Test message content',
    timestamp: new Date(),
    ...overrides,
  };
}

/**
 * Mock Prisma client helper
 * This creates a mock Prisma client with basic CRUD operations
 */
export function createMockPrismaClient() {
  const mockFn = createMockFn;

  const mockClient = {
    user: {
      create: mockFn(),
      findUnique: mockFn(),
      findMany: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    session: {
      create: mockFn(),
      findUnique: mockFn(),
      findMany: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    message: {
      create: mockFn(),
      findMany: mockFn(),
      delete: mockFn(),
    },
    $disconnect: mockFn(),
    $transaction: mockFn(),
  };

  return mockClient as unknown as PrismaClient;
}

/**
 * Mock API response helper
 */
export function createMockApiResponse<T>(data: T, success = true) {
  return {
    success,
    data,
    error: success ? undefined : { type: 'ERROR', message: 'Error occurred' },
  };
}

/**
 * Mock API error response helper
 */
export function createMockApiError(
  type: string,
  message: string,
  details?: Record<string, unknown>
) {
  return {
    success: false,
    data: null,
    error: {
      type,
      message,
      ...(details && { details }),
    },
  };
}

/**
 * Sleep helper for async tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for condition helper
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return;
    }
    await sleep(interval);
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Mock WebSocket helper
 */
export function createMockWebSocket() {
  const mockFn = createMockFn;
  const listeners = new Map<string, Set<Function>>();

  return {
    addEventListener: mockFn((event: string, callback: Function) => {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(callback);
    }),
    removeEventListener: mockFn((event: string, callback: Function) => {
      listeners.get(event)?.delete(callback);
    }),
    send: mockFn(),
    close: mockFn(),
    // Helper for testing: simulate receiving a message
    simulateMessage: (data: unknown) => {
      listeners.get('message')?.forEach((callback) => callback({ data }));
    },
    // Helper for testing: simulate connection close
    simulateClose: () => {
      listeners.get('close')?.forEach((callback) => callback({ code: 1000, reason: '' }));
    },
    // Helper for testing: simulate error
    simulateError: (error: unknown) => {
      listeners.get('error')?.forEach((callback) => callback({ error }));
    },
  };
}

/**
 * Mock fetch helper that returns a JSON response
 */
export function mockFetch(data: unknown, status = 200, ok = true) {
  return createMockFn().mockResolvedValue({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  });
}

/**
 * Helper to create mock session for NextAuth
 */
export function createMockAuthSession(overrides: Record<string, unknown> = {}) {
  const userOver = (overrides.user as Record<string, unknown>) || {};
  return {
    user: {
      id: userOver.userId as string || 'test-user-id',
      email: userOver.email as string || 'test@example.com',
      name: userOver.name as string || 'Test User',
      emailVerified: userOver.emailVerified as Date | null || null,
      ...userOver,
    },
    userId: (overrides.userId as string) || 'test-user-id',
    ...overrides,
  };
}
