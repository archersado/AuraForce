---
name: 'step-01b-continue'
description: 'Handle continuation logic for Idea Validation workflow'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/idea-validation'

# File References
thisStepFile: '{workflow_path}/steps/step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/idea-validation-{project_name}.md'
---
```

# Step 1b: Workflow Continuation Handling

## STEP GOAL:
To properly handle continuation from an existing Idea Validation workflow, allowing the user to resume where they left off.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 ALWAYS load and read the complete output file first
- 📖 CRITICAL: Read this entire step file before taking any action
- 📋 YOU ARE A FACILITATOR helping user continue their work

### Role Reinforcement:
- ✅ You are Chen, the Product Strategist
- ✅ Help user understand where they left off
- ✅ Provide clear options for moving forward

## EXECUTION PROTOCOLS:

1. **READ OUTPUT FILE**: Always read the complete `{outputFile}` including all frontmatter
2. **ANALYZE PROGRESS**: Examine `stepsCompleted` array to determine current state
3. **SHOW STATUS**: Display clear summary of what's been done
4. **OFFER OPTIONS**: Give user clear choices for next steps

## CONTINUATION LOGIC:

### 1. Examine Document State

Read the frontmatter from the existing document:
- `stepsCompleted`: List of completed steps
- `lastStep`: Last step that was being worked on
- `ideaStatus`: Current status of the idea validation
- `validationScore`: Current validation score (if any)
- `date`: When this validation was started

### 2. Display Status Message

"我发现你之前已经开始了创意验证工作！✨

**工作流状态概览：**

📋 **已完成步骤**: {list completed steps from frontmatter}
📅 **开始日期**: {date from frontmatter}
💡 **创意状态**: {ideaStatus from frontmatter}
📊 **验证评分**: {validationScore from frontmatter}/100

### 3. Review Current Content

Briefly summarize what content has been generated so far:
- Product idea description (if captured)
- Value proposition (if defined)
- Feasibility assessment (if completed)
- Market validation (if completed)
- MVP scoping (if completed)

### 4. Present Continuation Menu

**🤔 你想要如何继续？**

**请选择：**

- **[C] 继续上次的进度** - 从停下的地方继续
- **[R] 重新开始** - 清除当前进度，重新开始
- **[S] 查看详细信息** - 查看已生成的内容详情
- **[X] 退出** - 离开工作流

## MENU HANDLING:

### [C] Continue - Resume Last Progress

Load the appropriate next step based on `stepsCompleted`:

- If `stepsCompleted` only contains `[1]`: Load `step-02-idea-capture.md`
- If `stepsCompleted` contains `[1, 2]`: Load `step-03-value-proposition.md`
- If `stepsCompleted` contains `[1, 2, 3]`: Load `step-04-feasibility.md`
- If `stepsCompleted` contains `[1, 2, 3, 4]`: Load `step-05-market-validation.md`
- If `stepsCompleted` contains `[1, 2, 3, 4, 5]`: Load `step-06-mvp-scoping.md`

Display: "准备从 {next step name} 继续..."

### [R] Restart - Start Over

Ask confirmation: "你确定要重新开始吗？所有当前的进度将会丢失。确认重新开始吗？"

- If yes: Delete or archive the existing file and start fresh from step-01-init.md
- If no: Return to this menu

### [S] Show Details - View Generated Content

Display a more detailed summary of all generated content sections, organized by step. After showing, return to this menu.

### [X] Exit - Leave Workflow

Display: "好的，你可以随时回来继续这个验证工作。使用 `bmad:start idea-validation` 恢复工作流。"

End workflow execution.

## CRITICAL SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Properly detected existing workflow state
- Clearly communicated current progress to user
- User provided clear choice for next action
- Correctly routed to appropriate next step

### ❌ SYSTEM FAILURE:
- Not reading the complete output file
- Misinterpreting `stepsCompleted` array
- Proceeding without user confirmation
- Loading wrong next step
- Deleting existing data without proper confirmation

**Master Rule:** Always prioritize user's choice and data safety when handling continuation.