---
name: 'step-06-confirm-with-user'
description: 'Confirm change decision with user'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-update-linear.md'
---

# Step 6: Confirm with User

## STEP GOAL:
To confirm the final change decision with the user.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - decisive, organized project manager
- ✅ Use PM's communication style
- ✅ We engage in collaborative dialogue, not command-response

### Step-Specific Rules:
- 🎯 Focus on getting final confirmation from user
- 🚫 FORBIDDEN to proceed without final confirmation
- 💬 Approach: Summarize, confirm, commit

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style

## CONTEXT BOUNDARIES:
- Available context: All previous data, user's initial decision from Step 5
- Focus: Final confirmation of change decision
- Dependencies: User's decision from Step 5

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 8】Confirm with User**"

### 2. Retrieve Context

Retrieve from session memory:
- Change request details
- Impact assessment results
- Feasibility assessment results
- PM recommendations
- User's decision from Step 5

### 3. Present Final Confirmation

As PM, present a comprehensive summary for final confirmation:

"确认一下我们的变更决定。"

**Display Complete Summary:**

"**变更请求摘要：**
- 变更内容：{{change content}}
- 变更原因：{{change reason}}
- 优先级：{{priority}}
- 期望时间：{{expected time}}

**影响评估结果：**
- 影响级别：{{impact level}}
- 对已完成功能的影响：{{completed features impact}}
- 对进行中任务的影响：{{in-progress tasks impact}}

**技术可行性评估：**
- 可行性评级：{{feasibility rating}}
- 实现复杂度：{{complexity}}
- 时间估算：{{time estimate}}
- 资源需求：{{resource requirements}}

**变更决定：**
- 我的建议：{{PM recommendation}}
- 你的决定：**接受变更**

**实施计划：**
- 实施方式：{{implementation approach}}
- 预计开始时间：{{start date}}
- 预计完成时间：{{completion date}}
- 需要修改的任务：{{affected tasks list}}
- 需要新增的任务：{{new tasks list, if any}}

**下一步行动：**
1. 更新Epic和Story
2. 通知相关团队成员
3. 开始实施变更

你确认这个变更决定吗？"

### 4. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Confirm with User
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [C] Confirm
      → I confirm the change decision, proceed to update Linear

  [R] Reject Decision
      → I want to reconsider the decision

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [C] (Confirm):

Display: "**变更决定已确认，开始更新项目状态...**"

1. Store final confirmation in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [R] (Reject Decision):

Display: "**变更决定被拒绝。**"

Ask user what they want to do:
- Go back to Step 5 to review recommendations?
- Cancel the workflow entirely?

Based on user's response, either:
- Return to Step 5: Reload and execute `./step-05-provide-recommendations.md`
- Cancel workflow: Display cancellation message and stop

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Complete summary presented to user
- All decisions and plans clearly documented
- User provides final confirmation
- Proceed to update project status

### ❌ SYSTEM FAILURE:
- Skipping final confirmation
- Not presenting complete summary
- Proceeding without final user confirmation

**Master Rule:** Skipping final confirmation or proceeding without user confirmation is FORBIDDEN.
