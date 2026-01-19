/**
 * User Workspace Projects API
 *
 * Manages user workspace projects (create, list, select, delete).
 * Projects are created in a platform root directory.
 */

import { NextRequest, NextResponse } from 'next/server';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth/session';

// Platform root directory for user workspaces
const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

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
 * Create a new project directory
 */
function createProjectDir(userId: string, projectName: string): string {
  const userWorkspacePath = ensureUserWorkspaceDir(userId);
  const projectPath = path.join(userWorkspacePath, projectName);

  if (existsSync(projectPath)) {
    return projectPath;
  }

  mkdirSync(projectPath, { recursive: true });
  return projectPath;
}

/**
 * GET /api/workspaces - List user workspace projects
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = (await import('@/lib/prisma')).prisma;
    const projects = await prisma.userWorkspaceProject.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Check which projects exist on disk
    const projectsWithStatus = await Promise.all(
      projects.map(async (project) => {
        const exists = existsSync(project.path);
        return {
          ...project,
          status: exists ? 'active' : 'missing',
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithStatus,
      count: projectsWithStatus.length,
    });
  } catch (error) {
    console.error('[Workspace Projects] Error:', error);
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
 * POST /api/workspaces - Create a new workspace project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Validate project name
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!sanitizedName) {
      return NextResponse.json(
        { error: 'Invalid project name' },
        { status: 400 }
      );
    }

    const prisma = (await import('@/lib/prisma')).prisma;

    // Check for duplicate project name
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
    const projectPath = createProjectDir(session.userId, sanitizedName);

    // Create project in database
    const project = await prisma.userWorkspaceProject.create({
      data: {
        userId: session.userId,
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
    console.error('[Workspace Projects Create] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
