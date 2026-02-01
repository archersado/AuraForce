/**
 * File Move API Route
 *
 * Handles file and directory moving.
 * - Source and destination paths
 * - Path validation
 * - Conflict handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { stat, rename, mkdir } from 'fs/promises';
import path from 'path';

// Move file or directory
export async function POST(request: NextRequest) {
  try {
    const { sourcePath, destinationPath, workspaceRoot } = await request.json();

    if (!sourcePath || !destinationPath || !workspaceRoot) {
      return NextResponse.json(
        { error: 'Missing required fields: sourcePath, destinationPath, workspaceRoot' },
        { status: 400 }
      );
    }

    // Security: prevent path traversal
    const safeSource = path
      .normalize(sourcePath)
      .replace(/^(\.\.(\/|\\|$))+/, '');

    const safeDest = path
      .normalize(destinationPath)
      .replace(/^(\.\.(\/|\\|$))+/, '');

    if (!safeSource || !safeDest) {
      return NextResponse.json(
        { error: 'Invalid source or destination path' },
        { status: 400 }
      );
    }

    // Validate paths are different
    if (safeSource === safeDest) {
      destinationPath: safeDest
      return NextResponse.json(
        { error: 'Source and destination paths are the same' },
        { status: 400 }
      );
    }

    // Calculate full paths
    const workspaceDir = process.env.WORKSPACE_ROOT || '/tmp/workspace';
    const sourceFullPath = path.join(workspaceDir, safeSource);
    const destParentPath = path.dirname(safeDest);
    const destName = path.basename(safeDest);
    const destFullPath = path.join(workspaceDir, safeDest);

    // Check source exists
    try {
      await stat(sourceFullPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Source file or directory does not exist' },
        { status: 404 }
      );
    }

    // Check if destination exists (conflict)
    try {
      await stat(destFullPath);
      return NextResponse.json(
        { error: `Destination "${destName}" already exists` },
        { status: 409 } // Conflict
      );
    } catch (error) {
      // Destination doesn't exist, proceed with move
    }

    // Ensure destination directory exists
    try {
      const destDir = destParentPath === '/' ? workspaceDir : path.join(workspaceDir, destParentPath);
      await stat(destDir);
    } catch (error) {
      // Create destination directory if it doesn't exist
      const destDir = destParentPath === '/' ? workspaceDir : path.join(workspaceDir, destParentPath);
      await mkdir(destDir, { recursive: true });
    }

    // Perform move (rename operation)
    const sourceName = path.basename(safeSource);
    const finalDestPath = path.join(destParentPath, sourceName);
    const finalFullPath = path.join(workspaceDir, finalDestPath);

    await rename(sourceFullPath, finalFullPath);

    return NextResponse.json({
      success: true,
      message: `Successfully moved to "${path.join(destParentPath, sourceName)}"`,
      oldPath: safeSource,
      newPath: path.join(destParentPath, sourceName).replace(/\\/g, '/'),
      filename: sourceName,
    });
  } catch (error) {
    console.error('File move error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to move file or directory',
        success: false,
      },
      { status: 500 }
    );
  }
}
