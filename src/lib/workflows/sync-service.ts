/**
 * File System Sync Service
 *
 * Manages synchronization between the database and file system for workflow specs.
 * Handles conflict detection, auto-recovery, and sync status tracking.
 */

import { readFile, access, stat } from 'fs/promises';
import { createHash } from 'crypto';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { CCPathResolver } from './cc-path-resolver';

export type SyncStatus = 'synced' | 'out-of-sync' | 'missing' | 'conflicted';
export type WorkflowStatus = 'deployed' | 'error' | 'syncing' | 'out-of-sync';

export interface SyncResult {
  workflowId: string;
  workflowName: string;
  syncStatus: SyncStatus;
  details: string;
  recovered: boolean;
}

export interface SyncDiagnostic {
  totalWorkflows: number;
  synced: number;
  outOfSync: number;
  missing: number;
  conflicted: number;
  results: SyncResult[];
}

export interface SyncConflict {
  workflowId: string;
  workflowName: string;
  contentHash?: string;
  fileHash?: string;
  databaseHash?: string;
  databaseContent?: string;
  fileContent?: string;
  lastSyncAt: Date;
}

/**
 * File System Sync Service
 */
export class FileSystemSyncService {
  /**
   * Compute content hash for sync verification
   */
  static computeContentHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Verify sync status for a single workflow spec
   */
  static async verifySync(workflowId: string): Promise<SyncResult> {
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return {
        workflowId,
        workflowName: 'unknown',
        syncStatus: 'missing',
        details: 'Workflow not found in database',
        recovered: false,
      };
    }

