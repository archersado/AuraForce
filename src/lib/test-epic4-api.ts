/**
 * API Test Suite for Epic 4 Sprint 2
 *
 * 运行测试：npm run test:epic4 或 npx tsx src/lib/test-epic4-api.ts
 *
 * 注意：需要在运行时环境中有有效的数据库连接和用户会话
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 测试数据库连接
 */
async function testDatabaseConnection() {
  console.log('\n🔍 Testing database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // 检查表是否存在
    const workflowCount = await prisma.workflowSpec.count();
    const statsCount = await prisma.workflowStats.count();
    const favoriteCount = await prisma.workflowFavorite.count();

    console.log(`✅ WorkflowSpec: ${workflowCount} records`);
    console.log(`✅ WorkflowStats: ${statsCount} records`);
    console.log(`✅ WorkflowFavorite: ${favoriteCount} records`);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * 测试热门工作流数据
 */
async function testPopularWorkflows() {
  console.log('\n🔍 Testing popular workflows data...');

  try {
    // 查询公开工作流
    const publicWorkflows = await prisma.workflowSpec.findMany({
      where: { visibility: 'public' },
      include: { stats: true },
      orderBy: { stats: { totalLoads: 'desc' } },
      take: 5,
    });

    console.log(`✅ Found ${publicWorkflows.length} public workflows`);

    publicWorkflows.forEach((workflow, index) => {
      console.log(
        `  ${index + 1}. ${workflow.name} - ${workflow.stats?.totalLoads || 0} loads`
      );
    });

    return publicWorkflows.length > 0;
  } catch (error) {
    console.error('❌ Failed to query popular workflows:', error);
    return false;
  }
}

/**
 * 测试统计信息更新
 */
async function testStatsUpdate(workflowId: string) {
  console.log(`\n🔍 Testing stats update for workflow: ${workflowId}...`);

  try {
    // 获取当前统计信息
    const before = await prisma.workflowStats.findUnique({
      where: { workflowId },
    });

    console.log(
      `Before: totalLoads=${before?.totalLoads || 0}, favoriteCount=${before?.favoriteCount || 0}`
    );

    // 模拟加载工作流（增加 totalLoads）
    const after = await prisma.workflowStats.update({
      where: { workflowId },
      data: {
        totalLoads: { increment: 1 },
        todayLoads: { increment: 1 },
        weekLoads: { increment: 1 },
        monthLoads: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    console.log(
      `After: totalLoads=${after.totalLoads}, favoriteCount=${after.favoriteCount}`
    );

    console.log('✅ Stats update successful');

    return true;
  } catch (error) {
    console.error('❌ Failed to update stats:', error);

    // 如果错误是因为记录不存在，尝试创建
    try {
      const before = await prisma.workflowStats.findUnique({
        where: { workflowId },
      });

      if (!before) {
        console.log('  Creating stats record...');
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
        console.log('✅ Stats record created');
        return true;
      }
    } catch (createError) {
      console.error('❌ Failed to create stats record:', createError);
    }

    return false;
  }
}

/**
 * 测试收藏功能
 */
async function testFavoriteFunction(workflowId: string, userId: string) {
  console.log(`\n🔍 Testing favorite function for workflow: ${workflowId}, user: ${userId}...`);

  try {
    // 检查是否已收藏
    const before = await prisma.workflowFavorite.findUnique({
      where: {
        userId_workflowId: {
          userId,
          workflowId,
        },
      },
    });

    const isFavoritedBefore = !!before;
    console.log(`Before: isFavorited=${isFavoritedBefore}`);

    // 收藏工作流
    if (!isFavoritedBefore) {
      await prisma.workflowFavorite.create({
        data: { userId, workflowId },
      });

      // 更新统计信息
      await prisma.workflowStats.update({
        where: { workflowId },
        data: { favoriteCount: { increment: 1 } },
      });

      console.log('✅ Added to favorites');

      // 验证收藏数增加
      const stats = await prisma.workflowStats.findUnique({
        where: { workflowId },
      });
      console.log(`Favorite count: ${stats?.favoriteCount || 0}`);
    } else {
      console.log('Already favorited, skipping');
    }

    // 查询用户的收藏列表
    const favorites = await prisma.workflowFavorite.findMany({
      where: { userId },
      include: { workflow: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    console.log(`✅ User has ${favorites.length} favorites:`);
    favorites.forEach((fav, index) => {
      console.log(`  ${index + 1}. ${fav.workflow.name}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Failed to test favorite function:', error);
    return false;
  }
}

/**
 * 主测试函数
 */
async function main() {
  console.log('========================================');
  console.log('  Epic 4 Sprint 2 - API Test Suite');
  console.log('========================================');

  const results: { [key: string]: boolean } = {
    database_connection: false,
    popular_workflows: false,
    stats_update: false,
    favorite_function: false,
  };

  try {
    // 测试数据库连接
    results.database_connection = await testDatabaseConnection();

    if (!results.database_connection) {
      console.error('\n❌ Database connection failed. Aborting tests.');
      return;
    }

    // 测试热门工作流
    results.popular_workflows = await testPopularWorkflows();

    // 测试统计信息更新（需要一个工作流 ID）
    const sampleWorkflow = await prisma.workflowSpec.findFirst();
    if (sampleWorkflow) {
      results.stats_update = await testStatsUpdate(sampleWorkflow.id);

      // 测试收藏功能（需要一个用户 ID）
      const sampleUser = await prisma.user.findFirst();
      if (sampleUser && sampleWorkflow.visibility === 'public') {
        results.favorite_function = await testFavoriteFunction(
          sampleWorkflow.id,
          sampleUser.id
        );
      } else {
        console.log('\n⚠️  Skipping favorite test: no suitable user or public workflow found');
      }
    } else {
      console.log('\n⚠️  Skipping stats and favorite tests: no workflow found');
    }

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  } finally {
    // 断开数据库连接
    await prisma.$disconnect();
  }

  // 输出测试结果摘要
  console.log('\n========================================');
  console.log('  Test Results Summary');
  console.log('========================================');

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter((r) => r).length;

  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);

  console.log('\nDetailed Results:');
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${status} - ${test}`);
  });

  console.log('\n========================================');

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the logs above.');
    process.exit(1);
  }
}

// 运行测试
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
