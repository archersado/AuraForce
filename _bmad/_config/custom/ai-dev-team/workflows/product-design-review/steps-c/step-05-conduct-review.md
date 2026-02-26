---
name: 'step-05-conduct-review'
description: 'Conduct multi-agent product review meeting'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-user-confirmation.md'
prdFile: '{dev_docs_folder}/prd/{feature_name}.md'
brainstormingTask: '{project-root}/_bmad/bmb/tasks/brainstorming.xml'
---

# Step 5: Conduct Review

## STEP GOAL:
To conduct the product review meeting with all stakeholders, collect feedback from Interaction Designer, Frontend Dev, Backend Dev, and QA, and document review outcomes.

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
- ✅ Record key decisions and action items

### Step-Specific Rules:
- 🎯 Focus on facilitating discussion and capturing feedback
- 🚫 FORBIDDEN to make solo design decisions - this is a multi-agent review
- 💬 Approach: Facilitate structured discussion, collect feedback from each role

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is a multi-agent collaboration step - structured dialogue

## CONTEXT BOUNDARIES:
- Available context: PRD document, review participants ready
- Focus: Conduct review meeting, collect stakeholder feedback
- Limits: Don't unilaterally make decisions - facilitate discussion
- Dependencies: Step 04 complete, review meeting scheduled

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 7】Conduct Review**"

### 2. Open Review Meeting

Display meeting opening:

"**【产品评审会议开始】**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          产品评审会议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审主题: {{feature_name}} PRD评审
主持人: PM (项目经理)
参与者: Product Designer, Interaction Designer,
         Frontend Dev, Backend Dev, QA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"欢迎各位参加今天的产品评审会议。我是PM，将主持本次评审。

**会议议程:**
1. Product Designer展示PRD
2. Interaction Designer提供UX反馈
3. Frontend Dev提供前端技术评估
4. Backend Dev提供后端技术评估
5. QA提供测试角度评估
6. 综合讨论和行动项确认

让我们开始！"

### 3. PRD Presentation (Product Designer)

Segment: "**【环节1】PRD展示 - Product Designer**"

Display: "**Product Designer，请您展示PRD并讲解设计思路（5-10分钟）。**"

"请重点说明：
- 功能的核心价值和目标用户
- 关键用户故事和使用场景
- 主要功能划分和范围定义
- 关键设计决策和权衡

如果需要查看PRD文档：{prdFile}"

Listen to Product Designer presentation.
Ask clarifying questions as needed:
"关于XXX，能否进一步说明..."
"这个设计决策是基于什么考虑..."

After presentation, acknowledge:
"感谢Product Designer的展示。大家的疑问？"

### 4. Interaction Designer Feedback

Segment: "**【环节2】 Interaction Designer反馈**"

Display: "**现在请Interaction Designer从交互设计角度提供反馈。**"

"请评估：
- 交互流程的合理性
- 用户操作的便利性
- 与现有设计系统的一致性
- 潜在的UX问题和改进建议"

Listen to Interaction Designer feedback.

Acknowledge and summarize:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Interaction Designer 反馈摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 优点:
  {{记录Interaction Designer指出PRD的优点}}

Δ 建议/改进:
  {{记录Interaction Designer提出的改进建议}}

