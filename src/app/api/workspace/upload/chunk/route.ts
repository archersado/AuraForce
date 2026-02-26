/**
 * Upload Chunk Endpoint
 *
 * Uploads a single chunk of a chunked file upload.
 *
 * POST /api/workspace/upload/chunk
 *    FormData: {
 *      chunk: File,
 *      chunkIndex: number,
 *      uploadId: string
 *    }
 *
 * Response: {
 *   success: true,
 *   data: {
 *     uploadId,
 *     chunkIndex,
 *     chunksReceived,
 *     totalChunks
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, rm } from 'fs/promises';
import path from 'path';
import {
  getUploadSession,
  updateUploadSession,
  deleteUploadSession,
} from '../init/route';

const UPLOAD_TEMP_DIR = '.workspace-uploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const chunkFile = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const uploadId = formData.get('uploadId') as string;

    console.log('[Chunk Upload] Upload chunk:', {
      uploadId,
      chunkIndex,
      chunkSize: chunkFile?.size,
    });

    // Validate input
    if (!chunkFile) {
      return NextResponse.json(
        { error: 'No chunk file provided' },
        { status: 400 }
      );
    }

    if (isNaN(chunkIndex) || chunkIndex < 0) {
      return NextResponse.json(
        { error: 'Invalid chunk index' },
        { status: 400 }
      );
    }

    if (!uploadId) {
      return NextResponse.json(
        { error: 'No upload ID provided' },
        { status: 400 }
      );
    }

    // Get upload session
    const session = getUploadSession(uploadId);
    if (!session) {
      return NextResponse.json(
        { error: `Upload session ${uploadId} not found or expired` },
        { status: 404 }
      );
    }

    // Validate chunk index
    if (chunkIndex < 0 || chunkIndex >= session.totalChunks) {
      return NextResponse.json(
        {
          error: `Chunk index ${chunkIndex} out of range (0-${session.totalChunks - 1})`,
        },
        { status: 400 }
      );
    }

    // Check if chunk already received
    if (session.chunksReceived.has(chunkIndex)) {
      console.log('[Chunk Upload] Chunk already received, skipping:', {
        uploadId,
        chunkIndex,
      });
      return NextResponse.json({
        success: true,
        data: {
          uploadId,
          chunkIndex,
          chunksReceived: session.chunksReceived.size,
          totalChunks: session.totalChunks,
          skipped: true,
        },
      });
    }

    // Save chunk to temporary directory
    const uploadTempDir = path.join(process.cwd(), 'temp', UPLOAD_TEMP_DIR, uploadId);
    const chunkPath = path.join(uploadTempDir, `chunk-${chunkIndex}`);

    try {
      const bytes = await chunkFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(chunkPath, buffer);
    } catch (error) {
      console.error('[Chunk Upload] Failed to write chunk:', error);
      return NextResponse.json(
        { error: 'Failed to save chunk' },
        { status: 500 }
      );
    }

    // Update session with received chunk
    session.chunksReceived.add(chunkIndex);
    updateUploadSession(uploadId, {
      chunksReceived: session.chunksReceived,
    });

    console.log('[Chunk Upload] Chunk uploaded successfully:', {
      uploadId,
      chunkIndex,
      chunksReceived: session.chunksReceived.size,
      totalChunks: session.totalChunks,
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadId,
        chunkIndex,
        chunksReceived: session.chunksReceived.size,
        totalChunks: session.totalChunks,
      },
    });
  } catch (error) {
    console.error('[Chunk Upload] Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload chunk',
        success: false,
      },
      { status: 500 }
    );
  }
}
