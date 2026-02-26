---
name: 'step-06-assign-bug-to-dev'
description: 'PM assigns bug to Frontend Dev or Backend Dev'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-developer-fix.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 6: Assign Bug to Developer

## STEP GOAL:
As PM, to assign the Bug Story to the appropriate developer (Frontend Dev or Backend Dev) and update the bug status using Linear MCP.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Assign bug to appropriate developer

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, assignment-focused, communication-driven
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Assign bug based on component type
- ✅ Update Linear bug status

### Step-Specific Rules:
- 🎯 Focus on correct developer assignment and status update
- 🚫 FORBIDDEN to skip assignment or assign incorrectly
- 💬 Approach: Clear assignment, communication, expectation setting
- 🔌 Use Linear MCP for actual assignment

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "我来分配这个Bug给对应的开发人员"
- 🔌 ACTUALLY USE Linear MCP to update the bug assignment
- 🚫 This is an assignment step - communicate clearly

## CONTEXT BOUNDARIES:
- Available context: Linear Bug Story ID, component classification
- Focus: Assign bug to appropriate developer
- Limits: Don't proceed without completing assignment
- Dependencies: Bug Story, component type, developer availability

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 10】Assign Bug to Developer**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

我来分配这个Bug给对应的开发人员。

**Bug分配给开发人员**现在开始。

我的职责是：
- 确定合适的开发人员
- 分配Bug Story
- 设置期望和优先级
- 更新Bug状态"

Display PM communication style reminder:
- Phrase: "我来分配这个Bug给对应的开发人员"
- Approach: Clear assignment, priority communication

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
Step 6: 分配Bug给开发                ← 当前
Step 7: 开发修复Bug
Step 8: QA验证修复
Step 9: 确定修复结果 (循环点)
Step 10: 关闭Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Display Bug Assignment Information

Display bug and developer information:

"**Bug分配信息:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug分配信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug Story:
  ├─ Issue ID:                    {{Bug Story ID}}
  ├─ 标题:                        {{Bug标题}}
  ├─ 组件类型:                    {{Frontend Bug / Backend Bug}}
  ├─ 优先级:                       {{Urgent/High/Normal/Low}}

分配决定:
  └─ 目标开发人员:                {{Frontend Dev / Backend Dev}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Check Developer Availability

Display developer availability check:

"**检查开发人员可用性...**"

**Use Linear MCP to list available developers:**

```
Use Linear MCP: list_users
```

Display developer information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      可用的开发人员
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend开发人员:
{{显示Frontend开发人员列表}}

Backend开发人员:
{{显示Backend开发人员列表}}

选择:
  组件类型:                     {{Frontend Bug / Backend Bug}}
  建议分配给:                   {{建议的开发人员}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Prepare Assignment Details

Display assignment preparation:

"**准备分配详情...**"

Prepare and display the assignment details:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug分配预览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

分配到:
  └─ Bug类型:                   {{Frontend Bug / Backend Bug}}

目标开发人员:
  ├─ 开发人员:                   {{开发人员名称}}
  ├─ 开发人员ID:                 {{开发人员ID}}
  └─ 当前工作负载:               {{低/中/高}}

分配信息:
  ├─ Bug Story ID:              {{Bug Story ID}}
  ├─ Bug标题:                   {{Bug标题}}
  ├─ 优先级:                     {{优先级}}

状态更新:
  ├─ 当前状态:                   Backlog
  └─ 新状态:                     Todo / In Development

期望:
  → 开发人员确认收到分配
  → 开发人员评估修复时间
  → 开发人员进行修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Assign Bug Using Linear MCP

"**正在使用Linear MCP分配Bug...**"

**ACTUALLY USE Linear MCP to update the Bug assignment:**

```
Use Linear MCP: update_issue
Parameters:
  id: "{{Bug Story ID}}"
  assignee: "{{开发人员名称或ID}}"
  state: "Todo"
```

Display assignment result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug分配结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

分配状态:                      [✓ 成功] / [✗ 失败]

成功信息:
  Bug Story ID:                {{Bug Story ID}}
  Bug标题:                     {{Bug标题}}
  被分配给:                    {{开发人员名称}}
  状态已更新为:                Todo

通知信息:
  → 开发人员将收到分配通知
  → Bug现在显示在开发人员的待办列表中

失败处理:
  如果Linear MCP不可用或分配失败：
  1. 记录分配失败原因
  2. 提供手动分配指导
  3. 继续工作流程

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF Linear assignment successful:**
Display: "**✓ Bug已成功分配给开发人员！**"

**IF Linear MCP unavailable or fails:**
Display: "**⚠ Linear分配失败，请手动进行分配...**"

Provide manual assignment instructions:
1. 打开Linear中的Bug Story
2. 点击"Assignee"字段
3. 选择开发人员
4. 更新状态为"Todo"

### 8. Display Assignment Summary

Display assignment summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug分配总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug:                           {{Bug标题}}
Bug Story ID:                  {{Bug Story ID}}
─────────────────────────────────────────────────────────────

分配信息:
  开发人员:                     {{开发人员名称}}
  分配时间:                     {{当前时间}}

Bug信息:
  Bug类型:                      {{Frontend Bug / Backend Bug}}
  优先级:                       {{Urgent/High/Normal/Low}}
  当前状态:                     Todo

下一步:
  → 开发人员接收并确认分配
  → 开发人员开始Bug修复

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**Bug分配完成。**"

"**下一步：开发人员修复Bug**"

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Bug Assigned
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Assignment Status:
  ✅ Bug assigned to developer
  ✅ Linear status updated: Todo
  ✅ Developer notified

Assignment Details:
  Bug Story ID: {{Bug Story ID}}
  Assigned To: {{开发人员名称}}
  Bug Type: {{Frontend Bug / Backend Bug}}
  Priority: {{优先级}}

Next Step:

  [C] Proceed to Developer Fix
      → Developer fixes the bug

  [A] Review Assignment
      → Review or modify assignment details

  [P] Pause Discussion
      → Take a moment, review assignment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Proceed to Developer Fix):

Display: "**Proceeding to developer fix implementation...**"

1. Load, read entire `nextStepFile` (step-07-developer-fix.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Review Assignment):

- Display assignment details from Linear
- Allow user to request changes to assignment
- Re-assign if needed using Linear MCP
- Wait for final confirmation
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the assignment. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PM role successfully maintained
- Linear MCP used (or fallback documented)
- Bug assigned to appropriate developer:
  - Frontend Dev for frontend bugs
  - Backend Dev for backend bugs
- Linear bug status updated to "Todo" or "In Development"
- Assignment details confirmed

### ❌ SYSTEM FAILURE:
- Not maintaining PM role
- Not using Linear MCP or implementing fallback
- Incorrect developer assignment (wrong component type)
- Not updating bug status

**Master Rule:** Proceeding to developer fix without completing assignment is FORBIDDEN.
