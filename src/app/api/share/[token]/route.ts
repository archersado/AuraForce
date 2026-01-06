import { NextResponse } from 'next/server';
import { privacyService } from '@/lib/privacy/privacy.service';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/share/[token]
 *
 * Validate and access shared content (public endpoint)
 */
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Get IP and user agent for logging
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate the share token
    const validation = await privacyService.validateShareLink(
      token,
      ip,
      userAgent
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'INVALID_TOKEN', message: '分享链接无效或已过期' },
        { status: 404 }
      );
    }

    // Fetch the content
    const contentId = validation.contentId!;
    const contentType = validation.contentType!;

    let content;
    if (contentType === 'skill') {
      content = await prisma.skill.findUnique({
        where: { id: contentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    if (!content) {
      return NextResponse.json(
        { error: 'CONTENT_NOT_FOUND', message: '内容不存在' },
        { status: 404 }
      );
    }

    // Apply privacy settings
    const privacySettings = await prisma.userPrivacySettings.findUnique({
      where: { userId: content.userId },
    });

    const displayUser = {
      id: content.user.id,
      name: privacySettings?.showRealName ? content.user.name : null,
    };

    return NextResponse.json({
      success: true,
      contentType,
      content,
      displayUser,
    });
  } catch (error) {
    console.error('Error accessing shared content:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '访问分享内容失败' },
      { status: 500 }
    );
  }
}
