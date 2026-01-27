/**
 * Claude Project Sessions API
 *
 * GET /api/claude/sessions?projectPath=xxx - Get Claude sessions for a project
 *
 * Lists Claude Code CLI sessions from ~/.claude/projects/ for a given project path.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getClaudeProjectSessions, getLatestClaudeSession } from '@/lib/claude/project-sessions';
import type { ApiResponse } from '@/types/session';

/**
 * Session DTO for Claude sessions
 */
export interface ClaudeSessionDTO {
  id: string;
  summary: string;
  messageCount: number;
  lastActivity: string;
  cwd: string;
  lastUserMessage?: string;
  lastAssistantMessage?: string;
}

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const projectPath = searchParams.get('projectPath');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const getLatest = searchParams.get('latest') === 'true';

    if (!projectPath) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'VALIDATION_ERROR',
            message: 'projectPath is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.log('[API /claude/sessions GET] projectPath:', projectPath);

    if (getLatest) {
      // Get only the latest session
      const latestSession = await getLatestClaudeSession(projectPath);

      const response: ApiResponse<ClaudeSessionDTO | null> = {
        success: true,
        data: latestSession
          ? {
              id: latestSession.id,
              summary: latestSession.summary,
              messageCount: latestSession.messageCount,
              lastActivity: latestSession.lastActivity.toISOString(),
              cwd: latestSession.cwd,
              lastUserMessage: latestSession.lastUserMessage,
              lastAssistantMessage: latestSession.lastAssistantMessage,
            }
          : null,
        latest: true,
      };

      return NextResponse.json(response);
    }

    // Get all sessions for the project
    const sessions = await getClaudeProjectSessions(projectPath);

    // Limit results
    const limitedSessions = sessions.slice(0, limit);

    const sessionsDTO: ClaudeSessionDTO[] = limitedSessions.map((session) => ({
      id: session.id,
      summary: session.summary,
      messageCount: session.messageCount,
      lastActivity: session.lastActivity.toISOString(),
      cwd: session.cwd,
      lastUserMessage: session.lastUserMessage,
      lastAssistantMessage: session.lastAssistantMessage,
    }));

    const response: ApiResponse<{ sessions: ClaudeSessionDTO[]; total: number }> = {
      success: true,
      data: {
        sessions: sessionsDTO,
        total: sessions.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /claude/sessions GET] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to fetch Claude sessions',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
