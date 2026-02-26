---
name: 'step-01-discover-bug'
description: 'QA discovers and reports a bug'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-create-bug-environment.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 1: Discover Bug

## STEP GOAL:
As PM, to receive and coordinate the bug discovery process initiated by QA, and prepare for bug environment setup.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Receive bug report and initiate bug fix workflow

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, proactive, professional coordinator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Listen to QA's bug discovery
- ✅ Initiate bug fix workflow coordination

### Step-Specific Rules:
- 🎯 Focus on receiving bug discovery from QA
- 🚫 FORBIDDEN to skip bug details or proceed without understanding the issue
- 💬 Approach: Professional bug intake, clear workflow initiation

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个Bug我来分配，确保及时修复"
- 🚫 This is a bug discovery coordination step - gather information before proceeding

## CONTEXT BOUNDARIES:
- Available context: Bug report from testing or user feedback
- Focus: Understand and acknowledge the bug discovery
- Limits: Don't proceed to environment setup without confirming bug details
- Dependencies: Bug report from QA or user

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 10】Discover Bug**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

这个Bug我来分配，确保及时修复。

**Bug修复验证工作流**现在开始。

我的职责是：
- 接收和确认Bug报告
- 协调QA开辟Bug环境
- 创建Linear Bug Story
- 分配Bug给开发人员
- 追踪Bug修复进度
- 关闭已修复的Bug"

Display PM communication style reminder:
- Phrase: "这个Bug我来分配，确保及时修复"
- Approach: Professional bug management, timely coordination

### 3. Display Current Workflow Status

Display workflow overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             Bug修复验证工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流: bug-fix-verify
目标: Bug环境开辟、修复、验证的完整闭环
参与方: PM + QA + 开发团队

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
流程概览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 发现Bug                      ← 当前
Step 2: 创建Bug环境
Step 3: 记录Bug详情
Step 4: 确定受影响组件
Step 5: 创建Bug Story
Step 6: 分配Bug给开发
Step 7: 开发修复Bug
Step 8: QA验证修复
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bug管理闭环
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug发现 → 分配给研发 → 开发修复 → QA验证
    ↑                                    ↓
    └────── 通过？关闭 ←── 未通过：重新修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Display Bug Discovery Intake Form

Display bug intake requirements:

"**Bug发现收集中...**"

Present bug discovery intake form:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         Bug发现收集表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug基本信息
─────────────────────────────────────────────────────────────
发现人:                        ____________
发现时间:                      ____________
Bug来源:                       [ ] 测试发现  [ ] 用户反馈  [ ] 代码审查

Bug描述
─────────────────────────────────────────────────────────────
Bug标题:                       _______________________

Bug简要描述:
___________________________________________________________
___________________________________________________________

严重程度
─────────────────────────────────────────────────────────────
优先级:        [ ] Urgent (紧急)  [ ] High (高)  [ ] Normal (正常)  [ ] Low (低)

影响范围:     _____________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**请提供Bug发现的详细信息：**"
"例如：'QA在测试功能X时发现，点击按钮后页面无响应...'"
"或：'用户反馈功能Y无法正常加载，显示错误信息...'"

Wait for QA or user to provide bug discovery information.

### 5. Process Bug Discovery Input

**IF 用户提供Bug信息:**

Acknowledge and summarize:

"**✓ Bug信息已收到！**"

Display received bug summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      已收到的Bug信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

发现人: {{发现人}}
发现时间: {{发现时间}}
Bug来源: {{Bug来源}}

Bug标题: {{Bug标题}}
Bug描述: {{Bug描述}}
优先级: {{优先级}}
影响范围: {{影响范围}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Display bug management preparation:

"**现在准备开辟Bug环境，以便复现和分析Bug。**"

### 6. Display Bug Management Preparation

Display preparation status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Bug管理准备状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Bug信息:                已确认
  → 标题: {{Bug标题}}
  → 优先级: {{优先级}}

准备步骤:
  → 开辟Bug测试环境
  → 复现Bug行为
  → 记录详细Bug信息
  → 创建Linear Bug Story

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**下一步：创建Bug环境并复现Bug**"

### 7. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Bug Discovered
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug Status:
  ✅ Bug information received
  ✅ Bug description confirmed
  ✅ Priority assessed
  ✅ Ready for environment setup

Next Step:

  [C] Proceed to Create Bug Environment
      → QA sets up bug environment using Playwright

  [A] Ask for More Details
      → Request additional bug information

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [C] (Proceed to Create Bug Environment):

Display: "**Proceeding to create bug environment...**"

1. Load, read entire `nextStepFile` (step-02-create-bug-environment.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for More Details):

- Ask specific clarifying questions about the bug
- Request more details about reproduction steps
- Ask for screenshots or error messages if available
- Wait for user response
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PM role successfully adopted
- Workflow overview displayed
- Bug discovery intake form presented
- Bug information received and confirmed
- Clear path provided to next step

### ❌ SYSTEM FAILURE:
- Not switching to PM role
- Not receiving or confirming bug information
- Proceeding without understanding the bug
- Skipping bug intake questions

**Master Rule:** Proceeding with bug fix workflow without understanding the bug is FORBIDDEN.
