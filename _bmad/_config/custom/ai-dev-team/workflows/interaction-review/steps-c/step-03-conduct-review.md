---
name: 'step-03-conduct-review'
description: 'Conduct multi-agent interaction review meeting'

# File references (ONLY variables used in this step)
nextStepFile: './step-04-collect-feedback.md'
---
# Step 3: Conduct Review

## STEP GOAL:
To conduct the interaction review meeting with all stakeholders, enabling Interaction Designer to present the design and Product Designer, Frontend Dev, Backend Dev, and QA to provide feedback.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A MEETING FACILITATOR (PM role) for this step
- 🎯 Foster constructive dialogue between all stakeholders

### Role Reinforcement:
- ✅ You are PM (Project Manager) - meeting facilitator, mediator, recorder
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Facilitate productive discussion between diverse perspectives
- ✅ Record key points from each stakeholder

### Step-Specific Rules:
- 🎯 Focus on facilitating presentation and collecting initial feedback
- 🚫 FORBIDDEN to make solo design decisions - facilitate multi-agent discussion
- 💬 Approach: Facilitate structured discussion, collect input from each role

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a multi-agent collaboration step - structured dialogue

## CONTEXT BOUNDARIES:
- Available context: Interaction design materials, review participants ready
- Focus: Conduct review meeting, enable stakeholder presentations
- Limits: Don't unilaterally make decisions - facilitate discussion
- Dependencies: Step 02 complete, review meeting scheduled

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 8】Conduct Review**"

### 2. Open Review Meeting

Display meeting opening:

"**【交互评审会议开始】**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          交互评审会议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审主题: {{feature_name}} 交互设计评审
主持人: PM (项目经理)
参与者: Interaction Designer, Product Designer,
         Frontend Dev, Backend Dev, QA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"欢迎各位参加今天的交互评审会议。我是PM，将主持本次评审。

**会议议程:**
1. Interaction Designer展示交互设计
2. Product Designer验证需求一致性
3. Frontend Dev前端可行性评估
4. Backend Dev后端可行性评估
5. QA测试场景评估
6. 综合讨论

让我们开始！"

### 3. Interaction Design Presentation

Segment: "**【环节1】交互设计展示 - Interaction Designer**"

Display: "**Interaction Designer，请您展示交互设计并讲解设计思路（5-10分钟）。**"

"请重点说明：
- 核心交互流程
- 关键用户操作路径
- 页面跳转逻辑
- 重要交互细节和设计决策
- 与设计系统的一致性

交互设计材料: {{交互设计材料摘要}}"

Listen to Interaction Designer presentation.
Ask clarifying questions as needed:
"关于XXX交互，能否进一步说明..."
"这个交互设计是基于什么用户场景考虑..."

After presentation, acknowledge:
"感谢Interaction Designer的展示。"
"现在请各位从各自专业角度提供反馈。"

### 4. Product Designer Validation

Segment: "**【环节2】Product Designer 需求一致性验证**"

Display: "**现在请Product Designer从产品需求角度验证交互一致性。**"

"请评估：
- 交互设计是否完整覆盖PRD功能需求
- 用户故事是否通过交互得到准确呈现
- 交互流程是否清晰符合产品目标
- 是否有遗漏或冗余的交互点"

Listen to Product Designer validation.

Acknowledge and capture key points:

```Product Designer 验证摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 需求覆盖: {{完整/部分/有缺失}}

Δ 一致性评估: {{符合/部分符合/需调整}}

✅ 符合点:
  {{列出交互与需求一致的地方}}

⚠ 差异点/建议:
  {{列出需要调整或注意的地方}}

📋 补充建议:
  {{其他相关建议}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Frontend Dev Assessment

Segment: "**【环节3】前端技术评估 - Frontend Dev**"

Display: "**现在请Frontend Dev从前端实现角度提供技术评估。**"

"请评估：
- 前端实现复杂度（低/中/高）
- 是否存在实现难点或技术风险
- 组件库使用情况
- 性能考虑（如动画、交互响应）
- 实现建议和注意事项"

Listen to Frontend Dev assessment.

Acknowledge and capture key points:

```Frontend Dev 技术评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 可行性: {{可行/需要调整/有潜在风险}}

