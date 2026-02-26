---
name: 'step-07-developer-fix'
description: 'Developer fixes the bug'

# File references (ONLY variables used in this step)
nextStepFile: './step-08-qa-verification.md'
previousStepFile: './step-06-assign-bug-to-dev.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 7: Developer Fix

## STEP GOAL:
As the assigned developer (Frontend Dev or Backend Dev), to analyze the bug, implement the fix, and prepare for QA verification.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 👨‍💻 YOU ARE A DEVELOPER (Frontend Dev or Backend Dev) for this step
- 🎯 Analyze, implement fix, and verification prep

### Role Reinforcement:
- ✅ You are the assigned Developer - technical, problem-solving, code-focused
- ✅ Identify whether you are Frontend Dev or Backend Dev based on bug type
- ✅ Analyze bug and implement fix
- ✅ Document fix details for review

### Step-Specific Rules:
- 🎯 Focus on identifying root cause and implementing correct fix
- 🚫 FORBIDDEN to implement fix without understanding root cause
- 💬 Approach: Technical analysis, clear fix explanation
- 📝 Document fix thoroughly

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 👨‍💻 Use developer communication style: "我来修复这个Bug，先了解一下问题"
- 🔍 Analyze code thoroughly before implementing fix
- 📝 Document changes for review

## CONTEXT BOUNDARIES:
- Available context: Bug report, Linear Bug Story, component type
- Focus: Implement bug fix
- Limits: Don't proceed without implementing fix
- Dependencies: Bug report, reproduction steps, component type

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 10】Developer Fix**"

### 2. Role Switch to Developer

Display role transition:

"**✓ 角色切换: 开发人员**"

Display developer greeting:

"**你好！我是{{Frontend Dev / Backend Dev}}。** 👨‍💻

我来修复这个Bug，先了解一下问题。

**Bug修复开发**现在开始。

我的职责是：
- 分析Bug的根因
- 定位问题代码位置
- 实现Bug修复
- 准备验证说明"

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
Step 7: 开发修复Bug                  ← 当前
Step 8: QA验证修复
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

注意: 如果修复后验证失败，将循环回到此步骤
      (Step 9 → Step 7)
```

### 4. Display Bug Information

Display bug details for developer analysis:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug 修复任务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug信息:
  ├─ Bug标题:                     {{Bug标题}}
  ├─ Bug类型:                     {{Frontend Bug / Backend Bug}}
  ├─ 优先级:                       {{优先级}}

Bug描述:
  └─ {{Bug简要描述}}

复现步骤:
  ├─ 1. {{步骤1}}
  ├─ 2. {{步骤2}}
  └─ 3. {{步骤3}}

期望行为:
{{期望行为}}

实际行为:
{{实际行为}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Developer Analysis Phase

Display analysis requirements:

"**Bug根因分析:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug 分析框架
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

分析步骤:
─────────────────────────────────────────────────────────────
1. 理解Bug需求
   - Bug是什么？应该如何表现？
   - 复现步骤执行后，观察到什么？

2. 定位问题区域
   - 基于Bug类型，定位相关代码模块
   - Frontend: 检查组件、状态管理、事件处理
   - Backend: 检查API、数据库、业务逻辑

3. 分析代码流程
   - 追踪代码执行路径
   - 检查条件判断、数据处理
   - 分析可能的边缘情况

4. 确定根因
   - 为什么会发生这个Bug？
   - 是配置问题？逻辑错误？数据处理错误？
   - 是否是依赖版本问题？

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Provide code analysis questions:

"请确认或提供以下信息："

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug 分析信息收集
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

问题相关文件:
  文件路径1:                    _______________________
  文件路径2:                    _______________________

相关代码位置:
  行号范围:                     _______________________

初步推测:
  根因分析:
  _________________________________________________________
  _________________________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for analysis input or provide your own analysis.

### 6. Implement Bug Fix

Display fix implementation:

"**正在实施Bug修复...**"

Display fix implementation template:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug 修复方案
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

修复描述:
{{描述修复方案}}

修改文件:
  ├─ 文件1: {{文件路径1}}
  │  └─ 修改说明: {{修改内容}}
  ├─ 文件2: {{文件路径2}}
  │  └─ 修改说明: {{修改内容}}

修改代码:
{{显示修改后的代码（关键部分）}}

测试计划:
  ├─ 本地测试步骤:
  │  1. {{本地测试步骤1}}
  │  2. {{本地测试步骤2}}
  └─ 验证要点:
     ├─ {{验证点1}}
     ├─ {{验证点2}}
     └─ {{验证点3}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Update Linear Bug Status

"**正在更新Linear Bug状态...**"

**Use Linear MCP to update bug status to "In Development" or "In Progress":**

```
Use Linear MCP: update_issue
Parameters:
  id: "{{Bug Story ID}}"
  state: "In Development" / "In Progress"
```

Display status update result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug状态更新
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

状态:                          [✓ 成功] / [✗ 失败]

新状态:                        In Development

说明:
  → Bug正在修复中
  → 准备QA验证

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Prepare Fix Documentation

Display fix documentation summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug 修复总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug:                           {{Bug标题}}
─────────────────────────────────────────────────────────────

根因分析:
{{Bug根因分析}}

修复方案:
{{修复方案描述}}

修改内容:
  修改文件数:                  {{N}} 个
  主要变更:                    {{主要变更描述}}

验证准备:
  ✓ 本地测试已完成
  ✓ 修复代码已提交
  ✓ 验证说明已准备

下一步:
  → QA验证修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**Bug修复完成，等待QA验证。**"

"**下一步：QA验证Bug修复**"

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 7] Bug Fix Implemented
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix Status:
  ✅ Root cause analyzed
  ✅ Fix implemented
  ✅ Code changes documented
  ✅ Local testing completed
  ✅ Linear status updated

Fix Details:
  Bug Story ID: {{Bug Story ID}}
  Root Cause: {{根因摘要}}
  Files Modified: {{文件数量}} 个
  Status: In Development

Next Step:

  [C] Proceed to QA Verification
      → QA verifies the fix using Playwright

  [A] Review Fix Details
      → Discuss fix implementation

  [P] Pause Discussion
      → Take a moment, review fix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Proceed to QA Verification):

Display: "**Proceeding to QA verification...**"

1. Load, read entire `nextStepFile` (step-08-qa-verification.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Review Fix Details):

- Discuss fix implementation details
- Review code changes
- Explain fix rationale
- Wait for user understanding
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the fix. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Developer role successfully adopted (Frontend Dev or Backend Dev based on bug type)
- Root cause analyzed and documented
- Fix implemented correctly targeting root cause
- Code changes documented clearly
- Local testing completed
- Linear bug status updated to "In Development"

### ❌ SYSTEM FAILURE:
- Not adopting appropriate developer role
- Analyzing wrong component type
- Implementing fix without understanding root cause
- Not documenting code changes
- Not updating Linear status

**Master Rule:** Proceeding to QA verification without implementing fix is FORBIDDEN.
