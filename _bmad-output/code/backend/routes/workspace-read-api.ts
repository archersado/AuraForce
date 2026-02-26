/**
 * Workspace Read API
 *
 * GET /api/workspace/read - Read file content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';

const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

/**
 * GET /api/workspace/read?path=/filename - Read file content
 */
export async function GET(request: NextRequest) {
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

    // Validate path to prevent directory traversal
    const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, session.user.id);
    const normalizedInput = path.normalize(pathParam).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(userWorkspacePath, normalizedInput);

    const relativePath = path.relative(userWorkspacePath, fullPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return NextResponse.json({ error: 'Cannot read directory' }, { status: 400 });
    }

    const content = readFileSync(fullPath, 'utf-8');

    return NextResponse.json({
      success: true,
      path: normalizedInput,
      content,
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    });
  } catch (error) {
    console.error('[Workspace Read API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
