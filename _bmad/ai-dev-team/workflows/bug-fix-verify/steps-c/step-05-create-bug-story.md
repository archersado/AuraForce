---
name: 'step-05-create-bug-story'
description: 'PM creates Linear Bug Story'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-assign-bug-to-dev.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 5: Create Bug Story

## STEP GOAL:
As PM, to create a Bug Story in Linear using Linear MCP with all relevant bug information for tracking and assignment.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Create Linear Bug Story for bug tracking

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, tracking-focused, integration-aware
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Create comprehensive Bug Story in Linear
- ✅ Use Linear MCP for integration

### Step-Specific Rules:
- 🎯 Focus on creating complete Bug Story in Linear
- 🚫 FORBIDDEN to skip Linear integration or create incomplete Bug Story
- 💬 Approach: Clear documentation, systematic tracking
- 🔌 Use Linear MCP for actual Bug Story creation

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "我来创建Linear Bug Story，记录这个Bug"
- 🔌 ACTUALLY USE Linear MCP to create the Bug Story
- 🚫 This is an integration step - create actual Bug Story in Linear

## CONTEXT BOUNDARIES:
- Available context: Complete bug report, component classification
- Focus: Create Bug Story in Linear for tracking
- Limits: Don't proceed without creating or attempting Bug Story
- Dependencies: Bug report, component type, available Linear team

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 10】Create Bug Story**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

我来创建Linear Bug Story，记录这个Bug。

**Linear Bug Story创建**现在开始。

我的职责是：
- 使用Linear MCP创建Bug Story
- 填写完整的Bug信息
- 设置适当的Bug属性
- 为分配做准备"

Display PM communication style reminder:
- Phrase: "我来创建Linear Bug Story，记录这个Bug"
- Approach: Systematic bug tracking, comprehensive documentation

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
Step 5: 创建Bug Story                ← 当前
Step 6: 分配Bug给开发
Step 7: 开发修复Bug
Step 8: QA验证修复
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Display Linear Bug Story Template

Display Bug Story template structure:

"**Linear Bug Story 结构:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Linear Bug Story 结构
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

必要字段:
─────────────────────────────────────────────────────────────
Title:                         {{Bug标题}}
Description:                   {{Bug完整描述}}
Team:                          {{Linear团队名称}}
State:                         Backlog / Todo
Priority:                      {{Urgent/High/Normal/Low}}
Labels:                        [Bug, Frontend/Backend]

可选字段:
─────────────────────────────────────────────────────────────
Assignee:                      {{待指定}}
Estimate:                      {{时间估算}}
Due Date:                      {{截止日期 (可选)}}

Description 内容:
─────────────────────────────────────────────────────────────
## Bug Information

**Bug ID:** BUG-{{YYYYMMDD}}-{{序号}}
**Priority:** {{Urgent/High/Normal/Low}}
**Type:** {{Frontend Bug / Backend Bug / Infrastructure Bug}}

**Brief Description:**
{{Bug简要描述}}

**Detailed Description:**
{{Bug详细描述}}

## Reproduction Steps

1. {{复现步骤1}}
2. {{复现步骤2}}
3. {{复现步骤3}}

## Expected Behavior
{{期望行为}}

## Actual Behavior
{{实际行为}}

## Environment
- Application URL: {{应用URL}}
- Browser: {{浏览器}}
- OS: {{操作系统}}

