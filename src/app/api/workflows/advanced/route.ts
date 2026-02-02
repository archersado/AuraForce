/**
 * Enhanced Workflow Spec API with Intelligent Retrieval
 *
 * Provides advanced query capabilities, caching, and bulk operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { FileSystemSyncService } from '@/lib/workflows/sync-service';

// Simple in-memory cache (in production, use Redis or similar)
const specCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/workflows/search - Advanced search with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all';
    const syncStatus = searchParams.get('syncStatus') || 'all';
    const tags = searchParams.get('tags');
    const sortBy = searchParams.get('sortBy') || 'deployedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeDependencies = searchParams.get('includeDependencies') === 'true';

    // Build cache key
    const cacheKey = `${session.userId}:${query}:${status}:${syncStatus}:${tags}:${sortBy}:${sortOrder}:${page}:${limit}`;

    // Check cache
    const cached = specCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data);
    }

    // Build where clause
    const where: any = {
      OR: [
        { userId: session.userId },
        { visibility: 'public' },
      ],
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (status !== 'all') {
      where.status = status;
    }

    if (syncStatus !== 'all') {
      where.syncStatus = syncStatus;
    }

    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      where.metadata = {
        path: '$.tags',
        array_contains: tagsArray,
      };
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch workflows
    const [workflows, totalCount] = await Promise.all([
      prisma.workflowSpec.findMany({
        where,
        orderBy,
        take: Math.min(limit, 100),
        skip: (page - 1) * Math.min(limit, 100),
        select: includeDependencies ? {
          id: true,
          name: true,
          description: true,
          version: true,
          author: true,
          ccPath: true,
          ccPathVersion: true,
          status: true,
          syncStatus: true,
          metadata: true,
          deployedAt: true,
          lastSyncAt: true,
          updatedAt: true,
          dependencies: {
            select: {
              id: true,
              sourceWorkflowId: true,
              targetWorkflowId: true,
              dependencyType: true,
              targetWorkflow: {
                select: { id: true, name: true, version: true },
              },
            },
          },
        } : {
          id: true,
          name: true,
          description: true,
          version: true,
          author: true,
          ccPath: true,
          ccPathVersion: true,
          status: true,
          syncStatus: true,
          metadata: true,
          deployedAt: true,
          lastSyncAt: true,
          updatedAt: true,
          dependencies: false,
        },
      }),
      prisma.workflowSpec.count({ where }),
    ]);

    const response = {
      success: true,
      data: workflows,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    // Cache response
    specCache.set(cacheKey, { data: response, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Workflow Search] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows/batch - Bulk operations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { operation, workflowIds, data } = body;

    if (!operation || !Array.isArray(workflowIds)) {
      return NextResponse.json(
        { error: 'Invalid request: operation and workflowIds are required' },
        { status: 400 }
      );
    }

    // Verify ownership of all workflows
    const workflows = await prisma.workflowSpec.findMany({
      where: {
        id: { in: workflowIds },
        userId: session.userId,
      },
    });

    if (workflows.length !== workflowIds.length) {
      return NextResponse.json(
        { error: 'Some workflows not found or access denied' },
        { status: 403 }
      );
    }

    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    switch (operation) {
      case 'delete':
        for (const workflow of workflows) {
          try {
            // Delete file system content
            const { rm } = await import('fs/promises');
            try {
              await rm(workflow.ccPath, { recursive: true, force: true });
            } catch {
              // Ignore file system errors
            }

            // Delete from database
            await prisma.workflowSpec.delete({
              where: { id: workflow.id },
            });

            // Invalidate cache
            specCache.clear();

            results.push({ id: workflow.id, success: true });
          } catch (error) {
            results.push({
              id: workflow.id,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
        break;

      case 'update':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for update operation' },
            { status: 400 }
          );
        }

        for (const workflow of workflows) {
          try {
            await prisma.workflowSpec.update({
              where: { id: workflow.id },
              data,
            });

            // Invalidate cache
            specCache.clear();

            results.push({ id: workflow.id, success: true });
          } catch (error) {
            results.push({
              id: workflow.id,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
        break;

      case 'sync':
        for (const workflow of workflows) {
          try {
            const syncResult = await FileSystemSyncService.verifySync(workflow.id);
            results.push({
              id: workflow.id,
              success: syncResult.syncStatus === 'synced',
              error: syncResult.syncStatus === 'synced' ? undefined : syncResult.details,
            });
          } catch (error) {
            results.push({
              id: workflow.id,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
        break;

      default:
        return NextResponse.json(
          { error: `Unknown operation: ${operation}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      operation,
      results,
      summary: {
        total: results.length,
        succeeded: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    });
  } catch (error) {
    console.error('[Workflow Batch] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
