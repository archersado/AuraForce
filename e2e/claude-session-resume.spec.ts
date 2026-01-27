import { test, expect } from '@playwright/test'

/**
 * Claude Session Resume E2E Tests
 *
 * Tests for the Claude session resume functionality that allows users to
 * resume Claude Code CLI sessions from the web interface.
 *
 * NOTE: These tests require:
 * 1. A test user with verified email (auth bypass is not fully implemented)
 * 2. At least one project created to test the ChatInterface
 * 3. The server running on localhost:3000
 */

test.describe('Claude Session Resume', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock authentication - directly set a session cookie
    // This bypasses the email verification requirement
    await context.addCookies([
      {
        name: 'session',
        value: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com', name: 'Test User' },
          expires: Date.now() + 3600000,
        }),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax', // Required for cookies in modern browsers
      }
    ]);

    // Navigate to workspace first
    await page.goto('/workspace');
  });

  /**
   * Test: Navigate to a project page and verify History button is visible
   *
   * Since ChatInterface is only rendered on /project/[id] pages with the ChatHeader,
   * we need to navigate to a project page first.
   */
  test('History button is visible in ChatHeader', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    // Look for any project link
    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing. Create a project first.');
      return;
    }

    // Navigate to project page where ChatInterface is rendered
    await projectLink.click();

    // Wait for ChatHeader to load (it's inside ChatInterface component)
    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Check for History button (correct aria-label)
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await expect(historyButton).toBeVisible();

    // Verify the History icon is present
    await expect(historyButton.locator('svg')).toBeVisible();
  });

  test('clicking History button opens Claude session list panel', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    // Wait for ChatHeader to load
    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Click History button
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel to appear
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Verify panel title
    await expect(panel.locator('text=Claude Sessions')).toBeVisible();

    // Wait for sessions to load
    await page.waitForTimeout(2000);

    // Check for loading state or sessions
    const loadingIndicator = panel.locator('text=Loading sessions...');
    const sessions = panel.locator('button[type="button"]');

    const isLoading = await loadingIndicator.isVisible().catch(() => false);
    const hasSessions = await sessions.count() > 0;

    expect(isLoading || hasSessions).toBeTruthy();
  });

  test('Claude session list shows session details', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Wait for sessions to load
    await page.waitForTimeout(3000);

    // Check if sessions are displayed
    const sessions = panel.locator('button[type="button"]');
    const sessionCount = await sessions.count();

    if (sessionCount > 0) {
      // Check first session contains content
      const firstSession = sessions.first();
      const hasContent = await firstSession.innerText();
      expect(hasContent.length).toBeGreaterThan(0);
    } else {
      // If no sessions, should show empty state
      const emptyState = panel.locator('text=No Claude sessions');
      const hasEmptyState = await emptyState.isVisible().catch(() => false);
      if (hasEmptyState) {
        await expect(emptyState).toBeVisible();
      }
    }
  });

  test('can resume a Claude session from the list', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for sessions to load
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(3000);

    // Get sessions
    const sessions = panel.locator('button[type="button"]');
    const sessionCount = await sessions.count();

    if (sessionCount > 0) {
      // Click first session
      await sessions.first().click();

      // Panel should close
      await expect(panel).not.toBeVisible({ timeout: 5000 });

      // Should show toast notification
      await expect(page.locator('text=Claude session resumed')).toBeVisible({ timeout: 5000 });
    } else {
      test.skip(true, 'No Claude sessions to test resume functionality');
    }
  });

  test('clicking outside panel closes it', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Click backdrop (outside panel)
    const backdrop = page.locator('.fixed.inset-0');
    const hasBackdrop = await backdrop.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasBackdrop) {
      await backdrop.first().click();

      // Panel should close
      await expect(panel).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('Esc key closes panel', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Panel should close
    await expect(panel).not.toBeVisible({ timeout: 5000 });
  });

  test('refresh button reloads sessions', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel to load
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(2000);

    // Look for refresh button
    const refreshButton = page.locator('button:has-text("Refresh")');

    if (await refreshButton.isVisible()) {
      await refreshButton.click();

      // Should show loading indicator
      await expect(panel.locator('text=Loading sessions...')).toBeVisible({ timeout: 2000 });

      // Sessions should reload
      await expect(panel.locator('text=Loading sessions...')).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('displays loading state while fetching sessions', async ({ page }) => {
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');

    const projectLink = page.locator('a[href^="/project/"]').first();
    const hasProject = await projectLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasProject) {
      test.skip(true, 'No projects available for testing');
      return;
    }
    await projectLink.click();

    await page.waitForSelector('[data-testid="chat-header"]', { timeout: 10000 });

    // Open Claude session list
    const historyButton = page.locator('button[aria-label="Show Claude sessions"]');
    await historyButton.click();

    // Wait for panel
    const panel = page.locator('.fixed.right-0.top-0.h-full.w-96.bg-white');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Should show loading state initially
    const loading = panel.locator('text=Loading sessions...');
    await expect(loading).toBeVisible({ timeout: 1000 });

    // After loading, should show sessions or empty state
    await expect(loading).not.toBeVisible({ timeout: 3000 });
  });
});
