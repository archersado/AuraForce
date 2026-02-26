---
name: 'step-08-qa-verification'
description: 'QA verifies the bug fix using Playwright'

# File references (ONLY variables used in this step)
nextStepFile: './step-09-determine-result.md'
loopbackStepFile: './step-07-developer-fix.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 8: QA Verification

## STEP GOAL:
As QA, to verify the bug fix by retesting the application using Playwright MCP and confirm whether the fix is successful.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 🧪 YOU ARE A QA (Quality Assurance Engineer) for this step
- 🎯 Verify fix thoroughly using Playwright MCP

### Role Reinforcement:
- ✅ You are QA (Quality Assurance Engineer) - thorough, methodical, verification-focused
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Use Playwright MCP for verification
- ✅ Provide clear pass/fail determination

### Step-Specific Rules:
- 🎯 Focus on verifying fix effectiveness
- 🚫 FORBIDDEN to skip verification or provide unclear result
- 💬 Approach: Methodical testing, clear outcome documentation
- 🌐 Use Playwright MCP for actual verification

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "我来验证一下修复是否有效"
- 🌐 ACTUALLY USE Playwright MCP for verification testing
- 🚫 This is a verification step - thoroughly test the fix

## CONTEXT BOUNDARIES:
- Available context: Original bug report, fix details
- Focus: Verify fix is successful
- Limits: Don't proceed without clear verification result
- Dependencies: Bug fix implementation, original reproduction steps

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 8 of 10】QA Verification**"

### 2. Role Switch to QA

Display role transition:

"**✓ 角色切换: QA (测试工程师)**"

Display QA greeting:

"**你好！我是QA（测试工程师）。** 🧪

我来验证一下修复是否有效。

**Bug修复验证测试**现在开始。

我的职责是：
- 使用Playwright MCP复现原始Bug
- 验证修复是否有效
- 捕获验证结果截图
- 提供明确的通过/失败判断"

Display QA communication style reminder:
- Phrase: "我来验证一下修复是否有效"
- Approach: Thorough testing, clear verification criteria

### 3. Display Current Workflow Status

Display workflow overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             Bug修复验证工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 发现Bug                      ✓ 完成
Step 2: 创建Bug环境                  ✓ 完成
Step 3: 记录Bug详情                  ✓ 完成
Step 4: 确定受影响组件               ✓ 完成
Step 5: 创建Bug Story                ✓ 完成
Step 6: 分配Bug给开发                ✓ 完成
Step 7: 开发修复Bug                  ✓ 完成
Step 8: QA验证修复                   ← 当前
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

