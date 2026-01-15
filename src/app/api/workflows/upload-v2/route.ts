/**
 * Workflow Upload API Endpoint - Enhanced with Folder & ZIP Support
 *
 * Accepts multipart/form-data with workflow spec files or folders,
 * validates them, and deploys to Claude Code directory.
 * Folders are zipped and stored in a public templates directory.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir, stat, readdir, copyFile, access } from 'fs/promises';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import AdmZip from 'adm-zip';
import path from 'path';
import { validateWorkflowSpecContent, generateCCPath } from '@/lib/workflows/spec-validator';
import { deployWorkflow } from '@/lib/workflows/deployer';
import { getSession } from '@/lib/auth/session';

const prisma = new PrismaClient();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB total

// Public zipped workflows directory
const PUBLIC_TEMPLATES_DIR = path.join(process.cwd(), 'public', 'workflow-templates');
// Claude Code extensions directory
const CLAUDE_EXTENSIONS_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'extensions', 'workflows');

/**
 * Ensure necessary directories exist
 */
async function ensureDirectories() {
  const dirs = [PUBLIC_TEMPLATES_DIR, CLAUDE_EXTENSIONS_DIR];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Zip a folder and return the zip file path
 */
async function zipFolder(folderPath: string): Promise<string> {
  const zip = new AdmZip();
  zip.addLocalFolder(folderPath);

  const zipFileName = `${path.basename(folderPath)}.zip`;
  const zipPath = path.join(PUBLIC_TEMPLATES_DIR, zipFileName);

  zip.writeZip(zipPath);
  return zipPath;
}

/**
 * Process a folder upload
 * Folders should be uploaded as separate files with relative paths
 */
async function processFolderUpload(
  formData: FormData,
  workflowName: string
): Promise<{ success: boolean; zipPath?: string; message?: string; error?: string }> {
  try {
    await ensureDirectories();

    // Create a temporary directory for the folder
    const tempDir = path.join(process.cwd(), '.temp', `workflow-${workflowName}-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });

    // Get all files from formData
    const files: { path: string; file: File }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('folder-') && value instanceof File) {
        const relativePath = key.replace('folder-', '');
        files.push({ path: relativePath, file: value });
      }
    }

    if (files.length === 0) {
      return { success: false, error: 'No files found in folder upload' };
    }

    // Copy files to temp directory
    for (const { file, path: relativePath } of files) {
      const targetPath = path.join(tempDir, relativePath);
      const targetDir = path.dirname(targetPath);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await copyFileFromBuffer(buffer, targetPath);
    }

    // Zip the folder
    const zipPath = await zipFolder(tempDir);

    // Clean up temp directory
    await deleteDirectory(tempDir);

    return { success: true, zipPath };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Helper function to copy buffer to file
 */
function copyFileFromBuffer(buffer: Buffer, targetPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(targetPath);
    writeStream.write(buffer);
    writeStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

/**
 * Helper function to delete directory recursively
 */
async function deleteDirectory(dirPath: string): Promise<void> {
  const { rm } = await import('fs/promises');
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Get public URL for a zipped template
 */
function getTemplatePublicUrl(zipFileName: string): string {
  return `/workflow-templates/${zipFileName}`;
}

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

    await ensureDirectories();

    const formData = await request.formData();
    const uploadType = formData.get('uploadType') as string; // 'file' or 'folder'

    if (uploadType === 'folder') {
      // Process folder upload
      const workflowName = formData.get('workflowName') as string;
      if (!workflowName) {
        return NextResponse.json(
          { error: 'workflowName is required for folder upload' },
          { status: 400 }
        );
      }

      // Check for duplicate workflow name
      const existing = await prisma.workflowSpec.findFirst({
        where: {
          userId: session.userId,
          name: workflowName,
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: `Workflow "${workflowName}" already exists` },
          { status: 409 }
        );
      }

      const result = await processFolderUpload(formData, workflowName);

      if (!result.success || !result.zipPath) {
        return NextResponse.json(
          { error: result.error || 'Failed to process folder upload' },
          { status: 500 }
        );
      }

      const zipFileName = path.basename(result.zipPath);
      const publicUrl = getTemplatePublicUrl(zipFileName);

      // Check if README.md exists for metadata extraction
      const readmeBuffer = Buffer.from((formData.get('folder-README.md') as File | null)?.arrayBuffer ? await ((formData.get('folder-README.md') as File).arrayBuffer()) : Buffer.alloc(0));
      const readmeContent = readmeBuffer.length > 0 ? readmeBuffer.toString('utf-8') : '';

      let metadata: any = {};
      let description = '';

      if (readmeContent) {
        const validation = validateWorkflowSpecContent(readmeContent);
        metadata = validation.metadata || {};
        description = metadata.description || `${workflowName} workflow template`;
      }

      // Store in database with zip file reference
      const workflowSpec = await prisma.workflowSpec.create({
        data: {
          name: workflowName,
          description: description,
          version: metadata.version || '1.0.0',
          author: metadata.author || session.user.name || session.user.email || 'Unknown',
          ccPath: result.zipPath, // Store zip path
          userId: session.userId,
          status: 'deployed',
          metadata: {
            ...metadata,
            tags: metadata.tags || ['template'],
            requires: metadata.requires || [],
            resources: metadata.resources || [],
            agents: metadata.agents || [],
            subWorkflows: metadata.subWorkflows || [],
            isTemplate: true,
            templateUrl: publicUrl,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Workflow folder "${workflowName}" uploaded and zipped successfully`,
        workflowId: workflowSpec.id,
        workflowName,
        templateUrl: publicUrl,
        metadata,
      });
    }

    // Original file upload logic
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
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit (${(fileSize / 1024 / 1024).toFixed(2)}MB)`,
        });
        continue;
      }

      // Check total size limit
      if (totalSize > MAX_TOTAL_SIZE) {
        results.push({
          fileName: file.name,
          success: false,
          error: 'Total upload size exceeds 200MB limit',
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
