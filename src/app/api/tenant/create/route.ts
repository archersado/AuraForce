import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';
import { CreateTenantDto } from '@/lib/tenant/config';

/**
 * POST /api/tenant/create
 *
 * Create a new tenant (requires ENTERPRISE subscription)
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
    const { name, description, settings } = body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: '租户名称不能为空' },
        { status: 400 }
      );
    }

    const tenantData: CreateTenantDto = {
      name: name.trim(),
      description: description?.trim(),
      settings,
    };

    const tenant = await tenantService.createTenant(session.user.id, tenantData);

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    const message = error instanceof Error ? error.message : '创建租户失败';

    if (message.includes('Enterprise subscription required')) {
      return NextResponse.json(
        { error: 'SUBSCRIPTION_REQUIRED', message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
