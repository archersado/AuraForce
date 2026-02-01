/**
 * User Workspace Projects API
 *
 * Manages user workspace directories.
 * Projects are stored in: workspaces/{userId}/
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { existsSync, mkdirSync } from 'fs';
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
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const prisma = (await import('@/lib/prisma')).prisma;
    const projects = await prisma.userWorkspaceProject.findMany({
      where: { userId: session.userId },
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
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

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
        userId: session.userId,
        name: sanitizedName,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Project "${sanitizedName}" already exists` },
        { status: 409 }
      );
    }

    // Create project directory
    const userWorkspacePath = ensureUserWorkspaceDir(session.userId);
    const projectPath = path.join(userWorkspacePath, sanitizedName);

    // Create project in database
    const project = await prisma.userWorkspaceProject.create({
      data: {
        userId: session.userId,
        workflowTemplateId: null,
        name: sanitizedName,
        path: projectPath,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Project "${sanitizedName}" created successfully`,
      project,
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
