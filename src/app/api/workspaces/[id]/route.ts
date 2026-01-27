/**
 * Workspace Project API
 *
 * - GET /api/workspaces/[id] - Get a single project
 * - DELETE /api/workspaces/[id] - Delete a workspace project
 */

import { NextRequest, NextResponse } from 'next/server';
import { rmSync, existsSync } from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/workspaces/[id] - Get a single project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const prisma = (await import('@/lib/prisma')).prisma;

    // Find the project
    const project = await prisma.userWorkspaceProject.findFirst({
      where: {
        id: projectId,
        userId: session.userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if project directory exists
    const directoryExists = existsSync(project.path);

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        status: directoryExists ? 'active' : 'missing',
      },
    });
  } catch (error) {
    console.error('[Workspace Get] Error:', error);
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
 * DELETE /api/workspaces/[id] - Delete a workspace project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const prisma = (await import('@/lib/prisma')).prisma;

    // Find the project
    const project = await prisma.userWorkspaceProject.findFirst({
      where: {
        id: projectId,
        userId: session.userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete from file system if it exists
    if (existsSync(project.path)) {
      try {
        rmSync(project.path, { recursive: true, force: true });
      } catch (error) {
        console.warn('[Workspace Delete] Failed to delete directory:', error);
        // Continue with database deletion even if file system deletion fails
      }
    }

    // Delete from database
    await prisma.userWorkspaceProject.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: `Project "${project.name}" deleted successfully`,
    });
  } catch (error) {
    console.error('[Workspace Delete] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
