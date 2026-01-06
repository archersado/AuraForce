/**
 * Reset Password Confirmation API Endpoint
 *
 * POST /api/auth/reset-password/confirm
 *
 * Handles password reset confirmation and updates user password.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validatePassword, hashPassword } from '@/lib/auth/password-validation';
import { sanitizeEmail } from '@/lib/auth/password-validation';

/**
 * POST - Confirm password reset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword, confirmPassword } = body;

    // Validate request body
    if (!email || !token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.errors.join('，'), code: 'WEAK_PASSWORD' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: '两次输入的密码不一致', code: 'PASSWORD_MISMATCH' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: sanitizedEmail,
          token,
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: '重置链接无效', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: sanitizedEmail,
            token,
          },
        },
      });
      return NextResponse.json(
        { success: false, message: '重置链接已过期', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // Check if new password is same as current password
    if (user.password) {
      const bcrypt = await import('bcryptjs');
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { success: false, message: '新密码不能与当前密码相同' },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    // Delete the used reset token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: sanitizedEmail,
          token,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '密码重置成功，现在可以使用新密码登录',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '密码重置失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
