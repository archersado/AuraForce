/**
 * Workflow Favorite API Endpoint
 *
 * POST /api/workflows/[id]/favorite - 收藏/取消收藏工作流 (切换状态)
 * GET /api/workflows/[id]/favorite - 查询工作流收藏状态
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { NotFoundError, AppError } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workflows/[id]/favorite
 *
 * 查询工作流的收藏状态
 *
 * Response:
 * {
 *   "success": true,
 *   "isFavorited": true
 * }
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 验证认证
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 查询工作流是否存在
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
      select: {
        id: true,
        visibility: true,
        userId: true,
      },
    });

    if (!workflow) {
      throw new NotFoundError('Workflow');
    }

    // 验证权限：私有工作流只能被创建者查看
    if (workflow.visibility === 'private' && workflow.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 查询收藏状态
    const favorite = await prisma.workflowFavorite.findUnique({
      where: {
        userId_workflowId: {
          userId: session.userId,
          workflowId: id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      isFavorited: !!favorite,
    });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }

    console.error('[Workflow Favorite GET] Error:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows/[id]/favorite
 *
 * 收藏/取消收藏工作流（切换状态）
 *
 * Request Body:
 * {
 *   "isFavorited": boolean  // true=收藏, false=取消收藏
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "isFavorited": true
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: workflowId } = await params;

    // 验证认证
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { isFavorited } = body;

    // 验证参数
    if (typeof isFavorited !== 'boolean') {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'isFavorited must be a boolean',
        },
        { status: 400 }
      );
    }

    // 查询工作流是否存在
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id: workflowId },
      select: {
        id: true,
        name: true,
        visibility: true,
        userId: true,
      },
    });

    if (!workflow) {
      throw new NotFoundError('Workflow');
    }

    // 验证权限：只能收藏公开工作流或自己的私有工作流
    if (workflow.visibility === 'private' && workflow.userId !== session.userId) {
      return NextResponse.json(
        {
          error: 'FORBIDDEN',
          message: 'Cannot favorite private workflows owned by others',
        },
        { status: 403 }
      );
    }

    // 不能收藏自己的工作流（可选，根据需求决定）
    // if (workflow.userId === session.userId) {
    //   return NextResponse.json(
    //     { error: 'VALIDATION_ERROR', message: 'Cannot favorite your own workflow' },
    //     { status: 400 }
    //   );
    // }

    if (isFavorited) {
      // 收藏工作流
      await prisma.workflowFavorite.create({
        data: {
          userId: session.userId,
          workflowId,
        },
      });

      console.log(`[Workflow Favorite] User ${session.userId} favorited workflow ${workflowId}`);

      // 更新统计信息：增加收藏数
      try {
        await prisma.workflowStats.update({
          where: { workflowId },
          data: {
            favoriteCount: { increment: 1 },
          },
        });
        console.log(`[Workflow Favorite] Updated stats for workflow ${workflowId}: +1 favorite`);
      } catch (statsError) {
        // 如果统计表不存在，创建它
        if (
          statsError instanceof Error &&
          statsError.message.includes('WorkflowStats')
        ) {
          console.log(`[Workflow Favorite] Creating stats for workflow ${workflowId}`);
          await prisma.workflowStats.create({
            data: {
              workflowId,
              favoriteCount: 1,
              totalLoads: 0,
              todayLoads: 0,
              weekLoads: 0,
              monthLoads: 0,
              lastUsedAt: new Date(),
            },
          });
        } else {
          console.error('[Workflow Favorite] Failed to update stats:', statsError);
        }
      }
    } else {
      // 取消收藏工作流
      await prisma.workflowFavorite.deleteMany({
        where: {
          userId: session.userId,
          workflowId,
        },
      });

      console.log(`[Workflow Favorite] User ${session.userId} unfavorited workflow ${workflowId}`);

      // 更新统计信息：减少收藏数
      try {
        await prisma.workflowStats.update({
          where: { workflowId },
          data: {
            favoriteCount: { decrement: 1 },
          },
        });
        console.log(`[Workflow Favorite] Updated stats for workflow ${workflowId}: -1 favorite`);
      } catch (statsError) {
        console.error('[Workflow Favorite] Failed to update stats:', statsError);
      }
    }

    // 更新缓存（如果使用了缓存）
    // await invalidateFavoriteCache(workflowId);

    return NextResponse.json({
      success: true,
      isFavorited,
      message: isFavorited
        ? `Workflow "${workflow.name}" has been added to favorites`
        : `Workflow "${workflow.name}" has been removed from favorites`,
    });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }

    console.error('[Workflow Favorite POST] Error:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workflows/[id]/favorite
 *
 * 取消收藏工作流（显式删除）
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Workflow has been removed from favorites"
 * }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: workflowId } = await params;

    // 验证认证
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 取消收藏工作流
    const result = await prisma.workflowFavorite.deleteMany({
      where: {
        userId: session.userId,
        workflowId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError('Favorite relationship');
    }

    console.log(`[Workflow Favorite] User ${session.userId} unfavorited workflow ${workflowId}`);

    // 更新统计信息：减少收藏数
    try {
      await prisma.workflowStats.update({
        where: { workflowId },
        data: {
          favoriteCount: { decrement: 1 },
        },
      });
      console.log(`[Workflow Favorite] Updated stats for workflow ${workflowId}: -1 favorite`);
    } catch (statsError) {
      console.error('[Workflow Favorite] Failed to update stats:', statsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow has been removed from favorites',
    });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }

    console.error('[Workflow Favorite DELETE] Error:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
