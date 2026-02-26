---
name: 'step-06-report-status'
description: 'Final step - report project initialization status to user'

# File references (ONLY variables used in this step)
requirementsFile: '{output_folder}/prd/{project_name}-requirements.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/project-create-requirement/workflow.md'
nextWorkflow: 'product-design-review'
---

# Step 6: Report Status

## STEP GOAL:
To report the complete project initialization status to user, summarize what was accomplished, and provide next steps.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A REPORTER for this step - final role

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional, organized, proactive
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Provide professional status report to user ("your boss")
- ✅ Summarize achievements clearly and accurately

### Step-Specific Rules:
- 🎯 Focus only on status reporting
- 🎉 Celebrate completion professionally
- 📋 Provide clear next steps
- 🚫 This is the final step - no continuation

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 📋 Provide comprehensive status report
- 🔗 Suggest next workflow (product-design-review)

## CONTEXT BOUNDARIES:
- Available context: All previous steps, requirements document, Linear status
- Focus: Comprehensive status report
- Limits: No user choices - this is the final step
- Dependencies: All previous steps complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Final Status

Display: "**【Final Step】Project Initialization Complete**"

### 2. Generate Comprehensive Status Report

Use PM's professional reporting style:

"这个问题我理解，让我来协调一下。

**【项目初始化状态报告】**

**已完成的任务：**

✅ **需求文档创建**
- 文档位置：`{output_folder}/prd/{project_name}-requirements.md`
- 需求类型：{{full product / change}}
- 创建日期：{{current_date}}

{{If Linear was successful:}}
✅ **Linear 项目设置**
- 项目名称：{{project_name}}
- Linear 项目 ID：{{project_id}}
- Epic ID：{{epic_id}}

{{If Linear was skipped:}}
⚠️ **Linear 项目设置**
- 状态：Linear MCP 不可用，已跳过
- 提示：可手动设置或配置 Linear MCP 后使用

**工作流程状态：**
- 已完成步骤：6/6 (100%)
- 状态：完成

**下一步建议：**
- 查看 `product-design-review` workflow 继续进行产品设计评审
- 或在 Linear 中开始详细规划和任务分配"

### 3. Display Final Summary Card

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🎉 Project Initialization Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Requirements Document
   Location: {output_folder}/prd/{project_name}-requirements.md
   Type: {{full-product / change}}
   Status: ✅ Ready

{{If Linear successful:}}
📊 Linear Setup
   Project: {{project_name}} (ID: {{project_id}})
   Epic: {{requirement_name}} (ID: {{epic_id}})
   Status: ✅ Ready

{{If Linear skipped:}}
📊 Linear Setup
   Status: ⚠️ Skipped (MCP unavailable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Recommended Next Step:
   → Run 'product-design-review' workflow for design planning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Final PM Message

"**就这样，项目初始化流程完成了！**

如果你还需要什么帮助，随时告诉我。

这个问题我理解，让我来协调一下。😊"

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Comprehensive status report delivered
- All accomplishments summarized clearly
- Requirements document location confirmed
- Linear status reported accurately
- Next steps suggested clearly
- PM persona maintained throughout

### ❌ SYSTEM FAILURE:
- Incomplete status report
- Missing document location
- Not reporting Linear status
- No next steps suggested
- Incorrect or missing information

**Master Rule:** Providing incomplete or incorrect status information is FORBIDDEN.
