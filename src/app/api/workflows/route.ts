/**
 * Workflow Specs List API Endpoint
 *
 * GET /api/workflows - Returns all workflow specs for the authenticated user
 * Supports pagination and filtering by status
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search');

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.userId,
    };

    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
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
          metadata: true,
          deployedAt: true,
          updatedAt: true,
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
