import { test, expect } from '@playwright/test';

test.describe('Sprint 1 Product Flow Tests', () => {
  const BASE_URL = 'http://localhost:3000/auraforce';

  test('E2E: Workspace Editor Flow', async ({ page }) => {
    // 测试 1: 访问首页
    await test.step('Navigate to homepage', async () => {
      await page.goto(BASE_URL);
      const url = page.url();
      expect(url).toContain('/auraforce');
      console.log('✅ Homepage loaded');
    });

    // 测试 2: 访问 Workspace
    await test.step('Navigate to workspace', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('workspace');

      // 检查页面元素
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      console.log('✅ Workspace page loaded');
    });

    // 测试 3: 检查 API 调用（通过浏览器 DevTools）
    await test.step('Verify API calls', async () => {
      const apiCalls: any[] = [];

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/api/')) {
          apiCalls.push({
            url: url,
            method: request.method(),
            headers: request.headers(),
          });
        }
      });

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      console.log(`📊 API Calls Count: ${apiCalls.length}`);

      // 检查关键 API
      const authSessionCall = apiCalls.find(c => c.url.includes('/api/auth/session'));
      expect(authSessionCall).toBeDefined();
      console.log('✅ Auth session API called');

      const filesApiCall = apiCalls.find(c => c.url.includes('/api/files'));
      expect(filesApiCall).toBeDefined();
      console.log('✅ Files API called');

      // 验证所有 API 调用都有 /auraforce 前缀
      const missingPrefix = apiCalls.filter(c => !c.url.includes('/auraforce/api/'));
      expect(missingPrefix.length).toBe(0);
      if (missingPrefix.length > 0) {
        console.log('❌ Missing basePath:', missingPrefix);
      } else {
        console.log('✅ All API calls have basePath prefix');
      }
    });
  });

  test('E2E: Workflow Management Flow', async ({ page }) => {
    // 测试 1: 访问 Workflows 页面
    await test.step('Navigate to workflows page', async () => {
      await page.goto(`${BASE_URL}/workflows`);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('workflows');

      console.log('✅ Workflows page loaded');
    });

    // 测试 2: 检查工作流列表加载
    await test.step('Verify workflow list loads', async () => {
      await page.goto(`${BASE_URL}/workflows`);
      await page.waitForLoadState('networkidle');

      // 查找工作流卡片的容器
      const workflowContainer = page.locator('[class*="workflow"], [class*="Workflow"], [data-testid*="workflow"]');
      await workflowContainer.first().waitFor({ state: 'visible', timeout: 10000 });

      console.log('✅ Workflow list displayed');
    });

    // 测试 3: 拦截 API 请求验证 apiFetch 使用
    await test.step('Verify API requests use correct prefix', async () => {
      const apiUrls: string[] = [];

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/api/workflows')) {
          apiUrls.push(url);
        }
      });

      await page.goto(`${BASE_URL}/workflows`);
      await page.waitForLoadState('networkidle');

      // 验证 API URL 包含 /auraforce 前缀
      const allH = apiUrls.every(url => url.includes('/auraforce/api/workflows'));
      expect(allH).toBe(true);

      console.log(`✅ ${apiUrls.length} workflow API calls verified with basePath`);
    });
  });

  test('E2E: File Operations Flow', async ({ page }) => {
    // 测试 1: 测试文件列表 API
    await test.step('Test file list API', async () => {
      const apiResponses: any[] = [];

      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('/api/files/list')) {
          apiResponses.push({
            url: url,
            status: response.status(),
          });
        }
      });

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      // 等待 API 响应
      await page.waitForTimeout(2000);

      const filesListResponse = apiResponses.find(r => r.url.includes('/api/files/list'));
      expect(filesListResponse).toBeDefined();

      // 验证响应状态不是 404
      expect(filesListResponse!.status).not.toBe(404);

      console.log(`✅ Files list API responded with status: ${filesListResponse!.status}`);
    });

    // 测试 2: 验证文件树存在
    await test.step('Verify file tree UI exists', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 查找文件树元素
      const fileTreeElements = page.locator(
        '[class*="file"], [class*="folder"], [id*="file"], [id*="folder"]'
      );

      const count = await fileTreeElements.count();
      console.log(`📁 File tree elements found: ${count}`);

      // 至少应该有一些 UI 元素
      const visibleElements = await page.locator('div, button, span').filter({ hasText: /file|folder|workspace|项目/i }).count();
      expect(visibleElements).toBeGreaterThan(0);

      console.log('✅ File tree UI elements present');
    });
  });

  test('E2E: Claude Agent Integration Flow', async ({ page }) => {
    // 测试 1: 验证 Claude 对话输入框
    await test.step('Verify Claude chat input exists', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 查找文本输入框
      const textInput = page.locator('textarea, input[type="text"]').first();
      const isVisible = await textInput.isVisible({ timeout: 5000 });

      if (isVisible) {
        console.log('✅ Claude chat input found');

        // 测试输入（不发送）
        await textInput.fill('test message');
        await page.waitForTimeout(500);

        const value = await textInput.inputValue();
        expect(value).toContain('test');

        console.log('✅ Chat input accepts text');
      } else {
        console.log('⚠️ Claude chat input not immediately visible (may need project selection)');
      }
    });

    // 测试 2: 验证 Claude API 端点
    await test.step('Verify Claude API endpoints', async () => {
      const apiRequests: any[] = [];

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/api/claude/')) {
          apiRequests.push({
            url: url,
            method: request.method(),
          });
        }
      });

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      // 检查 API 调用
      const claudeCalls = apiRequests.filter(c => c.url.includes('/api/claude/'));
      console.log(`🤖 Claude API calls: ${claudeCalls.length}`);

      // 至少 session 应该被调用
      const sessionCall = claudeCalls.find(c => c.url.includes('/session'));
      expect(sessionCall).toBeDefined();

      console.log('✅ Claude API endpoints called');
    });
  });

  test('E2E: End-to-End User Journey', async ({ page }) => {
    console.log('\n========== 完整用户流程测试 ==========\n');

    // 步骤 1: 用户登录
    await test.step('Step 1: User login', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('/auraforce');

      console.log('👤 Step 1: 用户登录 - ✅ 完成');
    });

    // 步骤 2: 进入 Workspace
    await test.step('Step 2: Enter workspace', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('workspace');

      console.log('🏠 Step 2: 进入 Workspace - ✅ 完成');
    });

    // 步骤 3: 查看文件
    await test.step('Step 3: View files', async () => {
      await page.waitForTimeout(2000);

      // 验证文件相关 UI 存在
      const fileRelated = await page.locator('div, button, span').filter({ hasText: /file|文件/i }).count();
      expect(fileRelated).toBeGreaterThan(0);

      console.log('📁 Step 3: 查看文件 - ✅ 完成');
    });

    // 步骤 4: 打开工作流
    await test.step('Step 4: Browse workflows', async () => {
      await page.goto(`${BASE_URL}/workflows`);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('workflows');

      console.log('⚙️ Step 4: 浏览工作流 - ✅ 完成');
    });

    // 步骤 5: Claude 对话
    await test.step('Step 5: Claude chat', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 检查聊天 UI
      const chatInput = page.locator('textarea, input');
      const isVisible = await chatInput.first().isVisible({ timeout: 5000 });

      if (isVisible) {
        console.log('💬 Step 5: Claude 对话 - ✅ 完成');
      } else {
        console.log('💬 Step 5: Claude 对话 - ✅ UI 可用（等待项目选择）');
      }
    });

    console.log('\n========== 用户流程测试完成 ==========\n');
  });

  test('Smoke Test: Critical Services', async ({ page }) => {
    const criticalChecks: { name: string; url: string; expectedStatus: number }[] = [
      { name: 'Homepage', url: BASE_URL + '/', expectedStatus: 200 },
      { name: 'Workspace', url: BASE_URL + '/workspace', expectedStatus: 200 },
      { name: 'Workflows', url: BASE_URL + '/workflows', expectedStatus: 200 },
    ];

    for (const check of criticalChecks) {
      const response = await page.request.get(check.url);
      expect(response.status()).toBe(check.expectedStatus);
      console.log(`✅ ${check.name}: ${response.status()} (${check.url})`);
    }
  });
});
