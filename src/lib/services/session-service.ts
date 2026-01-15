/**
 * Session Service - Business Logic for Session Persistence
 *
 * Handles all session-related database operations for Claude conversations.
 * Provides methods for creating, reading, updating, and deleting sessions.
 */

import { prisma } from '@/lib/db/client';
import type { ClaudeConversation } from '@prisma/client';
import type {
  SessionDTO,
  SessionDetailDTO,
  CreateSessionRequest,
  UpdateSessionRequest,
  StoredMessage,
  SessionStatus,
  SessionMetadata,
} from '@/types/session';

/**
 * Session Service Class
 * Encapsulates all session-related business logic and database operations
 */
export class SessionService {
  /**
   * Convert Prisma ClaudeConversation to SessionDTO
   */
  private toSessionDTO(conversation: ClaudeConversation): SessionDTO {
    const messages = conversation.messages as StoredMessage[] | null;

    // Get last user message preview (Story 3.6)
    let lastMessagePreview: string | undefined;
    if (messages && messages.length > 0) {
      // Find last user message (not assistant or system)
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        // Truncate to 100 characters
        lastMessagePreview = lastUserMessage.content.length > 100
          ? lastUserMessage.content.substring(0, 100) + '...'
          : lastUserMessage.content;
      }
    }

    return {
      id: conversation.id,
      title: conversation.title || 'Untitled',
      sessionId: conversation.sessionId,
      userId: conversation.userId,
      skillId: conversation.skillId,
      status: conversation.status as SessionStatus,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messageCount: messages ? messages.length : 0,
      lastMessagePreview,
    };
  }

  /**
   * Convert Prisma ClaudeConversation to SessionDetailDTO
   */
  private toSessionDetailDTO(conversation: ClaudeConversation): SessionDetailDTO {
    return {
      ...this.toSessionDTO(conversation),
      messages: (conversation.messages as StoredMessage[] | null) || [],
      metadata: (conversation.metadata as SessionMetadata) || undefined,
    };
  }

  /**
   * Create a new session
   * @param userId - User ID from Auth.js session
   * @param data - Session creation options
   * @returns Newly created session DTO
   */
  async createSession(userId: string, data: CreateSessionRequest): Promise<SessionDTO> {
    const session = await prisma.claudeConversation.create({
      data: {
        userId,
        title: data.title || 'New Conversation',
        skillId: data.skillId,
        projectId: data.projectId, // Project ID for session isolation
        messages: (data.messages || []) as any,
        status: 'active',
      },
    });

    return this.toSessionDTO(session);
  }

  /**
   * Get a specific session by ID
   * @param sessionId - Session ID to fetch
   * @param userId - User ID for authorization check
   * @returns Session detail with messages, or null if not found/unauthorized
   */
  async getSessionById(
    sessionId: string,
    userId: string
  ): Promise<SessionDetailDTO | null> {
    const session = await prisma.claudeConversation.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      return null;
    }

    return this.toSessionDetailDTO(session);
  }

  /**
   * List all sessions for a user
   * @param userId - User ID
   * @param options - Pagination and filtering options
   * @returns List of sessions with total count
   */
  async listSessions(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      projectId?: string;
    } = {}
  ): Promise<{ sessions: SessionDTO[]; total: number }> {
    const { limit = 50, offset = 0, status, projectId } = options;

    const where: Record<string, unknown> = { userId };

    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    const [sessions, total] = await Promise.all([
      prisma.claudeConversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.claudeConversation.count({ where }),
    ]);

    return {
      sessions: sessions.map((session) => this.toSessionDTO(session)),
      total,
    };
  }

  /**
   * Update a session
   * @param sessionId - Session ID to update
   * @param userId - User ID for authorization check
   * @param data - Update data
   * @returns Updated session DTO, or null if not found/unauthorized
   */
  async updateSession(
    sessionId: string,
    userId: string,
    data: UpdateSessionRequest
  ): Promise<SessionDTO | null> {
    // First verify ownership
    const existing = await prisma.claudeConversation.findUnique({
      where: { id: sessionId },
    });

    if (!existing || existing.userId !== userId) {
      return null;
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.sessionId !== undefined) {
      updateData.sessionId = data.sessionId;
    }
    if (data.messages !== undefined) {
      updateData.messages = data.messages as any; // Prisma JsonValue type
    }
    if (data.metadata !== undefined) {
      // Merge metadata with existing metadata
      const existingMetadata = (existing.metadata as SessionMetadata) || {};
      updateData.metadata = { ...existingMetadata, ...data.metadata };
    }

    const updated = await prisma.claudeConversation.update({
      where: { id: sessionId },
      data: updateData,
    });

    return this.toSessionDTO(updated);
  }

  /**
   * Update messages in a session
   * @param sessionId - Session ID
   * @param userId - User ID for authorization check
   * @param messages - Messages array
   * @returns Updated session DTO, or null if not found/unauthorized
   */
  async updateSessionMessages(
    sessionId: string,
    userId: string,
    messages: StoredMessage[]
  ): Promise<SessionDTO | null> {
    return this.updateSession(sessionId, userId, { messages });
  }

  /**
   * Update session status
   * @param sessionId - Session ID
   * @param userId - User ID for authorization check
   * @param status - New status
   * @returns Updated session DTO, or null if not found/unauthorized
   */
  async updateSessionStatus(
    sessionId: string,
    userId: string,
    status: 'active' | 'completed' | 'aborted'
  ): Promise<SessionDTO | null> {
    return this.updateSession(sessionId, userId, { status });
  }

  /**
   * Delete a session
   * @param sessionId - Session ID to delete
   * @param userId - User ID for authorization check
   * @returns true if deleted, false if not found/unauthorized
   */
  async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    // First verify ownership
    const existing = await prisma.claudeConversation.findUnique({
      where: { id: sessionId },
    });

    if (!existing || existing.userId !== userId) {
      return false;
    }

    await prisma.claudeConversation.delete({
      where: { id: sessionId },
    });

    return true;
  }

  /**
   * Update Claude SDK session ID
   * @param sessionId - Database session ID
   * @param userId - User ID for authorization check
   * @param claudeSessionId - Claude Agent SDK session ID
   * @returns Updated session DTO, or null if not found/unauthorized
   */
  async updateClaudeSessionId(
    sessionId: string,
    userId: string,
    claudeSessionId: string
  ): Promise<SessionDTO | null> {
    return this.updateSession(sessionId, userId, { sessionId: claudeSessionId });
  }
}

// Export singleton instance
export const sessionService = new SessionService();
