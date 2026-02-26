---
name: 'step-05-determine-result'
description: 'Determine product review result based on collected feedback'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-record-decisions.md'
redesignStepFile: './step-01-verify-product-design.md'
---

# Step 5: Determine Result

## STEP GOAL:
To analyze the compiled feedback and determine the review result: Approved (no changes needed), Minor Modification (updates required), or Redesign (significant changes needed).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DECISION FACILITATOR (PM role) for this step
- 🎯 Guide user through objective decision-making process

### Role Reinforcement:
- ✅ You are PM (Project Manager) - decision facilitator, objective analyst
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Facilitate objective decision-making based on feedback
- ✅ Ensure decision is well-documented and defensible

### Step-Specific Rules:
- 🎯 Focus on facilitating result determination based on collected feedback
- 🚫 FORBIDDEN to unilaterally determine result without user input
- 💬 Approach: Present options objectively, let user decide

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "基于反馈分析，我们来确定评审结果"
- 🚫 This is a decision step - present options, don't decide for user

## CONTEXT BOUNDARIES:
- Available context: Compiled feedback from Step 4, critical issues identified
- Focus: Determine review outcome based on feedback analysis
- Limits: Don't make decision for user - facilitate decision process
- Dependencies: Step 04 complete, feedback analyzed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 7】Determine Result**"

### 2. Review Feedback Context

Display feedback review reminder:

"**✓ PM角色确认: 评审结果判定**"

"**我是PM（项目经理），现在帮助确定评审结果。**"

Display: "基于反馈分析，我们来确定评审结果。"

Display feedback context:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    反馈分析回顾
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需求符合度: {{评估}}
技术可行性: {{评估}}
UX评分:     {{评估}}
可测试性:   {{评估}}

关键问题:
  🔴 高优先级: {{数量}}个
  🟡 中优先级: {{数量}}个
  🟢 低优先级: {{数量}}个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Explain Result Options

Display: "**产品评审有以下三种可能的结果：**"

Display result options explanation:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     评审结果选项
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[通过] 产品设计通过
  ┌─────────────────────────────────────┐
  │ 适用条件:                            │
  │   ✓ 需求完全符合                     │
  │   ✓ 技术完全可行                     │
  │   ✓ UX评估良好                       │
  │   ✓ 无阻塞性问题                     │
  │   ✓ 仅有minor优化建议                │
  │                                      │
  │ 后续步骤:                            │
  │   → 记录决定                         │
  │   → 更新Linear状态                   │
  │   → 可进入交互设计阶段               │
  └─────────────────────────────────────┘

[修改] 需要修改
  ┌─────────────────────────────────────┐
  │ 适用条件:                            │
  │   ✓ 基本符合需求                     │
  │   ✓ 技术基本可行                     │
  │   ✓ UX评估可接受                     │
  │   ✓ 有可明确的修改意见               │
  │   ✓ 修改后可通过                     │
  │                                      │
  │ 后续步骤:                            │
  │   → 记录修改要求                     │
  │   → Product Designer修改设计          │
  │   → 快速二次评审                     │
  │   → 确认后更新状态                   │
  └─────────────────────────────────────┘

[重做] 需要重做
  ┌─────────────────────────────────────┐
  │ 适用条件:                            │
  │   ✗ 需求不符合或有重大遗漏           │
  │   ✗ 技术不可行或有重大风险           │
  │   ✗ UX评估不可接受                  │
  │   ✓ 需要重大设计调整                 │
  │   ✓ 当前方案不可用                   │
  │                                      │
  │ 后续步骤:                            │
  │   → 记录重做原因                     │
  │   → 返回产品设计阶段                 │
  │   → 重新进行评审流程                 │
  └─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Analyze for Decision Guidance

Display: "**基于当前反馈，建议的决策路径分析：**"

Present decision guidance:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     决策路径分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

支持[通过]的因素:
  - {{支持通过的因素1}}
  - {{支持通过的因素2}}

支持[修改]的因素:
  - {{支持修改的因素1}}
  - {{支持修改的因素2}}

支持[重做]的因素:
  - {{支持重做的因素1}}
  - {{支持重做的因素2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Display: "以上分析仅供参考，最终结果需要您来决定。"

### 5. Present Result Decision Menu

Display decision menu:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Determine Review Result
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on the collected feedback analysis:

  [A] APPROVED - 产品设计通过
      → Product design passes review
      → Proceed to record decisions

  [M] MODIFICATION NEEDED - 需要修改
      → Updates required before approval
      → Record modification requirements

  [R] REDESIGN REQUIRED - 需要重做
      → Significant changes needed
      → Return to product design phase

  [A] Ask for Guidance
      → Discuss the feedback analysis

  [P] Pause Discussion
      → Take time to consider

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Handle User Choice

#### If User Chooses [A] (APPROVED):

Display: "**评审通过！产品设计已确认。**"

"恭喜！产品设计已通过评审。

**决定:**
- 产品设计通过
- 无需重大修改
- 可以进入下一阶段

**下一步:** 记录决定并更新状态"

1. Load, read entire `nextStepFile` (step-06-record-decisions.md)
2. Execute `nextStepFile` with result=Approved

#### If User Chooses [M] (MODIFICATION NEEDED):

Display: "**需要修改。记录修改要求。**"

"**需要修改的产品设计:**

请明确需要修改的内容：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     修改要求记录
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需要修改的部分:
  [ ] {{修改点1}}
  [ ] {{修改点2}}
  [ ] {{修改点3}}

修改说明:
  {{详细描述修改要求}}

责任人: Product Designer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"确认修改要求后，Product Designer将进行修改，
修改完成后再进行快速评审确认。

**下一步:** 记录修改决定"

1. Load, read entire `nextStepFile` (step-06-record-decisions.md)
2. Execute `nextStepFile` with result=Modification

#### If User Chooses [R] (REDESIGN REQUIRED):

Display: "**需要重做。返回产品设计阶段。**"

"**产品设计需要重新设计。**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     重做原因记录
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

重做原因:
  - {{原因1}}
  - {{原因2}}

关键障碍:
  - {{障碍1}}
  - {{障碍2}}

重做建议:
  {{重做建议}}

责任人: Product Designer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"将记录重做决定，然后返回产品设计阶段。

**下一步:** 记录重做决定"

1. Load, read entire `redesignStepFile` (step-01-verify-product-design.md)
2. Execute `redesignStepFile`

#### If User Chooses [A] (Ask for Guidance):

Discuss the feedback analysis and provide objective guidance:
- Review key factors favoring each option
- Highlight critical blockers if they exist
- Weigh pros and cons of each path
- Then re-present the decision menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking time to consider the feedback. Let me know when you're ready to make a decision.**"
- Wait for user to initiate next step
- Then re-present the decision menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Result options clearly explained
- Decision guidance presented objectively
- User decision captured
- Clear path to next step established based on result

### ❌ SYSTEM FAILURE:
- Not explaining all result options
- Influencing user decision inappropriately
- Missing valid user options
- Unclear next steps after decision

**Master Rule:** Making the decision for the user without facilitating input is FORBIDDEN.
