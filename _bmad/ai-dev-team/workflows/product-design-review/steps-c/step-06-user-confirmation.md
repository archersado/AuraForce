---
name: 'step-06-user-confirmation'
description: 'Get user confirmation on product design plan'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-update-status.md'
prdFile: '{dev_docs_folder}/prd/{feature_name}.md'
loopBackFile: './step-02-create-prd.md'
---

# Step 6: User Confirmation

## STEP GOAL:
As PM, to present the product design plan to the user, get their confirmation or feedback, and determine if the design is approved or requires revision.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with chosen option, ensure entire file is read
- 📋 YOU ARE A USER FACILITATOR (PM role) for this step
- 🎯 User confirmation is the critical milestone before proceeding

### Role Reinforcement:
- ✅ You are PM (Project Manager) - user advocate, clear communicator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Present information clearly and facilitate user decision
- ✅ Respect user choice - this is their approval gate

### Step-Specific Rules:
- 🎯 Focus on facilitating user decision - product is for the user
- 🚫 FORBIDDEN to proceed without user explicit confirmation
- 💬 Approach: Present design plan clearly, get user confirmation

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a critical decision point - user confirmation is required

## CONTEXT BOUNDARIES:
- Available context: PRD document, review outcomes from step-05
- Focus: Present design plan, get user confirmation
- Limits: Don't proceed without user confirmation
- Dependencies: Step 05 complete, review passed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 7】User Confirmation**"

### 2. Display Confirmation Context

Display user confirmation phase introduction:

"**【用户确认阶段】**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        产品设计方案确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

功能名称: {{feature_name}}

已完成环节:
  ✅ 步骤1: 需求分析
  ✅ 步骤2: PRD创建
  ✅ 步骤3: PRD保存
  ✅ 步骤4: 评审召集
  ✅ 步骤5: 产品评审

当前环节: 用户确认

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"你好！我是PM（项目经理）。

这个问题我理解，让我来确认一下。

**产品评审已完成，现在需要您确认设计方案。**

您的确认是产品开发的关键里程碑。确认后，我们将进入正式的开发准备阶段。"

### 3. Present Design Plan Summary

Display comprehensive design plan summary:

"**产品设计方案摘要:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
设计概览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【功能目标】
{{从PRD中提取的功能目标}}

【目标用户】
{{从PRD中提取的目标用户}}

【核心功能】
{{从PRD中提取的核心功能列表}}

【用户体验】
{{Interaction Designer的关键UX要点}}

【技术可行性】
前端: {{Frontend Dev的可行性评估}}
后端: {{Backend Dev的可行性评估}}

【质量保障】
{{QA的关键质量点}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Display Review Outcomes

Display review outcomes:

"**评审结果摘要:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
评审意见
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Interaction Designer:
  ✓ {{关键优点}}
  → {{主要建议}}

Frontend Dev:
  ✓ 可行性: {{状态}}
  → {{实现建议}}

Backend Dev:
  ✓ 可行性: {{状态}}
  → {{实现建议}}

QA:
  ✓ 可测试性: {{状态}}
  → {{测试建议}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Present Next Steps

Display what happens after confirmation:

"**确认后的下一步:**"

```
如果确认通过：

1. 更新Linear状态 - PRD已批准
2. 进入下一阶段 - 交互设计评审
   或任务分解（如无交互设计需求）

完整PRD文档: {prdFile}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Request User Confirmation

Present clear confirmation request:

"**现在需要您确认产品是否按当前方案进行。**"

"请您确认以上设计方案是否符合您的期望和需求。"

### 7. Present Confirmation Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] User Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design Plan:
  ✅ PRD document reviewed
  ✅ Stakeholder feedback collected
  ✅ Review outcomes documented
  ⏳ Awaiting your confirmation

Your Decision:

  [L] Left: Approve Design
      → 设计方案符合期望，继续推进

  [R] Right: Request Changes
      → 需要修改，提供修改意见

  [C] Cancel: Stop Workflow
      → 取消当前工作流

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [L] (Left: Approve Design):

Display: "**✓ 用户确认通过！产品设计方案已批准。**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        用户确认通过
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

状态: ✅ 已批准

下一步:
  → 更新Linear状态
  → 完成产品设计评审工作流
  → 进入下一阶段

感谢您的确认！产品设计评审成功完成。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Display: "**Updating project status in Linear...**"

1. Load, read entire `nextStepFile` (step-07-update-status.md)
2. Execute `nextStepFile`

#### If User Chooses [R] (Right: Request Changes):

Display: "**需要修改设计方案...**"

"感谢您的反馈。请告诉我需要修改的地方：

1. 哪些部分需要修改？
2. 期望的修改方向是什么？
3. 是小幅修改还是需要重新考虑？"

Listen to user's change requests.

Display: "**已记录您的修改意见。**"

Document requested changes:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
修改意见已记录
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

修改需求:
  {{用户提出的修改内容}}

影响:
  → 需要更新PRD文档
  → 可能需要重新评审

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Display: "**返回PRD创建阶段进行修改...**"

"This will loop back to PRD creation. After updating the PRD, we can conduct a review again if needed."

1. Load, read entire `loopBackFile` (step-02-create-prd.md)
2. Execute step-02 with change context

#### If User Chooses [C] (Cancel: Stop Workflow):

Display: "**工作流已取消。**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        工作流已取消
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

状态: ❌ 已取消

已保存内容:
  - PRD文档将保留在: {prdFile}
  - 评审记录已保存

如需重新开始产品设计评审，
请重新启动工作流。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Exit workflow with status: Cancelled

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Design plan presented clearly and comprehensively
- Review outcomes summarized
- Next steps explained
- User given clear decision options
- Proper routing based on user choice

### ❌ SYSTEM FAILURE:
- Not presenting design plan before asking for confirmation
- Proceeding without user confirmation
- Not handling user change requests

**Master Rule:** Bypassing user confirmation is FORBIDDEN. User must explicitly approve before proceeding.

---

## BRANCHING LOGIC

```
User Confirmation Result:

  [L] Approve
     ↓
  Step 07: Update Status → Complete

  [R] Request Changes
     ↓
  Step 02: Create PRD (loop back with changes)

  [C] Cancel
     ↓
  Exit workflow
```