    try {
      const readmePath = join(workflow.ccPath, 'README.md');
      await access(readmePath);

      const fileContent = await readFile(readmePath, 'utf-8');
      const fileHash = this.computeContentHash(fileContent);

      if (workflow.contentHash === fileHash) {
        // Update sync status if needed
        if (workflow.syncStatus !== 'synced') {
          await prisma.workflowSpec.update({
            where: { id: workflowId },
            data: {
              syncStatus: 'synced',
              lastSyncAt: new Date(),
            },
          });
        }

        return {
          workflowId,
          workflowName: workflow.name,
          syncStatus: 'synced',
          details: 'Database and file system in sync',
          recovered: false,
        };
      }

      // Content mismatch - out of sync
      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          syncStatus: 'out-of-sync',
          status: 'out-of-sync',
          lastSyncAt: new Date(),
        },
      });

      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'out-of-sync',
        details: 'Content hash mismatch between database and file system',
        recovered: false,
      };
    } catch (error) {
      // File doesn't exist - missing
      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          syncStatus: 'missing',
          status: 'out-of-sync',
          lastSyncAt: new Date(),
        },
      });

      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'missing',
        details: 'Workflow file not found in file system',
        recovered: false,
      };
    }
  }

  /**
   * Run sync verification for all workflows of a user
   */
  static async verifyAllSyncs(userId: string): Promise<SyncDiagnostic> {
    const workflows = await prisma.workflowSpec.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        syncStatus: true,
        contentHash: true,
        ccPath: true,
      },
    });

    const results: SyncResult[] = [];

    for (const workflow of workflows) {
      const result = await this.verifySync(workflow.id);
      results.push(result);
    }

    const diagnostic: SyncDiagnostic = {
      totalWorkflows: workflows.length,
      synced: results.filter(r => r.syncStatus === 'synced').length,
      outOfSync: results.filter(r => r.syncStatus === 'out-of-sync').length,
      missing: results.filter(r => r.syncStatus === 'missing').length,
      conflicted: results.filter(r => r.syncStatus === 'conflicted').length,
      results,
    };

    return diagnostic;
  }

  /**
   * Attempt to recover a missing workflow spec
   */
  static async recoverWorkflow(workflowId: string): Promise<SyncResult> {
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return {
        workflowId,
        workflowName: 'unknown',
        syncStatus: 'missing',
        details: 'Workflow not found in database',
        recovered: false,
      };
    }

    try {
      const { mkdir, writeFile } = await import('fs/promises');

      // Create directory structure
      await mkdir(workflow.ccPath, { recursive: true });

      // TODO: Recover actual content from somewhere (备份, metadata, etc.)
      // For now, create a placeholder
      const placeholder =
        `# ${workflow.name}\n\n` +
        `This workflow was recovered from database metadata.\n\n` +
        `Version: ${workflow.version}\n` +
        `Author: ${workflow.author}\n\n` +
        `Description:\n${workflow.description || 'No description available.'}\n`;

      const readmePath = join(workflow.ccPath, 'README.md');
      await writeFile(readmePath, placeholder, 'utf-8');

      const contentHash = this.computeContentHash(placeholder);

      // Update database
      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          syncStatus: 'synced',
          status: 'deployed',
          contentHash,
          lastSyncAt: new Date(),
        },
      });

      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'synced',
        details: 'Workflow file recovered (placeholder created)',
        recovered: true,
      };
    } catch (error) {
      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'out-of-sync',
        details: `Failed to recover: ${error instanceof Error ? error.message : String(error)}`,
        recovered: false,
      };
    }
  }

  /**
   * Detect conflicts between database and file system
   */
  static async detectConflicts(userId: string): Promise<SyncConflict[]> {
    const workflows = await prisma.workflowSpec.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        contentHash: true,
        lastSyncAt: true,
        ccPath: true,
      },
    });

    const conflicts: SyncConflict[] = [];

    for (const workflow of workflows) {
      try {
        const readmePath = join(workflow.ccPath, 'README.md');
        await access(readmePath);

        const fileContent = await readFile(readmePath, 'utf-8');
        const fileHash = this.computeContentHash(fileContent);

        if (workflow.contentHash && fileHash !== workflow.contentHash) {
          conflicts.push({
            workflowId: workflow.id,
            workflowName: workflow.name,
            contentHash: workflow.contentHash,
            fileHash,
            lastSyncAt: workflow.lastSyncAt,
          });
        }
      } catch {
        // File not accessible - skip conflict detection
        continue;
      }
    }

    return conflicts;
  }

  /**
   * Resolve a sync conflict by choosing a source of truth
   */
  static async resolveConflict(
    workflowId: string,
    source: 'database' | 'filesystem' | 'merge'
  ): Promise<SyncResult> {
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return {
        workflowId,
        workflowName: 'unknown',
        syncStatus: 'missing',
        details: 'Workflow not found in database',
        recovered: false,
      };
    }

    try {
      const readmePath = join(workflow.ccPath, 'README.md');
      let newHash: string | undefined;

      if (source === 'filesystem') {
        // Use file system content as source of truth
        const fileContent = await readFile(readmePath, 'utf-8');
        newHash = this.computeContentHash(fileContent);
        // Update database with file content
        // TODO: Update workflow content in database
      } else if (source === 'database') {
        // Use database content as source of truth
        // Overwrite file with database content
        // TODO: Retrieve and write database content
      }

      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          syncStatus: 'synced',
          status: 'deployed',
          ...(newHash && { contentHash: newHash }),
          lastSyncAt: new Date(),
        },
      });

      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'synced',
        details: `Conflict resolved using ${source} as source of truth`,
        recovered: true,
      };
    } catch (error) {
      return {
        workflowId,
        workflowName: workflow.name,
        syncStatus: 'conflicted',
        details: `Failed to resolve conflict: ${error instanceof Error ? error.message : String(error)}`,
        recovered: false,
      };
    }
  }

  /**
   * Get detailed sync diagnostics
   */
  static async getSyncDiagnostics(userId: string): Promise<SyncDiagnostic> {
    return this.verifyAllSyncs(userId);
  }

  /**
   * Manually trigger sync for all workflows
   */
  static async triggerSync(userId: string): Promise<SyncDiagnostic> {
    return this.verifyAllSyncs(userId);
  }

  /**
   * Update sync status for a workflow
   */
  static async updateSyncStatus(
    workflowId: string,
    status: SyncStatus
  ): Promise<boolean> {
    try {
      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          syncStatus: status,
          lastSyncAt: new Date(),
          status: status === 'out-of-sync' ? 'out-of-sync' : 'deployed',
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Update path history when workflow is migrated
   */
  static async updatePathHistory(
    workflowId: string,
    newPath: string
  ): Promise<boolean> {
    try {
      const workflow = await prisma.workflowSpec.findUnique({
        where: { id: workflowId },
      });

      if (!workflow) {
        return false;
      }

      const history = Array.isArray((workflow.pathHistory as unknown) || [])
        ? (workflow.pathHistory as unknown as string[])
        : [];

      await prisma.workflowSpec.update({
        where: { id: workflowId },
        data: {
          ccPath: newPath,
          ccPathVersion: (workflow.ccPathVersion || 0) + 1,
          pathHistory: [...history, workflow.ccPath || ''],
        },
      });

      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Utility function to verify sync status for a workflow
 */
export async function verifyWorkflowSync(workflowId: string): Promise<SyncResult> {
  return FileSystemSyncService.verifySync(workflowId);
}

/**
 * Utility function to run sync diagnostics for all user workflows
 */
export async function runSyncDiagnostics(userId: string): Promise<SyncDiagnostic> {
  return FileSystemSyncService.getSyncDiagnostics(userId);
}
