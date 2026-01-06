import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { subscriptionService } from '@/lib/subscription/subscription.service';

/**
 * GET /api/subscription/usage
 *
 * Get current user's usage metrics
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

    const usageMetrics = await subscriptionService.getUsageMetrics(session.user.id);

    return NextResponse.json({
      success: true,
      usage: usageMetrics,
    });
  } catch (error) {
    console.error('Error fetching usage metrics:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取使用量失败' },
      { status: 500 }
    );
  }
}
