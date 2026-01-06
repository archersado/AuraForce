import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { subscriptionService } from '@/lib/subscription/subscription.service';
import { getAllPlans } from '@/lib/subscription/plans';

/**
 * GET /api/subscription/plans
 *
 * Get all available plans with comparison
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

    const [allPlans, currentPlan] = await Promise.all([
      getAllPlans(),
      subscriptionService.getCurrentPlan(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      plans: allPlans,
      currentPlan,
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取套餐信息失败' },
      { status: 500 }
    );
  }
}
