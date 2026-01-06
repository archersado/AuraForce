/**
 * Resend Verification Email API Endpoint
 *
 * POST /api/auth/resend-verification
 *
 * Resends verification email to user's email address.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateVerificationToken } from '@/lib/auth/password-validation';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST - Resend verification email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate request body
    if (!email) {
      return NextResponse.json(
        { success: false, message: '请提供邮箱地址' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在，请先注册' },
        { status: 404 }
      );
    }

    // If already verified, inform user
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: '邮箱已验证，可以直接登录' },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email.toLowerCase() },
    });

    // Generate new verification token
    const token = generateVerificationToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail({
      to: email.toLowerCase(),
      token,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          success: true,
          message: '验证邮件已发送（邮件服务未配置，请查看控制台获取验证码）',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '验证邮件已发送',
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '发送失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
