/**
 * Custom Login API Endpoint
 *
 * POST /api/auth/login
 *
 * Validates credentials and creates a JWT session.
 * This bypasses the NextAuth client-side signIn function which has
 * basePath issues.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/custom-session';

/**
 * POST - Custom login endpoint that validates credentials and creates session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // Verify password
    const { compare } = await import('bcryptjs');
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // Password is correct - create JWT session cookie
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Logout endpoint
 */
export async function DELETE() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Logout API] Error:', error);
    return NextResponse.json(
      { success: false, error: '登出失败' },
      { status: 500 }
    );
  }
}
