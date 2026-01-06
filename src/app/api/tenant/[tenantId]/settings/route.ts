import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { tenantService } from '@/lib/tenant/tenant.service';

/**
 * PATCH /api/tenant/[tenantId]/settings
 *
 * Update tenant settings (requires ADMIN)
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
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: '无效的设置数据' },
        { status: 400 }
      );
    }

    const tenant = await tenantService.updateSettings(tenantId, session.user.id, settings);

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    const message = error instanceof Error ? error.message : '更新租户设置失败';

    if (message.includes('Permission denied')) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message },
        { status: 403 }
      );
    }

    if (message.includes('Invalid settings')) {
      return NextResponse.json(
        { error: 'INVALID_SETTINGS', message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message },
      { status: 500 }
    );
  }
}
