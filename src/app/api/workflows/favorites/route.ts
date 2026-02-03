/**
 * User Favorites API Endpoint
 *
 * GET /api/workflows/favorites - 查询当前用户的所有收藏工作流
 *
 * 支持分页、搜索和排序
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/workflows/favorites
 *
 * 查询用户的所有收藏工作流，支持分页、搜索和排序
 *
 * Query Parameters:
 * - page: 页码 (默认 1)
 * - limit: 每页数量 (默认 20)
 * - search: 搜索关键词（匹配工作流名称或描述）
 * - sortBy: 排序字段 (createdAt, name) (默认 createdAt)
 * - sortOrder: 排序方向 (asc, desc) (默认 desc)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 50,
 *     "totalPages": 3
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // 验证认证
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim() || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 验证排序字段
    const validSortFields = ['createdAt', 'name', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 验证排序方向
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Invalid sortOrder. Must be "asc" or "desc"',
        },
        { status: 400 }
      );
    }

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId: session.userId,
    };

    // 如果有搜索关键词，添加过滤条件
    if (search) {
      where.workflow = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      };
    }

    // 构建排序条件
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 查询收藏列表
    const [favorites, totalCount] = await Promise.all([
      prisma.workflowFavorite.findMany({
        where,
        include: {
          workflow: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              stats: {
                select: {
                  totalLoads: true,
                  favoriteCount: true,
                  rating: true,
                },
              },
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.workflowFavorite.count({ where }),
    ]);

    // 格式化返回数据
    const data = favorites.map((favorite) => ({
      id: favorite.workflow.id,
      name: favorite.workflow.name,
      description: favorite.workflow.description,
      version: favorite.workflow.version,
      author: favorite.workflow.author,
      ccPath: favorite.workflow.ccPath,
      status: favorite.workflow.status,
      visibility: favorite.workflow.visibility,
      deployedAt: favorite.workflow.deployedAt,
      updatedAt: favorite.workflow.updatedAt,
      user: {
        id: favorite.workflow.user.id,
        name: favorite.workflow.user.name,
        email: favorite.workflow.user.email,
      },
      stats: favorite.workflow.stats || {
        totalLoads: 0,
        favoriteCount: 0,
        rating: 0,
      },
      favoritedAt: favorite.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    return handleApiError(error);
  }
}
