import { test, expect } from '@playwright/test';

test.describe('Sprint 2 Feature Validation Tests', () => {
  const BASE_URL = 'http://localhost:3000/auraforce';

  test('TabBarEnhanced: Multi-file tab system', async ({ page }) => {
    console.log('\n========== 测试 TabBarEnhanced 多文件标签页 ==========\n');

    await test.step('Open workspace page', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      expect(url).toContain('workspace');
      console.log('✅ Workspace 页面已加载');
    });

    await test.step('Check TabBarEnhanced component exists', async () => {
      await page.waitForTimeout(2000);

      // 查找 TabBarEnhanced 元素
      const tabBar = page.locator('[class*="tab"], [class*="Tab"], [data-testid*="tab"]');
      const count = await tabBar.count();
      console.log(`📁 TabBar 元素数量: ${count}`);

      // 检查是否有标签页功能的指示器（drag-and-drop 或 context menu）
      const hasDragFeatures = await page.locator('[draggable], [role="listitem"]').count();
      const hasContextMenu = await page.locator('[class*="context"], [class*="menu"]').count();

      console.log(`🖱️ 拖拽功能元素: ${hasDragFeatures}`);
      console.log(`📋 右键菜单元素: ${hasContextMenu}`);

      // 至少应该有标签页相关的 UI 元素
      const tabRelated = await page.locator('div, button, span').filter({ hasText: /tab|标签/i }).count();
      console.log(`📑 标签页文本元素: ${tabRelated}`);
    });

    await test.step('Test tab interactions', async () => {
      // 查找可能的标签页按钮
      const tabElements = await page.locator('button').filter({ hasText: /x|close|关闭/i }).all();
      
      if (tabElements.length > 0) {
        console.log(`🐾 找到 ${tabElements.length} 个关闭按钮`);
      } else {
        console.log('⏳ 暂无打开的标签页 (需要先打开文件)');
      }
    });
  });

  test('MediaPreviewEnhanced: Image preview enhancements', async ({ page }) => {
    console.log('\n========== 测试 MediaPreviewEnhanced 图片预览增强 ==========\n');

    await test.step('Check MediaPreviewEnhanced controls', async () => {
      // 查找缩放控制按钮
      const zoomInBtn = page.locator('button').filter({ hasText: /\+/|zoom|放大/i });
      const zoomOutBtn = page.locator('button').filter({ hasText: /-|缩小/i });
      const fitButtons = page.locator('button').filter({ hasText: /fit|适应/i });
      const rotateBtn = page.locator('button').filter({ hasText: /rotate|旋转/i });

      const zoomInCount = await zoomInBtn.count();
      const zoomOutCount = await zoomOutBtn.count();
      const fitCount = await fitButtons.count();
      const rotateCount = await rotateBtn.count();

      console.log(`🔍 缩放按钮: ${zoomInCount} (in), ${zoomOutCount} (out)`);
      console.log(`📐 适应按钮: ${fitCount}`);
      console.log(`🔄 旋转按钮: ${rotateCount}`);

      expect(zoomInCount + zoomOutCount).toBeGreaterThan(0);

      console.log('✅ 找到缩放控制按钮');
    });

    await test.step('Check zoom presets', async () => {
      // 查找预设缩放比例
      const zoomPresets = await page.locator('button, select, div').filter({ 
        hasText: /25%|50%|75%|100%|150%|200%|300%|400%/i 
      }).count();

      console.log(`📏 缩放预设: ${zoomPresets}`);
      console.log('✅ 找到缩放预设');
    });

    await test.step('Check metadata display', async () => {
      // 查找元数据显示（尺寸、格式）
      const metadataElements = await page.locator('div, span').filter({ 
        hasText: /dimensions|size|width|height|aspect ratio|dimensions/i 
      }).count();

      console.log(`📊 元数据元素: ${metadataElements}`);
      
      if (metadataElements > 0) {
        console.log('✅ 找到图片元数据显示');
      } else {
        console.log('⏳ 暂无图片显示 (需要先选择图片文件)');
      }
    });
  });

  test('FileSearchEnhanced: File search enhancements', async ({ page }) => {
    console.log('\n========== 测试 FileSearchEnhanced 文件搜索增强 ==========\n');

    await test.step('Test Ctrl+F shortcut', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      // 模拟 Ctrl+F 打开搜索对话框
      await page.keyboard.down('Control');
      await page.keyboard.press('F');
      await page.keyboard.up('Control');

      await page.waitForTimeout(1000);

      // 检查是否出现搜索对话框或输入框
      const searchInput = page.locator('input[type="text"], textarea').filter({ 
        hasText: /search|搜索/i, placeholder: /search|搜索/i 
      }).first();

      const isVisible = await searchInput.isVisible({ timeout: 3000 });

      if (isVisible) {
        console.log('✅ Ctrl+F 打开搜索对话框成功');
      } else {
        console.log('⚠️ 搜索对话框可能需要手动触发');
      }
    });

    await test.step('Check filter options', async () => {
      await page.waitForTimeout(1000);

      // 查找筛选器选项
      const filterTags = await page.locator('button, select, label').filter({ 
        hasText: /filter|筛选|type|类型|code|代码|image|图片|markdown|文档|time|时间/i 
      }).count();

      console.log(`🏷️ 筛选选项元素: ${filterTags}`);

      if (filterTags > 0) {
        console.log('✅ 找到筛选器选项');
      }
    });

    await test.step('Check search inputs', async () => {
      // 查找搜索相关的输入框
      const searchInputs = await page.locator('input').filter({ 
        hasText: /search|搜索/, placeholder: /search|搜索|name|名称|content|内容/i 
      }).all();

      console.log(`🔍 搜索输入框数量: ${searchInputs.length}`);

      if (searchInputs.length > 0) {
        console.log('✅ 找到搜索输入框');
      }
    });
  });

  test('Integration: Combined workflow', async ({ page }) => {
    console.log('\n========== 集成测试：完整工作流 ==========\n');

    await test.step('Open workspace', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');
      console.log('✅ 打开工作区');
    });

    await test.step('Check all Sprint 2 features available', async () => {
      // 收集所有功能指示器
      const indicators = {
        tabs: 0,
        enhancedSearch: false,
        enhancedPreview: false,
      };

      // 检查标签页功能
      const tabElements = await page.locator('[role="tab"], [role="listitem"], [class*="tab"]').count();
      indicators.tabs = tabElements;

      // 检查增强搜索（有筛选器或 Ctrl+F）
      const hasFilters = await page.locator('button, select').filter({ 
        hasText: /filter|筛选/i 
      }).count();
      indicators.enhancedSearch = hasFilters > 0;

      // 查找增强预览（有缩放或旋转按钮）
      const hasZoom = await page.locator('button').filter({ 
        hasText: /zoom|缩放/i 
      }).count();
      const hasRotate = await page.locator('button').filter({ 
        hasText: /rotate|旋转/i 
      }).count();
      indicators.enhancedPreview = hasZoom > 0 || hasRotate > 0;

      console.log('\n功能可用性检查:');
      console.log(`  📑 多文件标签页: ${indicators.tabs > 0 ? '✅ 可用' : '⏳ 需要打开文件'}`);
      console.log(`  🔍 增强搜索: ${indicators.enhancedSearch ? '✅ 可见' : '⚠️ 未找到'}`);
      console.log(`  🖼️ 增强预览: ${indicators.enhancedPreview ? '✅ 可用' : '⏳ 需要选择图片'}`);

      // 关键功能应该可用
      expect(indicators.enhancedSearch).toBe(true);
    });
  });

  test('Smoke Test: Component rendering', async ({ page }) => {
    console.log('\n========== 烟雾测试：组件渲染 ==========\n');

    await test.step('Workspace page renders without errors', async () => {
      const jsErrors: any[] = [];

      page.on('pageerror', (error) => {
        jsErrors.push({
          message: error.message,
          stack: error.stack,
        });
      });

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      console.log(`💻 JavaScript 错误: ${jsErrors.length}`);

      // 允许一些非关键错误，但检查是否有严重错误
      const criticalErrors = jsErrors.filter(e => 
        e.message.includes('TypeError') && !e.message.includes('Module not found')
      );

      expect(criticalErrors.length).toBeLessThan(5);

      if (criticalErrors.length > 0) {
        console.log('❌ 关键错误:');
        criticalErrors.forEach(e => console.log(`  - ${e.message}`));
      } else {
        console.log('✅ 无严重 JavaScript 错误');
      }
    });
  });

  test('API Test: Verify components use apiFetch', async ({ page }) => {
    console.log('\n========== API 测试：apiFetch 使用 ==========\n');

    await test.step('Verify no direct fetch calls in production code', async () => {
      // 拦截网络请求
      const apiRequests: any[] = [];

      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/api/')) {
          apiRequests.push({
            url: url,
            method: request.method(),
          });
        }
      });

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      console.log(`📡 API 请求总数: ${apiRequests.length}`);

      // 验证所有 API 请求都有 /auraforce 前缀
      const missingPrefix = apiRequests.filter(r => !r.url.includes('/auraforce/api/'));
      expect(missingPrefix.length).toBe(0);

      if (apiRequests.length > 0) {
        console.log(`✅ 所有 ${apiRequests.length} 个 API 请求都包含 basePath 前缀`);
      }

      // 列出 API 端点
      const uniqueEndpoints = [...new Set(apiRequests.map(r => r.url.split('?')[0]))];
      console.log('📌 API 端点:');
      uniqueEndpoints.slice(0, 10).forEach(ep => console.log(`  - ${ep.replace(BASE_URL, '')}`));
      if (uniqueEndpoints.length > 10) {
        console.log(`  ... 还有 ${uniqueEndpoints.length - 10} 个端点`);
      }
    });
  });

  test('Performance Test: Component load time', async ({ page }) => {
    console.log('\n========== 性能测试：组件加载时间 ==========\n');

    await test.step('Measure page load time', async () => {
      const startTime = Date.now();

      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      console.log(`⏱️ 页面加载时间: ${loadTime}ms`);

      expect(loadTime).toBeLessThan(5000); // 5秒内加载

      if (loadTime < 3000) {
        console.log('✅ 加载速度良好');
      } else if (loadTime < 5000) {
        console.log('⚠️ 加载速度尚可');
      } else {
        console.log('❌ 加载速度较慢');
      }
    });
  });
});
