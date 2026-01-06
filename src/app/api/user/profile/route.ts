/**
 * Profile Update API Endpoint
 *
 * PATCH /api/user/profile
 *
 * Handles user profile updates including name and avatar.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * PATCH - Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const avatarFile = formData.get('avatar') as File | null;

    // Collect updates
    const updates: Record<string, any> = {};

    if (name !== null && name !== undefined) {
      if (name.length > 100) {
        return NextResponse.json(
          { success: false, message: '显示名称不能超过 100 个字符' },
          { status: 400 }
        );
      }
      updates.name = name.trim() || null;
    }

    // Handle avatar upload
    if (avatarFile) {
      // Validate file size (max 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: '头像文件大小不能超过 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { success: false, message: '只支持 JPG、PNG、WebP 和 GIF 格式的图片' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = avatarFile.type.split('/')[1];
      const filename = `${session.userId}-${Date.now()}.${ext}`;

      // Ensure avatars directory exists
      const avatarsDir = join(process.cwd(), 'public', 'avatars');
      if (!existsSync(avatarsDir)) {
        await mkdir(avatarsDir, { recursive: true });
      }

      // Save file
      const filePath = join(avatarsDir, filename);
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      updates.image = `/avatars/${filename}`;
    }

    // Update user if there are changes
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '没有提供需要更新的内容',
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '个人资料更新成功',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
