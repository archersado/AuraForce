import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';

/**
 * GET /api/tenant/[tenantId]/usage
 *
 * Get tenant usage statistics (requires MEMBER+)
 */
export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const { tenantId } = params;

    const usage = await tenantService.getTenantUsage(tenantId);

    return NextResponse.json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    const message = error instanceof Error ? error.message : '获取使用统计失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
