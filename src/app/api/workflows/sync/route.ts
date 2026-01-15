/**
 * Sync Diagnostics API
 *
 * Provides endpoints for sync verification, diagnostics, and recovery.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { FileSystemSyncService, type SyncResult } from '@/lib/workflows/sync-service';

/**
 * GET /api/workflows/sync - Run sync diagnostics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const diagnostic = await FileSystemSyncService.getSyncDiagnostics(session.userId);

    return NextResponse.json({
      success: true,
      ...diagnostic,
    });
  } catch (error) {
    console.error('[Sync Diagnostics] Error:', error);
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
 * POST /api/workflows/sync - Trigger manual sync or recovery
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, workflowId, source } = body;

    switch (action) {
      case 'trigger':
        // Run sync for all workflows
        const diagnostic = await FileSystemSyncService.triggerSync(session.userId);
        return NextResponse.json({
          success: true,
          action: 'trigger',
          ...diagnostic,
        });

      case 'verify':
        // Verify sync for a specific workflow
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required for verify action' },
            { status: 400 }
          );
        }

        const result = await FileSystemSyncService.verifySync(workflowId);
        return NextResponse.json({
          success: true,
          action: 'verify',
          result,
        });

      case 'recover':
        // Recover a missing workflow
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required for recover action' },
            { status: 400 }
          );
        }

        const recoveryResult = await FileSystemSyncService.recoverWorkflow(workflowId);
        return NextResponse.json({
          success: true,
          action: 'recover',
          result: recoveryResult,
        });

      case 'detect-conflicts':
        // Detect all sync conflicts
        const conflicts = await FileSystemSyncService.detectConflicts(session.userId);
        return NextResponse.json({
          success: true,
          action: 'detect-conflicts',
          conflicts,
        });

      case 'resolve-conflict':
        // Resolve a specific conflict
        if (!workflowId || !source) {
          return NextResponse.json(
            { error: 'workflowId and source are required for resolve-conflict action' },
            { status: 400 }
          );
        }

        const resolution = await FileSystemSyncService.resolveConflict(workflowId, source);
        return NextResponse.json({
          success: true,
          action: 'resolve-conflict',
          result: resolution,
        });

      case 'update-status':
        // Update sync status manually
        if (!workflowId || !body.status) {
          return NextResponse.json(
            { error: 'workflowId and status are required for update-status action' },
            { status: 400 }
          );
        }

        const updated = await FileSystemSyncService.updateSyncStatus(workflowId, body.status);
        return NextResponse.json({
          success: updated,
          action: 'update-status',
          workflowId,
          status: body.status,
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Sync Action] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
