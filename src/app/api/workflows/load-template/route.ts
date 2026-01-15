/**
 * Workflow Template Load API
 *
 * Loads a workflow template and extracts it to the user's workspace.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { existsSync, mkdirSync } from 'fs';
import AdmZip from 'adm-zip';
import path from 'path';

/**
 * POST /api/workflows/load-template - Load a workflow template to workspace
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, projectName, workspacePath } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    if (!projectName) {
      return NextResponse.json(
        { error: 'projectName is required' },
        { status: 400 }
      );
    }

    // Platform root directory for user workspaces
    const PLATFORM_WORKSPACE_ROOT = process.cwd() + '/workspaces';

    // Get template info
    const prisma = (await import('@/lib/prisma')).prisma;
    const template = await prisma.workflowSpec.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (template.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Determine target workspace path
    const targetWorkspacePath = workspacePath
      ? workspacePath
      : path.join(PLATFORM_WORKSPACE_ROOT, session.userId, projectName);

    // Check if zip path exists
    const zipPath = template.ccPath;
    if (!existsSync(zipPath)) {
      return NextResponse.json(
        { error: `Template zip file not found at: ${zipPath}` },
        { status: 404 }
      );
    }

    // Extract template to workspace
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    // Ensure workspace directory exists
    if (!existsSync(targetWorkspacePath)) {
      mkdirSync(targetWorkspacePath, { recursive: true });
    }

    // Extract all files, maintaining the directory structure from the ZIP
    const extractedFiles: string[] = [];
    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        // The entryName may contain the full path from where the ZIP was created
        // We want to preserve the relative structure within the target workspace
        const entryPath = path.join(targetWorkspacePath, entry.entryName);
        const entryDir = path.dirname(entryPath);
        if (!existsSync(entryDir)) {
          mkdirSync(entryDir, { recursive: true });
        }
        zip.extractEntryTo(entry, targetWorkspacePath, true, true);
        extractedFiles.push(entry.entryName);
      }
    }

    // Check if project already exists, if not create it
    const existingProject = await prisma.userWorkspaceProject.findFirst({
      where: {
        userId: session.userId,
        name: projectName,
      },
    });

    if (!existingProject) {
      await prisma.userWorkspaceProject.create({
        data: {
          userId: session.userId,
          name: projectName,
          path: targetWorkspacePath,
          workflowTemplateId: templateId,
        },
      });
    } else {
      // Update existing project
      await prisma.userWorkspaceProject.update({
        where: { id: existingProject.id },
        data: {
          workflowTemplateId: templateId,
          lastOpenedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Template "${template.name}" loaded to workspace "${projectName}"`,
      projectName,
      workspacePath: targetWorkspacePath,
        extractedTemplates: extractedFiles.length,
    });
  } catch (error) {
    console.error('[Workflow Template Load] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
