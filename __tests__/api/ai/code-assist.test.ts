/**
 * Code Assist API Endpoint Tests
 *
 * Tests for /api/ai/code-assist endpoint
 */

import { POST, GET } from '@/app/api/ai/code-assist/route';
import { NextRequest } from 'next/server';

// Mock Claude SDK
jest.mock('@anthropic-ai/claude-agent-sdk', () => ({
  query: jest.fn(),
}));

import { query } from '@anthropic-ai/claude-agent-sdk';

// Mock config
jest.mock('@/lib/config', () => ({
  claude: {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'sonnet',
  },
}));

describe('Code Assist API', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock request
    mockRequest = {
      json: jest.fn(),
    } as unknown as NextRequest;
  });

  describe('GET /api/ai/code-assist', () => {
    it('should return health check status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.endpoint).toBe('/api/ai/code-assist');
      expect(data.version).toBe('1.0.0');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('POST /api/ai/code-assist', () => {
    it('should require command parameter', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        code: 'function x() {}',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('command');
    });

    it('should require code parameter', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('code');
    });

    it('should reject empty code', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: '   ',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('empty');
    });

    it('should return mock response when API key is invalid', async () => {
      // Override config temporarily
      jest.resetModules();
      jest.doMock('@/lib/config', () => ({
        claude: {
          apiKey: 'your-invalid-key',
          baseUrl: 'https://api.anthropic.com',
          defaultModel: 'sonnet',
        },
      }));

      const { POST: POSTWithInvalidKey } = require('@/app/api/ai/code-assist/route');

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: '添加注释',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POSTWithInvalidKey(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.suggestion).toContain('//');
      expect(data.isMock).toBe(true);
    });

    it('should call Claude SDK with correct parameters', async () => {
      // Mock successful query
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\nfunction improved() { return 2; }\n```Improved version',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(query).toHaveBeenCalledWith({
        prompt: expect.stringContaining('improve this'),
        options: expect.objectContaining({
          model: 'sonnet',
          cwd: expect.any(String),
        }),
      });

      expect(data.success).toBe(true);
      expect(data.suggestion).toContain('function improved');
    });

    it('should return security validation', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\nfunction safe() { return 1; }\n```',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.security).toBeDefined();
      expect(data.security.isValid).toBeDefined();
      expect(data.security.score).toBeDefined();
      expect(data.security.issues).toBeDefined();
    });

    it('should block suggestions with critical security issues', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\neval("dangerous code")\n```',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.security.isValid).toBe(false);
      expect(data.security.score).toBeLessThan(40);
      expect(data.security.issues.some((i: any) => i.type === 'EVAL')).toBe(true);
    });

    it('should generate diff between original and suggested code', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\nfunction test() { return 2; }\n```',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.diff).toBeDefined();
      expect(data.diff.changes).toBeDefined();
      expect(data.diff.additions).toBeDefined();
      expect(data.diff.deletions).toBeDefined();
      expect(data.diff.summary).toBeDefined();
    });

    it('should calculate confidence score', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\nfunction testImproved() { return 2; }\n```Code improved with better naming',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.confidence).toBeDefined();
      expect(data.confidence).toBeGreaterThanOrEqual(0);
      expect(data.confidence).toBeLessThanOrEqual(1);
    });

    it('should preserve session ID for context', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'existing-session-id',
            type: 'result',
            result: '```javascript\nfunction test() { return 1; }\n```',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        sessionId: 'existing-session-id',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      // Verify session was used
      expect(query).toHaveBeenCalledWith({
        prompt: expect.any(String),
        options: expect.objectContaining({
          resume: 'existing-session-id',
        }),
      });
    });

    it('should handle Claude API errors gracefully', async () => {
      (query as jest.Mock).mockImplementation(() => {
        throw new Error('Claude API error');
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'improve this',
        code: 'function test() { return 1; }',
        language: 'javascript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to process');
    });

    it('should return metadata with response', async () => {
      const mockQueryInstance = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            session_id: 'test-session',
            type: 'result',
            result: '```javascript\nfunction test() { return 1; }\n```',
          };
        },
      };

      (query as jest.Mock).mockReturnValue(mockQueryInstance);

      (mockRequest.json as jest.Mock).mockResolvedValue({
        command: 'add comments',
        code: 'function test() { return 1; }',
        language: 'typescript',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.meta).toBeDefined();
      expect(data.meta.language).toBe('typescript');
      expect(data.meta.command).toBe('add comments');
      expect(data.meta.timestamp).toBeDefined();
    });
  });
});
