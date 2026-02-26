/**
 * Abort Chunked Upload
 *
 * Cancels an ongoing chunked upload and cleans up temporary files.
 *
 * POST /api/workspace/upload/abort
 *    JSON Body: { uploadId }
 *
 * Response: {
 *   success: true,
 *   data: { message }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { rm } from 'fs/promises';
import path from 'path';
import {
  getUploadSession,
  deleteUploadSession,
} from '../init/route';

const UPLOAD_TEMP_DIR = '.workspace-uploads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uploadId } = body;

    console.log('[Upload Abort] Abort upload:', { uploadId });

    // Validate input
    if (!uploadId) {
      return NextResponse.json(
        { error: 'No upload ID provided' },
        { status: 400 }
      );
    }

    // Get upload session (for logging)
    const session = getUploadSession(uploadId);
    if (!session) {
      return NextResponse.json(
        {
          error: `Upload session ${uploadId} not found or already cleaned up`,
          success: true,
          data: { message: 'Upload session not found, already cleaned up' },
        },
        { status: 200 }
      );
    }

    // Cleanup temporary chunks directory
    const uploadTempDir = path.join(process.cwd(), 'temp', UPLOAD_TEMP_DIR, uploadId);
    try {
      await rm(uploadTempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('[Upload Abort] Failed to cleanup temp directory:', error);
      // Non-critical error, continue
    }

    // Delete upload session
    deleteUploadSession(uploadId);

    console.log('[Upload Abort] Upload aborted and cleaned up:', {
      uploadId,
      filename: session.filename,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: `Upload for ${session.filename} aborted and cleaned up`,
        uploadId,
        filename: session.filename,
      },
    });
  } catch (error) {
    console.error('[Upload Abort] Abort error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to abort upload',
        success: false,
      },
      { status: 500 }
    );
  }
}
