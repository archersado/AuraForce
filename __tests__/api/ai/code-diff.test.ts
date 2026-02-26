/**
 * Code Diff API Endpoint Tests
 *
 * Tests for /api/ai/code-diff endpoint
 */

import { POST, GET } from '@/app/api/ai/code-diff/route';
import { NextRequest } from 'next/server';

describe('Code Diff API', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock request
    mockRequest = {
      json: jest.fn(),
    } as unknown as NextRequest;
  });

  describe('GET /api/ai/code-diff', () => {
    it('should return health check status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.endpoint).toBe('/api/ai/code-diff');
      expect(data.version).toBe('1.0.0');
      expect(data.supportedFormats).toEqual(['json', 'unified', 'html']);
    });
  });

  describe('POST /api/ai/code-diff', () => {
    it('should require at least one of original or modified code', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({});

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });

    it('should generate diff for simple addition', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2',
        modified: 'line 1\nline 2\nline 3',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.diff.additions).toBe(1);
      expect(data.diff.deletions).toBe(0);
      expect(data.diff.summary).toBe('+1 -0');
    });

    it('should generate diff for simple removal', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2\nline 3',
        modified: 'line 1\nline 2',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.diff.additions).toBe(0);
      expect(data.diff.deletions).toBe(1);
      expect(data.diff.summary).toBe('+0 -1');
    });

    it('should generate diff for modification', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2\nline 3',
        modified: 'line 1\nline 2 modified\nline 3',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.diff.additions).toBe(1);
      expect(data.diff.deletions).toBe(1);
    });

    it('should include diff changes array', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.diff.changes).toBeInstanceOf(Array);
      expect(data.diff.changes.length).toBeGreaterThan(0);

      const addedChange = data.diff.changes.find((c: any) => c.type === 'add');
      expect(addedChange).toBeDefined();
      expect(addedChange.content).toBe('line 2');
    });

    it('should handle empty strings', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: '',
        modified: '',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.diff.changes).toEqual([]);
      expect(data.diff.additions).toBe(0);
      expect(data.diff.deletions).toBe(0);
    });

    it('should calculate similarity score', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2\nline 3',
        modified: 'line 1\nline 2 modified\nline 3',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.meta.similarity).toBeDefined();
      expect(data.meta.similarity).toBeGreaterThan(0);
      expect(data.meta.similarity).toBeLessThan(1);
    });

    it('should identify significant changes', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2\nline 3\nline 4\nline 5',
        modified: 'completely different',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.meta.isSignificant).toBe(true);
    });

    it('should return 0 difference for identical code', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2\nline 3',
        modified: 'line 1\nline 2\nline 3',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.meta.similarity).toBe(1);
      expect(data.meta.isSignificant).toBe(false);
      expect(data.diff.additions).toBe(0);
      expect(data.diff.deletions).toBe(0);
    });

    it('should generate unified diff format when requested', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2',
        modified: 'line 1\nline 2\nline 3',
        format: 'unified',
        fileName: 'test.js',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.unifiedDiff).toBeDefined();
      expect(data.unifiedDiff).toContain('--- a/test.js');
      expect(data.unifiedDiff).toContain('+++ b/test.js');
      expect(data.unifiedDiff).toContain('@@ -1,2 +1,3 @@');
    });

    it('should include HTML when requested', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
        includeHTML: true,
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.html).toBeDefined();
      expect(data.html).toContain('<div class="diff-container">');
      expect(data.html).toContain('class="diff-line"');
      expect(data.html).toContain('diff-add');
    });

    it('should include formatted diff for display', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\nline 2',
        modified: 'line 1\nline 2 modified',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.formatted).toBeDefined();
      expect(data.formatted).toBeInstanceOf(Array);
    });

    it('should use default file name when not provided', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
        format: 'unified',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.unifiedDiff).toContain('--- a/file.js');
      expect(data.unifiedDiff).toContain('+++ b/file.js');
    });

    it('should use provided file name', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
        format: 'unified',
        fileName: 'custom.ts',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.unifiedDiff).toContain('--- a/custom.ts');
      expect(data.unifiedDiff).toContain('+++ b/custom.ts');
    });

    it('should default to json format', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.diff).toBeDefined();
      expect(data.formatted).toBeDefined();
      expect(data.unifiedDiff).toBeUndefined();
    });

    it('should handle large code', async () => {
      const largeOriginal = Array(500).fill(0).map((_, i) => `line ${i}`).join('\n');
      const largeModified = largeOriginal + '\nline 500';

      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: largeOriginal,
        modified: largeModified,
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.diff.additions).toBe(1);
    });

    it('should include timestamp in metadata', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.meta.timestamp).toBeDefined();
      expect(new Date(data.meta.timestamp)).toBeInstanceOf(Date);
    });

    it('should preserve empty and blank lines in diff', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1\n\nline 3',
        modified: 'line 1\n\nline 2\nline 3',
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.diff.changes).toContainEqual(
        expect.objectContaining({
          content: '',
          type: 'equal',
        })
      );
    });

    it('should handle null/undefined fileName gracefully', async () => {
      (mockRequest.json as jest.Mock).mockResolvedValue({
        original: 'line 1',
        modified: 'line 1\nline 2',
        format: 'unified',
        fileName: null as any,
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.unifiedDiff).toBeDefined();
    });
  });
});
