/**
 * Playwright Test for FileEditor component
 * Tests the file tree loading and functionality
 */

const { chromium, expect } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Starting Playwright test...');

    // Navigate to the workspace page
    await page.goto('http://localhost:3000/workspace');
    console.log('Navigated to workspace page');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Take a screenshot
    await page.screenshot({ path: 'workspace-page.png', fullPage: true });
    console.log('Screenshot saved to workspace-page.png');

    // Check for file tree in browser console
    page.on('console', msg => {
      if (msg.text().includes('[FileEditor]') || msg.text().includes('[ProjectFileTree]')) {
        console.log('Browser console:', msg.text());
      }
    });

    // Look for file tree elements
    const fileTreeExists = await page.locator('text=/Files/i').count();
    console.log('File tree header found:', fileTreeExists > 0);

    // Check for any error messages
    const errors = await page.locator('text=/error|Error|failed/i').allTextContents();
    if (errors.length > 0) {
      console.log('Found error messages:', errors);
    }

    // Look for file tree items
    const fileTreeItems = await page.locator('text=/No files|Loading/').count();
    console.log('Empty file tree message found:', fileTreeItems > 0);

    // Take another screenshot after checking
    await page.screenshot({ path: 'file-tree-detail.png', fullPage: false });
    console.log('Detail screenshot saved to file-tree-detail.png');

  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
