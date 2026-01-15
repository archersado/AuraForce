/**
 * Session Service Tests
 *
 * Tests for the SessionService class which handles all session CRUD operations.
 */

import { SessionService } from '@/lib/services/session-service';
import type { SessionDTO } from '@/types/session';

// Mock Prisma client
jest.mock('@/lib/db/client', () => ({
  prisma: {
    claudeConversation: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/db/client';

describe('SessionService', () => {
  let service: SessionService;
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    service = new SessionService();
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new session with default title', async () => {
      const mockSession = {
        id: 'session-1',
        title: 'New Conversation',
        userId: mockUserId,
        sessionId: null,
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.createSession(mockUserId, {});

      expect(prisma.claudeConversation.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          title: 'New Conversation',
          skillId: undefined,
          messages: [],
          status: 'active',
        },
      });

      expect(result.id).toBe('session-1');
      expect(result.title).toBe('New Conversation');
      expect(result.status).toBe('active');
    });

    it('should create a session with custom title', async () => {
      const mockSession = {
        id: 'session-2',
        title: 'My Custom Title',
        userId: mockUserId,
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.createSession(mockUserId, {
        title: 'My Custom Title',
      });

      expect(prisma.claudeConversation.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          title: 'My Custom Title',
          skillId: undefined,
          messages: [],
          status: 'active',
        },
      });

      expect(result.title).toBe('My Custom Title');
    });

    it('should associate with skillId when provided', async () => {
      const mockSession = {
        id: 'session-3',
        title: 'Skill Session',
        userId: mockUserId,
        skillId: 'skill-123',
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.createSession(mockUserId, {
        skillId: 'skill-123',
      });

      expect(prisma.claudeConversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            skillId: 'skill-123',
          }),
        })
      );
    });
  });

  describe('getSessionById', () => {
    it('should return session when found and user owns it', async () => {
      const mockSession = {
        id: 'session-1',
        title: 'Test Session',
        userId: mockUserId,
        status: 'active',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T10:00:00Z',
          },
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.getSessionById('session-1', mockUserId);

      expect(result).not.toBeNull();
      expect(result?.id).toBe('session-1');
      expect(result?.messages).toHaveLength(1);
    });

    it('should return null when session not found', async () => {
      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getSessionById('invalid-id', mockUserId);

      expect(result).toBeNull();
    });

    it('should return null when user does not own session', async () => {
      const mockSession = {
        id: 'session-1',
        title: 'Other User Session',
        userId: 'other-user-id',
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.getSessionById('session-1', mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('listSessions', () => {
    it('should return list of sessions for user', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          title: 'Session 1',
          userId: mockUserId,
          status: 'active',
          messages: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 'session-2',
          title: 'Session 2',
          userId: mockUserId,
          status: 'completed',
          messages: [{ id: 'msg-1', role: 'user', content: 'Hi', timestamp: '2024-01-01' }],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      (prisma.claudeConversation.findMany as jest.Mock).mockResolvedValue(mockSessions);
      (prisma.claudeConversation.count as jest.Mock).mockResolvedValue(2);

      const result = await service.listSessions(mockUserId, {
        limit: 50,
        offset: 0,
      });

      expect(result.sessions).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.sessions[0].messageCount).toBe(0);
      expect(result.sessions[1].messageCount).toBe(1);
    });

    it('should filter by status when provided', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          title: 'Active Session',
          userId: mockUserId,
          status: 'active',
          messages: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      (prisma.claudeConversation.findMany as jest.Mock).mockResolvedValue(mockSessions);
      (prisma.claudeConversation.count as jest.Mock).mockResolvedValue(1);

      const result = await service.listSessions(mockUserId, {
        limit: 50,
        offset: 0,
        status: 'active',
      });

      expect(prisma.claudeConversation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: 'active' },
        orderBy: { updatedAt: 'desc' },
        take: 50,
        skip: 0,
      });

      expect(result.sessions).toHaveLength(1);
    });

    it('should apply limit and offset', async () => {
      (prisma.claudeConversation.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.claudeConversation.count as jest.Mock).mockResolvedValue(100);

      await service.listSessions(mockUserId, {
        limit: 10,
        offset: 20,
      });

      expect(prisma.claudeConversation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        skip: 20,
      });
    });
  });

  describe('updateSession', () => {
    it('should update session title', async () => {
      const existingSession = {
        id: 'session-1',
        title: 'Old Title',
        userId: mockUserId,
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const updatedSession = {
        ...existingSession,
        title: 'New Title',
        updatedAt: new Date('2024-01-02'),
      };

      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(existingSession);
      (prisma.claudeConversation.update as jest.Mock).mockResolvedValue(updatedSession);

      const result = await service.updateSession('session-1', mockUserId, {
        title: 'New Title',
      });

      expect(result?.title).toBe('New Title');
      expect(prisma.claudeConversation.update).toHaveBeenCalled();
    });

    it('should update session status', async () => {
      const existingSession = {
        id: 'session-1',
        title: 'Test',
        userId: mockUserId,
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const updatedSession = {
        ...existingSession,
        status: 'completed',
        updatedAt: new Date('2024-01-02'),
      };

      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(existingSession);
      (prisma.claudeConversation.update as jest.Mock).mockResolvedValue(updatedSession);

      const result = await service.updateSession('session-1', mockUserId, {
        status: 'completed',
      });

      expect(result?.status).toBe('completed');
    });

    it('should return null when session not found', async () => {
      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.updateSession('invalid-id', mockUserId, {
        title: 'New Title',
      });

      expect(result).toBeNull();
      expect(prisma.claudeConversation.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteSession', () => {
    it('should delete session when user owns it', async () => {
      const existingSession = {
        id: 'session-1',
        title: 'To Delete',
        userId: mockUserId,
        status: 'active',
        messages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(existingSession);
      (prisma.claudeConversation.delete as jest.Mock).mockResolvedValue(existingSession);

      const result = await service.deleteSession('session-1', mockUserId);

      expect(result).toBe(true);
      expect(prisma.claudeConversation.delete).toHaveBeenCalledWith({
        where: { id: 'session-1' },
      });
    });

    it('should return false when session not found', async () => {
      (prisma.claudeConversation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.deleteSession('invalid-id', mockUserId);

      expect(result).toBe(false);
      expect(prisma.claudeConversation.delete).not.toHaveBeenCalled();
    });
  });
});
