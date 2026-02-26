/**
 * Finalize Chunked Upload
 *
 * Combines all uploaded chunks into the final file and cleans up temporary files.
 *
 * POST /api/workspace/upload/finalize
 *    JSON Body: { uploadId }
 *
 * Response: {
 *   success: true,
 *   data: {
 *     filename,
 *     filePath,
 *     fullPath,
 *     size
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, stat, rm } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  getUploadSession,
  deleteUploadSession,
} from '../init/route';

const UPLOAD_TEMP_DIR = '.workspace-uploads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uploadId } = body;

    console.log('[Upload Finalize] Finalize upload:', { uploadId });

    // Validate input
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

    // Validate all chunks received
    if (session.chunksReceived.size !== session.totalChunks) {
      return NextResponse.json(
        {
          error: `Not all chunks received. Expected: ${session.totalChunks}, Received: ${session.chunksReceived.size}`,
          missingChunks: [...Array(session.totalChunks).keys()].filter(
            (i) => !session.chunksReceived.has(i)
          ),
        },
        { status: 400 }
      );
    }

    // Assemble file from chunks
    const uploadTempDir = path.join(process.cwd(), 'temp', UPLOAD_TEMP_DIR, uploadId);
    const chunks: Buffer[] = [];

    // Read all chunks in order
    for (let i = 0; i < session.totalChunks; i++) {
      const chunkPath = path.join(uploadTempDir, `chunk-${i}`);
      try {
        const chunkBuffer = await readFile(chunkPath);
        chunks.push(chunkBuffer);
      } catch (error) {
        console.error('[Upload Finalize] Failed to read chunk:', i, error);
        return NextResponse.json(
          {
            error: `Failed to read chunk ${i}`,
            success: false,
          },
          { status: 500 }
        );
      }
    }

    // Combine all chunks
    const fileBuffer = Buffer.concat(chunks);

    // Generate unique filename
    const extension = path.extname(session.filename);
    const baseName = path.basename(session.filename, extension);
    const timestamp = Date.now();
    const fileUuid = uuidv4();
    const safeFileName = `${baseName}-${timestamp}-${fileUuid}${extension}`;

    // Build final file path
    const finalDir = path.join(session.workspaceRoot, session.targetPath);
    const finalPath = path.join(finalDir, safeFileName);

    // Ensure target directory exists
    try {
      await mkdir(finalDir, { recursive: true });
    } catch (error) {
      console.error('[Upload Finalize] Failed to create target directory:', error);
      return NextResponse.json(
        { error: 'Failed to create target directory' },
        { status: 500 }
      );
    }

    // Write final file
    try {
      await writeFile(finalPath, fileBuffer);
    } catch (error) {
      console.error('[Upload Finalize] Failed to write final file:', error);
      return NextResponse.json(
        { error: 'Failed to write final file' },
        { status: 500 }
      );
    }

    // Get file stats
    const fileStat = await stat(finalPath);

    // Cleanup temporary chunks directory
    try {
      await rm(uploadTempDir, { recursive: true });
    } catch (error) {
      console.error('[Upload Finalize] Failed to cleanup temp directory:', error);
      // Non-critical error, continue
    }

    // Delete upload session
    deleteUploadSession(uploadId);

    // Return relative file path from workspace root
    const relativePath = path.join(session.targetPath, safeFileName);

    console.log('[Upload Finalize] Upload finalized successfully:', {
      filename: session.filename,
      filePath: relativePath,
      size: fileStat.size,
    });

    return NextResponse.json({
      success: true,
      data: {
        filename: session.filename,
        filePath: relativePath,
        fullPath: finalPath,
        size: fileStat.size,
        mimeType: session.fileType,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Upload Finalize] Finalization error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to finalize upload',
        success: false,
      },
      { status: 500 }
    );
  }
}
