import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { privacyService } from '@/lib/privacy/privacy.service';

/**
 * PATCH /api/content/[contentId]/visibility
 *
 * Toggle content visibility (private/public)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contentId } = params;
    const { isPublic, contentType } = body;

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'isPublic 必须是布尔值' },
        { status: 400 }
      );
    }

    if (!['skill', 'businessModel'].includes(contentType)) {
      return NextResponse.json(
        { error: 'INVALID_TYPE', message: '无效的内容类型' },
        { status: 400 }
      );
    }

    await privacyService.toggleContentVisibility(
      session.user.id,
      contentId,
      isPublic,
      contentType
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating content visibility:', error);
    const message = error instanceof Error ? error.message : '更新可见性失败';

    if (message === 'Content not found or access denied') {
      return NextResponse.json(
        { error: 'FORBIDDEN', message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
