---
name: 'step-03-record-bug'
description: 'QA records bug details with reproduction steps'

# File references (ONLY variables used in this step)
bugReportTemplate: '../templates/template-bug-report.md'
nextStepFile: './step-04-identify-affected-component.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 3: Record Bug Details

## STEP GOAL:
As QA, to record comprehensive bug details including reproduction steps, expected vs actual behavior, and all supporting information.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 🧪 YOU ARE A QA (Quality Assurance Engineer) for this step
- 🎯 Record complete bug documentation

### Role Reinforcement:
- ✅ You are QA (Quality Assurance Engineer) - detail-oriented, methodical, documentation-focused
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Create comprehensive bug report
- ✅ Include all necessary details for developers

### Step-Specific Rules:
- 🎯 Focus on creating detailed, reproducible bug report
- 🚫 FORBIDDEN to skip critical information (reproduction steps, expected/actual behavior)
- 💬 Approach: Clear, detailed documentation
- 📁 Will generate bug report in artifacts folder

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "我来记录一下这个Bug的详细信息"
- 📁 Create complete bug report document
- 🚫 This is a documentation step - capture all relevant details

## CONTEXT BOUNDARIES:
- Available context: Bug information, environment data, reproduction results from previous steps
- Focus: Create comprehensive bug report
- Limits: Don't proceed without creating complete bug report
- Dependencies: Bug discovery, environment setup, reproduction results

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 10】Record Bug Details**"

### 2. Role Switch to QA

Display role transition:

"**✓ 角色切换: QA (测试工程师)**"

Display QA greeting:

"**你好！我是QA（测试工程师）。** 🧪

我来记录一下这个Bug的详细信息。

**Bug详细记录**现在开始。

我的职责是：
- 记录Bug的完整信息
- 编写清晰的复现步骤
- 对比期望行为与实际行为
- 生成详细的Bug报告文档"

Display QA communication style reminder:
- Phrase: "我来记录一下这个Bug的详细信息"
- Approach: Detailed, clear, developer-friendly documentation

### 3. Display Current Workflow Status

Display workflow overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             Bug修复验证工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 发现Bug                      ✓ 完成
Step 2: 创建Bug环境                  ✓ 完成
Step 3: 记录Bug详情                  ← 当前
Step 4: 确定受影响组件
Step 5: 创建Bug Story
Step 6: 分配Bug给开发
Step 7: 开发修复Bug
Step 8: QA验证修复
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Display Bug Report Template

Display bug report template structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug报告结构
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

基本信息
─────────────────────────────────────────────────────────────
Bug ID:                        BUG-{{YYYYMMDD}}-{{序号}}
Bug 标题:                      {{Bug标题}}
优先级:                        {{Urgent/High/Normal/Low}}
Bug 类型:                      {{Frontend/Backend}}

发现信息
─────────────────────────────────────────────────────────────
发现人:                        {{发现人}}
发现时间:                      {{发现时间}}
Bug来源:                       {{测试发现/用户反馈/代码审查}}

Bug描述
─────────────────────────────────────────────────────────────
简要描述:
{{Bug简要描述}}

详细描述:
{{Bug详细描述，包括背景和影响}}

复现步骤
─────────────────────────────────────────────────────────────
1. {{步骤1}}
2. {{步骤2}}
3. {{步骤3}}
4. {{预期Bug出现的步骤}}

期望行为
─────────────────────────────────────────────────────────────
{{描述应该发生的正确行为}}

实际行为
─────────────────────────────────────────────────────────────
{{描述实际发生的错误行为}}

环境信息
─────────────────────────────────────────────────────────────
应用URL:                       {{应用的URL}}
浏览器:                        {{浏览器信息}}
操作系统:                      {{操作系统信息}}
测试账号:                      {{使用的测试账号}}

截图/录屏
─────────────────────────────────────────────────────────────
截图1: {{文件路径或描述}}
截图2: {{文件路径或描述}}

