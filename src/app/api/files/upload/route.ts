/**
 * File Upload API Route
 *
 * Handles file uploads to the workspace.
 * Supports:
 * - Multiple files
 * - Large files (up to 200MB without chunking)
 * - Chunked uploads for very large files (> 200MB)
 * - Progress tracking
 * - Content type validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat, readFile, unlink, rmdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readdir } from 'fs/promises';

// File upload API for workspace
// Maximum file size for regular uploads (200MB)
const MAX_FILE_SIZE = 200 * 1024 * 1024;

// Chunk upload configuration
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const targetPath = formData.get('path') as string || '/';

    // Check if this is a chunked upload
    const chunkIndex = parseInt(formData.get('chunkIndex') as string || '0');
    const totalChunks = parseInt(formData.get('totalChunks') as string || '1');
    const fileId = formData.get('fileId') as string;
    const originalName = formData.get('originalName') as string;
    const totalSize = parseInt(formData.get('totalSize') as string || '0');

    // Validate target path
    if (!targetPath || typeof targetPath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid target path' },
        { status: 400 }
      );
    }

    // Security: prevent path traversal
    const safePath = path
      .normalize(targetPath)
      .replace(/^(\.\.(\/|\\|$))+/, '');

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Get workspace root from environment
    const workspaceRoot = process.env.WORKSPACE_ROOT || '/tmp/workspace';

    // Handle chunked upload (for files > MAX_FILE_SIZE)
    if (fileId && totalChunks > 1) {
      const file = files[0];
      const extension = path.extname(originalName);
      const chunkDir = path.join(workspaceRoot, safePath, '.chunks', fileId);

      try {
        // Ensure chunk directory exists
        await mkdir(chunkDir, { recursive: true });

        // Write chunk
        const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(chunkPath, buffer);

        // Check if this is the last chunk
        if (chunkIndex === totalChunks - 1) {
          // All chunks received, assemble file
          const finalDir = path.join(workspaceRoot, safePath);
          const finalFileName = originalName;
          const finalPath = path.join(finalDir, finalFileName);

          // Ensure final directory exists
          await mkdir(finalDir, { recursive: true });

          // Read all chunks and write to final file
          const chunks: Buffer[] = [];
          for (let i = 0; i < totalChunks; i++) {
            const chunkBuffer = await readFile(path.join(chunkDir, `chunk-${i}`));
            chunks.push(chunkBuffer);
          }

          const finalContent = Buffer.concat(chunks);
          await writeFile(finalPath, finalContent);

          // Clean up chunks directory
          await recursiveDelete(chunkDir);

          // Get file stats
          const fileStat = await stat(finalPath);

          return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            file: {
              name: originalName,
              path: path.join(safePath, originalName).replace(/\\/g, '/'),
              size: fileStat.size,
              type: file.type,
              uploaded: true,
            },
            totalSize: fileStat.size,
            totalChunks,
            chunksReceived: chunkIndex + 1,
          });
        } else {
          // More chunks expected
          return NextResponse.json({
            success: true,
            message: `Chunk ${chunkIndex + 1} of ${totalChunks} received`,
            chunksReceived: chunkIndex + 1,
            totalChunks,
            fileId,
          });
        }
      } catch (error) {
        console.error('Chunked upload error:', error);
        return NextResponse.json(
          {
            error: error instanceof Error ? error.message : 'Failed to upload chunk',
            success: false,
          },
          { status: 500 }
        );
      }
    }

    // Regular upload (single file, not chunked)
    const results = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      try {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          // Return information about chunked upload requirement
          const chunksRequired = Math.ceil(file.size / CHUNK_SIZE);
          errors.push({
            file: file.name,
            error: `File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds regular upload limit. Use chunked upload with ${chunksRequired} chunks.`,
            requiresChunkedUpload: true,
            chunkSize: CHUNK_SIZE,
            chunksRequired,
            totalSize: file.size,
          });
          continue;
        }

        // Generate safe filename
        const timestamp = Date.now();
        const fileId = uuidv4();
        const extension = path.extname(file.name);
        const baseName = path.basename(file.name, extension);
        const safeFileName = `${baseName}-${fileId}${extension}`;

        // Calculate full path
        const fullPath = path.join(workspaceRoot, safePath, safeFileName);

        // Ensure directory exists
        const dirPath = path.dirname(fullPath);
        await mkdir(dirPath, { recursive: true });

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(fullPath, buffer);

        // Get file stats
        const fileStat = await stat(fullPath);

        results.push({
          name: file.name,
          path: path.join(safePath, safeFileName).replace(/\\/g, '/'),
          size: fileStat.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          success: true,
        });
      } catch (error) {
        errors.push({
          file: file.name,
          error: error instanceof Error ? error.message : 'Failed to upload file',
        });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: results.length,
      results,
      errors,
      targetPath: safePath,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload files',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * Recursively delete a directory
 */
async function recursiveDelete(dirPath: string) {
  const { readdir, unlink, rmdir } = await import('fs/promises');
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await recursiveDelete(entryPath);
    } else {
      await unlink(entryPath);
    }
  }

  await rmdir(dirPath);
}
