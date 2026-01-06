import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { privacyService } from '@/lib/privacy/privacy.service';

/**
 * GET /api/user/privacy
 *
 * Get user's privacy settings
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

    const settings = await privacyService.getPrivacySettings(session.user.id);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取隐私设置失败' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/privacy
 *
 * Update user's privacy settings
 */
export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const allowedKeys = [
      'allowPublicProfile',
      'allowSearchIndexing',
      'showEmail',
      'showRealName',
      'thirdPartyDataSharing',
      'marketingEmails',
      'analyticsEnabled',
      'defaultSkillVisibility',
    ];

    const invalidKeys = Object.keys(body).filter(key => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: '无效的字段: ' + invalidKeys.join(', ') },
        { status: 400 }
      );
    }

    const settings = await privacyService.updatePrivacySettings(session.user.id, body);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '更新隐私设置失败' },
      { status: 500 }
    );
  }
}
