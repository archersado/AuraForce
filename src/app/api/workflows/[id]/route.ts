/**
 * Workflow Spec Delete API Endpoint
 *
 * DELETE /api/workflows/[id] - Removes a workflow spec from both database and CC directory
 *
 * PATCH /api/workflows/[id] - Updates workflow spec properties (e.g., visibility)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { removeWorkflow } from '@/lib/workflows/deployer';
import { getSession } from '@/lib/auth/session';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get workflow ID
    const { id } = await params;

    // Verify authentication
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (workflow.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Remove from Claude Code directory
    const removeResult = await removeWorkflow(workflow.name);

    if (!removeResult.success) {
      console.error('[Workflow Delete] Failed to remove from CC directory:', removeResult.error);
    }

    // Delete from database
    await prisma.workflowSpec.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Workflow "${workflow.name}" deleted successfully`,
    });

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

/**
 * PATCH /api/workflows/[id] - Update workflow spec properties
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get workflow ID
    const { id } = await params;

    // Verify authentication
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { visibility } = body;

    // Validate visibility value
    if (visibility && !['public', 'private'].includes(visibility)) {
      return NextResponse.json(
        { error: 'Invalid visibility value. Must be "public" or "private"' },
        { status: 400 }
      );
    }

    // Find workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (workflow.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update workflow
    const updateData: any = {};
    if (visibility) {
      updateData.visibility = visibility;
    }

    const updatedWorkflow = await prisma.workflowSpec.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Workflow updated successfully',
      data: updatedWorkflow,
    });

  } catch (error) {
    console.error('[Workflow Update] Error:', error);
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
 * GET /api/workflows/[id] - Get workflow spec details
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get workflow ID
    const { id } = await params;

    // Verify authentication
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Verify ownership or public visibility
    if (workflow.userId !== session.userId && workflow.visibility !== 'public') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workflow,
    });

  } catch (error) {
    console.error('[Workflow Get] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
