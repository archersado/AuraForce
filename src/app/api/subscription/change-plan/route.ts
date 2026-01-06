import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { subscriptionService } from '@/lib/subscription/subscription.service';
import { SubscriptionLevel, BillingCycle } from '@/lib/subscription/plans';

/**
 * POST /api/subscription/change-plan
 *
 * Update user's subscription plan
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
    const { targetPlan, billingCycle = 'monthly' } = body;

    // Validate inputs
    if (!targetPlan || !Object.values(SubscriptionLevel).includes(targetPlan)) {
      return NextResponse.json(
        { error: 'INVALID_PLAN', message: '无效的订阅套餐' },
        { status: 400 }
      );
    }

    if (!['monthly', 'quarterly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'INVALID_BILLING_CYCLE', message: '无效的计费周期' },
        { status: 400 }
      );
    }

    // Change plan
    const result = await subscriptionService.changePlan(
      session.user.id,
      targetPlan as SubscriptionLevel,
      billingCycle as BillingCycle
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error changing plan:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '更改订阅套餐失败' },
      { status: 500 }
    );
  }
}
