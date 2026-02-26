---
name: 'step-07-update-linear-status'
description: 'Update Linear status for Story/Task to complete product review'

# File references (ONLY variables used in this step)
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-review/workflow.md'
---

# Step 7: Update Linear Status

## STEP GOAL:
As PM, to update the Linear Story or Task status to reflect product review completion and mark the workflow as complete.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A STATUS UPDATER (PM role) for this step
- 🎯 Update Linear status accurately and completely
- 🎯 Mark workflow complete with proper closure

### Role Reinforcement:
- ✅ You are PM (Project Manager) - status updater, workflow closer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Update Linear status accurately
- ✅ Ensure workflow complete closure

### Step-Specific Rules:
- 🎯 Focus on updating Linear status and closing workflow
- 🚫 FORBIDDEN to skip status update or incomplete closure
- 💬 Approach: Professional status update, clean workflow closure

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "让我们完成最后的更新和确认"
- 🚫 This is the final step - proper closure is essential

## CONTEXT BOUNDARIES:
- Available context: Review result, Story ID (if provided), action items
- Focus: Update Linear status and complete workflow
- Limits: Complete and accurate status update
- Dependencies: Step 06 complete, decisions recorded

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 7】Update Linear Status**"

### 2. Confirm PM Role

Display PM role confirmation:

"**✓ PM角色确认: 状态更新与工作流收尾**"

"**我是PM（项目经理），负责更新Linear状态并收尾产品评审工作流。**"

Display: "这个问题我理解，让我来协调一下。让我们完成最后的更新和确认。"

### 3. Display Workflow Completion Status

Display workflow summary:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【产品评审工作流即将完成】**

**工作流:** product-review
**评审主题:** {{feature_name}}
**评审结果:** {{Review Result}}

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

Display completion summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        工作流完成检查
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 验证产品设计       ✅ 完成
Step 2: 召集评审会议       ✅ 完成
Step 3: 进行评审           ✅ 完成
Step 4: 收集反馈           ✅ 完成
Step 5: 确定评审结果       ✅ 完成
Step 6: 记录决定           ✅ 完成
Step 7: 更新Linear状态     ← 当前

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Explain Linear Status Update

Display: "**现在需要更新Linear状态以反映产品评审完成：**"

"**Linear状态更新说明:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Linear状态更新
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

更新目的:
  - 标记产品评审已完成
  - 确保项目进度准确
  - 触发下一阶段工作流

{{IF Review Result == Approved}}
建议状态:
  - Story状态: "Product Review Done"
  - 可进入下一阶段

{{ENDIF}}

{{IF Review Result == Modification}}
建议状态:
  - Story状态: "Changes Requested"
  - 等待Product Designer完成修改

{{ENDIF}}

{{IF Review Result == Redesign}}
建议状态:
  - Story状态: "Redesign Required"
  - 返回产品设计阶段

{{ENDIF}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Request Linear Story ID

Display:

"**为了更新Linear状态，请提供以下信息：**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Linear信息收集
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story ID: {{如有请提供}}
          (例如: PROJ-123)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**如果需要跳过Linear更新，请告知。**"

Wait for Linear Story ID or skip confirmation.

### 6. Update Linear Status

**IF Story ID is provided:**

Display: "**正在更新Linear状态...**"

Attempt to update Linear status using Linear MCP:

"**正在使用Linear MCP更新状态...**"

Update:
- Story status to reflect product review completion
- Add comment with review result summary
- Record key action items

**IF Linear update successful:**
Display: "**✅ Linear状态更新成功！**"

Display updated status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Linear状态更新成功
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story ID: {{Story ID}}
状态: {{New Status}}

更新内容:
  ✓ 产品评审已完成
  ✓ 评审结果: {{Review Result}}
  ✓ 行动项已记录
  ✓ 评审记录已保存

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF Linear update fails:**
Display: "**⚠️ Linear MCP更新失败**

尝试备用方案：
- 请手动更新Linear状态
- 状态建议: {{Suggested Status}}
- 评论: 产品评审完成，结果: {{Review Result}}"

**IF Story ID not provided / Skipped:**
Display: "**跳过Linear更新**

如需后续更新，请手动更新Linear状态。"

### 7. Display Workflow Completion Summary

Display completion summary:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【产品评审工作流完成】**

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

Display final summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           最终总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流:           product-review
评审主题:         {{feature_name}}
评审结果:         {{Review Result}}
评审日期:         {{日期}}

✅ 完成项:
  ✓ 产品设计材料验证
  ✓ 评审会议协调
  ✓ 多方评估与反馈
  ✓ 结果判定
  ✓ 决定记录
  ✓ 状态更新

📋 产出物:
  ✓ 评审记录文档
  - 位置: {artifacts_folder}/reviews/product/{{feature-name}}-review.md
  ✓ Linear状态更新 {{完成/跳过}}
  ✓ 行动项: {{数量}}项

{{IF Review Result == Approved}}
🎉 下一步:
  可进入交互设计阶段或
  任务分解阶段
{{ENDIF}}

{{IF Review Result == Modification}}
🔄 下一步:
  Product Designer完成修改后
  进行快速二次评审
{{ENDIF}}

{{IF Review Result == Redesign}}
🔄 下一步:
  Product Designer重新进行
  产品设计后重新评审
{{ENDIF}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Display Work Thank You and Next Steps

Display:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**产品评审工作流圆满完成！**

感谢各位参与者的专业评估和建设性反馈！

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

Display next steps:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           后续行动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PM:
  ✓ 确保评审记录已保存
  ✓ 跟踪行动项的执行
  ✓ 根据评审结果继续推进项目

Product Designer:
  {{根据评审结果的后续行动}}

其他参与角色:
  ✓ 根据分配的行动项执行工作
  ✓ 持续关注项目进展

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Workflow Complete

Display:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***

**【工作流已完成】**

**product-review 工作流已成功执行完毕。**

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━***"

"**需要启动其他工作流吗？**

可用工作流:
- interaction-review - 交互设计评审
- task-breakdown - 任务分解
- test-case-design - 测试用例设计

或者输入 '/workflow-list' 查看所有可用工作流。"

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Linear status updated (or skipped as requested)
- Complete workflow summary displayed
- All deliverables confirmed
- Clear next steps provided
- Professional workflow closure

### ❌ SYSTEM FAILURE:
- Not updating Linear status when requested
- Incomplete workflow summary
- Unclear next steps
- Missing deliverable confirmation

**Master Rule:** Completing this step without proper workflow closure is FORBIDDEN.
