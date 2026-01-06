/**
 * Claude Command Translation API
 *
 * POST /api/claude/translate
 *
 * Translates natural language input to structured CLI commands.
 */

import { NextRequest, NextResponse } from 'next/server';
import { translateCommand } from '@/lib/claude/translator';
import type { TranslationRequest, TranslationError } from '@/lib/claude/types';

/**
 * POST - Translate natural language to CLI command
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: TranslationRequest = await request.json();
    const { message, context } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Message is required and must be a string',
          },
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Message cannot be empty',
          },
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Message too long (max 5000 characters)',
          },
        },
        { status: 400 }
      );
    }

    // Translate the command
    const result = await translateCommand({ message, context });

    // Return successful translation
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Translation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Translation failed',
          details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - CORS support for future use
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }),
  });
}
