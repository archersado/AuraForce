/**
 * Workflow Upload API Endpoint
 *
 * Accepts multipart/form-data with workflow specification files,
 * validates them, and deploys to Claude Code directory.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { validateWorkflowSpecContent, generateCCPath } from '@/lib/workflows/spec-validator';
import { deployWorkflow } from '@/lib/workflows/deployer';
import { getSession } from '@/lib/auth/session';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

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

      if (!validation.valid) {
        results.push({
          fileName: file.name,
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          warnings: validation.warnings,
        });
        continue;
      }

      if (!validation.metadata?.name) {
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
          userId: session.userId,
          name: validation.metadata.name,
        },
      });

      if (existing) {
        results.push({
          fileName: file.name,
          success: false,
          error: `Workflow "${validation.metadata.name}" already exists`,
          warnings: validation.warnings,
        });
        continue;
      }

      // Deploy to Claude Code directory
      const deployResult = await deployWorkflow(
        content,
        validation.metadata.name,
        validation.metadata
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
          name: validation.metadata.name,
          description: validation.metadata.description,
          version: validation.metadata.version || '1.0.0',
          author: validation.metadata.author || session.user.name || session.user.email || 'Unknown',
          ccPath: deployResult.ccPath,
          userId: session.userId,
          status: 'deployed',
          metadata: {
            tags: validation.metadata.tags || [],
            requires: validation.metadata.requires || [],
            resources: validation.metadata.resources || [],
            agents: validation.metadata.agents || [],
            subWorkflows: validation.metadata.subWorkflows || [],
          },
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
