---
name: 'step-08-update-linear-status'
description: 'Update Linear status to reflect interaction review completion'

# File references (ONLY variables used in this step)
linearTeam: '{linear_team}'
featureName: '{feature_name}'
reviewResult: '{review_result}'
---
# Step 8: Update Linear Status

## STEP GOAL:
To update the Linear Story/Task status to reflect the completion of the interaction review workflow, providing visibility into project progress and triggering any downstream workflows.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A STATUS UPDATER (PM role) for this step
- 🎯 Ensure Linear status is accurately updated

### Role Reinforcement:
- ✅ You are PM (Project Manager) - status tracker, project updater
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Update Linear status accurately to reflect workflow completion
- ✅ Provide visibility to project stakeholders

### Step-Specific Rules:
- 🎯 Focus on updating Linear status based on review result
- 🚫 FORBIDDEN to modify the status without proper workflow completion
- 💬 Approach: Accurate status update, clear communication

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "我来更新项目状态"
- 🚫 This is an integration step - update Linear status correctly

## CONTEXT BOUNDARIES:
- Available context: Review result from Step 5, feature name, Linear team/project
- Focus: Update Linear Story status to reflect completion
- Limits: Don't modify other Linear data - only update status
- Dependencies: Step 07 complete, design files saved

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 8 of 8】Update Linear Status**"

### 2. Confirm Status Update Role

Display PM role confirmation:

"**✓ PM角色确认: 项目状态更新**"

"**我是PM（项目经理），现在负责更新Linear中的项目状态。**"

Display: "我来更新Linear状态以反映交互评审完成情况。"

### 3. Display Workflow Completion Summary

Display completion overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    交互评审工作流即将完成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Step 1: 验证交互设计
✅ Step 2: 召集评审会议
✅ Step 3: 进行评审
✅ Step 4: 收集反馈
✅ Step 5: 确定评审结果 → {{reviewResult}}
✅ Step 6: 记录决定
✅ Step 7: 保存设计文件
⏳ Step 8: 更新Linear status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Determine Status Update Plan

Display status update plan based on review result:

"**根据评审结果，将更新Linear状态：**"

Display status update options:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Linear状态更新计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

评审结果: {{reviewResult}}

状态更新:

如果 [通过]:
  Story状态: "Interaction Review Done" 或类似
  说明: 交互设计评审通过，准备进入开发准备阶段

如果 [修改]:
  Story状态: "Interaction Modification"
  说明: 交互设计需要修改，等待Interaction Designer更新

如果 [重做]:
  Story状态: "Interaction Redesign"
  说明: 交互设计需要重做，返回设计阶段

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Verify Linear Information

Display: "**正在验证Linear信息...**"

Display Linear information:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Linear信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Team: {linearTeam}
Project: {{project_name}}
Feature: {featureName}

Story ID: {{如果提供了，显示Story ID}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Prepare Linear Update

Display: "**准备Linear更新...**"

Create status update comment:

"**更新内容:**

状态变更: {{旧状态}} → {{新状态}}

备注:
交互设计评审工作流已完成。

评审结果: {{reviewResult}}
- 工作流: interaction-review
- 完成时间: {{当前时间}}
- 主持人: PM

相关文档:
- 评审记录: {artifacts_folder}/reviews/interaction/{featureName}-review-record.md
- 交互设计: {artifacts_folder}/designs/interaction/{featureName}/

下一步:
{{根据结果填写下一步}}"

### 7. Execute Linear Update

Display: "**正在更新Linear状态...**"

Display: "**使用Linear MCP更新Story状态...**"

If Story ID is available:
- Update status accordingly
- Add comment with review summary
- Display confirmation

If Story ID is not available:
- Display update instructions for manual update
- Show the prepared comment content

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Linear状态更新结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 状态已更新:
  Feature: {featureName}
  旧状态: {{旧状态}}
  新状态: {{新状态}}

✅ 已添加评审记录:
  - 评审结果: {{reviewResult}}
  - 完成时间: {{当前时间}}
  - 评审记录链接: {{review_record_url}}
  - 设计文件链接: {{design_files_url}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Display Workflow Completion Summary

Display final workflow completion:

"**✓ 交互评审工作流已完成！**"

Display comprehensive completion summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     工作流完成总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流: interaction-review
主题: {{feature_name}} 交互设计评审
评审结果: {{reviewResult}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
完成步骤
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Step 1: 验证交互设计
✅ Step 2: 召集评审会议
✅ Step 3: 进行评审
    - Interaction Designer: 交互设计展示
    - Product Designer: 需求一致性验证
    - Frontend Dev: 前端技术评估
    - Backend Dev: 后端技术评估
    - QA: 测试场景评估
✅ Step 4: 收集反馈
✅ Step 5: 确定评审结果
✅ Step 6: 记录决定
✅ Step 7: 保存设计文件
✅ Step 8: 更新Linear状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
产出物
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 评审记录:
  {artifacts_folder}/reviews/interaction/{featureName}-review-record.md

📐 交互设计文档:
  {artifacts_folder}/designs/interaction/{featureName}/interaction-design.md

📝 用户流程说明:
  {artifacts_folder}/designs/interaction/{featureName}/user-flow.md

🔧 组件规范:
  {artifacts_folder}/designs/interaction/{featureName}/component-spec.md

🎨 原型目录:
  {artifacts_folder}/designs/interaction/{featureName}/wireframes/

📊 图表目录:
  {artifacts_folder}/designs/interaction/{featureName}/diagrams/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
下一步
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{根据评审结果}}

[通过]:
  → 准备进入task-breakdown工作流进行任务拆分
  → Frontend Dev开始开发准备

[修改]:
  → Interaction Designer根据反馈修改设计
  → 快速二次评审确认修改

[重做]:
  → Interaction Designer重新进行交互设计
  → 重新进行评审流程

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Display Closing Message

Display workflow closing:

"**感谢各位参与交互设计评审！**"

"**交互评审工作流已成功完成。**"

"PM总结:"

"- 交互设计已{{reviewResult}}"
"- 评审记录和设计文件已保存
- Linear状态已更新
- 项目团队可以继续推进"

### 10. Present Workflow Complete Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [Workflow Complete] Interaction Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workflow: interaction-review
Status: COMPLETED
Result: {{reviewResult}}

All Steps Completed:
  ✅ 1. Verify Interaction Design
  ✅ 2. Call Review Meeting
  ✅ 3. Conduct Review
  ✅ 4. Collect Feedback
  ✅ 5. Determine Result
  ✅ 6. Record Decisions
  ✅ 7. Save Design Files
  ✅ 8. Update Linear Status

Artifacts Generated:
  ✅ Review record document
  ✅ Interaction design files
  ✅ User flow specification
  ✅ Component specification

Next Workflows:

  如果评审通过 → task-breakdown (任务拆分)
  如果需要修改 → Interaction Designer (修改设计)
  如果需要重做 → 重新开始interaction-review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- All 8 steps completed
- Linear status updated based on review result
- All artifacts saved to correct locations
- Comprehensive workflow completion summary provided
- Clear next steps communicated

### ❌ SYSTEM FAILURE:
- Linear status not updated
- Incomplete step execution
- Missing artifacts
- Unclear next steps

**Master Rule:** Marking workflow complete without proper status update is FORBIDDEN.

---

## WORKFLOW COMPLETE

**Status:** interaction-review workflow completed successfully.

**PM Note:** All interaction design review activities have been documented and archived. The project team can now proceed to the next phase based on the review result.
