/**
 * Email Change Confirmation API Endpoint
 *
 * GET /api/user/change-email/confirm
 *
 * Handles email change verification and updates user's email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET - Confirm email change
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    // Validate query parameters
    if (!token || !userId) {
      return NextResponse.json(
        { success: false, message: '缺少必要的参数' },
        { status: 400 }
      );
    }

    // Find user with pending email change
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        pendingEmail: true,
        pendingEmailToken: true,
        pendingEmailExpires: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在', code: 'INVALID_TOKEN' },
        { status: 404 }
      );
    }

    // Check if there's a pending email change
    if (!user.pendingEmail || !user.pendingEmailToken) {
      return NextResponse.json(
        { success: false, message: '没有待处理的邮箱更改请求', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    // Verify token
    if (user.pendingEmailToken !== token) {
      return NextResponse.json(
        { success: false, message: '验证令牌无效', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    // Check if token expired
    if (user.pendingEmailExpires && user.pendingEmailExpires < new Date()) {
      // Clear pending email change
      await prisma.user.update({
        where: { id: userId },
        data: {
          pendingEmail: null,
          pendingEmailToken: null,
          pendingEmailExpires: null,
        },
      });

      return NextResponse.json(
        { success: false, message: '验证链接已过期', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      );
    }

    // Check if new email already exists (someone else might have registered)
    const existingUser = await prisma.user.findUnique({
      where: { email: user.pendingEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      // Clear pending email change
      await prisma.user.update({
        where: { id: userId },
        data: {
          pendingEmail: null,
          pendingEmailToken: null,
          pendingEmailExpires: null,
        },
      });

      return NextResponse.json(
        { success: false, message: '该邮箱地址已被使用' },
        { status: 409 }
      );
    }

    const oldEmail = user.email;
    const newEmail = user.pendingEmail;

    // Update user's email
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailExpires: null,
      },
    });

    // Send confirmation email to old email
    // await sendEmailChangeConfirmation(oldEmail, newEmail);

    console.log('Email change confirmed:');
    console.log('  User ID:', userId);
    console.log('  Old Email:', oldEmail);
    console.log('  New Email:', newEmail);

    // Return HTML response for browser display
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>邮箱更改成功 - AuraForce</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .success-card {
            background: white;
            border-radius: 16px;
            padding: 48px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .icon {
            width: 64px;
            height: 64px;
            background: #10B981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .icon svg {
            width: 32px;
            height: 32px;
            color: white;
          }
          h1 {
            color: #1F2937;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px;
          }
          p {
            color: #6B7280;
            font-size: 16px;
            margin: 0;
          }
          .email-display {
            background: #F3F4F6;
            border-radius: 8px;
            padding: 12px;
            margin: 24px 0;
            word-break: break-all;
            color: #1F2937;
            font-family: monospace;
          }
          button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 24px;
          }
          button:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="success-card">
          <div class="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1>邮箱更改成功</h1>
          <p>您的账户邮箱已成功更改为：</p>
          <div class="email-display">${newEmail}</div>
          <button onclick="window.close()">关闭窗口</button>
        </div>
        <script>
          // Auto-close after 3 seconds
          setTimeout(() => {
            window.close();
          }, 3000);
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('Email change confirmation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '邮箱更改失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
