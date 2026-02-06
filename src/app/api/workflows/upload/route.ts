/**
 * Workflow Upload API Endpoint
 *
 * Accepts multipart/form-data with workflow specification files,
 * validates them, and deploys to Claude Code directory.
 *
 * Task 2: Create File Upload API Endpoint
 * Task 6: Create Workflow Specs List API (GET)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { validateWorkflowSpecContent } from '@/lib/workflows/spec-validator';
import { deployWorkflow } from '@/lib/workflows/deployer';
import { requireAuth } from '@/lib/custom-session';
import { cookies } from 'next/headers';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

export async function POST(request: NextRequest) {
  try {
    // Debug: Check cookies first
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('auraforce-session');
    console.log('[Workflow Upload] Cookies:', {
      hasAuraforceSession: !!sessionToken,
      tokenValue: sessionToken?.value?.substring(0, 30) + '...',
      allCookies: cookieStore.getAll().map(c => c.name),
    });

    // Verify authentication using custom session
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }
    console.log('[Workflow Upload] Session:', {
      user: `${session?.user?.id} (${session.user.email})`,
      hasUserId: !!session?.user?.id,
    });

    const formData = await request.formData();
    const files = formData.getAll('files');

    // Get optional metadata from form (user-provided overrides)
    const workflowName = formData.get('workflowName') as string | undefined;
    const workflowDescription = formData.get('workflowDescription') as string | undefined;
    const visibility = formData.get('visibility') as string | undefined;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate visibility value
    const validVisibility = ['public', 'private'].includes(visibility || '') ? visibility : 'private';

    const results: Array<{
      fileName: string;
      success: boolean;
      workflowId?: string;
      ccPath?: string;
      error?: string;
      warnings?: string[];
    }> = [];

    let totalSize = 0;

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Check file size
      const fileSize = file.size;
      totalSize += fileSize;

      if (fileSize > MAX_FILE_SIZE) {
        results.push({
          fileName: file.name,
          success: false,
          error: `File size exceeds 5MB limit (${(fileSize / 1024 / 1024).toFixed(2)}MB)`,
        });
        continue;
      }

      // Check total size limit
      if (totalSize > MAX_TOTAL_SIZE) {
        results.push({
          fileName: file.name,
          success: false,
          error: 'Total upload size exceeds 50MB limit',
        });
        break;
      }

      // Read file content
      const content = await file.text();

      // Validate workflow spec
      const validation = validateWorkflowSpecContent(content);

      // Use provided name if available, otherwise use validated name
      const finalName = workflowName || validation.metadata?.name;
      const finalDescription = workflowDescription || validation.metadata?.description;

      if (!finalName || finalName.trim() === '') {
        results.push({
          fileName: file.name,
          success: false,
          error: 'Missing required workflow name',
          warnings: validation.warnings,
        });
        continue;
      }

      // Check for duplicate workflow name
      const existing = await prisma.workflowSpec.findFirst({
        where: {
          userId: session?.user?.id,
          name: finalName,
        },
      });

      if (existing) {
        results.push({
          fileName: file.name,
          success: false,
          error: `Workflow "${finalName}" already exists`,
          warnings: validation.warnings,
        });
        continue;
      }

      // Deploy to Claude Code directory
      const deployResult = await deployWorkflow(
        content,
        finalName,
        validation.metadata || {
          name: finalName,
          description: finalDescription || '',
          version: '1.0.0',
          author: session.user.name || 'Unknown',
          tags: [],
          requires: [],
          resources: [],
          agents: [],
        }
      );

      if (!deployResult.success) {
        results.push({
          fileName: file.name,
          success: false,
          error: `Deployment failed: ${deployResult.error}`,
          warnings: validation.warnings,
        });
        continue;
      }

      // Store metadata in database
      const workflowSpec = await prisma.workflowSpec.create({
        data: {
          name: finalName,
          description: finalDescription,
          version: validation.metadata?.version || '1.0.0',
          author: validation.metadata?.author || session.user.name || 'Unknown',
          ccPath: deployResult.ccPath,
          userId: session?.user?.id,
          status: 'deployed',
          visibility: validVisibility,
          metadata: {
            tags: validation.metadata?.tags || [],
            requires: validation.metadata?.requires || [],
            resources: validation.metadata?.resources?.map(r => ({ path: r.path, description: r.description })) || [],
            inputs: validation.metadata?.inputs || [],
            agents: validation.metadata?.agents || [],
            subWorkflows: validation.metadata?.subWorkflows || [],
          } as unknown as Prisma.InputJsonValue,
        },
      });

      results.push({
        fileName: file.name,
        success: true,
        workflowId: workflowSpec.id,
        ccPath: deployResult.ccPath,
        warnings: validation.warnings,
      });
    }

    // Summary
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      success: failCount === 0,
      message: `Processed ${results.length} file(s): ${successCount} deployed, ${failCount} failed`,
      results,
    }, {
      status: failCount === results.length ? 207 : (failCount > 0 ? 200 : 201),
    });

  } catch (error) {
    console.error('[Workflow Upload] Error:', error);
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
 * GET endpoint - List uploaded workflow specs
 *
 * Task 6: Create Workflow Specs List API
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate using custom session
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      userId: session?.user?.id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [workflows, total] = await Promise.all([
      prisma.workflowSpec.findMany({
        where,
        orderBy: { deployedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workflowSpec.count({ where }),
    ]);

    return NextResponse.json({
      workflows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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

/**
 * DELETE endpoint - Remove a workflow spec
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate using custom session
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const workflow = await prisma.workflowSpec.findFirst({
      where: {
        id,
        userId: session?.user?.id,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Delete from filesystem
    const { rm } = await import('fs/promises');
    try {
      await rm(workflow.ccPath, { recursive: true, force: true });
    } catch (error) {
      console.error('[Workflow Delete] Failed to delete directory:', error);
      // Continue with database deletion even if filesystem fails
    }

    // Delete from database
    await prisma.workflowSpec.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });

  } catch (error) {
    console.error('[Workflow Delete] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
