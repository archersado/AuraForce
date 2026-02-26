/**
 * File Operations API Test Suite
 *
 * This file contains test cases for the File Operations API.
 * Run with: npm test -- files-api.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { NextRequest } from 'next/server';

// Test utilities
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TEST_WORKSPACE = '/tmp/test-workspace';

// Test file paths
const TEST_FILE_PATH = 'test-file.txt';
const TEST_FILE_CONTENT = 'Hello, World!';
const TEST_LARGE_FILE_CONTENT = 'x'.repeat(1000000); // 1MB
const TEST_BINARY_FILE = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // PNG header

describe('Files API - File Operations (CRUD)', () => {

  beforeAll(async () => {
    // Setup: Create test workspace if needed
    console.log('Setting up test workspace...');
  });

  afterAll(async () => {
    // Cleanup: Remove test files
    console.log('Cleaning up test workspace...');
  });

  describe('POST /api/files/create - Create File', () => {
    it('should create a new empty file', async () => {
      const response = await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/${TEST_FILE_PATH}`,
          content: ''
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.metadata.path).toBe(TEST_FILE_PATH);
      expect(data.metadata.size).toBe(0);
    });

    it('should create a file with initial content', async () => {
      const response = await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-with-content.txt`,
          content: TEST_FILE_CONTENT
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.metadata.size).toBe(TEST_FILE_CONTENT.length);
    });

    it('should reject creation of existing file', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-duplicate.txt`,
          content: 'test'
        })
      });

      // Try to create again
      const response = await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-duplicate.txt`,
          content: 'test'
        })
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toContain('already exists');
    });

    it('should validate filename', async () => {
      const invalidFilenames = ['test/file.txt', 'test\\file.txt', 'test*.txt', 'test?.txt', 'test|.txt'];

      for (const filename of invalidFilenames) {
        const response = await fetch(`${BASE_URL}/api/files/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: `/${filename}`,
            content: 'test'
          })
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toContain('invalid');
      }
    });
  });

  describe('GET /api/files/read - Read File', () => {
    it('should read file content successfully', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-read.txt`,
          content: TEST_FILE_CONTENT
        })
      });

      // Read file
      const response = await fetch(`${BASE_URL}/api/files/read?path=/test-read.txt`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.content).toBe(TEST_FILE_CONTENT);
      expect(data.metadata.size).toBe(TEST_FILE_CONTENT.length);
      expect(data.metadata.mimeType).toBe('text/plain');
    });

    it('should return 404 for non-existent file', async () => {
      const response = await fetch(`${BASE_URL}/api/files/read?path=/non-existent.txt`);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toContain('not found');
    });

    it('should warn about large files', async () => {
      // Create large file
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-large.txt`,
          content: TEST_LARGE_FILE_CONTENT
        })
      });

      // Read file
      const response = await fetch(`${BASE_URL}/api/files/read?path=/test-large.txt`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.isLarge).toBe(true);
      expect(data.warning).toContain('Large file');
    });

    it('should detect binary files', async () => {
      // Create binary file
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-binary.txt`,
          content: TEST_BINARY_FILE.toString()
        })
      });

      // Read file (will be detected as binary)
      const response = await fetch(`${BASE_URL}/api/files/read?path=/test-binary.txt`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.isBinary).toBeDefined();
    });
  });

  describe('PUT /api/files/write - Update File', () => {
    it('should update existing file content', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-update.txt`,
          content: 'original content'
        })
      });

      // Update file
      const response = await fetch(`${BASE_URL}/api/files/write`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-update.txt`,
          content: 'updated content'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.metadata.size).toBe('updated content'.length);

      // Verify update
      const readResponse = await fetch(`${BASE_URL}/api/files/read?path=/test-update.txt`);
      const readData = await readResponse.json();
      expect(readData.content).toBe('updated content');
    });

    it('should create parent directories if requested', async () => {
      const response = await fetch(`${BASE_URL}/api/files/write`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/new/deep/path/file.txt`,
          content: 'test',
          createIfMissing: true
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should return 400 if parent directory does not exist', async () => {
      const response = await fetch(`${BASE_URL}/api/files/write`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/nonexistent/path/file.txt`,
          content: 'test',
          createIfMissing: false
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Parent directory does not exist');
    });
  });

  describe('DELETE /api/files/delete - Delete File', () => {
    it('should require confirmation', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-delete.txt`,
          content: 'test'
        })
      });

      // Try to delete without confirmation
      const response = await fetch(`${BASE_URL}/api/files/delete?path=/test-delete.txt`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(202);
      const data = await response.json();
      expect(data.requiresConfirmation).toBe(true);
    });

    it('should delete file with confirmation', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/test-delete-confirmed.txt`,
          content: 'test'
        })
      });

      // Delete with confirmation
      const response = await fetch(`${BASE_URL}/api/files/delete?path=/test-delete-confirmed.txt&confirmed=true`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);

      // Verify deletion
      const readResponse = await fetch(`${BASE_URL}/api/files/read?path=/test-delete-confirmed.txt`);
      expect(readResponse.status).toBe(404);
    });

    it('should not delete directories', async () => {
      // Create directory first
      const mkdirResponse = await fetch(`${BASE_URL}/api/files/mkdir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPath: '/',
          directoryName: 'test-dir'
        })
      });

      // Try to delete directory
      const response = await fetch(`${BASE_URL}/api/files/delete?path=/test-dir&confirmed=true`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Cannot delete directories');
    });
  });

  describe('POST /api/files/rename - Rename File', () => {
    it('should rename a file successfully', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/old-name.txt`,
          content: 'test'
        })
      });

      // Rename file
      const response = await fetch(`${BASE_URL}/api/files/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPath: `/old-name.txt`,
          newName: 'new-name.txt',
          workspaceRoot: TEST_WORKSPACE
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.filename).toBe('new-name.txt');
    });

    it('should prevent name conflicts', async () => {
      // Create two files
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/file1.txt`,
          content: 'test1'
        })
      });

      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/file2.txt`,
          content: 'test2'
        })
      });

      // Try to rename file1 to file2
      const response = await fetch(`${BASE_URL}/api/files/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPath: `/file1.txt`,
          newName: 'file2.txt',
          workspaceRoot: TEST_WORKSPACE
        })
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toContain('already exists');
    });
  });

  describe('POST /api/files/upload - Upload File', () => {
    it('should upload a single file', async () => {
      const file = new File(['test content'], 'upload-test.txt', { type: 'text/plain' });

      const formData = new FormData();
      formData.append('files', file);
      formData.append('path', '/');

      const response = await fetch(`${BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.uploaded).toBe(1);
      expect(data.results[0].success).toBe(true);
    });

    it('should upload multiple files', async () => {
      const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });

      const formData = new FormData();
      formData.append('files', file1);
      formData.append('files', file2);
      formData.append('path', '/');

      const response = await fetch(`${BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.uploaded).toBe(2);
    });

    // Note: Chunked upload tests would require setup of large file
    // and would be tested in integration tests
  });

  describe('GET /api/files/download - Download File', () => {
    it('should download a file successfully', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/download-test.txt`,
          content: TEST_FILE_CONTENT
        })
      });

      // Download file
      const response = await fetch(`${BASE_URL}/api/files/download?path=/download-test.txt`);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain');
      expect(response.headers.get('Content-Disposition')).toContain('attachment');
      const content = await response.text();
      expect(content).toBe(TEST_FILE_CONTENT);
    });

    it('should support custom filename', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/original-name.txt`,
          content: TEST_FILE_CONTENT
        })
      });

      // Download with custom name
      const response = await fetch(`${BASE_URL}/api/files/download?path=/original-name.txt&name=custom-name.txt`);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Disposition')).toContain('custom-name.txt');
    });
  });

  describe('DELETE /api/files/batch-delete - Batch Delete', () => {
    it('should require confirmation', async () => {
      const response = await fetch(`${BASE_URL}/api/files/batch-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/file1.txt', '/file2.txt']
        })
      });

      expect(response.status).toBe(202);
      const data = await response.json();
      expect(data.requiresConfirmation).toBe(true);
    });

    it('should delete multiple files with confirmation', async () => {
      // Create test files
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/batch1.txt`,
          content: 'test1'
        })
      });

      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/batch2.txt`,
          content: 'test2'
        })
      });

      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/batch3.txt`,
          content: 'test3'
        })
      });

      // Batch delete
      const response = await fetch(`${BASE_URL}/api/files/batch-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/batch1.txt', '/batch2.txt', '/batch3.txt'],
          confirmed: true
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.summary.successful).toBe(3);
    });

    it('should respect max batch size limit', async () => {
      const paths = Array(101).fill(0).map((_, i) => `/file${i}.txt`);

      const response = await fetch(`${BASE_URL}/api/files/batch-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths,
          confirmed: true
        })
      });

      expect(response.status).toBe(413);
      const data = await response.json();
      expect(data.error).toContain('Too many files');
    });
  });

  describe('GET /api/files/metadata - Get File Metadata', () => {
    it('should return file metadata', async () => {
      // Create file first
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/metadata-test.txt`,
          content: TEST_FILE_CONTENT
        })
      });

      // Get metadata
      const response = await fetch(`${BASE_URL}/api/files/metadata?path=/metadata-test.txt`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.metadata.name).toBe('metadata-test.txt');
      expect(data.metadata.type).toBe('file');
      expect(data.metadata.size).toBe(TEST_FILE_CONTENT.length);
      expect(data.metadata.mimeType).toBe('text/plain');
      expect(data.metadata.category).toBe('text');
      expect(data.metadata.permissions).toBeDefined();
    });

    it('should include directory children when requested', async () => {
      // Create directory with files
      const mkdirResponse = await fetch(`${BASE_URL}/api/files/mkdir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPath: '/',
          directoryName: 'metadata-dir'
        })
      });

      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/metadata-dir/file1.txt`,
          content: 'test1'
        })
      });

      // Get metadata with children
      const response = await fetch(`${BASE_URL}/api/files/metadata?path=/metadata-dir&includeChildren=true`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.metadata.type).toBe('directory');
      expect(data.metadata.children).toBeDefined();
      expect(data.metadata.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/files/list - List Directory', () => {
    it('should list directory contents', async () => {
      // Create test files
      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/list-test/file1.txt`,
          content: 'test1'
        })
      });

      await fetch(`${BASE_URL}/api/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/list-test/file2.txt`,
          content: 'test2'
        })
      });

      // List directory
      const response = await fetch(`${BASE_URL}/api/files/list?path=/list-test`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.path).toBe('/list-test');
      expect(data.files).toBeDefined();
      expect(data.files.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// Performance Tests
describe('Files API - Performance', () => {
  it('should create file within 500ms', async () => {
    const start = Date.now();

    await fetch(`${BASE_URL}/api/files/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/perf-test.txt`,
        content: 'test'
      })
    });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('should read file within 200ms', async () => {
    // Create file first
    await fetch(`${BASE_URL}/api/files/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/perf-read-test.txt`,
        content: 'test content'
      })
    });

    const start = Date.now();

    await fetch(`${BASE_URL}/api/files/read?path=/perf-read-test.txt`);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });

  it('should update file within 500ms', async () => {
    // Create file first
    await fetch(`${BASE_URL}/api/files/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/perf-update-test.txt`,
        content: 'original'
      })
    });

    const start = Date.now();

    await fetch(`${BASE_URL}/api/files/write`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/perf-update-test.txt`,
        content: 'updated'
      })
    });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('should delete file within 200ms', async () => {
    // Create file first
    await fetch(`${BASE_URL}/api/files/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/perf-delete-test.txt`,
        content: 'test'
      })
    });

    const start = Date.now();

    await fetch(`${BASE_URL}/api/files/delete?path=/perf-delete-test.txt&confirmed=true`, {
      method: 'DELETE'
    });

    const duration = Date.now - start;
    expect(duration).toBeLessThan(200);
  });
});
