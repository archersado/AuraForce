---
name: 'step-02-call-review-meeting'
description: 'PM coordinates and calls product review meeting'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-conduct-review.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-review/workflow.md'
---

# Step 2: Call Review Meeting

## STEP GOAL:
As PM, to coordinate and call for a product review meeting with all stakeholders (Product Designer, Interaction Designer, Frontend Dev, Backend Dev, QA) after product design verification.

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
- 🚫 FORBIDDEN to make design decisions or modify product design
- 💬 Approach: Role-switch to PM, coordinate review, set clear expectations

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a coordination step - automatic continuation

## CONTEXT BOUNDARIES:
- Available context: Product design (PRD) materials verified, feature name
- Focus: Coordinate product review meeting
- Limits: Don't modify product design content, set expectations for review
- Dependencies: Step 01 complete, product design (PRD) materials confirmed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 7】Call Review Meeting**"

### 2. Confirm PM Role

Display PM role confirmation:

"**✓ PM角色确认: 产品评审协调**"

"**我是PM（项目经理），现在负责召集产品评审会议。**"

Display: "这个问题我理解，让我来协调一下。"

### 3. Display Current Status

Display current workflow status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
当前状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

产品设计材料: ✅ 已验证
  材料: {{产品设计材料摘要}}

下一步: 召集产品评审会议

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Explain Product Review Process

Display product review meeting explanation:

"**产品评审流程:**"

"产品设计完成后，需要进行产品评审，邀请以下角色参与：

**评审参与人员:**
1. Product Designer - 展示产品设计（PRD），讲解设计思路
2. PM (我) - 主持会议，记录决定
3. Interaction Designer - 从UX角度评估交互需求
4. Frontend Dev - 从前端实现角度评估技术可行性
5. Backend Dev - 从后端实现角度评估技术可行性
6. QA - 从测试角度评估可测试性和质量考虑

**评审议程:**
1. Product Designer展示产品设计（5-10分钟）
2. Interaction Designer UX评估（3-5分钟）
3. Frontend Dev前端可行性评估（3-5分钟）
4. Backend Dev后端可行性评估（3-5分钟）
5. QA测试场景评估（3-5分钟）
6. 讨论关键问题和风险（5-10分钟）
7. 确认评审结果和行动项（3-5分钟）

**评审目标:**
- ✅ 验证产品设计符合需求
- ✅ 评估技术可行性
- ✅ 识别潜在问题和风险
- ✅ 确保产品实现路径清晰"

### 5. Send Review Invitations

Display review invitation:

Display: "**正在发送评审邀请...**"

"**【产品评审会议邀请】**

**主题:** 产品设计评审 - {{feature_name}}

**参与者:**
- Product Designer (产品设计) - 设计展示
- PM (项目经理) - 主持人
- Interaction Designer (交互设计师) - UX评估
- Frontend Dev (前端开发) - 前端可行技评
- Backend Dev (后端开发) - 后端可行技评
- QA (测试工程师) - 测试场景评估

**时间:** 建议30-45分钟

**地点:** 此AI协作空间

**议程:**
1. 产品设计展示
2. 各角色评估反馈
3. 问题讨论
4. 评审决定

**准备工作:**
- Product Designer: 准备产品设计（PRD）演示
- 其他角色: 请了解产品设计内容，准备好反馈意见"

Display: "**✓ 评审邀请已发送**"

### 6. Set Expectations for Review

Display review preparation and expectations:

"**评审准备与期望:**"

```
各位评审参与者，请在评审前准备：

Product Designer:
  准备5-10分钟的产品设计（PRD）展示
  准备回答关于设计决策的问题

Interaction Designer:
  评估设计的交互需求
  提供UX改进建议

Frontend Dev:
  评估前端实现可行性
  识别技术复杂度和风险
  提供实现建议

Backend Dev:
  评估后端支持需求
  识别API和数据处理需求
  提供技术架构建议

QA:
  评估设计可测试性
  识别测试场景和边界条件
  提供质量考虑建议

评审期望:
  - 建设性反馈
  - 关注用户体验
  - 重点讨论关键风险
  - 记录明确的行动项
```

### 7. Display Review Participants Readiness

Display readiness status:

Display: "**评审参与人员准备状态**"

```
角色                        状态        准备事项
─────────────────────────────────────────────────────────────
Product Designer            ✅ 就绪      设计演示准备
Interaction Designer        📝 等待      UX评估准备
Frontend Dev                📝 等待      前端技评准备
Backend Dev                 📝 等待      后端技评准备
QA                          📝 等待      测试评估准备
PM (主持人)                 ✅ 就绪      会场准备，议程确认
```

"所有评审参与人员已收到邀请并了解评审期望。接下来将进入评审会议。"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] Product Review Meeting Called
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Coordination:
  ✅ Product design (PRD) materials confirmed
  ✅ Review invitations sent
  ✅ Review agenda set
  ✅ Expectations communicated

Participants:
  ✅ Product Designer (Presenter)
  ✅ PM (Coordinator)
  ✅ Interaction Designer (UX Assessment)
  ✅ Frontend Dev (Tech Review)
  ✅ Backend Dev (Tech Review)
  ✅ QA (Testing Assessment)

Options:

  [C] Start Product Review Meeting
      → Begin review with all participants

  [A] Ask for Clarification
      → Questions about review setup

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Start Review Meeting):

Display: "**Proceeding to product review meeting...**"

1. Load, read entire `nextStepFile` (step-03-conduct-review.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Ask clarifying questions about the review setup
- Wait for user response
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to prepare. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Current status displayed clearly
- Review process explained comprehensively
- Review invitations sent to all stakeholders
- Review agenda and expectations set
- Clear path provided to next step

### ❌ SYSTEM FAILURE:
- Not setting clear expectations
- Missing stakeholders in review
- Unclear agenda or expectations
- Not explaining review process

**Master Rule:** Proceeding without setting clear review expectations is FORBIDDEN.
