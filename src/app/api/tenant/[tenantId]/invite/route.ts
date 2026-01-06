import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';
import { TenantRole } from '@/lib/tenant/rbac.service';

/**
 * POST /api/tenant/[tenantId]/invite
 *
 * Invite a new member (requires ADMIN)
 */
export async function POST(
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
    const { email, role = TenantRole.MEMBER } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL', message: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    if (!Object.values(TenantRole).includes(role)) {
      return NextResponse.json(
        { error: 'INVALID_ROLE', message: '无效的角色' },
        { status: 400 }
      );
    }

    const invitation = await tenantService.inviteMember(tenantId, session.user.id, email, role as TenantRole);

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error inviting member:', error);
    const message = error instanceof Error ? error.message : '邀请成员失败';

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
