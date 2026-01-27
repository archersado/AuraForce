/**
 * Claude Session Messages API
 *
 * GET /api/claude/sessions/[sessionId]/messages?projectPath=xxx
 *
 * Returns the message history for a specific Claude session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getClaudeSessionMessages } from '@/lib/claude/project-sessions';
import type { ApiResponse, SessionDTO, StoredMessage, MessageRole } from '@/types/session';

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

/**
 * Convert Claude JSONL entry to StoredMessage format
 */
function jsonlEntryToStoredMessage(entry: any): StoredMessage {
  // Extract role and content
  let role: MessageRole = 'assistant';
  let content = '';

  if (entry.type === 'user' || entry.message?.role === 'user') {
    role = 'user';
  } else if (entry.type === 'system') {
    role = 'system';
  }

  // Handle content (could be string or array)
  if (typeof entry.message?.content === 'string') {
    content = entry.message.content;
  } else if (Array.isArray(entry.message?.content)) {
    // Handle structured content (e.g., images, text blocks)
    content = JSON.stringify(entry.message.content);
  } else if (entry.message) {
    content = JSON.stringify(entry.message);
  } else {
    content = JSON.stringify(entry);
  }

  return {
    id: entry.uuid || `msg-${Date.now()}-${Math.random()}`,
    role,
    content,
    timestamp: entry.timestamp || new Date().toISOString(),
  };
}

/**
 * GET - Get messages for a specific Claude session
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const projectPath = searchParams.get('projectPath');

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

    // Await params for Next.js 15
    const { sessionId } = await params;

    console.log('[API /claude/sessions/[id]/messages GET] sessionId:', sessionId, 'projectPath:', projectPath);

    // Get session messages from Claude's JSONL file
    const jsonlEntries = await getClaudeSessionMessages(projectPath, sessionId);

    // Convert to StoredMessage format
    const messages: StoredMessage[] = jsonlEntries.map(jsonlEntryToStoredMessage);

    const response: ApiResponse<{ sessionId: string; messages: StoredMessage[]; total: number }> = {
      success: true,
      data: {
        sessionId,
        messages,
        total: messages.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /claude/sessions/[id]/messages GET] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to fetch session messages',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
