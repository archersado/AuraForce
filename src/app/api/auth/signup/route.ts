/**
 * Registration API Endpoint
 *
 * POST /api/auth/signup
 *
 * Handles user registration, password validation, and email verification.
 */

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { validatePassword, hashPassword, isCommonPassword, sanitizeEmail, validateEmail, generateVerificationToken } from '@/lib/auth/password-validation';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST - Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validate request body
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // Validate email format
    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.errors.join('，'),
        },
        { status: 400 }
      );
    }

    // Check for common passwords
    if (isCommonPassword(password)) {
      return NextResponse.json(
        { success: false, message: '请选择更安全的密码' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: '两次输入的密码不一致' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '该邮箱已被注册' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: name || null,
        emailVerified: null,
        password: hashedPassword,
      },
    });

    // Generate verification token
    const token = generateVerificationToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: sanitizedEmail,
        token,
        expires,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail({
      to: sanitizedEmail,
      token,
    });

    let message = '注册成功！';
    if (emailSent) {
      message += '验证邮件已发送到您的邮箱';
    } else {
      message += '验证邮件已发送（邮件服务未配置，请查看控制台获取验证码）';
    }

    return NextResponse.json({
      success: true,
      message,
      userId: user.id,
      requireVerification: true,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '注册失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
