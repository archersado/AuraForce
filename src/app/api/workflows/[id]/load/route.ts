/**
 * Workflow Load API Endpoint
 *
 * POST /api/workflows/[id]/load - 加载工作流到 workspace 并返回配置文件内容
 *
 * 此端点与 load-template 不同：
 * - load-template: 将工作流提取到用户的 workspace 目录
 * - load: 读取工作流的配置文件内容，不实际解压
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { NotFoundError, ForbiddenError, AppError } from '@/lib/errors';
import { existsSync } from 'fs';
import AdmZip from 'adm-zip';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/workflows/[id]/load
 *
 * 加载工作流并返回配置文件内容
 *
 * 此端点会：
 * 1. 验证工作流存在且有权限访问
 * 2. 读取工作流的 zip 文件
 * 3. 解析 .claude/ 目录下的配置文件（project.md, agents.md, etc.）
 * 4. 更新统计信息（totalLoads, weekLoads, monthLoads, lastUsedAt）
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "workflow": { ...workflow data },
 *     "configFiles": {
 *       ".claude/project.md": { ... },
 *       ".claude/agents.md": { ... },
 *       ...
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: workflowId } = await params;

    // 验证认证
    const session = await getSession();
    if (!session?.userId || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 查询工作流
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id: workflowId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        stats: true,
      },
    });

    if (!workflow) {
      throw new NotFoundError('Workflow');
    }

    // 验证权限：只能加载公开工作流或自己的私有工作流
    if (workflow.visibility === 'private' && workflow.userId !== session.userId) {
      throw new ForbiddenError('Cannot load private workflows owned by others');
    }

    // 检查 zip 文件是否存在
    if (!existsSync(workflow.ccPath)) {
      return NextResponse.json(
        {
          error: 'WORKFLOW_FILE_NOT_FOUND',
          message: `Workflow file not found at: ${workflow.ccPath}`,
        },
        { status: 404 }
      );
    }

    // 读取 zip 文件并解析配置文件
    const zip = new AdmZip(workflow.ccPath);
    const zipEntries = zip.getEntries();

    // 定义要读取的配置文件
    const configFilePaths = [
      '.claude/project.md',
      '.claude/agents.md',
      '.claude/workspace.md',
      '.claude/instructions.md',
      '.claude/tools.md',
    ];

    // 读取配置文件内容
    const configFiles: Record<string, { exists: boolean; content?: string; error?: string }> = {};

    for (const configPath of configFilePaths) {
      const entry = zip.getEntry(configPath);

      if (entry) {
        try {
          const content = entry.getData()?.toString('utf8');
          configFiles[configPath] = {
            exists: !!content,
            content: content || '',
          };
        } catch (error) {
          configFiles[configPath] = {
            exists: true,
            error: 'Failed to read file content',
          };
        }
      } else {
        configFiles[configPath] = {
          exists: false,
        };
      }
    }

    // 更新统计信息（原子递增）
    try {
      await prisma.workflowStats.update({
        where: { workflowId },
        data: {
          totalLoads: { increment: 1 },
          todayLoads: { increment: 1 },
          weekLoads: { increment: 1 },
          monthLoads: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
      console.log(`[Workflow Load] Updated stats for workflow ${workflowId}`);
    } catch (statsError) {
      // 如果统计表不存在，创建它
      if (
        statsError instanceof Error &&
        statsError.message.includes('WorkflowStats')
      ) {
        console.log(`[Workflow Load] Creating stats for workflow ${workflowId}`);
        await prisma.workflowStats.create({
          data: {
            workflowId,
            totalLoads: 1,
            todayLoads: 1,
            weekLoads: 1,
            monthLoads: 1,
            lastUsedAt: new Date(),
          },
        });
      } else {
        console.error('[Workflow Load] Failed to update stats:', statsError);
      }
    }

    // 确保最后使用时间已更新
    await prisma.workflowSpec.update({
      where: { id: workflowId },
      data: { lastSyncAt: new Date() },
    });

    // 返回工作流信息和配置文件
    return NextResponse.json({
      success: true,
      message: `Workflow "${workflow.name}" loaded successfully`,
      data: {
        workflow: {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          version: workflow.version,
          author: workflow.author,
          ccPath: workflow.ccPath,
          status: workflow.status,
          visibility: workflow.visibility,
          deployedAt: workflow.deployedAt,
          updatedAt: workflow.updatedAt,
          metadata: workflow.metadata,
          user: workflow.user,
          stats: workflow.stats || {
            totalLoads: 0,
            todayLoads: 0,
            weekLoads: 0,
            monthLoads: 0,
            favoriteCount: 0,
            rating: 0,
            ratingCount: 0,
          },
        },
        configFiles,
      },
    });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.errorCode, message: error.message },
        { status: error.statusCode }
      );
    }

    console.error('[Workflow Load POST] Error:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while loading the workflow',
      },
      { status: 500 }
    );
  }
}
