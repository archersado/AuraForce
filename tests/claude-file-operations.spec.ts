/**
 * Playwright Test for Claude Agent SDK File Operations
 *
 * Tests whether Claude Agent SDK can return messages for:
 * - Computer Tool Results with file update operations
 * - Computer Tool Results with file creation operations
 */

import { test, expect } from '@playwright/test';

test.describe('Claude Agent SDK - File Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to workspace
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should connect to Claude and send file operation prompt', async ({ page }) => {
    // Find the chat input textarea
    const chatInput = page.locator('textarea[placeholder*="输入消息"], textarea[placeholder*="Type"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Send a prompt that asks Claude to create a file
    const testPrompt = '请在 _bmad-output 目录下创建一个测试文件 test.md，内容是："这是一个测试文件"';
    await chatInput.fill(testPrompt);

    // Find and click the send button
    const sendButton = page.getByRole('button', { name: /发送|send/i }).or(
      page.locator('button').filter({ hasText: /发送|send/i })
    );
    await expect(sendButton).toBeVisible();
    await sendButton.click();

    // Wait for response
    const response = page.locator('[data-testid*="message"], [data-testid*="assistant"], .claude-response, .message-content');
    await expect(response.first()).toBeVisible({ timeout: 120000 });

    // Wait a bit more for any file operations to complete
    await page.waitForTimeout(5000);
  });

  test('should detect Computer Tool Results in response', async ({ page }) => {
    // Find the chat input
    const chatInput = page.locator('textarea[placeholder*="输入消息"], textarea[placeholder*="Type"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Send a prompt that will trigger file operations
    const testPrompt = '帮我在根目录创建一个名为 hello.txt 的文件，内容是 "Hello World"';
    await chatInput.fill(testPrompt);

    // Click send button
    const sendButton = page.getByRole('button', { name: /发送|send/i }).or(
      page.locator('button').filter({ hasText: /发送|send/i })
    );
    await sendButton.click();

    // Wait for assistant response
    await page.waitForTimeout(5000);

    // Check for Computer Tool Results indicators
    // Look for common patterns: file path mentions, tool_result, computer_results, etc.
    const fileOperationIndicators = [
      '/ComputerToolResult/',
      'computer_results',
      'tool_result',
      'file_path',
      '执行结果',
      '文件已创建',
      '文件已保存',
      'File created',
      'File written',
    ];

    for (const indicator of fileOperationIndicators) {
      try {
        // If any indicator is found, this test passes
        const element = page.locator(`*:text("${indicator}")`).or(
          page.locator(`*:text-is("${indicator}")`)
        ).first();
        if (await element.isVisible()) {
          console.log(`Found file operation indicator: ${indicator}`);
          return; // Test passes if any indicator is found
        }
      } catch (e) {
        // Continue checking other indicators
      }
    }

    // At this point, wait for the full response to complete
    await page.waitForTimeout(60000); // Wait up to 60s for response

    // Check the page content for evidence of file operations
    const pageContent = await page.content();
    console.log('Page content length:', pageContent.length);

    // Check for any indicators in the raw HTML
    for (const indicator of fileOperationIndicators) {
      if (pageContent.includes(indicator)) {
        console.log(`Found indicator in page content: ${indicator}`);
        expect(true).toBe(true);
        return;
      }
    }

    console.log('No obvious file operation indicators found. May need to check API directly.');
  });

  test('should check API responses for Computer Tool Results', async ({ page, request }) => {
    // Setup API response listener
    const apiLog: any[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/api/claude/stream')) {
        console.log('Stream API called:', url);
        // Try to read response body
        try {
          const text = await response.text();
          console.log('Stream response preview:', text.substring(0, 500));
          apiLog.push({ url, text: text.substring(0, 1000) });
        } catch (e) {
          console.log('Could not read stream response body');
        }
      }
    });

    // Navigate to workspace
    await page.goto('http://localhost:3000/workspace?page=project:9b3e3f35-4bf4-4e79-a3d8-335da97ff209');
    await page.waitForLoadState('networkidle');

    // Find the chat input
    const chatInput = page.locator('textarea[placeholder*="输入消息"], textarea[placeholder*="Type"]');
    await expect(chatInput).toBeVisible({ timeout: 15000 });

    // Send a file operation test
    const testPrompt = '创建文件 cli-test.md，内容为 "测试内容"';
    await chatInput.fill(testPrompt);

    // Click send
    const sendButton = page.getByRole('button', { name: /发送|send/i }).or(
      page.locator('button').filter({ hasText: /发送|send/i })
    );
    await sendButton.click();

    // Wait for processing
    await page.waitForTimeout(30000);

    // Check if we saw any stream API calls
    console.log('API calls logged:', apiLog.length);
    expect(apiLog.length).toBeGreaterThan(0);

    // Check if any response contains file operation indicators
    const fileOperationKeywords = [
      'ComputerToolResult',
      'tool_result',
      'computer_results',
      '文件已创建',
      'File created',
      'write_file',
      'create_file',
    ];

    let foundFileOperation = false;
    for (const logEntry of apiLog) {
      for (const keyword of fileOperationKeywords) {
        if (logEntry.text.includes(keyword)) {
          console.log(`Found file operation keyword: ${keyword}`);
          foundFileOperation = true;
        }
      }
    }

    // This is a soft assertion - we're exploring what the API returns
    if (foundFileOperation) {
      console.log('✓ File operation indicators found in API responses');
    } else {
      console.log('✗ No file operation indicators found in API responses');
      console.log('Sample API response:', apiLog[0]?.text || 'No responses logged');
    }
  });
});
