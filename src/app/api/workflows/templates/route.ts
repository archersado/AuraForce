/**
 * Workflow Template List API
 *
 * Lists available workflow templates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/workflows/templates - List available workflow templates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Fetch templates from database
    const prisma = (await import('@/lib/prisma')).prisma;
    const templates = await prisma.workflowSpec.findMany({
      where: {
        userId: session.userId,
        metadata: {
          path: '$.isTemplate',
          equals: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        version: true,
        author: true,
        metadata: true,
        deployedAt: true,
        updatedAt: true,
      },
      orderBy: {
        deployedAt: 'desc',
      },
    });

    const formattedTemplates = templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      version: t.version,
      author: t.author,
      icon: (t.metadata as any)?.icon || null,
      category: (t.metadata as any)?.category || 'General',
      templateUrl: (t.metadata as any)?.templateUrl,
      tags: (t.metadata as any)?.tags || [],
      requires: (t.metadata as any)?.requires || [],
      createdAt: t.deployedAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      templates: formattedTemplates,
      count: formattedTemplates.length,
    });
  } catch (error) {
    console.error('[Workflow Templates] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
