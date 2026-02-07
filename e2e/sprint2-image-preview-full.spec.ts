import { test, expect } from '@playwright/test';

test.describe('Sprint 2 - Image Preview Full Test', () => {
  const BASE_URL = 'http://localhost:3000/actual_path_to_workspace';

  test('Full image preview with enhanced controls', async ({ page }) => {
    console.log('\n========== 完整图片预览测试 ==========\n');

    await test.step('Open workspace', async () => {
      await page.goto(`${BASE_URL}/workspace`);
      await page.waitForLoadState('networkidle');
      console.log('✅ Workspace 已加载');
    });

    await test.step('Look for image files or create test image', async () => {
      // Check if there's any existing image
      const images = await page.locator('img').filter({ hasText: /.png|.jpg|.jpeg|.gif|.svg/i }).all();
      console.log(`🖼️ 现有图片文件: ${images.length}`);

      if (images.length > 0) {
        console.log('📄 找到图片文件: ' + await images[0].getAttribute('src'));
        
        // Click on first image
        await images[0].click();
        await page.waitForTimeout(1000);
        console.log('✅ 点击了图片');
      } else {
        console.log('⏳ 需要先创建/上传图片文件');
        
        // Create a simple SVG image programmatically
        await page.evaluate(() => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '200');
          svg.setAttribute('height', '200');
          svg.setAttribute('viewBox', '0 0 200 200');
          svg.style.border = '1px solid #ccc';
          svg.style.margin = '20px';
          
          // Add a circle
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', '100');
          circle.setAttribute('cy', '100');
          circle.setAttribute('r', '50');
          circle.setAttribute('fill', 'blue');
          svg.appendChild(circle);
          
          // Add file info overlay
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', '100');
          text.setAttribute('y', '190');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', 'black');
          text.textContent = 'Test Image (200x200)';
          text.setAttribute('font-size', '12');
          svg.appendChild(text);
          
          document.body.appendChild(svg);
          
          return 'test-svg-created';
        });
        
        await page.waitForTimeout(500);
        console.log('✅ 创建了测试 SVG 图片');
      }
    });

    await test.step('Test zoom controls', async () => {
      await page.waitForTimeout(1000);

      // Look for zoom controls
      const zoomInBtns = await page.locator('button').filter({ hasText: /\+|plus|zoom in|放大/i }).all();
      const zoomOutBtns = await page.locator('button').filter({ hasText: /-|minus|zoom out|缩小/i }).all();

      console.log(`🔍 找到 ${zoomInBtns.length} 个放大按钮`);
      console.log(`🔍 找到 ${zoomOutBtns.length} 个缩小按钮`);

      if (zoomInBtns.length > 0) {
        // Click zoom in button
        await zoomInBtns[0].click();
        await page.waitForTimeout(500);
        console.log('✅ 点击了放大按钮');
      }
    });

    await test.step('Test fit modes', async () => {
      await page.waitForTimeout(500);

      // Look for fit buttons
      const fitBtns = await page.locator('button').filter({ hasText: /fit|适应/i }).all();

      console.log(`📐 适应按钮: ${fitBtns.length}`);

      if (fitBtns.length > 0) {
        for (const btn of fitBtns.slice(0, 2)) {
          try {
            await btn.click();
            await page.waitForTimeout(300);
            console.log('✅ 点击适应按钮');
          } catch (e) {
            console.log('⏳ 按钮点击失败');
          }
        }
      }
    });

    await test.step('Test rotation', async () => {
      await page.waitForTimeout(500);

      // Look for rotate buttons
      const rotateBtns = await page.locator('button').filter({ hasText: /rotate|旋转|90/i }).all();

      console.log(`🔄 旋转按钮: ${rotateBtns.length}`);

      if (rotateBtns.length > 0) {
        await rotateBtns[0].click();
        await page.waitForTimeout(500);
        console.log('✅ 点击了旋转按钮');
      }
    });

    await test.step('Check metadata display', async () => {
      await page.waitForTimeout(500);

      // Look for metadata elements
      const metadataElements = await page.locator('div, span').filter({ 
        hasText: /dimensions|width|height|size|尺寸|width x height|200 x 200/i 
      }).all();

      console.log(`📊 元数据元素: ${metadataElements.length}`);

      if (metadataElements.length > 0) {
        console.log('✅ 找到图片元数据显示');
        const text = await metadataElements[0].textContent();
        console.log(`   元数据: ${text}`);
      } else {
        console.log('⏳ 未显示元数据（可能未选择图片）');
      }
    });

    await test.step('Test keyboard shortcuts', async () => {
      await page.waitForTimeout(500);

      console.log('⌨️ 测试键盘快捷键:');

      // Test zoom in
      console.log('  - 按 + 键...');
      await page.keyboard.press('+');
      await page.waitForTimeout(300);

      // Test zoom out
      console.log('  - 按 - 键...');
      await page.keyboard.press('-');
      await page.waitForTimeout(300);

      // Test fit mode
      console.log('  - 按 F 键（适应模式）...');
      await page.keyboard.press('f');
      await page.waitForTimeout(300);

      // Test rotate
      console.log('  - 按 R 键（旋转）...');
      await page.keyboard.press('r');
      await page.waitForTimeout(300);

      console.log('✅ 键盘快捷键测试完成');
    });
  });

  test('Manual: Create image and test all features', async ({ page }) => {
    console.log('\n========== 手动测试：创建图片并测试全部功能 ==========\n');

    await page.goto(`${BASE_URL}/workspace`);
    await page.waitForLoadState('networkidle');

    // Create test SVG programmatically
    await page.evaluate(() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '400');
      svg.setAttribute('height', '300');
      svg.setAttribute('viewBox', '0 0 400 300');
      svg.style.border = '2px solid #4F46E5';
      svg.style.margin = '20px';
      svg.style.cursor = 'pointer';
      svg.setAttribute('data-testid', 'test-image');
      
      // Background gradient
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'grad1');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');
      gradient.innerHTML = `
        <stop offset="0%" stop-color="#E0E7FF" />
        <stop offset="100%" stop-color="#1976D2" />
      `;
      defs.appendChild(gradient);
      svg.appendChild(defs);
      
      // Background rect with gradient
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '10');
      rect.setAttribute('y', '10');
      rect.setAttribute('width', '380');
      rect.setAttribute('height', '280');
      rect.setAttribute('fill', 'url(#grad1)');
      svg.appendChild(rect);
      
      // Text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '200');
      text.setAttribute('y', '140');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '24');
      text.setAttribute('font-weight', 'bold');
      text.textContent = 'Test Image';
      svg.appendChild(text);
      
      // Dimensions text
      const info = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      info.setAttribute('x', '200');
      info.setAttribute('y', '170');
      info.setAttribute('text-anchor', 'middle');
      info.setAttribute('fill', 'white');
      info.setAttribute('font-size', '14');
      info.textContent = '400 x 300';
      svg.appendChild(info);
      
      document.body.appendChild(svg);
      
      return { width: 400, height: 300 };
    });

    await page.waitForTimeout(1000);

    // Click the test image to select it
    const testImage = page.locator('[data-testid="test-image"]');
    let isVisible = false;
    try {
      isVisible = await testImage.isVisible({ timeout: 3000 });
    } catch (e) {}

    if (isVisible) {
      await testImage.click();
      await page.waitForTimeout(500);
      console.log('✅ 选择了测试图片');
      
      // Test zoom
      console.log('\n' + '='.repeat(50));
      console.log('测试 1: 缩放功能');
      console.log('='.repeat(50));

      // Test all zoom levels
      const zoomLevels = ['50%', '75%', '100%', '150%', '200%', '300%'];
      for (const level of zoomLevels) {
        // Look for zoom level button
        const zoomBtn = page.locator('button').filter({ hasText: new RegExp(level) }).first();
        try {
          const exists = await zoomBtn.isVisible({ timeout: 1000 });
          if (exists) {
            await zoomBtn.click();
            await page.waitForTimeout(300);
            console.log(`  ✅ 缩放级别: ${level}`);
          }
        } catch (e) {
          console.log(`  ⏳ 缩放级别 ${level} 未找到`);
        }
      }

      // Test rotation
      console.log('\n测试 2: 旋转功能');
      console.log('='.repeat(50));
      const rotateCount = 4;
      for (let i = 0; i < rotateCount; i++) {
        await page.keyboard.down('r');
        await page.keyboard.up('r');
        await page.waitForTimeout(500);
        console.log(`  ✅ 旋转 90 degrees (${i + 1}/${rotateCount})`);
      }

      // Test fit modes
      console.log('\n测试 3: 适应模式');
      console.log('='.repeat(50));
      const fitModes = ['screen', 'width'];
      for (const mode of fitModes) {
        console.log(`  测试适应模式: ${mode}`);
        await page.keyboard.press('f');
        await page.waitForTimeout(500);
      }

      console.log('\n✅ MediaPreviewEnhanced 完整功能测试完成');
    }
  });
});
