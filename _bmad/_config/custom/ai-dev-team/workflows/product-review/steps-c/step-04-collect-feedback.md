---
name: 'step-04-collect-feedback'
description: 'Collect and summarize feedback from all review participants'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-determine-result.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-review/workflow.md'
---

# Step 4: Collect Feedback

## STEP GOAL:
As PM, to collect, compile, and summarize all feedback from the review participants for comprehensive review analysis and result determination.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A COMPILER (PM role) for this step
- 🎯 Collect and organize feedback systematically

### Role Reinforcement:
- ✅ You are PM (Project Manager) - feedback compiler, documenter
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Compile feedback comprehensively and objectively
- ✅ Organize feedback for result determination

### Step-Specific Rules:
- 🎯 Focus on compiling feedback from all stakeholders
- 🚫 FORBIDDEN to filter or discount feedback unfairly
- 💬 Approach: Compile all feedback, organize by category and priority

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "让我来整理各方反馈意见"
- 🚫 This is a compilation step - gather, don't evaluate yet

## CONTEXT BOUNDARIES:
- Available context: Feedback from Product Designer, Interaction Designer, Frontend Dev, Backend Dev, QA
- Focus: Compile and organize feedback comprehensively
- Limits: Don't make evaluation judgments, just organize
- Dependencies: Step 03 complete, review conducted

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 7】Collect Feedback**"

### 2. Confirm PM Role

Display PM role confirmation:

"**✓ PM角色确认: 反馈收集与整理**"

"**我是PM（项目经理），现在负责收集和整理各方反馈意见。**"

Display: "这个问题我理解，让我来协调一下。让我来整理各方反馈意见。"

### 3. Display Feedback Compilation Process

Display compilation process overview:

"**反馈收集与整理流程:**"

"现在我来汇总所有角色的反馈意见，按照以下维度整理：

**反馈维度:**
1. 需求符合度 - 产品设计是否满足需求
2. UX考虑 - 用户体验和交互评估
3. 技术可行性 - 前后端实现考虑
4. 测试考虑 - 可测试性和质量评估
5. 风险识别 - 潜在问题和风险点
6. 改进建议 - 具体改进建议

**反馈分类:**
- 🔴 高优先级 - 阻塞性问题，必须解决
- 🟡 中优先级 - 重要问题，需要关注
- 🟢 低优先级 - 改进建议，可选优化"

### 4. Compile Feedback Summary

Display feedback compilation:

Display: "**正在收集和整理各方反馈意见...**"

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【产品评审反馈汇总】**

**评审主题:** {{feature_name}}

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

### 5. Present Feedback Summary Template

Display feedback structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                反馈汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Interaction Designer - UX评估
   =====================================
   评估维度: UX和用户体验

   ✅ 正面反馈:
     - {{正面反馈点1}}
     - {{正面反馈点2}}

   ⚠️  关注点:
     - [🔴/🟡/🟢] {{关注点1}}
     - [🔴/🟡/🟢] {{关注点2}}

   💡 改进建议:
     - {{建议1}}
     - {{建议2}}


2. Frontend Dev - 前端可行性评估
   =====================================
   评估维度: 前端实现可行性

   ✅ 正面反馈:
     - {{正面反馈点1}}
     - {{正面反馈点2}}

   ⚠️  关注点:
     - [🔴/🟡/🟢] {{关注点1}}
     - [🔴/🟡/🟢] {{关注点2}}

   💡 技术建议:
     - {{建议1}}
     - {{建议2}}


3. Backend Dev - 后端可行性评估
   =====================================
   评估维度: 后端实现可行性

   ✅ 正面反馈:
     - {{正面反馈点1}}
     - {{正面反馈点2}}

   ⚠️  关注点:
     - [🔴/🟡/🟢] {{关注点1}}
     - [🔴/🟡/🟢] {{关注点2}}

   💡 技术建议:
     - {{建议1}}
     - {{建议2}}


4. QA - 测试场景评估
   =====================================
   评估维度: 可测试性和质量考虑

   ✅ 正面反馈:
     - {{正面反馈点1}}
     - {{正面反馈点2}}

   ⚠️  关注点:
     - [🔴/🟡/🟢] {{关注点1}}
     - [🔴/🟡/🟢] {{关注点2}}

   💡 测试建议:
     - {{建议1}}
     - {{建议2}}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                问题汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

高优先级问题 (🔴):
  1. {{问题1}}
  2. {{问题2}}

中优先级问题 (🟡):
  1. {{问题1}}
  2. {{问题2}}

低优先级建议 (🟢):
  1. {{建议1}}
  2. {{建议2}}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                风险评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

技术风险:
  - {{风险描述}}

实现风险:
  - {{风险描述}}

质量风险:
  - {{风险描述}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait to collect and compile all feedback.

### 6. Confirm Feedback Completeness

Display completeness check:

"**以上是汇总的各方反馈意见。**

请确认反馈是否完整，或者补充遗漏的反馈点：

**反馈完整性检查:**
- ✅ Interaction Designer反馈 - [ ] 已包含
- ✅ Frontend Dev反馈 - [ ] 已包含
- ✅ Backend Dev反馈 - [ ] 已包含
- ✅ QA反馈 - [ ] 已包含

**如有遗漏或需要补充，请立即提出。**"

Wait for confirmation and any additional feedback.

### 7. Analyze Feedback for Decision Guidance

Display feedback analysis:

"**基于收集的反馈，进行初步分析：**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            反馈分析概览
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需求符合度: {{评估 (高/中/低)}}
技术可行性: {{评估 (高/中/低)}}
UX评分:     {{评估 (高/中/低)}}
可测试性:   {{评估 (高/中/低)}}

关键问题统计:
  🔴 高优先级: {{数量}}个 - {{描述}}
  🟡 中优先级: {{数量}}个 - {{描述}}
  🟢 低优先级: {{数量}}个 - {{描述}}

综合评估:
  {{整体评估摘要}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Display Compilation Summary

Display:

"**反馈收集与整理完成。**

综合以上各角色的反馈，我们可以进入下一步确定评审结果。"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   反馈收集状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Interaction Designer反馈: 已收集
✅ Frontend Dev反馈:     已收集
✅ Backend Dev反馈:      已收集
✅ QA反馈:               已收集
✅ 问题汇总:             已完成
✅ 风险评估:             已完成

下一步: 确定评审结果

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Feedback Collected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feedback Compilation:
  ✅ Interaction Designer feedback collected
  ✅ Frontend Dev feedback collected
  ✅ Backend Dev feedback collected
  ✅ QA feedback collected
  ✅ Issues categorized by priority
  ✅ Risks identified

Next Step:

  [C] Proceed to Determine Result
      → Analyze feedback and determine review outcome

  [A] Ask for Clarification
      → Discuss specific feedback items

  [P] Pause Discussion
      → Review feedback summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Proceed to Determine Result):

Display: "**Proceeding to determine review result...**"

1. Load, read entire `nextStepFile` (step-05-determine-result.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Facilitate discussion about specific feedback items
- Provide additional context or clarification
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the feedback. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Feedback from all stakeholders collected
- Feedback categorized by priority and dimension
- Issues documented comprehensively
- Risks identified and summarized
- Clear analysis provided for result determination

### ❌ SYSTEM FAILURE:
- Missing feedback from any stakeholder
- Not categorizing feedback by priority
- Discounting feedback unfairly
- Incomplete feedback compilation

**Master Rule:** Proceeding without collecting feedback from all stakeholders is FORBIDDEN.
