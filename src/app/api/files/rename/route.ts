/**
 * File Rename API Route
 *
 * Handles file and directory renaming.
 * - Validates new name uniqueness
 * - Prevents invalid characters
 * - Handles name conflicts
 */

import { NextRequest, NextResponse } from 'next/server';
import { rename, stat } from 'fs/promises';
import path from 'path';

// Rename file or directory
export async function POST(request: NextRequest) {
  try {
    const { currentPath, newName, workspaceRoot } = await request.json();

    if (!currentPath || !newName || !workspaceRoot) {
      return NextResponse.json(
        { error: 'Missing required fields: currentPath, newName, workspaceRoot' },
        { status: 400 }
      );
    }

    // Security: prevent path traversal
    // Normalize and remove leading slash to treat as relative to workspace root
    let safeCurrentPath = path
      .normalize(currentPath)
      .replace(/^(\.\.(\/|\\|$))+/, '');
    
    // Remove leading slash to ensure path is relative
    if (safeCurrentPath.startsWith('/')) {
      safeCurrentPath = safeCurrentPath.substring(1) || '.';
    }

    const safeNewName = path.basename(newName);
    if (safeNewName !== newName || safeNewName.includes('/') || safeNewName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file name. Special characters and path separators are not allowed.' },
        { status: 400 }
      );
    }

    // Validate name length
    if (safeNewName.length === 0 || safeNewName.length > 255) {
      return NextResponse.json(
        { error: 'File name must be between 1 and 255 characters' },
        { status: 400 }
      );
    }

    // Calculate old and new full paths
    const fullPath = path.join(workspaceRoot, safeCurrentPath);
    const directory = path.dirname(fullPath);
    const newPath = path.join(directory, safeNewName);

    // Check if source exists
    try {
      await stat(fullPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Source file or directory does not exist' },
        { status: 404 }
      );
    }

    // Check if destination already exists
    try {
      await stat(newPath);
      return NextResponse.json(
        { error: `A file or directory named "${safeNewName}" already exists in this location.` },
        { status: 409 } // Conflict
      );
    } catch (error) {
      // Destination doesn't exist, proceed with rename
    }

    // Perform rename
    await rename(fullPath, newPath);

    return NextResponse.json({
      success: true,
      message: `Successfully renamed to "${safeNewName}"`,
      oldPath: safeCurrentPath,
      newPath: path.join(directory, safeNewName).replace(/\\/g, '/'),
      filename: safeNewName,
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to rename file or directory',
        success: false,
      },
      { status: 500 }
    );
  }
}
