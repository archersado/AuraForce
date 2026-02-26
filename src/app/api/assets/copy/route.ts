/**
 * Copy Generated Assets to Workspace API Endpoint
 *
 * Accepts generated assets and copies them to the specified workspace project directory.
 * This endpoint integrates with the CC asset generation workflow to automatically
 * deploy generated code to the user's workspace.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { readFile } from 'fs/promises';

const PRISMA_BATCH_SIZE = 50;

/**
 * Asset file to be copied to workspace
 */
interface AssetFile {
  name: string;
  content: string;
  type: 'workflow' | 'subagent' | 'skill' | 'script';
  path?: string; // Custom path within workspace
  directory?: string; // Subdirectory within workspace (e.g., 'workflows', 'agents', 'src')
}

/**
 * Copy assets request
 */
interface CopyAssetsRequest {
  projectId?: string; // If specified, use the project's workspace path
  customPath?: string; // Custom workspace path
  assets: AssetFile[];
  createDirectory?: boolean; // Create subdirectories for organization
  directoryName?: string; // Name of the subdirectory to create
}

/**
 * Get a project's workspace path from database
 */
async function getProjectPath(projectId: string, userId: string): Promise<string | null> {
  try {
    const prisma = (await import('@/lib/prisma')).prisma;
    const project = await prisma.userWorkspaceProject.findFirst({
      where: {
        id: projectId,
        userId,
      },
      select: { path: true },
    });
    return project?.path || null;
  } catch (error) {
    console.error('[Assets Copy] Failed to get project path:', error);
    return null;
  }
}

/**
 * Get file extension based on asset type
 */
function getFileExtension(type: string): string {
  const extensions: Record<string, string> = {
    'workflow': 'md',
    'subagent': 'md',
    'skill': 'ts',
    'script': 'js',
    'typescript': 'ts',
    'javascript': 'js',
    'python': 'py',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
  };
  return extensions[type] || 'txt';
}

/**
 * Sanitize filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Ensure directory exists
 */
async function ensureDirectory(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Write a single asset file
 */
async function writeAssetFile(
  workspaceRoot: string,
  asset: AssetFile,
  baseDirectory: string = ''
): Promise<{ success: boolean; path: string; error?: string }> {
  try {
    // Determine the file path
    let fileName = asset.name;
    let ext = '';

    // Check if filename already has extension
    if (!fileName.includes('.')) {
      ext = '.' + getFileExtension(asset.type);
    }

    const safeName = sanitizeFilename(fileName);
    const finalFileName = safeName + ext;

    // Determine directory path
    let directoryPath = workspaceRoot;
    if (baseDirectory) {
      directoryPath = join(workspaceRoot, baseDirectory);
    }
    if (asset.directory) {
      directoryPath = join(directoryPath, asset.directory);
    }
    if (asset.path) {
      directoryPath = join(workspaceRoot, asset.path);
    }

    // Ensure directory exists
    await ensureDirectory(directoryPath);

    // Write the file
    const filePath = join(directoryPath, finalFileName);
    await writeFile(filePath, asset.content, 'utf-8');

    return {
      success: true,
      path: filePath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Assets Copy] Failed to write asset file:', error);
    return {
      success: false,
      path: asset.name,
      error: errorMessage,
    };
  }
}

/**
 * POST /api/assets/copy - Copy generated assets to workspace
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as CopyAssetsRequest;
    const { projectId, customPath, assets, createDirectory = true, directoryName } = body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return NextResponse.json(
        { error: 'No assets provided' },
        { status: 400 }
      );
    }

    // Determine the target workspace path
    let workspaceRoot = customPath;

    if (projectId && !workspaceRoot) {
      workspaceRoot = await getProjectPath(projectId, session.user.id);
      if (!workspaceRoot) {
        return NextResponse.json(
          { error: 'Project not found or no workspace path configured' },
          { status: 404 }
        );
      }
    }

    if (!workspaceRoot) {
      return NextResponse.json(
        { error: 'Either projectId or customPath must be provided' },
        { status: 400 }
      );
    }

    // Resolve and validate workspace path
    workspaceRoot = resolve(workspaceRoot);

    if (!existsSync(workspaceRoot)) {
      return NextResponse.json(
        { error: 'Workspace path does not exist' },
        { status: 404 }
      );
    }

    // Determine base directory structure
    let baseDirectory = '';
    if (createDirectory && directoryName) {
      baseDirectory = directoryName;
    } else if (createDirectory) {
      // Use a timestamp-based directory name
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      baseDirectory = `generated-assets-${timestamp}`;
    }

    // Write all assets
    const results: Array<{
      asset: string;
      success: boolean;
      path?: string;
      error?: string;
    }> = [];

    for (const asset of assets) {
      const result = await writeAssetFile(workspaceRoot, asset, baseDirectory);
      results.push({
        asset: asset.name,
        success: result.success,
        path: result.path,
        error: result.error,
      });
    }

    // Count successful and failed writes
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      success: failCount === 0,
      message: `Copied ${successCount} asset(s) to workspace${failCount > 0 ? `, ${failCount} failed` : ''}`,
      workspaceRoot,
      baseDirectory,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount,
      },
    });

  } catch (error) {
    console.error('[Assets Copy] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
