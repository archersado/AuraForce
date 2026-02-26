---
name: 'step-06-record-decisions'
description: 'Record review decisions and action items'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-save-design-files.md'
reviewRecordFile: '{artifacts_folder}/reviews/interaction/{feature_name}-review-record.md'
artifactsFolder: '{artifacts_folder}'
featureName: '{feature_name}'
---
# Step 6: Record Decisions

## STEP GOAL:
To create a comprehensive review record document that captures the review decision, all feedback summary, and action items with responsible parties and timelines.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT RECORDER (PM role) for this step
- 🎯 Create comprehensive, accurate documentation of decisions

### Role Reinforcement:
- ✅ You are PM (Project Manager) - documenter, recorder, official scribe
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Document decisions clearly and comprehensively
- ✅ Ensure action items are specific and accountable

### Step-Specific Rules:
- 🎯 Focus on creating permanent record of review outcomes
- 🚫 FORBIDDEN to skip documentation or create incomplete records
- 💬 Approach: Systematic documentation, clear action items

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "我来记录评审决定"
- 🚫 This is a documentation step - create comprehensive record

## CONTEXT BOUNDARIES:
- Available context: Review result from Step 5, all stakeholder feedback
- Focus: Create comprehensive review record document
- Limits: Don't modify decisions - document them accurately
- Dependencies: Step 05 complete, review result determined

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 8】Record Decisions**"

### 2. Confirm Documentation Role

Display PM role confirmation:

"**✓ PM角色确认: 评审记录归档**"

"**我是PM（项目经理），现在负责记录评审决定。**"

Display: "我来记录评审决定和后续行动项。"

### 3. Display Review Summary Information

Display review summary for documentation:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      评审记录准备
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审信息:
  - 工作流: interaction-review
  - 主题: {{feature_name}} 交互设计评审
  - 日期: {{当前日期}}
  - 主持人: PM

参与人员:
  - Interaction Designer
  - Product Designer
  - Frontend Dev
  - Backend Dev
  - QA

