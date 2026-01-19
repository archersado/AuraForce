/**
 * Project Sessions API - Get Latest Session for a Project
 *
 * GET /api/sessions/project/[projectId]/latest - Get the latest (most recent) session for a project
 *
 * Returns the most recently updated session for the specified project.
 * Used for auto-restoring the last session when entering a workspace.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sessionService } from '@/lib/services/session-service';
import type { ApiResponse, SessionDTO } from '@/types/session';

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

/**
 * GET - Get the latest session for a specific project
 *
 * Returns the most recently updated session for the project.
 * If no sessions exist for the project, returns null.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated session
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Await params for Next.js 15
    const { projectId } = await params;

    // Validate project ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Invalid project ID format',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get sessions for this project, ordered by updatedAt desc, limit to 1
    const result = await sessionService.listSessions(session.userId, {
      projectId,
      limit: 1,
    });

    const latestSession = result.sessions.length > 0 ? result.sessions[0] : null;

    const response: ApiResponse<SessionDTO | null> = {
      success: true,
      data: latestSession,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /sessions/project/[projectId]/latest GET] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to fetch latest session',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