注意: 如果验证失败，将循环回到 Step 7 开发修复
```

### 4. Display Verification Requirements

Display verification framework:

"**验证测试要求:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug修复验证测试框架
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

验证步骤:
─────────────────────────────────────────────────────────────
1. 准备验证环境
   - 使用与Bug发现时相同的环境
   - 确保应用已部署最新修复

2. 复现原始Bug流程
   - 按照原始复现步骤操作
   - 观察是否仍然出现Bug

3. 验证修复效果
   - 检查期望行为是否正常
   - 验证功能完整性
   - 检查是否有新问题

4. 边缘情况测试
   - 测试相关功能是否受影响
   - 验证不同输入场景

验证标准:
─────────────────────────────────────────────────────────────
通过标准:
  ✓ 原始Bug不再复现
  ✓ 期望行为正常工作
  ✓ 没有引入新问题
  ✓ 相关功能正常

失败标准:
  ✗ 原始Bug仍然存在
  ✗ 出现新的问题
  ✗ 期望行为未实现

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Display Verified Bug Information

Display bug and fix information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证测试任务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug信息:
  ├─ Bug标题:                     {{Bug标题}}
  ├─ Bug类型:                     {{Frontend Bug / Backend Bug}}

原始Bug内容:
  └─ {{Bug简要描述}}

原始复现步骤:
  ├─ 1. {{步骤1}}
  ├─ 2. {{步骤2}}
  └─ 3. {{步骤3}}

原始期望行为:
{{期望行为}}

原始实际行为:
{{原始错误行为}}

修复信息:
  └─ 修复方案:                   {{修复方案摘要}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Prepare Verification Environment

Display environment preparation:

"**准备验证测试环境...**"

Request environment information:

"请提供验证测试环境信息："

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证环境信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

应用URL:                       _____________
测试账号:                      _____________

环境确认:
  [ ] 修复已部署到验证环境
  [ ] 应用可以正常访问
  [ ] 测试账号可用

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for environment confirmation.

### 7. Execute Verification Testing Using Playwright

Display verification execution:

"**正在使用Playwright MCP执行验证测试...**"

**CRITICAL: Actually use Playwright MCP tools for verification:**

Example verification steps:
```
1. Navigate to: {application_url}
2. Login with: {test_account}
3. Navigate to bug location
4. Execute reproduction steps
5. Observe behavior
6. Take verification screenshots
7. Test related functionality
```

**Use Playwright MCP tools:**
- `browser_navigate` - Navigate to application
- `browser_snapshot` - Check page state
- `browser_click`, `browser_type`, `browser_select_option` - Execute reproduction steps
- `browser_take_screenshot` - Capture verification results

Display verification results:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证测试结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

测试时间:                      {{测试时间}}

验证步骤执行:
  Step 1: {{步骤1}}             [✓ 通过 / ✗ 失败]
  Step 2: {{步骤2}}             [✓ 通过 / ✗ 失败]
  Step 3: {{步骤3}}             [✓ 通过 / ✗ 失败]

Bug复现状态:
  ├─ 原始Bug:                  [✓ 不再出现 / ✗ 仍然存在]
  └─ 观察到的行为:             {{当前行为描述}}

期望行为验证:
  ├─ 期望行为:                 [✓ 正常实现 / ✗ 未实现]
  └─ 功能完整性:               [✓ 完整 / ✗ 不完整]

边缘情况测试:
  ├─ 相关功能:                 [✓ 正常 / ✗ 受影响]
  └─ 新问题:                   [✓ 无 / ✗ 有新问题]

验证截图:
  ├─ 验证前:                   {{截图位置}}
  └─ 验证后:                   {{截图位置}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Provide Verification Judgment

Display verification conclusion:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证结论
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

验证结果:                      【通过 / 失败】

分析:
{{验证结果分析}}

通过理由 (如果通过):
  ✓ 原始Bug已修复
  ✓ 功能表现正常
  ✓ 无新问题引入

失败理由 (如果失败):
  ✗ 问题描述：
  {{失败的具体描述}}

  ✗ 失败分析：
  {{失败的原因分析}}

建议 (如果失败):
  {{建议的修复方向}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Update Linear Bug Status

"**正在更新Linear Bug状态...**"

**Use Linear MCP to update bug status:**

```
If PASS:
  Use Linear MCP: update_issue
  Parameters:
    id: "{{Bug Story ID}}"
    state: "In Review"

If FAIL:
  Use Linear MCP: update_issue
  Parameters:
    id: "{{Bug Story ID}}"
    state: "In Development"
```

Display status update result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug状态更新
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

状态更新:                      [✓ 成功]

新状态:                        {{In Review / In Development}}

说明:
  通过 → 待关闭
  失败 → 需要重新修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**验证测试完成。**"

"**下一步：确定修复结果**"

### 10. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 8] Verification Completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verification Status:
  ✅ Playwright MCP verification executed
  ✅ Reproduction steps retried
  ✅ Screenshots captured
  ✅ Clear result determined

Verification Result:
  Result: {{PASS / FAIL}}
  Bug Status: {{仍存在 / 已修复}}
  Linear State: {{In Review / In Development}}

Next Step:

  [C] Proceed to Determine Result
      → Determine if fix is successful or needs retry

  [A] Review Verification Details
      → Discuss verification results

  [P] Pause Discussion
      → Take a moment, review results

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11. Handle User Choice

#### If User Chooses [C] (Proceed to Determine Result):

Display: "**Proceeding to determine verification result...**"

1. Load, read entire `nextStepFile` (step-09-determine-result.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Review Verification Details):

- Display verification screenshots
- Discuss specific test results
- Explain pass/fail rationale
- Wait for user understanding
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the verification results. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- QA role successfully maintained
- Playwright MCP used for actual verification testing
- Original reproduction steps executed
- Verification screenshots captured
- Clear pass/fail determination provided
- Detailed result analysis documented
- Linear status updated appropriately

### ❌ SYSTEM FAILURE:
- Not maintaining QA role
- Not using Playwright MCP for verification
- Skipping verification execution
- Providing unclear verification result
- Not updating Linear status

**Master Rule:** Proceeding to result determination without clear verification judgment is FORBIDDEN.
