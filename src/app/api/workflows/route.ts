/**
 * Workflow Specs List API Endpoint
 *
 * GET /api/workflows - Returns all workflow specs
 * Supports pagination, filtering by status/visibility, and search
 * Public workflows visible without authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication (optional for public workflows)
    const session = await getSession();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search');

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // If user is authenticated, show their private workflows and public workflows
    if (session?.userId) {
      where.OR = [
        { userId: session.userId },
        { visibility: 'public' },
      ];
    } else {
      // If not authenticated, only show public workflows
      where.visibility = 'public';
    }

    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }

    if (search) {
      const searchCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ]
      };
      
      if (session?.userId) {
        where.OR = [
          { userId: session.userId },
          { visibility: 'public', ...searchCondition },
        ];
      } else {
        where.visibility = 'public';
        where.AND = searchCondition;
      }
    }

    // Fetch workflows with pagination
    const [workflows, totalCount] = await Promise.all([
      prisma.workflowSpec.findMany({
        where,
        orderBy: { deployedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          description: true,
          version: true,
          author: true,
          ccPath: true,
          status: true,
          visibility: true,
          userId: true,
          metadata: true,
          deployedAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
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
      }),
      prisma.workflowSpec.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: workflows,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('[Workflow List] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