Δ 技术复杂度: {{低/中/高}}

⚠ 主要风险:
  {{记录Frontend Dev识别的技术风险}}

💡 实现建议:
  {{记录Frontend Dev提供的实现建议}}

🔧 技术栈:
  {{记录需要的技术栈或依赖}}

📊 时间估算: {{粗略估算}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Backend Dev Assessment

Segment: "**【环节4】后端技术评估 - Backend Dev**"

Display: "**现在请Backend Dev从后端实现角度提供技术评估。**"

"请评估：
- 交互触发需要的API接口
- 数据处理和状态管理需求
- 技术架构考虑点
- 性能和扩展性考虑
- 实现建议和注意事项"

Listen to Backend Dev assessment.

Acknowledge and capture key points:

```Backend Dev 技术评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 可行性: {{可行/需要调整/有潜在风险}}

Δ 技术复杂度: {{低/中/高}}

⚠ 主要风险:
  {{记录Backend Dev识别的技术风险}}

💡 实现建议:
  {{记录Backend Dev提供的实现建议}}

🌐 接口需求:
  {{记录Backend Dev提出的API接口需求}}

📊 时间估算: {{粗略估算}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. QA Assessment

Segment: "**【环节5】测试评估 - QA**"

Display: "**现在请QA从测试角度提供评估。**"

"请评估：
- 交互可测试性（容易/中等/困难）
- 主要测试场景和边界条件
- 潜在质量风险
- 测试自动化可能性
- 测试建议和注意事项"

Listen to QA assessment.

Acknowledge and capture key points:

```QA 测试评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 可测试性: {{容易/中等/困难}}

Δ 主要测试场景:
  {{记录QA提出的主要测试场景}}

⚠ 质量风险:
  {{记录QA识别的质量风险}}

💡 测试建议:
  {{记录QA提供的测试建议}}

🎯 覆盖重点:
  {{记录QA强调的测试覆盖重点}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Proceed to Feedback Collection

Segment: "**【环节6】准备收集综合反馈**"

Display: "**感谢各位的专业评估！现在进入反馈收集环节。**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
已完成的评估环节汇总
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Interaction Designer - 交互设计展示
✅ Product Designer    - 需求一致性验证
✅ Frontend Dev        - 前端技术评估
✅ Backend Dev         - 后端技术评估
✅ QA                  - 测试评估

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"接下来我们将在下一步中深入综合各方反馈，

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Review Assessment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Sessions:
  ✅ Interaction Designer presentation
  ✅ Product Designer requirement validation
  ✅ Frontend Dev technical assessment
  ✅ Backend Dev technical assessment
  ✅ QA testing assessment

Next Step:

  [C] Collect and Summarize Feedback
      → Compile all stakeholder feedback for analysis

  [A] Ask for Clarification
      → Request more details on any assessment

  [P] Pause Discussion
      → Take a moment, ask questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Collect Feedback):

Display: "**Proceeding to collect and summarize feedback...**"

1. Load, read entire `nextStepFile` (step-04-collect-feedback.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Ask specific clarifying questions about any stakeholder's assessment
- Wait for user response
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Meeting opened with clear agenda
- Interaction Designer presentation captured
- All stakeholders provided structured feedback
- Each assessment captured in summary format
- Clear path provided to feedback collection

### ❌ SYSTEM FAILURE:
- Missing stakeholder feedback
- Not capturing assessment summaries
- Skipping stakeholder input
- Not facilitating balanced discussion

**Master Rule:** Making assessments without hearing from all stakeholders is FORBIDDEN.
