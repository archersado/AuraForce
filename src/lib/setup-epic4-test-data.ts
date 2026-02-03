/**
 * Setup Epic 4 Sprint 2 测试数据
 *
 * 创建测试用的工作流、用户和统计数据
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================');
  console.log('  Epic 4 Sprint 2 - Test Data Setup');
  console.log('========================================');

  try {
    // 1. 创建测试用户（如果不存在）
    console.log('\n🔍 Checking test users...');
    let testUser = await prisma.user.findFirst({
      where: { email: 'test-user@example.com' },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: 'Test User',
          email: 'test-user@example.com',
          emailVerified: new Date(),
          image: null,
        },
      });
      console.log('✅ Created test user:', testUser.id);
    } else {
      console.log('✅ Test user exists:', testUser.id);
    }

    // 2. 创建另一个测试用户（用于测试私有工作流）
    console.log('\n🔍 Checking second test user...');
    let testUser2 = await prisma.user.findFirst({
      where: { email: 'test-user2@example.com' },
    });

    if (!testUser2) {
      testUser2 = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: 'Test User 2',
          email: 'test-user2@example.com',
          emailVerified: new Date(),
          image: null,
        },
      });
      console.log('✅ Created second test user:', testUser2.id);
    } else {
      console.log('✅ Second test user exists:', testUser2.id);
    }

    // 3. 创建公开工作流（如果不存在）
    console.log('\n🔍 Checking public workflows...');

    const publicWorkflow1Id = uuidv4();
    const publicWorkflow2Id = uuidv4();
    const publicWorkflow3Id = uuidv4();

    const publicWorkflowsData = [
      {
        id: publicWorkflow1Id,
        name: 'Popular API Automation',
        description: 'Automate API testing workflows with this powerful template',
        version: '1.0.0',
        author: 'Test User',
        ccPath: '/workflows/api-automation.zip',
        status: 'deployed',
        visibility: 'public',
        userId: testUser.id,
      },
      {
        id: publicWorkflow2Id,
        name: 'Data Processing Pipeline',
        description: 'Process and transform large datasets efficiently',
        version: '2.1.0',
        author: 'Test User 2',
        ccPath: '/workflows/data-pipeline.zip',
        status: 'deployed',
        visibility: 'public',
        userId: testUser2.id,
      },
      {
        id: publicWorkflow3Id,
        name: 'Website Monitoring',
        description: 'Monitor website uptime and performance metrics',
        version: '1.5.0',
        author: 'Test User',
        ccPath: '/workflows/website-monitor.zip',
        status: 'deployed',
        visibility: 'public',
        userId: testUser.id,
      },
    ];

    for (const workflowData of publicWorkflowsData) {
      const existing = await prisma.workflowSpec.findUnique({
        where: { id: workflowData.id },
      });

      if (!existing) {
        const workflow = await prisma.workflowSpec.create({
          data: workflowData,
        });
        console.log(`✅ Created public workflow: ${workflow.name} (${workflow.id})`);
      } else {
        // 更新为公开
        await prisma.workflowSpec.update({
          where: { id: workflowData.id },
          data: { visibility: 'public' },
        });
        console.log(`✅ Updated to public: ${workflowData.name}`);
      }
    }

    // 4. 创建私有工作流
    console.log('\n🔍 Checking private workflows...');

    const privateWorkflowId = uuidv4();
    const privateWorkflowData = {
      id: privateWorkflowId,
      name: 'Private Internal Workflow',
      description: 'Internal workflow for testing private access',
      version: '1.0.0',
      author: 'Test User',
      ccPath: '/workflows/internal-workflow.zip',
      status: 'deployed',
      visibility: 'private',
      userId: testUser.id,
    };

    const existingPrivate = await prisma.workflowSpec.findUnique({
      where: { id: privateWorkflowData.id },
    });

    if (!existingPrivate) {
      const workflow = await prisma.workflowSpec.create({
        data: privateWorkflowData,
      });
      console.log(`✅ Created private workflow: ${workflow.name} (${workflow.id})`);
    } else {
      console.log(`✅ Private workflow exists: ${privateWorkflowData.name}`);
    }

    // 5. 创建统计数据
    console.log('\n🔍 Creating workflow stats...');

    const allWorkflows = await prisma.workflowSpec.findMany({
      where: {
        visibility: 'public',
      },
      select: { id: true, name: true },
    });

    for (const workflow of allWorkflows) {
      const existingStats = await prisma.workflowStats.findUnique({
        where: { workflowId: workflow.id },
      });

      if (!existingStats) {
        // 模拟一些随机统计数据
        const totalLoads = Math.floor(Math.random() * 1000) + 50;
        const weekLoads = Math.floor(Math.random() * 100) + 10;
        const monthLoads = Math.floor(Math.random() * 300) + 30;
        const favoriteCount = Math.floor(Math.random() * 50) + 5;

        await prisma.workflowStats.create({
          data: {
            workflowId: workflow.id,
            totalLoads,
            todayLoads: Math.floor(Math.random() * 10),
            weekLoads,
            monthLoads,
            favoriteCount,
            rating: 3.5 + Math.random() * 1.5,
            ratingCount: Math.floor(Math.random() * 20) + 5,
            lastUsedAt: new Date(),
          },
        });
        console.log(`✅ Created stats for: ${workflow.name}`);
      } else {
        console.log(`✅ Stats exist for: ${workflow.name}`);
      }
    }

    // 6. 创建收藏记录
    console.log('\n🔍 Creating favorite records...');

    const firstPublicWorkflow = await prisma.workflowSpec.findFirst({
      where: { visibility: 'public' },
      select: { id: true },
    });

    if (firstPublicWorkflow && testUser) {
      const existingFavorite = await prisma.workflowFavorite.findUnique({
        where: {
          userId_workflowId: {
            userId: testUser.id,
            workflowId: firstPublicWorkflow.id,
          },
        },
      });

      if (!existingFavorite) {
        await prisma.workflowFavorite.create({
          data: {
            userId: testUser.id,
            workflowId: firstPublicWorkflow.id,
          },
        });

        // 更新收藏数
        await prisma.workflowStats.update({
          where: { workflowId: firstPublicWorkflow.id },
          data: { favoriteCount: { increment: 1 } },
        });

        console.log(`✅ Created favorite for workflow: ${firstPublicWorkflow.id}`);
      } else {
        console.log(`✅ Favorite already exists`);
      }
    }

    // 7. 汇总数据
    console.log('\n📊 Summary:');
    const totalWorkflows = await prisma.workflowSpec.count();
    const publicWorkflows = await prisma.workflowSpec.count({
      where: { visibility: 'public' },
    });
    const privateWorkflows = await prisma.workflowSpec.count({
      where: { visibility: 'private' },
    });
    const totalStats = await prisma.workflowStats.count();
    const totalFavorites = await prisma.workflowFavorite.count();
    const totalUsers = await prisma.user.count();

    console.log(`  Workflows: ${totalWorkflows} (Public: ${publicWorkflows}, Private: ${privateWorkflows})`);
    console.log(`  Users: ${totalUsers}`);
    console.log(`  Stats Records: ${totalStats}`);
    console.log(`  Favorites: ${totalFavorites}`);

    console.log('\n========================================');
    console.log('✅ Test data setup completed!');
    console.log('========================================');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
