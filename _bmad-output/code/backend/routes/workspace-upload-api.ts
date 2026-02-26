/**
 * Workspace Upload API
 *
 * POST /api/workspace/upload - Upload files to workspace
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, mkdirSync, writeFile, statSync } from 'fs';
import path from 'path';

const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

/**
 * POST /api/workspace/upload - Upload one or multiple files
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const targetPath = formData.get('path') || '/';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, session.user.id);

    // Validate and normalize target path
    const normalizedTarget = path.normalize(targetPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const targetFullPath = path.join(userWorkspacePath, normalizedTarget);

    const relativePath = path.relative(userWorkspacePath, targetFullPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return NextResponse.json({ error: 'Invalid target path' }, { status: 403 });
    }

    // Ensure target directory exists
    if (!existsSync(targetFullPath)) {
      mkdirSync(targetFullPath, { recursive: true });
    }

    const uploadedFiles: Array<{
      name: string;
      originalName: string;
      path: string;
      size: number;
      type: string;
    }> = [];

    // Process each file
    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = file.name;
        const filePath = path.join(targetFullPath, fileName);

        // Check for duplicate, append number if needed
        let finalPath = filePath;
        let counter = 1;
        while (existsSync(finalPath)) {
          const ext = path.extname(fileName);
          const nameWithoutExt = path.basename(fileName, ext);
          finalPath = path.join(targetFullPath, `${nameWithoutExt}_${counter}${ext}`);
          counter++;
        }

        writeFile(finalPath, buffer);

        uploadedFiles.push({
          name: path.basename(finalPath),
          originalName: fileName,
          path: '/' + path.join(normalizedTarget, path.basename(finalPath)).replace(/\\/g, '/'),
          size: file.size,
          type: file.type,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('[Workspace Upload API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
