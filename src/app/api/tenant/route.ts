import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';

/**
 * POST /api/tenant
 *
 * Create a new tenant
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
    const { name, description, settings = {} } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: '工作空间名称至少需要2个字符' },
        { status: 400 }
      );
    }

    const tenant = await tenantService.createTenant(
      session.user.id,
      {
        name: name.trim(),
        description: description?.trim(),
        settings,
      }
    );

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    const message = error instanceof Error ? error.message : '创建工作空间失败';

    // Handle specific errors
    if (message.includes('already has a tenant')) {
      return NextResponse.json(
        { error: 'ALREADY_HAS_TENANT', message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
