/**
 * Playwright Test for WorkspacePanel and FileEditor Layout
 * Tests the layout, sizing, and display of the workspace components
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('=== Starting Playwright Workspace Test ===\n');

    // Navigate to the workspace page
    console.log('1. Navigating to workspace page...');
    await page.goto('http://localhost:3000/workspace');
    console.log('   ✓ Navigated to workspace page');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check page title
    const title = await page.title();
    console.log('2. Page title:', title);

    // Take initial screenshot
    await page.screenshot({ path: 'test-screenshots/01-workspace-initial.png', fullPage: true });
    console.log('3. ✓ Screenshot saved: 01-workspace-initial.png');

    // Monitor console for FileEditor and FileTree logs
    const consoleLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[FileEditor]') || text.includes('[FileTree]') || text.includes('error') || text.includes('failed')) {
        console.log('  [Browser]', msg.type(), ':', text);
        consoleLogs.push({ type: msg.type(), text });
      }
    });

    // Try to find FileTree or Files section
    console.log('\n4. Checking for file tree/Files section...');
    const fileTreeHeader = await page.locator('text=Files').count();
    console.log('   Files header found:', fileTreeHeader > 0);

    // Check for empty messages
    const noFilesMessage = await page.locator('text=No files').count();
    const loadingMessage = await page.locator('text=Loading').count();
    const noFileSelectedMessage = await page.locator('text=No file selected').count();

    console.log('   "No files" message:', noFilesMessage > 0);
    console.log('   "Loading" message:', loadingMessage > 0);
    console.log('   "No file selected" message:', noFileSelectedMessage > 0);

    // Check dimensions of a sidebar or file tree area (if exists)
    console.log('\n5. Checking layout dimensions...');
    try {
      const fileEditor = await page.locator('.bg-gray-900, .bg-gray-800').first();
      if (await fileEditor.count() > 0) {
        const box = await fileEditor.boundingBox();
        if (box) {
          console.log('   Editor dimensions:', { width: box.width, height: box.height });
        }
      }
    } catch (e) {
      console.log('   Could not determine editor dimensions');
    }

    // Check viewport size
    const viewport = page.viewportSize();
    console.log('   Viewport size:', viewport);

    // Take another screenshot after checking
    await page.screenshot({ path: 'test-screenshots/02-layout-check.png', fullPage: false });
    console.log('6. ✓ Screenshot saved: 02-layout-check.png');

    // Click on refresh button if found
    console.log('\n7. Looking for refresh button...');
    const refreshButton = await page.locator('button[title*="Refresh"], button[title*="refresh"]').first();
    if (await refreshButton.count() > 0) {
      console.log('   Clicking refresh button...');
      await refreshButton.click();
      await page.waitForTimeout(2000);
      console.log('   ✓ Refresh clicked');
      await page.screenshot({ path: 'test-screenshots/03-after-refresh.png', fullPage: false });
      console.log('   ✓ Screenshot saved: 03-after-refresh.png');
    } else {
      console.log('   No refresh button found');
    }

    // Final console log summary
    console.log('\n8. Console logs summary:');
    const errors = consoleLogs.filter(l => l.text.toLowerCase().includes('error'));
    const fileTreeLogs = consoleLogs.filter(l => l.text.includes('[FileEditor]'));
    console.log(`   Total relevant logs: ${consoleLogs.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   FileEditor logs: ${fileTreeLogs.length}`);

    if (errors.length > 0) {
      console.log('\n ⚠️  Errors found:');
      errors.forEach(e => console.log(`   - ${e.text}`));
    }

    console.log('\n=== Test Complete ===');
    console.log('Screenshots saved to test-screenshots/ directory');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    await page.screenshot({ path: 'test-screenshots/error.png', fullPage: true });
    console.log('Error screenshot saved to test-screenshots/error.png');
  } finally {
    await browser.close();
  }
})();
