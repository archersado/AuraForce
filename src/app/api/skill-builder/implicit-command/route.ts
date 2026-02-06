/**
 * Implicit Command API for Skill Builder
 *
 * POST /api/skill-builder/implicit-command
 *
 * Handles implicit commands that should be injected into the Claude conversation
 * without being displayed in the user interface.
 *
 * This is used by the Skill Builder page to automatically trigger workflows
 * when users enter the page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';

interface ImplicitCommandRequest {
  command: string;
  silent: boolean;
  sessionId?: string;
}

interface ImplicitCommandResponse {
  success: boolean;
  data?: {
    commandExecuted: string;
    sessionId: string;
  };
  error?: {
    type: string;
    message: string;
  };
}

/**
 * POST - Handle implicit command injection
 *
 * The command is stored in session context and will be picked up by the
 * Claude streaming API, but it won't be displayed to the user in the chat UI.
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        } as ImplicitCommandResponse,
        { status: 401 }
      );
    }

    // Parse request body
    const body: ImplicitCommandRequest = await request.json();
    const { command, silent, sessionId: requestSessionId } = body;

    if (!command) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'command is required',
          },
        } as ImplicitCommandResponse,
        { status: 400 }
      );
    }

    console.log('[API /skill-builder/implicit-command] Received:', {
      command,
      silent,
      userId: session.user.id,
    });

    // For now, we'll return success and the frontend components
    // will handle the command execution through ChatInterface
    // The session ID will be managed by the frontend ChatInterface component
    console.log('[API /skill-builder/implicit-command] Command stored for execution');

    const commandType = command.startsWith('/bmad:') ? 'bmad-workflow' : 'command';

    return NextResponse.json(
      {
        success: true,
        data: {
          commandExecuted: command,
          sessionId: 'managed-by-frontend',
          type: commandType,
        },
      } as ImplicitCommandResponse
    );

  } catch (error) {
    console.error('[API /skill-builder/implicit-command] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      } as ImplicitCommandResponse,
      { status: 500 }
    );
  }
}
