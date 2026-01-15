/**
 * Single Session API - Get, Update, Delete Session
 *
 * GET /api/sessions/[id] - Get session details with messages
 * PUT /api/sessions/[id] - Update session
 * DELETE /api/sessions/[id] - Delete session
 *
 * All endpoints require authenticated user session and ownership verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sessionService } from '@/lib/services/session-service';
import type { ApiResponse, SessionDetailDTO, UpdateSessionRequest } from '@/types/session';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET - Get a specific session with all messages
 *
 * Returns 404 if session not found or user doesn't own it.
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
    const { id: sessionId } = await params;

    // Validate session ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Invalid session ID format',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get session
    const sessionData = await sessionService.getSessionById(sessionId, session.userId);

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Session not found',
          },
        } as ApiResponse,
        { status: 404 }
      );
    }

    const response: ApiResponse<SessionDetailDTO> = {
      success: true,
      data: sessionData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /sessions/[id] GET] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to fetch session',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a session
 *
 * Can update:
 * - title: string - Session title
 * - status: 'active' | 'completed' | 'aborted' - Session status
 * - sessionId: string | null - Claude SDK session ID
 * - messages: StoredMessage[] - Update messages array
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const { id: sessionId } = await params;

    // Validate session ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Invalid session ID format',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Parse request body
    const body: UpdateSessionRequest = await request.json();

    // Validate title if provided
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

    // Validate status if provided
    if (body.status !== undefined) {
      const validStatuses = ['active', 'completed', 'aborted'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: 'VALIDATION_ERROR',
              message: 'Invalid status value',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }
    }

    // Update session
    const updatedSession = await sessionService.updateSession(
      sessionId,
      session.userId,
      body
    );

    if (!updatedSession) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Session not found or you do not have permission to modify it',
          },
        } as ApiResponse,
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: updatedSession,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /sessions/[id] PUT] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to update session',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a session
 *
 * Returns 404 if session not found or user doesn't own it.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const { id: sessionId } = await params;

    // Validate session ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'Invalid session ID format',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Delete session
    const deleted = await sessionService.deleteSession(sessionId, session.userId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Session not found or you do not have permission to delete it',
          },
        } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /sessions/[id] DELETE] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to delete session',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
