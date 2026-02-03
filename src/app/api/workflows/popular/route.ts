/**
 * Popular Workflows API Endpoint
 *
 * GET /api/workflows/popular - 获取热门工作流列表
 *
 * 按 stats.totalLoads + stats.favoriteCount 排序
 * 支持时间范围参数（7d, 30d, all）
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { handleApiError } from '@/lib/errors';

/**
 * GET /api/workflows/popular
 *
 * 查询热门工作流列表
 *
 * Query Parameters:
 * - period: 时间范围 (7d=最近7天, 30d=最近30天, all=全部) 默认: all
 * - limit: 返回数量 (默认 20, 最大 100)
 * - page: 页码 (默认 1)
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
 *
 * Authentication:
 * - 可选：如果用户已登录，可以查看所有公开工作流
 * - 如果有用户会话，也可以查看用户自己的私有工作流
 */
export async function GET(request: NextRequest) {
  try {
    // 验证认证（可选：公开数据也可以访问）
    const session = await getSession();
    const isAuthenticated = !!session?.userId;

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    // 验证 period 参数
    const validPeriods = ['7d', '30d', 'all'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: `Invalid period. Must be one of: ${validPeriods.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 构建 WHERE 条件
    const where: any = {
      visibility: 'public',
    };

    // 如果用户已登录，也可以查看用户的私有工作流
    if (isAuthenticated) {
      where.OR = [
        { visibility: 'public' },
        { userId: session.userId },
      ];
    }

    // 根据时间范围选择排序字段
    let orderBy: any;
    switch (period) {
      case '7d':
        // 按周加载次数降序
        orderBy = {
          stats: { weekLoads: 'desc' },
        };
        break;
      case '30d':
        // 按月加载次数降序
        orderBy = {
          stats: { monthLoads: 'desc' },
        };
        break;
      default:
        // 按总加载次数降序
        orderBy = {
          stats: { totalLoads: 'desc' },
        };
    }

    // 查询热门工作流
    const [workflows, totalCount] = await Promise.all([
      prisma.workflowSpec.findMany({
        where,
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
              weekLoads: true,
              monthLoads: true,
              favoriteCount: true,
              rating: true,
              ratingCount: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.workflowSpec.count({ where }),
    ]);

    // 计算热门度分数（用于二次排序，可选）
    // 热门度 = totalLoads * 1 + favoriteCount * 2
    const data = workflows.map((workflow) => {
      const stats = workflow.stats || {
        totalLoads: 0,
        weekLoads: 0,
        monthLoads: 0,
        favoriteCount: 0,
        rating: 0,
        ratingCount: 0,
      };

      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        version: workflow.version,
        author: workflow.author,
        ccPath: workflow.ccPath,
        status: workflow.status,
        visibility: workflow.visibility,
        deployedAt: workflow.deployedAt,
        updatedAt: workflow.updatedAt,
        metadata: workflow.metadata,
        user: workflow.user,
        stats: {
          ...stats,
          // 热门度分数（可选：用于前端显示或二次排序）
          popularityScore: stats.totalLoads * 1 + stats.favoriteCount * 2,
        },
      };
    });

    // 可选：对热门度分数进行二次排序（如果需要更复杂的排序逻辑）
    // data.sort((a, b) => b.stats.popularityScore - a.stats.popularityScore);

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
