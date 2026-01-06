/**
 * Claude Session Manager
 *
 * Manages Claude conversation sessions including creation,
 * storage, retrieval, and cleanup of session data.
 */

import type { ClaudeMessage, ClaudeSession, SessionFilter } from '@/types/claude'

/**
 * Session storage (in-memory for now, can be extended to database)
 */
interface SessionStorage {
  [sessionId: string]: ClaudeSession
}

/**
 * Session TTL in milliseconds (24 hours)
 */
const SESSION_TTL = 24 * 60 * 60 * 1000

/**
 * Global session storage
 */
let sessionStorage: SessionStorage = {}

/**
 * Get current Unix timestamp in milliseconds
 */
function getCurrentTimestamp(): number {
  return Date.now()
}

/**
 * Check if a session has expired
 */
function isSessionExpired(session: ClaudeSession): boolean {
  const now = getCurrentTimestamp()
  const sessionAge = now - session.lastActivityAt
  return sessionAge > SESSION_TTL
}

/**
 * Create a new session
 */
export function createSession(
  userId: string,
  options: {
    title?: string
    systemPrompt?: string
    metadata?: Record<string, unknown>
  } = {}
): ClaudeSession {
  const session: ClaudeSession = {
    id: crypto.randomUUID(),
    userId,
    title: options.title,
    messages: options.systemPrompt
      ? [{ role: 'system', content: options.systemPrompt, timestamp: getCurrentTimestamp() }]
      : [],
    createdAt: getCurrentTimestamp(),
    lastActivityAt: getCurrentTimestamp(),
    metadata: options.metadata,
  }

  sessionStorage[session.id] = session

  return session
}

/**
 * Get a session by ID
 */
export function getSession(sessionId: string): ClaudeSession | null {
  const session = sessionStorage[sessionId]

  if (!session) {
    return null
  }

  if (isSessionExpired(session)) {
    deleteSession(sessionId)
    return null
  }

  return session
}

/**
 * Update session activity
 */
export function updateSessionActivity(sessionId: string): boolean {
  const session = getSession(sessionId)

  if (!session) {
    return false
  }

  session.lastActivityAt = getCurrentTimestamp()
  sessionStorage[sessionId] = session

  return true
}

/**
 * Add a message to a session
 */
export function addSessionMessage(
  sessionId: string,
  message: ClaudeMessage
): boolean {
  const session = getSession(sessionId)

  if (!session) {
    return false
  }

  session.messages.push({
    ...message,
    timestamp: message.timestamp || getCurrentTimestamp(),
  })

  session.lastActivityAt = getCurrentTimestamp()
  sessionStorage[sessionId] = session

  return true
}

/**
 * Add multiple messages to a session
 */
export function addSessionMessages(
  sessionId: string,
  messages: ClaudeMessage[]
): boolean {
  const session = getSession(sessionId)

  if (!session) {
    return false
  }

  const timestampedMessages = messages.map((msg) => ({
    ...msg,
    timestamp: msg.timestamp || getCurrentTimestamp(),
  }))

  session.messages.push(...timestampedMessages)
  session.lastActivityAt = getCurrentTimestamp()
  sessionStorage[sessionId] = session

  return true
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): boolean {
  const session = sessionStorage[sessionId]

  if (!session) {
    return false
  }

  delete sessionStorage[sessionId]
  return true
}

/**
 * Get all sessions for a user
 */
export function getUserSessions(userId: string, filters: SessionFilter = {}): ClaudeSession[] {
  const sessions = Object.values(sessionStorage)
    .filter(
      (session) =>
        session.userId === userId &&
        (filters.minLastActivityAt === undefined ||
          session.lastActivityAt >= filters.minLastActivityAt) &&
        !isSessionExpired(session)
    )
    .sort((a, b) => b.lastActivityAt - a.lastActivityAt)

  if (filters.limit) {
    return sessions.slice(0, filters.limit)
  }

  return sessions
}

/**
 * Get session count for a user
 */
export function getUserSessionCount(userId: string): number {
  return getUserSessions(userId).length
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): number {
  let cleanedCount = 0

  Object.keys(sessionStorage).forEach((sessionId) => {
    const session = sessionStorage[sessionId]

    if (session && isSessionExpired(session)) {
      delete sessionStorage[sessionId]
      cleanedCount++
    }
  })

  return cleanedCount
}

/**
 * Clear all sessions (useful for testing or logout)
 */
export function clearAllSessions(): number {
  const count = Object.keys(sessionStorage).length
  sessionStorage = {}
  return count
}

/**
 * Get session statistics
 */
export function getSessionStats(): {
  totalSessions: number
  activeSessions: number
  expiredSessions: number
} {
  const allSessions = Object.values(sessionStorage)
  const active = allSessions.filter((s) => !isSessionExpired(s))
  const expired = allSessions.filter((s) => isSessionExpired(s))

  // Clean up expired sessions
  expired.forEach((session) => {
    delete sessionStorage[session.id]
  })

  return {
    totalSessions: allSessions.length,
    activeSessions: active.length,
    expiredSessions: expired.length,
  }
}

/**
 * Initialize periodic cleanup (call on app startup)
 */
let cleanupInterval: NodeJS.Timeout | null = null

export function startSessionCleanup(intervalMs: number = 60 * 60 * 1000): void {
  // Cleanup every hour by default
  cleanupInterval = setInterval(() => {
    cleanupExpiredSessions()
  }, intervalMs)
}

export function stopSessionCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}

/**
 * Export session storage for testing/persistence
 */
export function exportSessionStorage(): SessionStorage {
  return { ...sessionStorage }
}

/**
 * Import session storage (for testing)
 */
export function importSessionStorage(storage: SessionStorage): void {
  sessionStorage = { ...storage }
}
