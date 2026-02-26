/**
 * Workspace API Routes
 *
 * Implements Workspace File CRUD operations
 * Epic 14: Workspace Editor & File Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, readFileSync, writeFileSync, unlinkSync, statSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import path from 'path';

// Platform workspaces root
const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Validate file path to prevent directory traversal
 */
function validatePath(userPath: string, userId: string): { valid: boolean; fullPath: string } {
  const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, userId);
  const normalizedInput = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(userWorkspacePath, normalizedInput);

  // Check if the path is within the user's workspace
  const relativePath = path.relative(userWorkspacePath, fullPath);
  const valid = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);

  return { valid, fullPath };
}

/**
 * Generate file tree structure
 */
function generateFileTree(dirPath: string, userId: string, basePath: string = ''): any {
  const items = readdirSync(dirPath, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    const relativePath = path.join(basePath, item.name);
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      result.push({
        id: Buffer.from(relativePath).toString('base64'),
        name: item.name,
        path: '/' + relativePath.replace(/\\/g, '/'),
        type: 'folder',
        children: generateFileTree(fullPath, userId, relativePath),
      });
    } else {
      const stats = statSync(fullPath);
      result.push({
        id: Buffer.from(relativePath).toString('base64'),
        name: item.name,
        path: '/' + relativePath.replace(/\\/g, '/'),
        type: 'file',
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      });
    }
  }

  return result.sort((a: any, b: any) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
  });
}

/**
 * GET /api/workspace/files - List files in workspace
 * GET /api/workspace/files/:path - Get file content
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathParam = searchParams.get('path');

    // If path is provided, return file content (but for now return a mock response)
    if (pathParam) {
      // This is a GET for specific file - would be implemented by frontend differently
      return NextResponse.json({ error: 'Use GET /api/workspace/read with path param' }, { status: 400 });
    }

    // Return file tree
    const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, session.user.id);
    ensureDir(userWorkspacePath);

    const tree = generateFileTree(userWorkspacePath, session.user.id);

    return NextResponse.json({
      success: true,
      tree,
    });
  } catch (error) {
    console.error('[Workspace Files API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspace/files - Create new file/folder
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path, type = 'file', content = '' } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const { valid, fullPath } = validatePath(path, session.user.id);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Check if already exists
    if (existsSync(fullPath)) {
      return NextResponse.json({ error: 'Path already exists' }, { status: 409 });
    }

    if (type === 'folder') {
      mkdirSync(fullPath, { recursive: true });
    } else {
      ensureDir(path.dirname(fullPath));
      writeFileSync(fullPath, content, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: `${type === 'folder' ? 'Folder' : 'File'} created successfully`,
      path,
    });
  } catch (error) {
    console.error('[Workspace Files API] POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/workspace/files - Update file content
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path, content } = body;

    if (!path || content === undefined) {
      return NextResponse.json({ error: 'Path and content are required' }, { status: 400 });
    }

    const { valid, fullPath } = validatePath(path, session.user.id);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return NextResponse.json({ error: 'Cannot write to a directory' }, { status: 400 });
    }

    writeFileSync(fullPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
    });
  } catch (error) {
    console.error('[Workspace Files API] PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workspace/files - Delete file/folder
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathParam = searchParams.get('path');

    if (!pathParam) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const { valid, fullPath } = validatePath(pathParam, session.user.id);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    unlinkSync(fullPath);

    return NextResponse.json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (error) {
    console.error('[Workspace Files API] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
