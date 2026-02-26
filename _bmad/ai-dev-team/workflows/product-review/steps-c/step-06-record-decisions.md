---
name: 'step-06-record-decisions'
description: 'Record review decisions and action items'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-update-linear-status.md'
---

# Step 6: Record Decisions

## STEP GOAL:
As PM, to document the review decisions, action items, and any modification or redesign requirements in a comprehensive review record document.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENTER (PM role) for this step
- 🎯 Record decisions comprehensively and accurately

### Role Reinforcement:
- ✅ You are PM (Project Manager) - documenter, recorder
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Record all decisions and action items systematically
- ✅ Create comprehensive documentation for future reference

### Step-Specific Rules:
- 🎯 Focus on recording review decisions and action items
- 🚫 FORBIDDEN to modify or change decisions during documentation
- 💬 Approach: Record accurately, be comprehensive, assign ownership

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "让我来记录评审决定"
- 🚫 This is a documentation step - record, don't negotiate

## CONTEXT BOUNDARIES:
- Available context: Review result from Step 5 (Approved/Modification/Redesign), feedback summary
- Focus: Record review decisions and action items
- Limits: Complete and accurate documentation
- Dependencies: Step 05 complete, result determined

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 7】Record Decisions**"

### 2. Confirm PM Role

Display PM role confirmation:

"**✓ PM角色确认: 评审决定记录**"

"**我是PM（项目经理），现在负责记录评审决定和行动项。**"

Display: "这个问题我理解，让我来协调一下。让我来记录评审决定。"

### 3. Display Review Result Summary

Display result summary:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【产品评审决定】**

**评审主题:** {{feature_name}}

**评审结果:** {{Review Result - 通过/修改/重做}}

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

### 4. Generate Review Record Document

Display: "**正在生成评审记录文档...**"

Create comprehensive review record:

Display review record structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        产品评审记录
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

文档信息
  ─────────────────────────────────────
  标题:       {{feature_name}} 产品评审记录
  日期:       {{评审日期}}
  主持人:     PM
  参与人员:   Product Designer, Interaction Designer,
              Frontend Dev, Backend Dev, QA


评审概述
  ─────────────────────────────────────
  评审目的: 评估产品设计（PRD）的可行性、完整性和质量

  评审范围:
    - 功能需求完整性
    - 技术可行性
    - UX和用户体验
    - 可测试性和质量考虑


评审参与人员
  ─────────────────────────────────────
  Product Designer      - 设计展示者
  Interaction Designer  - UX评估
  Frontend Dev        - 前端技术评估
  Backend Dev         - 后端技术评估
  QA                  - 测试质量评估
  PM                  - 会议主持和记录


评审摘要
  ─────────────────────────────────────
  需求符合度:   {{评估}}
  技术可行性:   {{评估}}
  UX评分:       {{评估}}
  可测试性:     {{评估}}


各方反馈摘要
  ─────────────────────────────────────

  Interaction Designer - UX评估
    {{反馈摘要}}


  Frontend Dev - 前端技术评估
    {{反馈摘要}}


  Backend Dev - 后端技术评估
    {{反馈摘要}}


  QA - 测试质量评估
    {{反馈摘要}}


问题汇总
  ─────────────────────────────────────
  高优先级问题 (🔴):
    1. {{问题描述}}
       责任人: {{责任人}}
       状态: 待处理

    2. {{问题描述}}
       责任人: {{责任人}}
       状态: 待处理

  中优先级问题 (🟡):
    1. {{问题描述}}
       责任人: {{责任人}}
       状态: 待处理

  低优先级建议 (🟢):
    1. {{建议描述}}
       责任人: {{责任人}}
       状态: 可选


{{IF Review Result == Modification}}
修改要求
  ─────────────────────────────────────
  需要修改的部分:
    1. {{修改点1}}
       说明: {{详细说明}}
       责任人: Product Designer
       截止日期: {{日期}}

    2. {{修改点2}}
       说明: {{详细说明}}
       责任人: Product Designer
       截止日期: {{日期}}

  下一步行动:
    1. Product Designer根据修改要求进行调整
    2. 完成后进行快速二次评审
    3. 确认后更新状态

