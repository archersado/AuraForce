import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { privacyService } from '@/lib/privacy/privacy.service';

/**
 * DELETE /api/share/[token]/revoke
 *
 * Revoke a share link
 */
export async function DELETE(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const { token } = params;

    // Find the share token by token string
    const prisma = (await import('@/lib/prisma')).prisma;
    const shareToken = await prisma.shareToken.findUnique({
      where: { token },
    });

    if (!shareToken) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: '分享链接不存在' },
        { status: 404 }
      );
    }

    if (shareToken.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: '无权操作此分享链接' },
        { status: 403 }
      );
    }

    await privacyService.revokeShareLink(session.user.id, shareToken.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error revoking share link:', error);
    const message = error instanceof Error ? error.message : '撤销分享链接失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
