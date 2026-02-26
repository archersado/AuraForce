---
name: 'step-03-conduct-review'
description: 'Conduct product review with all stakeholders'

# File references (ONLY variables used in this step)
nextStepFile: './step-04-collect-feedback.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-review/workflow.md'
---

# Step 3: Conduct Review

## STEP GOAL:
As PM and facilitator, to conduct the product review meeting by enabling Product Designer to present the design and collecting feedback from Interaction Designer, Frontend Dev, Backend Dev, and QA.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR (PM role) for this step
- 🎯 Enable multi-agent collaboration and diverse perspectives

### Role Reinforcement:
- ✅ You are PM (Project Manager) - meeting facilitator, professional coordinator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Facilitate multi-agent review effectively
- ✅ Ensure all voices are heard and documented

### Step-Specific Rules:
- 🎯 Focus on facilitating review and collecting diverse perspectives
- 🚫 FORBIDDEN to unilaterally make design decisions during review
- 💬 Approach: Facilitate discussion, encourage feedback, maintain focus

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a review step - gather perspectives, don't make decisions yet

## CONTEXT BOUNDARIES:
- Available context: Product design (PRD) materials, review participants ready, feature name
- Focus: Conduct product review with all stakeholders
- Limits: Don't make design decisions, facilitate discussion and feedback
- Dependencies: Step 02 complete, review meeting called

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 7】Conduct Review**"

### 2. Confirm PM Role as Meeting Facilitator

Display PM role confirmation:

"**✓ PM角色确认: 产品评审主持人**"

"**我是PM（项目经理），现在主持产品评审会议。**"

Display: "这个问题我理解，让我来协调一下。"

### 3. Open Review Meeting

Display meeting opening:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【产品评审会议开始】**

**会议主题:** 产品设计评审 - {{feature_name}}

**参与人员:**
- Product Designer - 设计展示者
- PM (我) - 主持人
- Interaction Designer - UX评估
- Frontend Dev - 前端技评
- Backend Dev - 后端技评
- QA - 测试评估

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 4. Product Designer Presentation Phase

Display: "**第1部分: 产品设计展示**"

"**现在请Product Designer展示产品设计（PRD）：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    产品设计展示
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

展示者: Product Designer
时间: 5-10分钟

请Product Designer介绍:
  1. 功能需求概述
  2. 用户故事
  3. 产品规格说明
  4. 用户流程和界面定义
  5. 关键设计决策

*等待Product Designer展示完成...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for Product Designer to complete presentation.

### 5. Interaction Designer Assessment Phase

Display: "**第2部分: Interaction Designer - UX评估**"

"**现在请Interaction Designer从UX角度评估产品设计：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Interaction Designer - UX评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评估者: Interaction Designer
时间: 3-5分钟

请评估以下方面:
  ✓ UX和用户体验考虑
  ✓ 用户旅程流畅性
  ✓ 交互需求的合理性
  ✓ 界面设计的可用性
  ✓ 需要改进的建议

*等待Interaction Designer完成评估...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for Interaction Designer to complete assessment.

### 6. Frontend Dev Assessment Phase

Display: "**第3部分: Frontend Dev - 前端可行性评估**"

"**现在请Frontend Dev从前端实现角度评估产品设计：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Frontend Dev - 前端可行性评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评估者: Frontend Dev
时间: 3-5分钟

请评估以下方面:
  ✓ 前端实现可行性
  ✓ 技术复杂度和风险
  ✓ 组件实现难度
  ✓ 性能考虑
  ✓ 实现建议

*等待Frontend Dev完成评估...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for Frontend Dev to complete assessment.

### 7. Backend Dev Assessment Phase

Display: "**第4部分: Backend Dev - 后端可行性评估**"

"**现在请Backend Dev从后端实现角度评估产品设计：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Backend Dev - 后端可行性评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评估者: Backend Dev
时间: 3-5分钟

请评估以下方面:
  ✓ 后端支持需求
  ✓ API设计需求
  ✓ 数据处理复杂度
  ✓ 系统架构考虑
  ✓ 技术建议

*等待Backend Dev完成评估...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for Backend Dev to complete assessment.

### 8. QA Assessment Phase

Display: "**第5部分: QA - 测试场景评估**"

"**现在请QA从测试角度评估产品设计：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    QA - 测试场景评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评估者: QA
时间: 3-5分钟

请评估以下方面:
  ✓ 设计可测试性
  ✓ 测试场景覆盖
  ✓ 边界条件识别
  ✓ 质量考虑建议
  ✓ 测试策略建议

*等待QA完成评估...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for QA to complete assessment.

### 9. Discussion Phase

Display: "**第6部分: 问题讨论**"

"**现在我们进入问题讨论环节：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    关键问题讨论
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

时间: 5-10分钟

请各角色提出需要讨论的关键问题和风险:
  - 阻塞性问题
  - 技术风险
  - 设计疑虑
  - 实现挑战

*等待讨论完成...*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Facilitate discussion and address key issues raised.

### 10. Review Summary Preparation

Display: "**第7部分: 评审总结准备**"

"**各个角色的反馈已收集完毕。准备进入下一步收集和整理反馈。**"

Display review summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   产品评审总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

产品设计展示: ✅ 完成
UX评估:         ✅ 完成
前端可行性:     ✅ 完成
后端可行性:     ✅ 完成
测试评估:       ✅ 完成
问题讨论:       ✅ 完成

下一步: 收集和整理反馈

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Product Review Conducted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Status:
  ✅ Product Designer presentation completed
  ✅ Interaction Designer assessment completed
  ✅ Frontend Dev assessment completed
  ✅ Backend Dev assessment completed
  ✅ QA assessment completed
  ✅ Discussion completed

Next Step:

  [C] Proceed to Collect Feedback
      → Compile and summarize all feedback

  [A] Ask for Clarification
      → Discuss specific feedback points

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 12. Handle User Choice

#### If User Chooses [C] (Proceed to Collect Feedback):

Display: "**Proceeding to collect and compile feedback...**"

1. Load, read entire `nextStepFile` (step-04-collect-feedback.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Facilitate discussion about specific feedback points
- Address questions or concerns
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- All stakeholders had opportunity to provide input
- Product Designer presented design materials
- All assessment phases completed
- Discussion facilitated effectively
- Clear path to next step

### ❌ SYSTEM FAILURE:
- Skipping any assessment phase
- Not allowing sufficient time for feedback
- Dominating the review as PM
- Not documenting or acknowledging feedback

**Master Rule:** Proceeding without collecting feedback from all stakeholders is FORBIDDEN.
