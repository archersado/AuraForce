import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 5000 })

    // Verify redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Verify user is logged in (check for user name or logout button)
    await expect(page.locator('text=Test User')).toBeVisible({ timeout: 5000 })
  })

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/)

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 3000 })
  })

  test('user can logout', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Click logout button
    await page.click('[aria-label="Logout"]')

    // Should redirect to login
    await page.waitForURL('/login', { timeout: 5000 })

    // Should not be able to access dashboard without auth
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard')

    // Should redirect to login
    await page.waitForURL('/login', { timeout: 5000 })

    await expect(page).toHaveURL(/\/login/)
  })
})
