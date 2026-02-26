/**
 * Initialize Chunked Upload
 *
 * Initializes a new chunked upload session for large files (>5MB).
 * Returns an upload ID that will be used for subsequent chunk uploads.
 *
 * POST /api/workspace/upload/init
 *    JSON Body: {
 *      filename: string,
 *      fileSize: number,
 *      fileType: string,
 *      totalChunks: number,
 *      targetPath: string,
 *      workspaceRoot: string,
 *      uploadId?: string
 *    }
 *
 * Response: {
 *   success: true,
 *   data: { uploadId, chunkSize }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import path from 'path';

// Temporary directory for upload chunks
const UPLOAD_TEMP_DIR = '.workspace-uploads';

// Chunk size (must match frontend chunk size)
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// In-memory tracking of active uploads (in production, use a database)
const activeUploads = new Map<string, {
  filename: string;
  fileSize: number;
  fileType: string;
  totalChunks: number;
  targetPath: string;
  workspaceRoot: string;
  createdAt: number;
  chunksReceived: Set<number>;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      filename,
      fileSize,
      fileType,
      totalChunks,
      targetPath,
      workspaceRoot,
      uploadId,
    } = body;

    console.log('[Workspace Upload Init] Initialize chunked upload:', {
      filename,
      fileSize,
      totalChunks,
      targetPath,
      workspaceRoot,
    });

    // Validate required fields
    if (!filename || !fileSize || !totalChunks || !targetPath) {
      return NextResponse.json(
        {
          error: 'Missing required fields: filename, fileSize, totalChunks, targetPath',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize <= CHUNK_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${fileSize} bytes) does not require chunked upload. Use direct upload instead.`,
        },
        { status: 400 }
      );
    }

    // Validate total chunks
    const expectedTotalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    if (Math.abs(totalChunks - expectedTotalChunks) > 1) {
      return NextResponse.json(
        {
          error: `Invalid total chunks. Expected: ${expectedTotalChunks}, Received: ${totalChunks}`,
        },
        { status: 400 }
      );
    }

    // Normalize paths
    const safeTargetPath = path.normalize(targetPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const safeWorkspaceRoot = path.normalize(workspaceRoot).replace(/^(\.\.(\/|\\|$))+/, '');

    // Generate or use provided upload ID
    const finalUploadId = uploadId || generateUploadId();

    // Check for duplicate upload ID
    if (activeUploads.has(finalUploadId)) {
      return NextResponse.json(
        {
          error: `Upload ID ${finalUploadId} already exists`,
        },
        { status: 409 }
      );
    }

    // Create temporary directory for chunks
    const uploadTempDir = path.join(process.cwd(), 'temp', UPLOAD_TEMP_DIR, finalUploadId);
    try {
      await mkdir(uploadTempDir, { recursive: true });
    } catch (error) {
      console.error('[Workspace Upload Init] Failed to create upload directory:', error);
      return NextResponse.json(
        { error: 'Failed to initialize upload' },
        { status: 500 }
      );
    }

    // Store upload session
    activeUploads.set(finalUploadId, {
      filename,
      fileSize,
      fileType,
      totalChunks,
      targetPath: safeTargetPath,
      workspaceRoot: safeWorkspaceRoot,
      createdAt: Date.now(),
      chunksReceived: new Set<number>(),
    });

    console.log('[Workspace Upload Init] Upload initialized:', {
      uploadId: finalUploadId,
      uploadTempDir,
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadId: finalUploadId,
        chunkSize: CHUNK_SIZE,
      },
    });
  } catch (error) {
    console.error('[Workspace Upload Init] Initialization error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initialize upload',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate unique upload ID
 */
function generateUploadId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2);
}

/**
 * Get upload session (for use by other endpoints)
 */
export function getUploadSession(uploadId: string) {
  return activeUploads.get(uploadId);
}

/**
 * Update upload session (for use by other endpoints)
 */
export function updateUploadSession(
  uploadId: string,
  updates: Partial<ReturnType<typeof getUploadSession>>
) {
  const session = activeUploads.get(uploadId);
  if (session) {
    activeUploads.set(uploadId, { ...session, ...updates });
  }
}

/**
 * Delete upload session (for use by other endpoints)
 */
export function deleteUploadSession(uploadId: string) {
  return activeUploads.delete(uploadId);
}
