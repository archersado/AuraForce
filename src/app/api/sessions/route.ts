/**
 * Sessions API - List and Create Sessions
 *
 * GET /api/sessions - List all sessions for current user
 * POST /api/sessions - Create a new session
 *
 * All endpoints require authenticated user session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sessionService } from '@/lib/services/session-service';
import type { ApiResponse, SessionsListResponse, SessionDTO, CreateSessionRequest } from '@/types/session';

/**
 * GET - List all sessions for authenticated user
 * Query params:
 * - limit: number of sessions to return (default: 50)
 * - offset: offset for pagination (default: 0)
 * - status: filter by status (optional)
 * - projectId: filter by project ID for project-specific sessions (optional)
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') || undefined;
    const projectId = searchParams.get('projectId') || undefined;

    // Get sessions
    const result = await sessionService.listSessions(session.userId, {
      limit,
      offset,
      status,
      projectId,
    });

    const response: ApiResponse<SessionsListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /sessions GET] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to fetch sessions',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new session
 * Body:
 * - title: optional session title
 * - skillId: optional skill ID to associate with
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body: CreateSessionRequest = await request.json();

    // Validate title length if provided
    if (body.title !== undefined && typeof body.title === 'string') {
      if (body.title.length === 0 || body.title.length > 200) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: 'VALIDATION_ERROR',
              message: 'Title must be between 1 and 200 characters',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }
    }

    // Create session
    const newSession = await sessionService.createSession(session.userId, body);

    const response: ApiResponse<SessionDTO> = {
      success: true,
      data: newSession,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('[API /sessions POST] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to create session',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
