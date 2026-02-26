---
name: 'step-01-verify-product-design'
description: 'Verify product design (PRD) completion and prepare for review'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-call-review-meeting.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-review/workflow.md'
---

# Step 1: Verify Product Design

## STEP GOAL:
As PM, to verify that the product design (PRD) is complete and ready for review by confirming availability of design materials and documentation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Verify readiness and coordinate next steps

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, proactive, professional coordinator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Verify project materials are complete before proceeding
- ✅ Coordinate with Product Designer

### Step-Specific Rules:
- 🎯 Focus on verifying product design completion (PRD)
- 🚫 FORBIDDEN to skip verification or proceed without confirming materials
- 💬 Approach: Professional verification, clear communication

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a verification step - confirm materials before reviewing

## CONTEXT BOUNDARIES:
- Available context: Feature name, PRD (if available), Product Designer materials
- Focus: Verify product design (PRD) materials are ready
- Limits: Don't proceed with review if materials are incomplete
- Dependencies: Product design (PRD) materials from Product Designer

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 7】Verify Product Design**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

这个问题我理解，让我来协调一下。

**产品评审工作流**现在开始。

我的职责是：
- 验证产品设计（PRD）材料完整性
- 协调各方参与评审
- 记录评审决定
- 更新项目状态"

Display PM communication style reminder:
- Phrase: "这个问题我理解，让我来协调一下"
- Approach: Professional coordination, stakeholder management

### 3. Display Current Workflow Status

Display workflow overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             产品评审工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流: product-review
目标: 产品设计完成后的多方评审
参与方: 产品设计 + 研发团队

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
流程概览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 验证产品设计（PRD）           ← 当前
Step 2: 召集评审会议
Step 3: 进行评审
Step 4: 收集反馈
Step 5: 确定评审结果
Step 6: 记录决定
Step 7: 更新Linear状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Explain Verification Requirements

Display verification requirements:

"**产品设计（PRD）验证要求:**"

"在开始评审之前，需要确认以下材料已准备就绪：

**必需材料:**
1. 产品需求文档（PRD）（由Product Designer提供）
   - 功能需求描述
   - 用户故事
   - 产品规格说明
   - 用户流程和界面定义

2. 支持材料（可选但推荐）:
   - 产品原型或设计稿
   - 用户旅程图
   - 设计规范

**验证标准:**
- ✅ PRD覆盖所有功能需求
- ✅ 用户故事完整清晰
- ✅ 产品规格明确可理解
- ✅ 用户流程逻辑完整"

### 5. Verify Product Design Materials

Display verification status:

"**正在验证产品设计（PRD）材料...**"

Present verification questions:

"请确认以下产品设计材料是否已准备就绪："

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       产品设计材料验证
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

材料项                      状态        描述
─────────────────────────────────────────────────────────────
PRD文档                     [ ]        包含功能需求、用户故事
产品原型                    [ ]        可演示或截图展示
用户旅程图                  [ ]        用户操作路径可视化
设计规范                    [ ]        关键决策和约束条件

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**请提供产品设计材料的位置或内容：**"
"例如：'PRD文档已准备好，位于...'"
"或：'产品设计已完成，包含...功能...'"

Wait for user confirmation or input about product design materials.

### 6. Process User Input

**IF 用户提供产品设计材料:**

Acknowledge and summarize:

"**✓ 产品设计（PRD）材料已确认！**"

Display received materials summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     已收到的产品设计材料
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{总结用户提供的材料信息}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Proceed to next step.

### 7. Display Review Readiness

Display readiness status:

"**产品设计（PRD）材料验证完成。**"

"**现在准备组织产品评审会议。**"

Display review preparation summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   产品评审准备状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 产品设计材料:           已确认
  → {{材料摘要}}
✓ 评审准备:               待进行
  → 召集评审参与人员
  → 设置评审议程

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**下一步：召集产品评审会议**"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Product Design Verified
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verification Status:
  ✅ Product design (PRD) materials confirmed
  ✅ Design completeness verified
  ✅ Ready for review

Next Step:

  [C] Proceed to Call Review Meeting
      → PM coordinates product review with stakeholders

  [A] Ask for Clarification
      → Request more details about design materials

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Proceed to Call Review Meeting):

Display: "**Proceeding to call product review meeting...**"

1. Load, read entire `nextStepFile` (step-02-call-review-meeting.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Ask specific clarifying questions about the product design materials
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
- Verification requirements explained clearly
- Product design (PRD) materials confirmed as ready
- Clear path provided to next step

### ❌ SYSTEM FAILURE:
- Not switching to PM role
- Not verifying product design materials
- Proceeding without confirming materials exist
- Skipping verification questions

**Master Rule:** Proceeding without verifying design materials is FORBIDDEN.
