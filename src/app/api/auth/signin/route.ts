/**
 * Login API Endpoint
 *
 * POST /api/auth/signin
 *
 * Handles user authentication and session creation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth/session';
import { sanitizeEmail } from '@/lib/auth/password-validation';
import { isDevelopment } from '@/lib/config';

/**
 * POST - Sign in user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Authenticate user
    const user = await authenticateUser(sanitizedEmail, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误', code: 'INVALID_CREDENTIALS' },
        { status: 400 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // User needs to verify email first
      return NextResponse.json(
        {
          success: false,
          message: '请先验证您的邮箱地址',
          code: 'UNVERIFIED_EMAIL',
        },
        { status: 400 }
      );
    }

    // Create session
    const sessionToken = await createSession(user.id, rememberMe);

    // Return success response
    return NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '登录失败，请稍后重试',
        error: isDevelopment() ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
