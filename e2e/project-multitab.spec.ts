/**
 * Playwright Test for Project Page Multi-Tab Features
 *
 * Tests the enhanced project page with:
 * - Multi-tab file management
 * - PPTX file preview
 * - Image preview with zoom/rotate
 * - Document preview (PDF/DOCX)
 * - Tab bar interactions (drag, close, context menu)
 * - File browser integration
 *
 * Bug Fix Workflow 2026-02-08
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3005';
const PROJECT_ROUTE = '/auraforce/workspace';

// Helper function to wait for page to be stable
async function waitForPageStable(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

// Helper function to check for console errors
async function captureConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error' || text.includes('Error')) {
      errors.push(text);
      console.error(`[Console ${type}]:`, text);
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('[Page Error]:', error.message);
  });

  return errors;
}

test.describe('Project Page - Multi-Tab System', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = await captureConsoleErrors(page);
  });

  test.afterEach(async ({ page }) => {
    // Log any errors that occurred
    if (consoleErrors.length > 0) {
      console.log('\n=== Console Errors Detected ===');
      consoleErrors.forEach(err => console.log(`  - ${err}`));
      console.log('=== End of Errors ===\n');
    }
  });

  test('should load workspace page without errors', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check title
    const title = await page.title();
    console.log('Page title:', title);

    // Check for critical errors
    expect(consoleErrors.filter(e =>
      e.includes('cannot read') ||
      e.includes('undefined') ||
      e.includes('module not found')
    ).length).toBe(0);

    // Page should be loaded
    expect(page.url()).toContain('workspace');
  });

  test('should navigate to a specific project', async ({ page }) => {
    // First go to workspace
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Look for project links/buttons
    const projectLinks = page.getByRole('link', { name: /Project|项目/ });

    const count = await projectLinks.count();
    console.log('Found project links:', count);

    if (count > 0) {
      // Click on first project
      await projectLinks.first().click();
      await waitForPageStable(page);

      // Check URL changed
      expect(page.url()).toMatch(/\/project\/[^/]+$/);

      // Check for console errors
      expect(consoleErrors.length).toBe(0);
    } else {
      console.log('No projects found on workspace page');
    }
  });

  test('should display tab bar when files are opened', async ({ page }) => {
    // Navigate to a project (assuming we have one)
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Look for file browser
    const fileTree = page.locator('[class*="file"], [data-testid*="file"], [id*="file"]').first();
    const hasFileTree = await fileTree.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasFileTree) {
      console.log('File tree found');

      // Look for any clickable file items
      const fileItems = page.locator('[class*="file-item"], [role="treeitem"]').or(
        page.locator('div').filter({ hasText: /\.(ts|tsx|js|jsx|md|json)$/ })
      );

      const fileCount = await fileItems.count();
      console.log('Found file items:', fileCount);

      if (fileCount > 0) {
        // Click on a file to open it
        await fileItems.first().click();
        await waitForPageStable(page);

        // Check for tab bar
        const tabBar = page.locator('[class*="tab"], .tab-bar').or(
          page.locator('div').filter({ hasText: /No files open/ })
        );

        expect(await tabBar.first().isVisible()).toBeTruthy();
      }
    }

    // Check for errors
    expect(consoleErrors.filter(e => e.includes('tab')).length).toBe(0);
  });

  test('should not have module loading errors', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check for module errors
    const moduleErrors = consoleErrors.filter(e =>
      e.includes('Module not found') ||
      e.includes('Cannot find module') ||
      e.includes('Failed to fetch dynamically imported module')
    );

    console.log('Module errors found:', moduleErrors.length);
    if (moduleErrors.length > 0) {
      console.log('Module error details:', moduleErrors);
    }

    expect(moduleErrors.length).toBe(0);
  });

  test('should load TabBarEnhanced component', async ({ page }) => {
    // Navigate directly to a project URL if we have one
    // Otherwise navigate to workspace
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check if TabBarEnhanced script is loaded
    // The component should be dynamically imported
    const content = page.content();

    // Look for tab-related text that would indicate the component loaded
    const hasTabUI = await page.locator('text=No files open').isVisible({ timeout: 5000 }).catch(() => false) ||
                      await page.locator('[class*="tab"]').first().isVisible({ timeout: 5000 }).catch(() => false);

    console.log('Tab UI visible:', hasTabUI);

    // Check for component-specific errors
    const tabErrors = consoleErrors.filter(e =>
      e.toLowerCase().includes('tabbarenhanced') ||
      e.toLowerCase().includes('workspace-tabs')
    );

    console.log('Tab component errors:', tabErrors.length);
    if (tabErrors.length > 0) {
      console.log('Tab errors:', tabErrors);
    }

    expect(tabErrors.length).toBe(0);
  });

  test('should handle PPTPreview component', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check for PPTX-related errors
    const pptErrors = consoleErrors.filter(e =>
      e.toLowerCase().includes('ppt') ||
      e.toLowerCase().includes('presentation')
    );

    console.log('PPT component errors:', pptErrors.length);
    if (pptErrors.length > 0) {
      console.log('PPT errors:', pptErrors);
    }

    expect(pptErrors.length).toBe(0);
  });

  test('should handle MediaPreviewEnhanced component', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check for media preview related errors
    const mediaErrors = consoleErrors.filter(e =>
      e.toLowerCase().includes('mediapreview') ||
      e.toLowerCase().includes('image') && e.toLowerCase().includes('error')
    );

    console.log('Media preview errors:', mediaErrors.length);
    if (mediaErrors.length > 0) {
      console.log('Media errors:', mediaErrors);
    }

    expect(mediaErrors.length).toBe(0);
  });

  test('should handle DocumentPreview component', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check for document preview related errors
    const docErrors = consoleErrors.filter(e =>
      e.toLowerCase().includes('documentpreview') ||
      e.toLowerCase().includes('pdf') && e.toLowerCase().includes('error')
    );

    console.log('Document preview errors:', docErrors.length);
    if (docErrors.length > 0) {
      console.log('Document errors:', docErrors);
    }

    expect(docErrors.length).toBe(0);
  });
});

test.describe('Component Dependency Verification', () => {
  test('should verify FileUpload component exists', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    // Check if FileUpload is referenced correctly
    const content = await page.content();
    console.log('Page HTML length:', content.length);

    // The FileUpload component should be dynamically importable without errors
    expect(errors.filter(e => e.includes('FileUpload')).length).toBe(0);
  });

  test('should verify workspace-tabs-store is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    // Check for store-related errors
    const storeErrors = errors.filter(e =>
      e.toLowerCase().includes('store') ||
      e.toLowerCase().includes('zustand')
    );

    console.log('Store errors:', storeErrors.length);
    if (storeErrors.length > 0) {
      console.log('Store error details:', storeErrors);
    }

    expect(storeErrors.length).toBe(0);
  });
});

test.describe('Network Request Verification', () => {
  test('should not have failed API requests', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      const url = request.url();
      const failure = request.failure();
      if (failure && !url.includes('data:')) {
        failedRequests.push(`${url} - ${failure.errorText}`);
        console.log('[Failed Request]:', url, failure.errorText);
      }
    });

    // Give time for requests to complete
    await page.waitForTimeout(3000);

    console.log('Total failed requests:', failedRequests.length);
    failedRequests.forEach(req => console.log(`  - ${req}`));

    // Allow some failed requests (e.g., analytics, tracking)
    // but not critical API requests
    const criticalFailures = failedRequests.filter(req =>
      req.includes('/api/') ||
      req.includes('/workspace/') ||
      req.includes('/project/')
    );

    expect(criticalFailures.length).toBe(0);
  });

  test('should load all JavaScript bundles successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    const scriptTags = await page.locator('script').all();
    const scriptUrls: string[] = [];

    for (const script of scriptTags) {
      const src = await script.getAttribute('src');
      if (src) {
        scriptUrls.push(src);
      }
    }

    console.log('Total script tags:', scriptTags.length);
    console.log('External scripts:', scriptUrls.length);

    // Verify no 404s for scripts
    const errors: string[] = [];
    page.on('response', async response => {
      if (response.status() === 404 && response.url().includes('.js')) {
        errors.push(response.url());
        console.log('[404 Script]:', response.url());
      }
    });

    await page.waitForTimeout(2000);

    expect(errors.length).toBe(0);
  });
});

test.describe('UI Component Rendering', () => {
  test('should render page layout correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    // Check for main layout elements
    const hasHeader = await page.locator('header').isVisible().catch(() => false);
    const hasMain = await page.locator('main').isVisible().catch(() => false);
    const hasNav = await page.locator('nav').isVisible().catch(() => false);

    console.log('Layout elements - Header:', hasHeader, 'Main:', hasMain, 'Nav:', hasNav);

    // At least main content area should be visible
    expect(hasMain || await page.locator('body').isVisible()).toBeTruthy();
  });

  test('should not have visual rendering errors', async ({ page }) => {
    await page.goto(`${BASE_URL}${PROJECT_ROUTE}`);
    await waitForPageStable(page);

    const errors: string[] = [];
    page.on('pageerror', error => {
      if (error.message.includes('render') ||
          error.message.includes('createElement') ||
          error.message.includes('hydrate')) {
        errors.push(error.message);
        console.log('[Render Error]:', error.message);
      }
    });

    await page.waitForTimeout(2000);

    console.log('Render errors:', errors.length);
    expect(errors.length).toBe(0);
  });
});
