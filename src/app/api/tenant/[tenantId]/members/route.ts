import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';

/**
 * GET /api/tenant/[tenantId]/members
 *
 * Get all tenant members (requires MEMBER+)
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

    const members = await tenantService.getTenantMembers(tenantId);

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    const message = error instanceof Error ? error.message : '获取成员列表失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