{{ENDIF}}


{{IF Review Result == Redesign}}
重做要求
  ─────────────────────────────────────
  重做原因:
    1. {{原因1}}
    2. {{原因2}}

  重做建议:
    {{详细建议}}

  下一步行动:
    1. Product Designer重新进行产品设计
    2. 完成后重新进行评审流程
    3. 确认后更新状态

{{ENDIF}}


{{IF Review Result == Approved}}
评审通过说明
  ─────────────────────────────────────
  恭喜！产品设计已通过评审。

  可选优化建议:
    1. {{优化建议1}}
    2. {{优化建议2}}

  下一步行动:
    1. 产品设计定稿
    2. 可进入交互设计阶段
    3. 更新Linear状态

{{ENDIF}}


行动项汇总
  ─────────────────────────────────────
  ID  | 行动项描述                     | 责任人   | 截止日期   | 状态
  ───────────────────────────────────────────────────────────────────────
  1   | {{行动项1}}                    | {{责任人}}| {{日期}}   | 待处理
  2   | {{行动项2}}                    | {{责任人}}| {{日期}}   | 待处理
  3   | {{行动项3}}                    | {{责任人}}| {{日期}}   | 待处理


评审结论
  ─────────────────────────────────────
  评审结果: {{通过/修改/重做}}

  PM建议:
    {{根据结果提供建议}}

  记录时间: {{时间戳}}
  记录人: PM


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Confirm Review Record

Display confirmation:

"**评审记录文档已生成。**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   评审记录状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 评审结果:           {{结果}}
✅ 决定记录:           已完成
✅ 行动项:             {{数量}}项
✅ 问题汇总:           已完成
✅ 下一步说明:         已明确

下一步: 更新Linear状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"

"以上评审记录作为正式文档保存，包含:
- 评审参与人员和角色
- 各方反馈摘要
- 问题汇总和优先级
- {{修改要求/重做要求/通过说明}}"
- 行动项和责任人
- 下一步行动计划

**请确认评审记录是否准确完整。**"

Wait for confirmation.

### 6. Update Document Output Path

Display file save location:

"**评审记录将保存至:**
```
{artifacts_folder}/reviews/product/{{feature-name}}-review.md
```"

### 7. Display Completion Summary

Based on review result, display appropriate summary:

**IF APPROVED:**
"**评审通过！产品设计已获批准。**

可以进入下一阶段（如交互设计或任务分解）。"

**IF MODIFICATION:**
"**需要修改。Product Designer将根据修改要求进行调整。**

修改完成后请重新提交进行快速评审。"

**IF REDESIGN:**
"**需要重做。返回产品设计阶段。**

Product Designer将根据重做要求重新进行产品设计。"

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Decisions Recorded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Documentation Status:
  ✅ Review result documented
  ✅ Action items recorded
  ✅ Issues summarized
  ✅ Next steps defined

Review Result:
  Result: {{Review Result}}
  Actions: {{Action Count}} action items
  Next: Update Linear Status

Next Step:

  [C] Proceed to Update Linear Status
      → Update Story/Task status and complete workflow

  [A] Ask for Clarification
      → Discuss documentation details

  [P] Pause Discussion
      → Review the record

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Proceed to Update Linear Status):

Display: "**Proceeding to update Linear status...**"

1. Load, read entire `nextStepFile` (step-07-update-linear-status.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Ask for Clarification):

- Discuss documentation details or ask questions
- Provide clarification as needed
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Review result documented accurately
- All action items recorded with ownership
- Issues categorized and summarized
- Clear next steps defined
- Document saved to appropriate location

### ❌ SYSTEM FAILURE:
- Missing or incomplete documentation
- Action items without assigned owners
- Unclear next steps
- Document not saved

**Master Rule:** Proceeding without complete documentation is FORBIDDEN.
