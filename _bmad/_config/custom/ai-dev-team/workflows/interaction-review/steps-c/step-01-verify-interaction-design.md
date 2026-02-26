---
name: 'step-01-verify-interaction-design'
description: 'Verify interaction design completion and prepare for review'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-call-review-meeting.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/interaction-review/workflow.md'
---

# Step 1: Verify Interaction Design

## STEP GOAL:
As PM, to verify that the interaction design is complete and ready for review by confirming availability of design materials and documentation.

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
- ✅ Coordinate with Interaction Designer

### Step-Specific Rules:
- 🎯 Focus on verifying interaction design completion
- 🚫 FORBIDDEN to skip verification or proceed without confirming materials
- 💬 Approach: Professional verification, clear communication

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a verification step - confirm materials before reviewing

## CONTEXT BOUNDARIES:
- Available context: Feature name, PRD (if available), Interaction Designer materials
- Focus: Verify interaction design materials are ready
- Limits: Don't proceed with review if materials are incomplete
- Dependencies: Interaction design materials from Interaction Designer

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 8】Verify Interaction Design**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

这个问题我理解，让我来协调一下。

**交互设计评审工作流**现在开始。

我的职责是：
- 验证交互设计材料完整性
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
             交互设计评审工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流: interaction-review
目标: 交互设计完成后的研发评审
参与方: 产品设计团队 + 研发团队

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
流程概览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 验证交互设计                 ← 当前
Step 2: 召集评审会议
Step 3: 进行评审
Step 4: 收集反馈
Step 5: 确定评审结果
Step 6: 记录决定
Step 7: 保存设计文件
Step 8: 更新Linear状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Explain Verification Requirements

Display verification requirements:

"**交互设计验证要求:**"

"在开始评审之前，需要确认以下材料已准备就绪：

**必需材料:**
1. 交互设计文档（Interaction Designer提供）
   - 交互流程图
   - 页面原型
   - 交互说明和设计说明
   - 关键组件定义

2. 支持材料（可选但推荐）:
   - 设计系统组件规范
   - 交互动图说明
   - 用户旅程图

**验证标准:**
- ✅ 交互设计覆盖所有PRD功能点
- ✅ 流程逻辑清晰完整
- ✅ 原型可演示或清晰展示
- ✅ 设计说明文字完整"

### 5. Verify Interaction Design Materials

Display verification status:

"**正在验证交互设计材料...**"

Present verification questions:

"请确认以下交互设计材料是否已准备就绪："

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       交互设计材料验证
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

材料项                      状态        描述
─────────────────────────────────────────────────────────────
交互设计文档                [ ]        包含流程、原型、说明
交互流程图                  [ ]        用户操作流程可视化
页面原型                    [ ]        可演示或截图展示
设计说明                    [ ]        关键决策和约束条件

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**请提供交互设计材料的位置或内容：**"
"例如：'交互设计文档已准备好，位于...'"
"或：'交互原型已完成，包含...页面...'"

Wait for user confirmation or input about interaction design materials.

### 6. Process User Input

**IF 用户提供交互设计材料:**

Acknowledge and summarize:

"**✓ 交互设计材料已确认！**"

Display received materials summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     已收到的交互设计材料
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{总结用户提供的材料信息}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Proceed to next step.

### 7. Display Review Readiness

Display readiness status:

"**交互设计材料验证完成。**"

"**现在准备组织交互评审会议。**"

Display review preparation summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   交互评审准备状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 交互设计材料:          已确认
  → {{材料摘要}}
✓ 评审准备:               待进行
  → 召集评审参与人员
  → 设置评审议程

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**下一步：召集交互评审会议**"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Interaction Design Verified
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verification Status:
  ✅ Interaction design materials confirmed
  ✅ Design completeness verified
  ✅ Ready for review

Next Step:

  [C] Proceed to Call Review Meeting
      → PM coordinates interaction review with stakeholders

  [A] Ask for Clarification
      → Request more details about design materials

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Proceed to Call Review Meeting):

Display: "**Proceeding to call interaction review meeting...**"

1. Load, read entire `nextStepFile` (step-02-call-review-meeting.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Ask specific clarifying questions about the interaction design materials
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
- Interaction design materials confirmed as ready
- Clear path provided to next step

### ❌ SYSTEM FAILURE:
- Not switching to PM role
- Not verifying interaction design materials
- Proceeding without confirming materials exist
- Skipping verification questions

**Master Rule:** Proceeding without verifying design materials is FORBIDDEN.
