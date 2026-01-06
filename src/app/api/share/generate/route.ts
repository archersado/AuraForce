import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { privacyService } from '@/lib/privacy/privacy.service';

/**
 * POST /api/share/generate
 *
 * Generate a shareable link for content
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contentId, contentType, options } = body;

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (!['skill', 'businessModel'].includes(contentType)) {
      return NextResponse.json(
        { error: 'INVALID_TYPE', message: '无效的内容类型' },
        { status: 400 }
      );
    }

    const shareLink = await privacyService.generateShareLink(
      session.user.id,
      contentId,
      contentType,
      options
    );

    return NextResponse.json({
      success: true,
      shareLink,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    const message = error instanceof Error ? error.message : '生成分享链接失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
