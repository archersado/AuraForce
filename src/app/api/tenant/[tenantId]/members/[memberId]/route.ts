import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';
import { TenantRole } from '@/lib/tenant/rbac.service';

/**
 * PATCH /api/tenant/[tenantId]/members/[memberId]/role
 *
 * Update member role (requires ADMIN)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { tenantId: string; memberId: string } }
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
    const { tenantId, memberId } = params;
    const { role } = body;

    if (!Object.values(TenantRole).includes(role)) {
      return NextResponse.json(
        { error: 'INVALID_ROLE', message: '无效的角色' },
        { status: 400 }
      );
    }

    await tenantService.updateMemberRole(tenantId, session.user.id, memberId, role as TenantRole);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    const message = error instanceof Error ? error.message : '更新成员角色失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tenant/[tenantId]/members/[memberId]/remove
 *
 * Remove member from tenant (requires ADMIN)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { tenantId: string; memberId: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: '请先登录' },
        { status: 401 }
      );
    }

    const { tenantId, memberId } = params;

    await tenantService.removeMember(tenantId, session.user.id, memberId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error removing member:', error);
    const message = error instanceof Error ? error.message : '移除成员失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