## Screenshots
{{截图引用}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Check Linear Integration Status

Display Linear MCP status:

"**检查Linear MCP集成状态...**"

First, use Linear MCP to list available teams:

**Attempt to list Linear teams:**
```
Use Linear MCP: list_teams
```

Display team information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Linear团队信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

可用的团队:
{{显示Linear MCP返回的团队列表}}

选择的团队:                  {{确定的团队}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Prepare Bug Story Content

Display Bug Story preparation:

"**准备Bug Story内容...**"

Prepare and display the Bug Story details:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug Story 准备预览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title:
{{Bug标题}}

Team:
{{Linear团队名称}}

State:
Backlog

Priority:
{{1=Urgent / 2=High / 3=Normal / 4=Low}}

Labels:
[ Bug, {{Frontend/Backend/Infrastructure}} ]

Assignee:
(待下一步分配)

Description:
{{Bug的完整Markdown描述}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Create Bug Story Using Linear MCP

"**正在使用Linear MCP创建Bug Story...**"

**ACTUALLY USE Linear MCP to create the Bug Story:**

```
Use Linear MCP: create_issue
Parameters:
  title: "{{Bug标题}}"
  team: "{{团队名称}}"
  description: "{{完整的Markdown描述}}"
  priority: {{1/2/3/4}}
  labels: ["Bug", "{{Frontend/Backend/Infrastructure}}"]
  state: "Backlog"
```

Display creation result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Linear Bug Story 创建结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

创建状态:                      [✓ 成功] / [✗ 失败]

成功信息:
  Issue ID:                    {{Linear返回的Issue ID}}
  Issue URL:                   {{Linear返回的URL}}
  Issue Title:                 {{Bug标题}}
  Team:                        {{团队}}
  State:                       Backlog
  Priority:                    {{优先级}}

失败处理:
  如果Linear MCP不可用或创建失败：
  1. 保存Bug Story内容到本地文档
  2. 记录创建失败原因
  3. 继续工作流程（稍后可手动创建）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF Linear Bug Story creation successful:**
Display: "**✓ Linear Bug Story创建成功！**"

**IF Linear MCP unavailable or fails:**
Display: "**⚠ Linear MCP创建失败，创建本地Bug Story文档...**"

Fallback: Create local Bug Story document:
```markdown
# Bug Story for Linear (Pending Manual Creation)

## Bug Story Content (ready to copy to Linear)

**Title:** {{Bug标题}}
**Team:** {{团队名称}}
**Priority:** {{优先级}}
**Labels:** Bug, {{Frontend/Backend/Infrastructure}}

## Description
{{完整的Bug描述}}

---
*This Bug Story needs to be manually created in Linear. Linear MCP was not available at time of creation.*
```

### 8. Confirm Bug Story Creation

Display confirmation:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug Story创建完成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug Story信息:
  ├─ 标题:                       {{Bug标题}}
  ├─ 团队:                       {{团队}}
  ├─ 状态:                       Backlog
  ├─ 优先级:                      {{优先级}}
  ├─ 标签:                        Bug, {{组件类型}}

下一步:
  → 分配给相应的开发人员

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**Bug Story创建完成。**"

"**下一步：分配Bug给开发人员**"

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Bug Story Created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug Story Status:
  ✅ Linear Issue created: {{Issue ID}}
  ✅ Bug information documented
  ✅ Priority and labels set
  ✅ Ready for assignment

Bug Story Details:
  Issue ID: {{Linear返回的Issue ID}}
  Issue URL: {{Linear返回的URL}}
  Title: {{Bug标题}}
  Priority: {{优先级}}
  Component: {{Frontend/Backend/Infrastructure}}

Next Step:

  [C] Proceed to Assign Bug to Developer
      → PM assigns bug to Frontend Dev or Backend Dev

  [A] Review Bug Story
      → Review or modify Bug Story details

  [P] Pause Discussion
      → Take a moment, review the Bug Story

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Proceed to Assign Bug to Developer):

Display: "**Proceeding to assign bug to developer...**"

1. Load, read entire `nextStepFile` (step-06-assign-bug-to-dev.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Review Bug Story):

- Display or retrieve Bug Story details from Linear
- Allow user to request changes
- Update Bug Story if needed using Linear MCP
- Wait for final confirmation
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the Bug Story. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PM role successfully maintained
- Linear MCP used (or fallback documented)
- Bug Story created in Linear with:
  - Complete bug title
  - Full description (with reproduction steps, expected/actual behavior, environment)
  - Appropriate team assignment
  - Correct priority level
  - Relevant labels (Bug, Frontend/Backend/Infrastructure)
- Bug story ID and URL recorded

### ❌ SYSTEM FAILURE:
- Not maintaining PM role
- Not using Linear MCP or implementing fallback
- Incomplete Bug Story (missing critical fields)
- Skipping Bug Story creation entirely

**Master Rule:** Proceeding to developer assignment without creating Bug Story is FORBIDDEN.
