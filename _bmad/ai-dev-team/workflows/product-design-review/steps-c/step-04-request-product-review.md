---
name: 'step-04-request-product-review'
description: 'PM coordinates and requests product review meeting'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-conduct-review.md'
prdFile: '{dev_docs_folder}/prd/{feature_name}.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-design-review/workflow.md'
---

# Step 4: Request Product Review

## STEP GOAL:
As PM, to coordinate and request a product review meeting with all stakeholders (Interaction Designer, Frontend Dev, Backend Dev, QA) after PRD creation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Facilitate stakeholder communication and meeting coordination

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, proactive, professional coordinator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Coordinate meetings and stakeholders effectively
- ✅ Maintain clear communication and expectations

### Step-Specific Rules:
- 🎯 Focus on coordinating product review meeting
- 🚫 FORBIDDEN to make design decisions or modify PRD
- 💬 Approach: Role-switch to PM, coordinate review, set clear expectations

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a coordination step - automatic continuation

## CONTEXT BOUNDARIES:
- Available context: PRD saved from step-03, feature name from earlier steps
- Focus: Coordinate product review meeting
- Limits: Don't modify PRD content, set expectations for review
- Dependencies: Step 03 complete, PRD document saved

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 7】Request Product Review**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: Product Designer → PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

这个问题我理解，让我来协调一下。

**PRD文档已完成**，现在我需要召集产品评审会议。"

Display PM communication style reminder:
- Phrase: "这个问题我理解，让我来协调一下"
- Approach: Professional coordination, stakeholder management

### 3. Display Current Status

Display current workflow status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
当前状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRD文档: ✅ 已完成
  文件: {prdFile}

下一步: 召集产品评审会议

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Explain Review Process

Display product review meeting explanation:

"**产品评审流程:**"

"PRD完成后，需要进行产品评审，邀请以下角色参与：

**评审参与人员:**
1. Product Designer - 展示PRD，讲解设计思路
2. PM (我) - 主持会议，记录决定
3. Interaction Designer - 从交互设计角度评估
4. Frontend Dev - 从前端实现角度评估技术可行性
5. Backend Dev - 从后端实现角度评估技术可行性
6. QA - 从测试角度评估可测试性和质量考虑

**评审议程:**
1. Product Designer展示PRD（5-10分钟）
2. 各角色从专业角度提供反馈（各3-5分钟）
3. 讨论关键问题和风险（5-10分钟）
4. 确认评审结果和行动项（3-5分钟）

**评审目标:**
- ✅ 确认PRD完整性
- ✅ 评估技术可行性
- ✅ 识别潜在风险
- ✅ 确保设计实现路径清晰"

### 5. Send Review Invitations

Display review invitation:

Display: "**正在发送评审邀请...**"

"**【产品评审会议邀请】**

**主题:** PRD评审 - {{feature_name}}

**参与者:**
- Product Designer (产品设计师)
- PM (项目经理) - 主持人
- Interaction Designer (交互设计师)
- Frontend Dev (前端开发)
- Backend Dev (后端开发)
- QA (测试工程师)

**时间:** 建议30-45分钟

**地点:** 此AI协作空间

**议程:**
1. PRD展示
2. 角色反馈
3. 问题讨论
4. 评审决定

**准备工作:**
- 大家已收到PRD文档: {prdFile}
- 请提前阅读文档，准备好反馈意见"

Display: "**✓ 评审邀请已发送**"

### 6. Set Expectations for Review

Display review preparation and expectations:

"**评审准备与期望:**"

```
各位评审参与者，请在评审前准备：

Product Designer:
  准备5-10分钟的PRD展示
  准备回答关于设计决策的问题

Interaction Designer:
  评估交互设计可行性
  识别潜在的UX问题和改进点

Frontend Dev:
  评估前端实现可行性
  识别技术复杂度和风险
  提供实现建议

Backend Dev:
  评估后端实现可行性
  识别接口设计需求
  提供架构建议

QA:
  评估可测试性
  识别潜在质量风险
  提供测试场景建议

评审期望:
  - 建设性反馈
  - 关注可实现的方案
  - 重点讨论关键风险
  - 记录明确的行动项
```

### 7. Display Review Participants Readiness

Display readiness status:

Display: "**评审参与人员准备状态**"

```
角色                        状态        准备事项
─────────────────────────────────────────────────────────────
Product Designer            ✅ 就绪      PRD展示准备
Interaction Designer        📝 等待      阅读PRD，准备UX反馈
Frontend Dev                📝 等待      阅读PRD，准备技评
Backend Dev                 📝 等待      阅读PRD，准备技评
QA                          📝 等待      阅读PRD，准备Q评
PM (主持人)                 ✅ 就绪      会场准备，议程确认
```

"所有评审参与人员已收到邀请并了解评审期望。接下来将进入评审会议。"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Product Review Requested
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Coordination:
  ✅ PRD document location confirmed
  ✅ Review invitations sent
  ✅ Review agenda set
  ✅ Expectations communicated

Participants:
  ✅ Product Designer (Presenter)
  ✅ PM (Coordinator)
  ✅ Interaction Designer (UX Review)
  ✅ Frontend Dev (Tech Review)
  ✅ Backend Dev (Tech Review)
  ✅ QA (QA Review)

Options:

  [C] Start Review Meeting
      → Begin product review with all participants

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Start Review Meeting):

Display: "**Proceeding to product review meeting...**"

1. Load, read entire `nextStepFile` (step-05-conduct-review.md)
2. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PM role successfully adopted
- Current workflow status displayed clearly
- Review process explained comprehensively
- Review invitations sent to all stakeholders
- Review agenda and expectations set
- Clear path provided to next step

### ❌ SYSTEM FAILURE:
- Not switching to PM role
- Not sending review invitations
- Missing stakeholders in review
- Unclear agenda or expectations

**Master Rule:** Proceeding without coordinating review is FORBIDDEN.
