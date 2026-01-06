import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { subscriptionService } from '@/lib/subscription/subscription.service';

/**
 * GET /api/subscription/current
 *
 * Get current user's subscription details
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

    const [currentPlan, details, usageMetrics] = await Promise.all([
      subscriptionService.getCurrentPlan(session.user.id),
      subscriptionService.getSubscriptionDetails(session.user.id),
      subscriptionService.getUsageMetrics(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      plan: currentPlan,
      details,
      usage: usageMetrics,
    });
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取订阅信息失败' },
      { status: 500 }
    );
  }
}
