import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { subscriptionService } from '@/lib/subscription/subscription.service';

/**
 * GET /api/subscription/history
 *
 * Get subscription and invoice history
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

    const [subscriptions, invoices] = await Promise.all([
      subscriptionService.getSubscriptionHistory(session.user.id),
      subscriptionService.getInvoiceHistory(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      subscriptions,
      invoices,
    });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '获取订阅历史失败' },
      { status: 500 }
    );
  }
}
