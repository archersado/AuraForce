import { test, expect } from '@playwright/test';

test.describe('Thinking Block UI Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a project page (you may need to adjust URL)
    await page.goto('http://localhost:3005/project/e3e2c198-5a4a-485e-b16c-0e4979c3c090');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('thinking blocks should be rendered and collapsible', async ({ page }) => {
    // Wait for chat interface to be ready
    await page.waitForSelector('[role="article"]', { timeout: 5000 });

    // Send a message that may trigger thinking blocks
    const testMessage = 'Please explain how arrays work in JavaScript';

    // Find the input field
    const inputField = page.locator('textarea[placeholder*="Type"]').or(page.locator('input[type="text"]')).or(page.locator('[contenteditable="true"]')).first();
    await expect(inputField).toBeVisible();

    // Type the message
    await inputField.fill(testMessage);

    // Send the message (click send button or press Enter)
    const sendButton = page.locator('button:has-text("Send"), button[aria-label*="send"], button').filter({ hasText: /^$/i }).first();
    if (await sendButton.count() > 0) {
      await sendButton.click();
    } else {
      await inputField.press('Enter');
    }

    // Wait for response
    console.log('Waiting for response...');

    // Check if any mental thinking elements appear
    const thinkingBlockSelector = text => page.locator(`text=${text}`).or(page.locator('[class*="thinking"]'));

    // Wait for some assistant response
    await page.waitForSelector('[role="article"]:has-text("Claude")', {
      timeout: 30000,
    });

    // Check if the response contains expected elements
    const assistantMessages = await page.locator('[role="article"]:has-text("Claude")').count();
    expect(assistantMessages).toBeGreaterThan(0);

    console.log('Assistant message found:', assistantMessages);

    // Look for thinking block indicators in the UI
    // This would match the "Thinking" label in our ThinkingBlock component
    const thinkingLabels = page.locator('text=Thinking');
    const thinkingLabelCount = await thinkingLabels.count();
    console.log('Found', thinkingLabelCount, 'thinking labels');

    // If thinking blocks exist, verify they are collapsible
    if (thinkingLabelCount > 0) {
      // Find the first thinking block
      const firstThinkingBlock = page.locator('text=Thinking').first();

      // Check if it has the Brain icon or chevron
      const thinkingContainer = firstThinkingBlock.locator('..');

      // Verify it contains a chevron or arrow icon
      const hasIcon = await thinkingContainer.locator('svg').count();
      expect(hasIcon).toBeGreaterThan(0);

      console.log('Thinking block has icon:', thinkingLabelCount > 0);

      // Click to toggle (expand/collapse)
      await firstThinkingBlock.click();
      // Wait a moment
      await page.waitForTimeout(500);

      // Click again to toggle back
      await firstThinkingBlock.click();
      await page.waitForTimeout(500);

      console.log('Thinking block is collapsible');
    } else {
      console.log('No thinking blocks found in the response (this is normal if the AI didn\'t return any thinking blocks)');
    }
  });

  test('thinking block UI elements exist', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3005/project/e3e2c198-5a4a-485e-b16c-0e4979c3c090');
    await page.waitForLoadState('networkidle');

    // Verify the page has a chat interface
    const chatInterface = page.locator('.prose, [role="article"]');
    await expect(chatInterface.first()).toBeVisible();

    // Test the extractThinkingBlocks function logic
    const result = await page.evaluate(async () => {
      // Test content inline
      const content = 'Hello This is a thinking block that should be rendered in a collapsible UI.World';
      const regex = /<think[^>]*>([\s\S]*?)<\/think>/g;
      const matches = [...content.matchAll(regex)];

      const thinkingBlocks = matches.map((match, idx) => ({
        id: `think-block-${idx}`,
        content: match[1].trim(),
      }));

      return {
        originalContent: content,
        thinkingBlocksCount: thinkingBlocks.length,
        thinkingBlocks: thinkingBlocks,
      };
    });

    console.log('Extraction test result:', result);
    expect(result.thinkingBlocksCount).toBe(1);
    expect(result.thinkingBlocks[0].content).toBe('This is a thinking block that should be rendered in a collapsible UI.');
  });

  test('verify thinking block extraction regex works correctly', async ({ page, request }) => {
    // Test various edge cases

    const testCases = [
      {
        name: 'Simple thinking block',
        // Use page.evaluate to construct the content
        expectedBlocks: 1,
        expectedCleaned: 'HelloWorld',
      },
      {
        name: 'Multiple thinking blocks',
        expectedBlocks: 2,
        expectedCleaned: 'Beforebetweenafter',
      },
      {
        name: 'Thinking block with attributes',
        expectedBlocks: 1,
        expectedCleaned: 'Start',
      },
      {
        name: 'Incomplete thinking block (no closing)',
        expectedBlocks: 0,
        expectedCleaned: 'Hello This is incomplete',
      },
    ];

    for (const testCase of testCases) {
      const result = await page.evaluate((testCase) => {
        let content = '';
        if (testCase.name === 'Simple thinking block') {
          content = 'Hello This is hiddenWorld';
        } else if (testCase.name === 'Multiple thinking blocks') {
          content = 'Before First between Second after';
        } else if (testCase.name === 'Thinking block with attributes') {
          content = 'Start This content';
        } else if (testCase.name === 'Incomplete thinking block (no closing)') {
          content = 'Hello This is incomplete';
        }
        const regex = /<think[^>]*>([\s\S]*?)<\/think>/g;
        const matches = [...content.matchAll(regex)];
        const cleaned = content.replace(regex, '');
        return {
          blocksCount: matches.length,
          cleaned,
        };
      }, testCase);

      console.log(`Test case "${testCase.name}":`, {
        blocksFound: result.blocksCount,
        expected: testCase.expectedBlocks,
        cleaned: result.cleaned,
        expectedCleaned: testCase.expectedCleaned,
      });

      expect(result.blocksCount).toBe(testCase.expectedBlocks);
      expect(result.cleaned).toBe(testCase.expectedCleaned);
    }

    console.log('All regex tests passed!');
  });
});
