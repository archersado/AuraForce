---
name: 'step-04-collect-feedback'
description: 'Collect and summarize feedback from all review participants'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-determine-result.md'
reviewRecordFile: '{artifacts_folder}/reviews/interaction/{feature_name}-review-record.md'
---
# Step 4: Collect Feedback

## STEP GOAL:
To collect, organize, and summarize all feedback gathered during the review session from Product Designer, Frontend Dev, Backend Dev, and QA for analysis and decision-making.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FEEDBACK ORGANIZER (PM role) for this step
- 🎯 Systematically organize and present collected feedback

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organizer, analyst, documenter
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Organize feedback systematically for decision-making
- ✅ Ensure all feedback is captured and acknowledged

### Step-Specific Rules:
- 🎯 Focus on compiling and organizing feedback from Step 3
- 🚫 FORBIDDEN to dismiss or ignore stakeholder feedback
- 💬 Approach: Systematic compilation, balanced presentation

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来整理一下反馈"
- 🚫 This is a feedback compilation step - organize and prepare for decision

## CONTEXT BOUNDARIES:
- Available context: All stakeholder assessments from Step 3
- Focus: Compile, organize, and present feedback for decision-making
- Limits: Don't make decisions yet - just organize information
- Dependencies: Step 03 complete, stakeholder assessments collected

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 8】Collect Feedback**"

### 2. Confirm Role and Purpose

Display PM role confirmation:

"**✓ PM角色确认: 反馈整理与分析**"

"**我是PM（项目经理），现在负责整理各方反馈。**"

Display: "这个问题我理解，让我来整理一下反馈。"

### 3. Display Feedback Collection Status

Display feedback collection overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      反馈收集阶段
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

已完成:
  ✅ Interaction Designer - 交互设计展示
  ✅ Product Designer    - 需求一致性验证
  ✅ Frontend Dev        - 前端技术评估
  ✅ Backend Dev         - 后端技术评估
  ✅ QA                  - 测试评估

当前任务: 整理并汇总所有反馈

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Compile Feedback Summary

Display: "**正在整理各方反馈...**"

Present comprehensive feedback summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     交互评审反馈汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审内容: {{feature_name}} 交互设计

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Product Designer 需求一致性反馈
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 需求覆盖: {{评估结果}}

  符合点:
    - {{具体符合点1}}
    - {{具体符合点2}}

  差异点/建议:
    - {{差异点1}}
    - {{差异点2}}

  补充建议:
    - {{建议1}}
    - {{建议2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. Frontend Dev 前端技术反馈
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 可行性: {{评估结果}}

  技术复杂度: {{低/中/高}}

  主要风险:
    - {{风险1}}
    - {{风险2}}

  实现建议:
    - {{建议1}}
    - {{建议2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. Backend Dev 后端技术反馈
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 可行性: {{评估结果}}

  技术复杂度: {{低/中/高}}

  主要风险:
    - {{风险1}}
    - {{风险2}}

  接口需求:
    - {{接口1}}
    - {{接口2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. QA 测试反馈
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 可测试性: {{评估结果}}

  主要测试场景:
    - {{场景1}}
    - {{场景2}}

  质量风险:
    - {{风险1}}
    - {{风险2}}

  测试建议:
    - {{建议1}}
    - {{建议2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Identify Critical Issues

Display: "**正在识别关键问题和风险...**"

"基于各方反馈，识别出的关键问题："

Display critical issues summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     关键问题汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 高优先级问题 (阻塞性):
  [ ] {{高优先级问题1}}
  [ ] {{高优先级问题2}}

🟡 中优先级问题 (需解决):
  [ ] {{中优先级问题1}}
  [ ] {{中优先级问题2}}

🟢 低优先级建议 (可优化):
  [ ] {{低优先级建议1}}
  [ ] {{低优先级建议2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for user confirmation on critical issues.

### 6. Synthesize Feedback Themes

Display feedback themes analysis:

"**请确认反馈汇总和关键问题是否准确。**"

"另外，我注意到以下反馈主题值得注意："

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     反馈主题分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

重复出现的问题:
  - {{多个角色提到的共同问题}}
  - {{另一个共同关注点}}

技术可行性共识:
  - {{Frontend和Backend都认可的方面}}
  - {{共同的技术建议}}

用户体验共识:
  - {{Product Designer和Interaction Designer的一致意见}}
  - {{关于UX的共同建议}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Prepare for Decision Making

Display preparation for decision:

"**反馈已整理完成。**"

"**现在准备确定评审结果。**"

Display analysis summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    评审决策分析准备
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 正面反馈:
  - {{收集到的正面评价}}
  - {{各方认可的方面}}

⚠ 需要讨论的问题:
  - 共识问题: {{数量}个
  - 待解决问题: {{数量}个

📊 总体评估:
  - 需求符合度: {{评估}}
  - 技术可行性: {{评估}}
  - 实现复杂度: {{评估}}
  - 测试覆盖: {{评估}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Feedback Collection Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feedback Compiled:
  ✅ Product Designer - Requirement validation feedback
  ✅ Frontend Dev - Technical feasibility feedback
  ✅ Backend Dev - Technical feasibility feedback
  ✅ QA - Testing feedback
  ✅ Critical issues identified
  ✅ Feedback themes analyzed

Next Step:

  [C] Determine Review Result
      → Analyze feedback and determine outcome

  [A] Adjust Feedback Summary
      → Make corrections to the feedback summary

  [P] Pause Discussion
      → Take a moment to review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Determine Result):

Display: "**Proceeding to determine review result...**"

1. Load, read entire `nextStepFile` (step-05-determine-result.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Adjust Feedback Summary):

- Allow user to correct or add to the feedback summary
- Update the compiled feedback
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the feedback. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- All stakeholder feedback compiled comprehensively
- Critical issues identified and prioritized
- Feedback themes analyzed
- Clear preparation for decision-making provided
- User confirmation received on feedback accuracy

### ❌ SYSTEM FAILURE:
- Missing or incomplete stakeholder feedback
- Not identifying critical issues
- Dismissing stakeholder input
- Unorganized feedback presentation

**Master Rule:** Decision-making without complete feedback analysis is FORBIDDEN.
