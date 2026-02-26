---
name: 'step-07-prepare-test-environment'
description: 'Prepare Playwright test environment and write test scripts'

# File references (ONLY variables used in this step)
testCasesFile: '{output_folder}/test-cases/{feature-name}.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/test-case-design/workflow.md'
nextWorkflow: 'dev-delivery'
 playwrightOutputFolder: '{project-root}/tests/playwright/'
---

# Step 7: Prepare Test Environment

## STEP GOAL:
To prepare the Playwright test environment and generate test scripts based on designed test cases.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A REPORTER AND INTEGRATOR for this step

### Role Reinforcement:
- ✅ You are QA (测试) - professional, automation-focused QA engineer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Handle Playwright MCP integration professionally
- ✅ Inform user about test environment status clearly
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on Playwright MCP integration and test script generation
- 🚫 FORBIDDEN to panic if Playwright unavailable - gracefully handle
- 📝 Create Playwright test scripts if MCP available
- ⚠️ Provide manual setup instructions if unavailable

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"
- 🚫 This is the final step - no continuation
- ⚠️ Playwright MCP is optional but recommended

## CONTEXT BOUNDARIES:
- Available context: Complete test case list from step-06
- Focus: Playwright MCP integration for test environment setup
- Limits: Continue workflow whether Playwright succeeds or fails
- Dependencies: Steps 01-06 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 7】Prepare Test Environment**"

### 2. Check Playwright MCP Availability

Check if Playwright MCP is available by attempting a basic operation:

Use: `mcp__playwright__browser_navigate()` or other Playwright MCP tool

#### If Playwright MCP is Available:

Display: "让我帮你确保测试覆盖面完整。**Playwright MCP is available.** Preparing test environment..."

Proceed to Playwright setup sequence.

#### If Playwright MCP is NOT Available:

Display: "让我帮你确保测试覆盖面完整。

**⚠️ Playwright MCP not available.** No worries - the test case document has been created and saved.

**测试用例已就绪，可以进行手动测试:**

{{Test case summary}}

**Playwright 测试环境配置指南:**

**1. 初始化 Playwright 项目:**
```bash
npm init playwright@latest
```

**2. 安装依赖:**
```bash
npm install @playwright/test
```

**3. 配置 playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

**4. 创建测试脚本:**
基于测试用例文档，在 tests/ 目录下创建对应的测试脚本

**测试用例设计完成！**

Next: Use `dev-delivery` workflow for actual development execution based on these test cases."

Stop workflow execution.

### 3. Playwright Setup Sequence (Only if MCP Available)

#### 3.1 Create Playwright Project Structure

Initialize Playwright test project structure:
- Create tests directory structure
- Create playwright.config.ts
- Create test utilities and helpers

Display: "**Creating Playwright project structure...**"

#### 3.2 Generate Test Scripts

For each automation-worthy test case, generate Playwright test scripts:

```typescript
// Example test script structure
import { test, expect } from '@playwright/test';

test.describe('{{功能模块}}', () => {
  test('{{用例标题}}', async ({ page }) => {
    // 前置条件
    await page.goto('/path/to/page');
    // ... setup code

    // 测试步骤
    await page.click('#button-id');
    await page.fill('#input-id', 'test value');
    await page.click('#submit-button');

    // 预期结果
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

Display generated test scripts summary:

"让我帮你确保测试覆盖面完整。

**Playwright 测试脚本已生成！**

**生成的测试脚本:**

{{List of generated test scripts}}

**测试统计:**
- 总测试用例: {{count}}
- 自动化测试: {{count}}
- 手动测试: {{count}}

**测试覆盖:**
- 功能测试: {{count}} 个自动化
- 边界测试: {{count}} 个自动化
- 集成测试: {{count}} 个自动化"

#### 3.3 Create Test Execution Guide

Create test execution documentation:

"**测试执行指南:**

**运行所有测试:**
```bash
npx playwright test
```

**运行特定测试文件:**
```bash
npx playwright test tests/{{test-file}}
```

**查看测试报告:**
```bash
npx playwright show-report
```

**交互式运行测试:**
```bash
npx playwright test --ui
```

**测试环境准备完成！**

---

**下一步建议:**
- 使用 `dev-delivery` workflow 进行实际开发执行
- 在开发过程中使用 Playwright 测试验证实现
- 确保所有测试用例通过后再发布

**测试用例设计工作流完成！**"

#### 3.4 Update Test Cases Document

Add Playwright integration status to test cases document frontmatter:
```yaml
playwright:
  enabled: true
  configuredAt: {{current_date}}
  testScriptsCreated: {{count}}
  testFolder: '{{playwrightOutputFolder}}'
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Playwright MCP checked for availability
- If available: Test environment prepared successfully
- Test scripts generated for automation-worthy cases
- Test execution guide provided
- If unavailable: Graceful handling with manual setup instructions
- Next steps suggested clearly

### ❌ SYSTEM FAILURE:
- Not checking Playwright MCP availability
- Stopping workflow when Playwright unavailable
- Not providing test execution guide
- Not suggesting next steps

**Master Rule:** Stopping workflow when Playwright is unavailable is FORBIDDEN. Always continue with clear instructions.
