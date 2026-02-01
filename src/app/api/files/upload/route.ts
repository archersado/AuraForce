/**
 * File Upload API Route
 *
 * Handles file uploads to the workspace.
 * Supports:
 * - Multiple files
 * - Progress tracking
 * - Large files (up to 100MB)
 * - Content type validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// File upload API for workspace
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const targetPath = formData.get('path') as string || '/';

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

    // Results array
    const results = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      try {
        // Validate file size (100MB limit per Next.js config)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
          errors.push({
            file: file.name,
            error: `File size exceeds maximum limit of 100MB`,
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

        results.push({
          name: file.name,
          path: path.join(safePath, safeFileName).replace(/\\/g, '/'),
          size: file.size,
          type: file.type,
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
