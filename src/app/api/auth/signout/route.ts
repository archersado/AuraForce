/**
 * Logout API Endpoint
 *
 * POST /api/auth/signout
 *
 * Handles user logout and session deletion.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

/**
 * POST - Sign out current user
 */
export async function POST(request: NextRequest) {
  try {
    // Create a new NextResponse
    const response = NextResponse.json(
      {
        success: true,
        message: '注销成功',
      },
      { status: 200 }
    );

    // Clear the session cookie
    response.cookies.delete('auraforce-session');

    // Delete session from database
    await deleteSession();

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '注销失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
