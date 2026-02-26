---
name: 'step-09-determine-result'
description: 'QA determines if fix is successful or needs retry'

# File references (ONLY variables used in this step)
loopbackStepFile: './step-07-developer-fix.md'
nextStepFile: './step-10-close-bug.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 9: Determine Result

## STEP GOAL:
As QA, to determine whether the bug fix verification passed or failed, and route to either bug closure (if pass) or retry loop (if fail).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 🧪 YOU ARE A QA (Quality Assurance Engineer) for this step
- 🎯 Make clear pass/fail decision and route appropriately

### Role Reinforcement:
- ✅ You are QA (Quality Assurance Engineer) - objective, decisive, quality-focused
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Review verification results objectively
- ✅ Make clear pass/fail determination

### Step-Specific Rules:
- 🎯 Focus on clear verification result determination
- 🚫 FORBIDDEN to provide ambiguous result or skip decision
- 💬 Approach: Objective assessment, clear communication
- 🔄 Handle loop back to Step 7 on failure

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "基于验证结果，Bug修复{{通过/未通过}}"
- 🔄 Implement loop logic correctly (Loop to Step 7 on failure)
- 🚫 This is a decision step - be decisive

## CONTEXT BOUNDARIES:
- Available context: Verification results from Step 8
- Focus: Make pass/fail determination and route
- Limits: Don't proceed without clear decision
- Dependencies: Verification results, bug fix details

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 9 of 10】Determine Result**"

### 2. Role Switch to QA

Display role transition:

"**✓ 角色切换: QA (测试工程师)**"

Display QA greeting:

"**你好！我是QA（测试工程师）。** 🧪

基于验证结果，我来确定Bug修复是否成功。

**修复结果确定**现在开始。

我的职责是：
- 审查验证测试结果
- 判断修复是否通过
- 决定后续流程（关闭或循环）"

Display QA communication style reminder:
- Phrase: "基于验证结果，Bug修复{{通过/未通过}}"
- Approach: Objective assessment, clear decision

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
Step 8: QA验证修复                   ✓ 完成
Step 9: 确定修复结果 (循环点)        ← 当前
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

决策点:
  通过 → 前往 Step 10: 关闭Bug
  失败 → 循环回到 Step 7: 开发修复
```

### 4. Display Verification Results Summary

Display verification summary:

"**验证测试结果回顾:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证测试结果摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug信息:
  ├─ Bug标题:                     {{Bug标题}}
  └─ Bug类型:                     {{Frontend Bug / Backend Bug}}

验证执行:
  ├─ 测试时间:                     {{测试时间}}
  ├─ Playwright测试:               ✓ 已执行
  └─ 截图已捕获:                   ✓ 是

验证结果:
  ├─ 原始Bug:                      {{仍存在 / 不再出现}}
  ├─ 期望行为:                     {{正常实现 / 未实现}}
  └─ 相关功能:                     {{正常 / 受影响}}
  └─ 新问题:                       {{无 / 有}}

初步判定:                       【{{通过 / 失败}}】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Apply Verification Criteria

Display verification criteria and judgment:

"**应用验证标准进行判断:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      验证标准检查
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

通过标准检查:
  ─────────────────────────────────────────────────────────────
  ✓ 原始Bug不再复现:              [已满足 / 未满足]
  ✓ 期望行为正常工作:              [已满足 / 未满足]
  ✓ 没有引入新问题:                [已满足 / 未满足]
  ✓ 相关功能正常:                  [已满足 / 未满足]

失败标准检查:
  ─────────────────────────────────────────────────────────────
  ✗ 原始Bug仍然存在:              [是 / 否]
  ✗ 出现新问题:                    [是 / 否]
  ✗ 期望行为未实现:                [是 / 否]

判定依据:
─────────────────────────────────────────────────────────────
{{判断依据的具体说明}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Make Final Determination

Display final decision:

"**最终结果判定:**"

**IF VERIFICATION PASSED:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug修复验证通过
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

判定结果:                      【✓ 通过】

通过理由:
  1. 原始Bug已完全修复
  2. 功能表现符合预期
  3. 无新问题引入
  4. 相关功能正常

建议:
  ✓ Bug可以关闭
  ✓ 修复说明已完善

下一步:
  → PM关闭Bug状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF VERIFICATION FAILED:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug修复验证失败
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

判定结果:                      【✗ 失败】

失败理由:
  1. {{失败理由1}}
  2. {{失败理由2}}

失败分析:
{{详细分析失败原因}}

建议的修复方向:
  1. {{建议1}}
  2. {{建议2}}
  3. {{建议3}}

下一步:
  → 循环回开发修复步骤
  → 开发人员根据建议重新修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Present Decision Menu

Based on the determination:

**IF PASSED:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 9] Verification Passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Decision Result: ✓ PASS

Reasoning:
  - Original bug no longer occurs
  - Expected behavior works correctly
  - No new issues introduced
  - Related functions work properly

Bug Status:
  Ready for closure

Next Step:

  [C] Proceed to Close Bug
      → PM closes the bug in Linear

  [A] Review Pass Decision
      → Discuss the pass decision

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF FAILED:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 9] Verification Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Decision Result: ✗ FAIL

Reasoning:
  - {{失败理由}}
  - {{失败理由}}

Failure Analysis:
  {{失败分析}}

Retry Recommendations:
  1. {{建议1}}
  2. {{建议2}}

Loop Status:
  Will return to Step 7: Developer Fix

Next Step:

  [R] Retry Developer Fix
      → Loop back to Step 7 for re-fix

  [A] Discuss Failure
      → Discuss failure details and recommendations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [C] (Proceed to Close Bug) - PASS case:

Display: "**Proceeding to close bug...**"

1. Load, read entire `nextStepFile` (step-10-close-bug.md)
2. Execute `nextStepFile`

#### If User Chooses [R] (Retry Developer Fix) - FAIL case:

Display: "**循环回到开发修复步骤...**"

1. Display loop notification: "**🔄 循环回到 Step 7: 开发修复Bug**"
2. Update Linear state if needed: "状态将更新为 In Development"
3. Display retry guidance:```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      修复重试指导
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

失败分析:
{{失败分析}}

修复建议:
  1. {{建议1}}
  2. {{建议2}}

开发人员注意事项:
  - 仔细阅读失败分析
  - 根据建议调整修复方案
  - 修复后再次提交验证

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
4. Load, read entire `loopbackStepFile` (step-07-developer-fix.md)
5. Execute `loopbackStepFile`

#### If User Chooses [A] (Review Pass/Fail Decision):

- Discuss the decision details
- Explain the judgment rationale
- Address any questions or concerns
- Wait for user agreement
- Then re-present the appropriate continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- QA role successfully maintained
- Verification results reviewed objectively
- Clear pass/fail determination made
- Appropriate routing decision provided:
  - Pass route to Step 10 (Close Bug)
  - Fail route to Step 7 loopback (Developer Fix retry)
- Detailed reasoning documented

### ❌ SYSTEM FAILURE:
- Not maintaining QA role
- Not making clear pass/fail determination
- Providing ambiguous decision
- Incorrect routing (wrong step)

**Master Rule:** Proceeding without clear pass/fail determination OR incorrect routing is FORBIDDEN.
