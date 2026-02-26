/**
 * Workspace File Upload API
 *
 * Implements standard file upload for files <5MB.
 * For larger files, use the chunked upload endpoints.
 *
 * POST /api/workspace/upload
 *    FormData: { file, targetPath, workspaceRoot }
 *
 * @see chunked-upload for larger files
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Maximum file size for direct upload (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetPath = formData.get('targetPath') as string || '/';
    const workspaceRoot = formData.get('workspaceRoot') as string || '';

    console.log('[Workspace Upload] Upload request:', {
      filename: file?.name,
      size: file?.size,
      targetPath,
      workspaceRoot,
    });

    // Validate input
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Use chunked upload for larger files.`,
          requiresChunkedUpload: true,
          maxFileSize: MAX_FILE_SIZE,
        },
        { status: 413 }
      );
    }

    // Normalize and validate paths
    const safeTargetPath = path.normalize(targetPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const safeWorkspaceRoot = path.normalize(workspaceRoot).replace(/^(\.\.(\/|\\|$))+/, '');

    if (!safeWorkspaceRoot) {
      return NextResponse.json(
        { error: 'Invalid workspace root' },
        { status: 400 }
      );
    }

    // Generate unique filename (with timestamp and UUID to avoid conflicts)
    const extension = path.extname(file.name);
    const baseName = path.basename(file.name, extension);
    const timestamp = Date.now();
    const fileUuid = uuidv4();
    const safeFileName = `${baseName}-${timestamp}-${fileUuid}${extension}`;

    // Build full file path
    const finalDir = path.join(safeWorkspaceRoot, safeTargetPath);
    const finalPath = path.join(finalDir, safeFileName);

    // Ensure target directory exists
    try {
      await mkdir(finalDir, { recursive: true });
    } catch (error) {
      console.error('[Workspace Upload] Failed to create directory:', error);
      return NextResponse.json(
        { error: 'Failed to create target directory' },
        { status: 500 }
      );
    }

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(finalPath, buffer);

    // Get file stats
    const fileStat = await stat(finalPath);

    // Return relative file path from workspace root
    const relativePath = path.join(safeTargetPath, safeFileName);

    console.log('[Workspace Upload] Upload successful:', {
      filename: file.name,
      filePath: relativePath,
      size: fileStat.size,
    });

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        filePath: relativePath,
        fullPath: finalPath,
        size: fileStat.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Workspace Upload] Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload file',
        success: false,
      },
      { status: 500 }
    );
  }
}
