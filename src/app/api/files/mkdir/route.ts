/**
 * Create Directory API Route
 *
 * Handles directory creation with validation.
 * Features:
 * - Path validation
 * - Duplicate prevention
 * - Recursive creation
 */

import { NextRequest, NextResponse } from 'next/server';
import { mkdir, stat } from 'fs/promises';
import path from 'path';

// Create a new directory in workspace
export async function POST(request: NextRequest) {
  try {
    const { targetPath, directoryName } = await request.json();

    // Validate inputs
    if (!targetPath || typeof targetPath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid target path' },
        { status: 400 }
      );
    }

    if (!directoryName || typeof directoryName !== 'string') {
      return NextResponse.json(
        { error: 'Directory name is required' },
        { status: 400 }
      );
    }

    // Security: prevent path traversal
    // Normalize and remove leading slash to treat as relative to workspace root
    let safePath = path
      .normalize(targetPath)
      .replace(/^(\.\.(\/|\\|$))+/, '');
    
    // Remove leading slash to ensure path is relative
    if (safePath.startsWith('/')) {
      safePath = safePath.substring(1) || '.';
    }

    // Get workspace root from environment
    const workspaceRoot = process.env.WORKSPACE_ROOT || '/tmp/workspace';

    // Validate directory name
    const safeDirName = directoryName.trim();
    if (safeDirName.length === 0) {
      return NextResponse.json(
        { error: 'Directory name cannot be empty' },
        { status: 400 }
      );
    }

    // Check for invalid characters
    const invalidChars = /[<>:"|/\\\*\?]/;
    if (invalidChars.test(safeDirName)) {
      return NextResponse.json(
        { error: 'Directory name contains invalid characters' },
        { status: 400 }
      );
    }

    // Generate full path
    const fullPath = path.join(workspaceRoot, safePath, safeDirName);

    // Check if parent directory exists
    const parentPath = path.dirname(fullPath);
    try {
      await stat(parentPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Parent directory does not exist' },
        { status: 404 }
      );
    }

    // Check if directory already exists
    try {
      await stat(fullPath);
      return NextResponse.json(
        { error: `Directory "${safeDirName}" already exists` },
        { status: 409 }
      );
    } catch (error) {
      // Directory doesn't exist, proceed with creation
    }

    // Create directory
    await mkdir(fullPath, { recursive: true });

    // Return success with new directory path
    return NextResponse.json({
      success: true,
      message: `Directory "${safeDirName}" created successfully`,
      path: path.join(safePath, safeDirName).replace(/\\/g, '/'),
      fullPath,
    });
  } catch (error) {
    console.error('Create directory error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create directory',
        success: false,
      },
      { status: 500 }
    );
  }
}
