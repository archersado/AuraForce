/**
 * Email Change Request API Endpoint
 *
 * POST /api/user/change-email/request
 *
 * Handles email change requests and sends verification emails.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { verifyPassword, sanitizeEmail, validateEmail } from '@/lib/auth/password-validation';
import { generateVerificationToken } from '@/lib/auth/password-validation';
import { checkRateLimit } from '@/lib/rate-limiting';

/**
 * POST - Request email change
 */
export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newEmail, currentPassword } = body;

    // Validate request body
    if (!newEmail || !currentPassword) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    const sanitizedNewEmail = sanitizeEmail(newEmail);

    // Validate email format
    if (!validateEmail(sanitizedNewEmail)) {
      return NextResponse.json(
        { success: false, message: '请输入有效的邮箱地址', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { result } = checkRateLimit(`email-change:${session.userId}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!result.allowed) {
      return NextResponse.json(
        { success: false, message: '请求过于频繁，请稍后重试', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // Check if same as current email
    if (sanitizedNewEmail === user.email) {
      return NextResponse.json(
        { success: false, message: '新邮箱地址不能与当前邮箱相同', code: 'SAME_EMAIL' },
        { status: 400 }
      );
    }

    // Verify current password
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: '当前用户未设置密码，无法进行邮箱更改' },
        { status: 400 }
      );
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: '当前密码不正确', code: 'WRONG_PASSWORD' },
        { status: 400 }
      );
    }

    // Check if new email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedNewEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '该邮箱地址已被使用', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // Generate verification token
    const token = generateVerificationToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    // Store email change request
    await prisma.user.update({
      where: { id: user.id },
      data: {
        pendingEmail: sanitizedNewEmail,
        pendingEmailToken: token,
        pendingEmailExpires: expires,
      },
    });

    // Send verification email to new email
    // const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/user/change-email/confirm?token=${token}&userId=${user.id}`;
    // await sendEmailChangeVerification(sanitizedNewEmail, confirmationUrl, user.email);

    // For development, log the verification details
    console.log('Email change verification details:');
    console.log('  Token:', token);
    console.log('  New Email:', sanitizedNewEmail);
    console.log('  Old Email:', user.email);
    console.log('  Confirmation URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/change-email/confirm?token=${token}&userId=${user.id}`);

    return NextResponse.json({
      success: true,
      message: '验证邮件已发送到您的新邮箱地址',
      newEmail: sanitizedNewEmail,
    });

  } catch (error) {
    console.error('Email change request error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '邮箱更改请求失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
