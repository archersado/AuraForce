import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';

/**
 * GET /api/tenant/[tenantId]
 *
 * Get tenant details (requires membership)
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

    // Get tenant details
    const tenant = await tenantService.getTenant(tenantId);

    // Get user's role in this tenant
    const user = await (await import('@/lib/prisma')).prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true, tenantRole: true },
    });

    if (!user || user.tenantId !== tenantId) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: '您不是此租户的成员' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      tenant,
      userRole: user.tenantRole,
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    const message = error instanceof Error ? error.message : '获取租户信息失败';

    if (message === 'Tenant not found') {
      return NextResponse.json(
        { error: 'NOT_FOUND', message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tenant/[tenantId]
 *
 * Update tenant details (requires ADMIN)
 */
export async function PATCH(
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

    const body = await request.json();
    const { tenantId } = params;

    const tenant = await tenantService.updateTenant(tenantId, session.user.id, body);

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    const message = error instanceof Error ? error.message : '更新租户信息失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
