/**
 * Session API Endpoint
 *
 * GET /api/auth/session
 *
 * Returns the current session data using custom JWT-based sessions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';

/**
 * GET - Get current session
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      user: {
        id: session?.user?.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified?.toISOString() || null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('[Session API] Error:', error);
    return NextResponse.json(null);
  }
}