附加信息
─────────────────────────────────────────────────────────────
{{其他相关日志、错误信息等}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Collect Comprehensive Bug Information

Display bug data collection:

"**正在收集Bug详细信息...**"

Collect and organize all bug information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug信息收集
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug基本信息:
  Bug标题:                       {{Bug标题}}
  优先级:                        {{优先级}}
  发现人:                        {{发现人}}
  发现时间:                      {{发现时间}}

Bug详细描述:
  简要描述:
  {{简要描述}}

  详细描述:
  {{详细描述}}

复现步骤 (请尽量详细):
  步骤1:
  _________________________________________________________

  步骤2:
  _________________________________________________________

  步骤3:
  _________________________________________________________

  步骤4:
  _________________________________________________________

  ...

期望行为 vs 实际行为:

  期望行为:
  _________________________________________________________

  实际行为:
  _________________________________________________________

环境信息:
  应用URL:                       {{URL}}
  浏览器:                        {{浏览器}}
  操作系统:                      {{OS}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for confirmation of bug information completeness, then record any additional details.

### 6. Generate Bug Report Document

Display document creation status:

"**正在生成Bug报告文档...**"

Create the bug report document using the collected information:

**Bug Report Template Content:**

```markdown
# Bug Report

## Bug ID
BUG-{{YYYYMMDD}}-{{序号}}

## Bug 标题
{{Bug标题}}

## 优先级
{{Urgent/High/Normal/Low}}

## 发现信息

| 字段 | 值 |
|------|-----|
| 发现人 | {{发现人}} |
| 发现时间 | {{发现时间}} |
| Bug来源 | {{Bug来源}} |

## Bug 描述

### 简要描述
{{Bug简要描述}}

### 详细描述
{{Bug详细描述}}

## 复现步骤

1. {{步骤1描述}}
2. {{步骤2描述}}
3. {{步骤3描述}}
4. {{步骤4描述}}
5. ...

## 期望行为
{{期望发生的行为描述}}

## 实际行为
{{实际发生的错误行为描述}}

## 环境信息

| 字段 | 值 |
|------|-----|
| 应用URL | {{应用URL}} |
| 浏览器 | {{浏览器信息}} |
| 操作系统 | {{操作系统信息}} |
| 测试账号 | {{测试账号}} |

## 截图/录屏
{{截图路径或描述}}

## 附加信息
{{其他相关信息、日志、错误消息等}}

## 状态
新建 (New)

## 备注
{{其他备注信息}}
```

Display bug report creation result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug报告生成完成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

文件位置: {artifacts_folder}/bugs/{bug-id}-report.md

Bug ID: {{Bug ID}}
Bug 标题: {{Bug标题}}

报告包含:
  ✅ 完整的Bug描述
  ✅ 详细的复现步骤
  ✅ 期望 vs 实际行为对比
  ✅ 环境信息
  ✅ 截图/录屏记录

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Confirm Bug Report

Display confirmation:

"**Bug详细信息已记录完成。**"

"**下一步：确定Bug受影响的组件（前端或后端）**"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Bug Details Recorded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug Report Status:
  ✅ Bug ID generated: {{Bug ID}}
  ✅ Complete description documented
  ✅ Reproduction steps recorded
  ✅ Expected vs actual behavior documented
  ✅ Environment information captured
  ✅ Screenshots referenced

Report Location:
  {artifacts_folder}/bugs/{bug-id}-report.md

Next Step:

  [C] Proceed to Identify Affected Component
      → QA determines if bug is frontend or backend

  [A] Review Bug Report
      → Review and potentially modify the bug report

  [P] Pause Discussion
      → Take a moment, review documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Proceed to Identify Affected Component):

Display: "**Proceeding to identify affected component...**"

1. Load, read entire `nextStepFile` (step-04-identify-affected-component.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Review Bug Report):

- Display the bug report content
- Allow user to request changes
- Update bug report if needed
- Wait for final confirmation
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the bug report. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- QA role successfully maintained
- Complete bug report document created
- All critical information documented:
  - Bug description (brief and detailed)
  - Reproduction steps (clear and detailed)
  - Expected vs actual behavior
  - Environment information
  - Screenshots/replay referenced
- Bug report saved to artifacts folder

### ❌ SYSTEM FAILURE:
- Not maintaining QA role
- Incomplete bug report (missing critical sections)
- Skipping reproduction steps documentation
- Not saving bug report document

**Master Rule:** Proceeding to component identification without creating a complete bug report is FORBIDDEN.
