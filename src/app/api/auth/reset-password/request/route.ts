/**
 * Reset Password Request API Endpoint
 *
 * POST /api/auth/reset-password/request
 *
 * Handles password reset requests and sends reset tokens via email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateVerificationToken, sanitizeEmail, validateEmail } from '@/lib/auth/password-validation';
import { checkRateLimit, PASSWORD_RESET_RATE_LIMIT } from '@/lib/rate-limiting';
import { sendPasswordResetEmail } from '@/lib/email';

/**
 * POST - Request password reset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: '请输入您的邮箱地址' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { result, retryAfter } = checkRateLimit(
      `password-reset:${ip}`,
      PASSWORD_RESET_RATE_LIMIT
    );

    // Set rate limit headers
    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toUTCString(),
    };

    // Rate limit exceeded
    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: '请求过于频繁，请稍后重试',
          code: 'RATE_LIMITED',
          retryAfter,
        },
        { status: 429, headers }
      );
    }

    // Check if user exists (but don't reveal this for security)
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json(
        {
          success: true,
          message: '如果该邮箱地址已注册，我们已发送密码重置链接到您的邮箱',
        },
        { headers }
      );
    }

    // Delete any existing reset tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: sanitizedEmail },
    });

    // Generate reset token
    const token = generateVerificationToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: sanitizedEmail,
        token,
        expires,
      },
    });

    // Send reset email
    const emailSent = await sendPasswordResetEmail({
      to: sanitizedEmail,
      token,
    });

    // For development, also log the token if not sent
    if (!emailSent) {
      console.log('Password reset token:', token);
      console.log('Reset URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`);
    }

    let message = '如果该邮箱地址已注册，我们已发送密码重置链接到您的邮箱';
    if (!emailSent) {
      message += '（邮件服务未配置，请查看控制台获取验证码）';
    }

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { headers }
    );

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '处理失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
