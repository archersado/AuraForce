/**
 * User Workspace Projects API
 *
 * Manages user workspace directories.
 * Projects are stored in: workspaces/{userId}/
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, mkdirSync } from 'fs';
import AdmZip from 'adm-zip';
import path from 'path';

// Platform workspaces root
const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

export interface ProjectStatus {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: 'active' | 'missing';
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Ensure workspace directory exists
 */
function ensureUserWorkspaceDir(userId: string): string {
  const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, userId);

  if (!existsSync(userWorkspacePath)) {
    mkdirSync(userWorkspacePath, { recursive: true });
  }

  return userWorkspacePath;
}

/**
 * GET /api/workspaces - List user workspace projects
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const prisma = (await import('@/lib/prisma')).prisma;
    const projects = await prisma.userWorkspaceProject.findMany({
      where: { userId: session?.user?.id },
      orderBy: { createdAt: 'desc' as const },
    });

    // Check which projects exist on disk
    const projectStatuses: ProjectStatus[] = await Promise.all(
      projects.map(async (project): Promise<ProjectStatus> => {
        const exists = existsSync(project.path);

        return {
          id: project.id,
          name: project.name,
          path: project.path,
          description: project.description,
          status: exists ? 'active' : 'missing',
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectStatuses,
      count: projectStatuses.length,
    });
  } catch (error) {
    console.error('[Workspaces API] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspaces - Create new workspace project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, workflowTemplateId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Sanitize project name - keep Chinese characters and most UTF-8 characters
    // Only replace characters that are unsafe for file systems: / \ : * ? " < > |
    const sanitizedName = name.trim().replace(/[\\/:*?"<>|]/g, '_');

    if (!sanitizedName) {
      return NextResponse.json(
        { error: 'Invalid project name' },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const prisma = (await import('@/lib/prisma')).prisma;
    const existing = await prisma.userWorkspaceProject.findFirst({
      where: {
        userId: session?.user?.id,
        name: sanitizedName,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Project "${sanitizedName}" already exists` },
        { status: 409 }
      );
    }

    // Create project directory on disk
    const userWorkspacePath = ensureUserWorkspaceDir(session?.user?.id);
    const projectPath = path.join(userWorkspacePath, sanitizedName);

    if (!existsSync(projectPath)) {
      mkdirSync(projectPath, { recursive: true });
    }

    // Extract workflow template if provided
    let extractedFiles: string[] = [];
    if (workflowTemplateId) {
      const template = await prisma.workflowSpec.findUnique({
        where: { id: workflowTemplateId },
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      // Allow loading public templates or own templates
      if (template.userId !== session?.user?.id && template.visibility !== 'public') {
        return NextResponse.json(
          { error: 'Access denied to template' },
          { status: 403 }
        );
      }

      // Check if zip path exists
      const zipPath = template.ccPath;
      console.log('[Workspaces API] Template zip path:', zipPath);

      if (existsSync(zipPath)) {
        try {
          // Extract template to workspace
          const zip = new AdmZip(zipPath);
          const zipEntries = zip.getEntries();

          console.log('[Workspaces API] Extracting', zipEntries.length, 'entries from template');

          // Extract all files, maintaining the directory structure from the ZIP
          for (const entry of zipEntries) {
            if (!entry.isDirectory) {
              const entryPath = path.join(projectPath, entry.entryName);
              const entryDir = path.dirname(entryPath);

              // Create directory if it doesn't exist
              if (!existsSync(entryDir)) {
                mkdirSync(entryDir, { recursive: true });
              }

              zip.extractEntryTo(entry, projectPath, true, true);
              extractedFiles.push(entry.entryName);
              console.log('[Workspaces API] Extracted:', entry.entryName);
            }
          }

          console.log('[Workspaces API] Successfully extracted', extractedFiles.length, 'files');
        } catch (error) {
          console.error('[Workspaces API] Failed to extract template:', error);
          // Continue with project creation even if extraction fails
        }
      } else {
        console.warn('[Workspaces API] Template zip file not found:', zipPath);
      }
    }

    // Create project in database
    const project = await prisma.userWorkspaceProject.create({
      data: {
        userId: session?.user?.id,
        workflowTemplateId: workflowTemplateId || null,
        name: sanitizedName,
        path: projectPath,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Project "${sanitizedName}" created successfully${workflowTemplateId ? ` with ${extractedFiles.length} files from template` : ''}`,
      project,
      extractedFilesCount: extractedFiles.length,
    });
  } catch (error) {
    console.error('[Workspaces API] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
