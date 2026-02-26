import { test, expect } from '@playwright/test';

test.describe('Sprint 1 API Tests using apiFetch', () => {
  test('Run apiFetch tests in browser', async ({ page }) => {
    // Navigate to API test page
    await page.goto('http://localhost:3000/auraforce/api-test');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Click "开始测试" button
    const testButton = page.getByRole('button', { name: '开始测试' });
    await expect(testButton).toBeVisible();
    await testButton.click();

    // Wait for tests to complete (wait for "测试完成" message)
    await page.waitForTimeout(10000);

    // Extract test results
    const results = await page.evaluate(() => {
      const elements = document.querySelectorAll('.space-y-2 > div');
      return Array.from(elements).map(el => {
        const testName = el.querySelector('.font-semibold')?.textContent || '';
        const statusBadge = el.querySelectorAll('span')[1]?.textContent || '';
        const message = el.querySelector('.mt-2')?.textContent || '';
        const details = el.querySelector('pre')?.textContent || '';
        return { testName, statusBadge, message, details };
      });
    });

    console.log('\n========== API Fetch 测试结果 ==========\n');
    results.forEach((result, i) => {
      if (i === 0 || result.testName.includes('测试完成')) {
        console.log(`\n--- ${result.testName} ---`);
        console.log(result.message);
      } else {
        console.log(`${result.testName}`);
        console.log(`  状态: ${result.statusBadge}`);
        console.log(`  ${result.message}`);
        if (result.details) {
          console.log(`  详情: ${result.details.substring(0, 100)}...`);
        }
      }
    });

    console.log('\n=========================================\n');

    // Verify key tests
    const successTests = results.filter(r => r.statusBadge === 'SUCCESS');
    const errorTests = results.filter(r => r.statusBadge === 'ERROR');

    console.log(`Summary: ${successTests.length} 成功, ${errorTests.length} 失败`);

    // At minimum, auth session should work
    const authSessionTest = results.find(r => r.testName.includes('Test 1'));
    if (authSessionTest) {
      expect(authSessionTest.statusBadge).toBe('SUCCESS');
    }

    // Files list should work
    const filesListTest = results.find(r => r.testName.includes('Test 2'));
    if (filesListTest) {
      expect(filesListTest.statusBadge).toBe('SUCCESS');
    }

    // Take screenshot for visual verification
    await page.screenshot({ path: '/tmp/api-test-results.png', fullPage: true });
    console.log('\nScreenshot saved: /tmp/api-test-results.png');
  });
});