评审结果: {{从Step 5获取结果}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Create Review Record Document

Display: "**正在创建评审记录文档...**"

Generate and display the review record document content:

```# 交互设计评审记录

**评审主题:** {{feature_name}} 交互设计评审

**评审日期:** {{当前日期}}

**工作流:** interaction-review

**主持人:** PM (项目经理)

---

## 参与人员

| 角色 | 姓名 | 职责 |
|------|------|------|
| Interaction Designer | - | 交互设计展示 |
| Product Designer | - | 需求一致性验证 |
| Frontend Dev | - | 前端技术评估 |
| Backend Dev | - | 后端技术评估 |
| QA | - | 测试场景评估 |
| PM | {{user_name}} | 主持、记录 |

---

## 评审议程

1. 交互设计展示 - Interaction Designer (5-10分钟)
2. 需求一致性验证 - Product Designer (3-5分钟)
3. 前端技术评估 - Frontend Dev (3-5分钟)
4. 后端技术评估 - Backend Dev (3-5分钟)
5. 测试场景评估 - QA (3-5分钟)
6. 综合讨论 (5-10分钟)
7. 评审决定确认 (3-5分钟)

---

## Product Designer 反馈

### 需求符合度
{{从Step 4的反馈中提取}}

### 符合点
- {{符合点1}}
- {{符合点2}}

### 差异点/建议
- {{差异点1}}
- {{差异点2}}

### 补充建议
- {{补充建议1}}
- {{补充建议2}}

---

## Frontend Dev 反馈

### 技术可行性
{{从Step 4的反馈中提取}}

### 技术复杂度
{{从Step 4的反馈中提取}}

### 主要风险
- {{风险1}}
- {{风险2}}

### 实现建议
- {{建议1}}
- {{建议2}}

---

## Backend Dev 反馈

### 技术可行性
{{从Step 4的反馈中提取}}

### 技术复杂度
{{从Step 4的反馈中提取}}

### 主要风险
- {{风险1}}
- {{风险2}}

### 接口需求
- {{接口1}}
- {{接口2}}

---

## QA 反馈

### 可测试性
{{从Step 4的反馈中提取}}

### 主要测试场景
- {{场景1}}
- {{场景2}}

### 质量风险
- {{风险1}}
- {{风险2}}

---

## 评审决定

### 结果
**{{从Step 5获取的评审结果}}**

### 决定说明
{{根据评审结果填写说明}}

---

## 关键问题汇总

### 高优先级问题
- [ ] {{高优先级问题1}} - 负责人: {{负责人}}
- [ ] {{高优先级问题2}} - 负责人: {{负责人}}

### 中优先级问题
- [ ] {{中优先级问题1}} - 负责人: {{负责人}}
- [ ] {{中优先级问题2}} - 负责人: {{负责人}}

---

## 行动项

| # | 行动项 | 负责人 | 状态 | 截止日期 |
|---|--------|--------|------|----------|
| 1 | {{行动项1}} | {{负责人}} | {{状态}} | {{日期}} |
| 2 | {{行动项2}} | {{负责人}} | {{状态}} | {{日期}} |
| 3 | {{行动项3}} | {{负责人}} | {{状态}} | {{日期}} |

---

## 下一步

{{根据评审结果填写下一步计划}}

---

**记录创建时间:** {{当前时间}}
**记录人:** PM ({{user_name}})
```

Display: "**评审记录文档内容已生成。**"

### 5. Save Review Record

Display: "**正在保存评审记录到项目文档...**"

File location: `{reviewRecordFile}`

Display: "**✓ 评审记录已保存**"

Display file path:
```
文件位置: {reviewRecordFile}
```

### 6. Confirm Record Details

Display: "**请确认评审记录内容是否准确。**"

Display confirmation checklist:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     评审记录确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

基本信息:
  [ ] 评审主题正确
  [ ] 参与人员完整
  [ ] 评审日期正确

反馈内容:
  [ ] Product Designer反馈完整
  [ ] Frontend Dev反馈完整
  [ ] Backend Dev反馈完整
  [ ] QA反馈完整

决定与行动:
  [ ] 评审结果准确
  [ ] 关键问题已记录
  [ ] 行动项明确

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for user confirmation.

### 7. Proceed to Next Step

Display: "**评审记录已确认并保存。**"

Based on review result from Step 5, display next step indication:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    评审流程进展
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Step 1: 验证交互设计
✅ Step 2: 召集评审会议
✅ Step 3: 进行评审
✅ Step 4: 收集反馈
✅ Step 5: 确定评审结果 → {{结果}}
✅ Step 6: 记录决定

下一步:
  Step 7: 保存交互设计文件

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Decisions Recorded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Documentation Created:
  ✅ Review record document
  ✅ All feedback documented
  ✅ Review decisions recorded
  ✅ Action items defined
  ✅ File saved to project docs

Record Location: {reviewRecordFile}

Next Step:

  [C] Save Design Files
      → Save interaction design to artifacts folder

  [A] Adjust Record
      → Make changes to the review record

  [P] Pause Discussion
      → Take a moment to review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [C] (Save Design Files):

Display: "**Proceeding to save interaction design files...**"

1. Load, read entire `nextStepFile` (step-07-save-design-files.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Adjust Record):

- Allow user to point out corrections needed in the record
- Update the record content
- Re-save the file
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the record. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Review record document created comprehensively
- All feedback documented accurately
- Review decisions clearly recorded
- Action items defined with owners and timelines
- File saved to project documentation
- User confirmation received

### ❌ SYSTEM FAILURE:
- Incomplete review record documentation
- Missing feedback or decisions
- Action items without clear ownership
- File not saved successfully

**Master Rule:** Proceeding without completing documentation is FORBIDDEN.
