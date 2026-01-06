import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { privacyService } from '@/lib/privacy/privacy.service';

/**
 * GET /api/share/my
 *
 * Get all share links for the current user
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const shareLinks = await privacyService.getUserShareLinks(session.user.id);

    return NextResponse.json({
      success: true,
      shareLinks,
    });
  } catch (error) {
    console.error('Error fetching share links:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取分享链接失败' },
      { status: 500 }
    );
  }
}