⚠ 关键关注点:
  {{记录Interaction Designer强调的关键问题}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Frontend Dev Technical Assessment

Segment: "**【环节3】前端技术评估 - Frontend Dev**"

Display: "**现在请Frontend Dev从前端实现角度提供技术评估。**"

"请评估：
- 前端实现复杂度（低/中/高）
- 技术风险和潜在问题
- 需要的技术栈和依赖
- 实现时间估算（粗略）
- 实现建议和注意事项"

Listen to Frontend Dev assessment.

Acknowledge and summarize:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend Dev 技术评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 可行性: {{可行/需要调整/有潜在风险}}

Δ 技术复杂度: {{低/中/高}}

⚠ 主要风险:
  {{记录Frontend Dev识别的技术风险}}

💡 实现建议:
  {{记录Frontend Dev提供的实现建议}}

📊 时间估算: {{粗略估算}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Backend Dev Technical Assessment

Segment: "**【环节4】后端技术评估 - Backend Dev**"

Display: "**现在请Backend Dev从后端实现角度提供技术评估。**"

"请评估：
- 后端实现复杂度（低/中/高）
- 接口设计和数据层需求
- 技术架构考虑点
- 性能和扩展性考虑
- 实现时间估算（粗略）
- 实现建议和注意事项"

Listen to Backend Dev assessment.

Acknowledge and summarize:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend Dev 技术评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 可行性: {{可行/需要调整/有潜在风险}}

Δ 技术复杂度: {{低/中/高}}

⚠ 主要风险:
  {{记录Backend Dev识别的技术风险}}

💡 实现建议:
  {{记录Backend Dev提供的实现建议}}

🌐 接口需求:
  {{记录Backend Dev提出的接口设计需求}}

📊 时间估算: {{粗略估算}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. QA Testing Assessment

Segment: "**【环节5】测试评估 - QA**"

Display: "**现在请QA从测试角度提供评估。**"

"请评估：
- 功能可测试性（容易/中等/困难）
- 主要测试场景和用例
- 潜在质量风险
- 测试覆盖重点
- 测试建议和注意事项"

Listen to QA assessment.

Acknowledge and summarize:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA 测试评估摘要
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

### 8. Open Discussion

Segment: "**【环节6】综合讨论**"

Display: "**感谢各位的专业反馈！现在进入综合讨论环节。**"

"让我们讨论今天评审中提到的关键问题：

**已识别的关键问题:**
1. {{从各方反馈中提取的关键问题1}}
2. {{关键问题2}}
3. ...

**请大家就以下问题进行讨论:**
- 这些问题如何解决？
- 是否需要修正PRD？
- 有什么补充建议？"

Facilitate discussion:
- Ensure all voices are heard
- Identify consensus or disagreements
- Explore solutions to identified issues
- Clarify action items

### 9. Document Review Outcomes

Segment: "**【环节7】评审总结**"

Display: "**感谢大家的讨论！现在让我总结评审结果。**"

Display comprehensive review summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        产品评审会议总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审内容: {{feature_name}} PRD

参与者:
  ✓ Product Designer - 展示PRD
  ✓ Interaction Designer - UX反馈
  ✓ Frontend Dev - 前端技评
  ✓ Backend Dev - 后端技评
  ✓ QA - 测试评估

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
评审要点
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【Interaction Designer】
  ✓ 优点: {{优点列表}}
  Δ 建议: {{建议列表}}

【Frontend Dev】
  ✓ 可行性: {{状态}}
  Δ 复杂度: {{低/中/高}}
  ⚠ 风险: {{风险列表}}

【Backend Dev】
  ✓ 可行性: {{状态}}
  Δ 复杂度: {{低/中/高}}
  ⚠ 风险: {{风险列表}}

【QA】
  ✓ 可测试性: {{状态}}
  Δ 场景: {{场景列表}}
  ⚠ 风险: {{风险列表}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
决定与行动项
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审结果:
  [ ] 通过，无需修改 → 进入用户确认
  [ ] 轻微修改，确认后继续 → 需要补充文档
  [ ] 需要重大修改 → 重新编写PRD

行动项:
  [ ] {{行动项1}} - 负责人: {{负责人}}
  [ ] {{行动项2}} - 负责人: {{负责人}}
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Determine Review Result

Present decision choice:

"**产品评审会议结束，需要确定评审结果。**"

"基于今天的评审，结果如何？"

### 11. Present Results Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Review Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Summary:
  ✅ All stakeholders provided feedback
  ✅ Key risks and issues identified
  ✅ Action items documented

Review Result:

  [A] Review Passed
      → PRD approved, proceed to user confirmation

  [P] Minor Revisions Needed
      → Updates required, then confirm and continue

  [C] Major Revisions Required
      → Significant changes needed, return to PRD creation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 12. Handle User Choice

#### If User Chooses [A] (Review Passed):

Display: "**评审通过！准备进入用户确认阶段...**"

1. Load, read entire `nextStepFile` (step-06-user-confirmation.md)
2. Execute `nextStepFile`

#### If User Chooses [P] (Minor Revisions):

Display: "**进行PRD小幅修改...**"

- Clarify what minor revisions are needed
- Note that these updates should be documented
- Display: "**小修改已完成，准备进入用户确认阶段...**"
- Proceed to user confirmation step

#### If User Chooses [C] (Major Revisions):

Display: "**需要进行重大修改，返回PRD创建阶段...**"

This will require looping back to Step 2.

Display: "**返回到PRD创建阶段进行修订...**"

1. Load, read entire `./step-02-create-prd.md`
2. Execute step-02 (note this is a major revision loop)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Meeting opened with clear agenda
- Product Designer presentation captured
- All stakeholders provided structured feedback
- Discussion facilitated constructively
- Review outcomes documented comprehensively
- Clear path forward based on review result

### ❌ SYSTEM FAILURE:
- Missing stakeholder feedback
- Not documenting review outcomes
- Unclear next steps
- Bypassing stakeholder consultation

**Master Rule:** Making decisions without stakeholder input is FORBIDDEN.
