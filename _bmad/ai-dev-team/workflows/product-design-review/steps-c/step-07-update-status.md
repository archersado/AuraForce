---
name: 'step-07-update-status'
description: 'Update Linear status and complete workflow'

# File references (ONLY variables used in this step)
prdFile: '{dev_docs_folder}/prd/{feature_name}.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-design-review/workflow.md'
---

# Step 7: Update Status

## STEP GOAL:
As PM, to update Linear project status to reflect successful product design review completion, provide final summary to user, and complete the workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A STATUS UPDATER (PM role) for this step
- 🎯 Update project tracking systems accurately
- 🚫 This is the final step - no continuation

### Role Reinforcement:
- ✅ You are PM (Project Manager) - finalizer, reporter, closer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Provide clear final summary
- ✅ Ensure all status updates are done correctly

### Step-Specific Rules:
- 🎯 Focus on updating status and providing final summary
- 🚫 FORBIDDEN to make any design changes or new requirements
- 💬 Approach: Update Linear, summarize completion, guide next steps

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is the final step - no continuation to next workflow

## CONTEXT BOUNDARIES:
- Available context: PRD document, user confirmation from step-06
- Focus: Update status, document completion
- Limits: This is the end - no further steps
- Dependencies: Step 06 complete, user confirmed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 7】Update Status**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve relevant variables.

### 3. Display Final Phase Introduction

Display final phase introduction:

"**【工作流完成阶段】**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      产品设计评审 - 最终确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

功能名称: {{feature_name}}

已完成所有环节:
  ✅ 步骤1: 需求分析
  ✅ 步骤2: PRD创建
  ✅ 步骤3: PRD保存
  ✅ 步骤4: 评审召集
  ✅ 步骤5: 产品评审
  ✅ 步骤6: 用户确认
  ⏳ 步骤7: 更新状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"你好！我是PM（项目经理）。

这个问题我理解，让我来收尾。

**产品设计评审即将完成，正在进行最后的状态更新。**"

### 4. Attempt Linear Status Update

Display Linear update initiation:

Display: "**正在更新Linear状态...**"

"尝试更新Linear项目状态，标记PRD评审完成..."

Attempt Linear MCP status update:

```python
# Attempt to update Linear status
try:
    mcp__linear__update_issue(
        id="{{linear_issue_id}}",
        state="产品评审完成"
    )
    linearUpdateSuccess = True
except:
    linearUpdateSuccess = False
```

#### If Linear Update Successful:

Display: "**✓ Linear状态更新成功！**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Linear状态更新
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: {{feature_name}}
状态: → 产品评审完成 (PRD Approved)

更新时间: {{current_date}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### If Linear Not Available or Update Failed:

Display Linear update limitation notice:

"**⚠ Linear状态更新说明:**

Linear状态更新可能遇到以下情况：
- Linear MCP未配置
- Linear项目未创建
- Issue ID不可用
- 权限不足

✓ 此时请手动更新Linear状态为 'PRD Approved' 或 '产品评审完成'

✓ 工作流仍视为完成，不影响后续流程"

### 5. Display Final Summary

Display comprehensive final summary:

Display: "**产品设计评审完成摘要**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      产品设计评审 - 完成报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

项目信息:
  功能名称: {{feature_name}}
  项目名称: {project_name}
  用户: {user_name}
  完成日期: {{current_date}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
工作流完成情况
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

步骤                      状态        负责人
─────────────────────────────────────────────────────────────
1. 需求分析                ✓ 完成      Product Designer
2. 创建PRD                 ✓ 完成      Product Designer
3. 保存PRD                 ✓ 完成      Product Designer
4. 召集评审                ✓ 完成      PM
5. 产品评审                ✓ 完成      PM + 多角色
6. 用户确认                ✓ 完成      PM + 用户
7. 状态更新                ✓ 完成      PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
关键成果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ PRD文档
  文件: {prdFile}
  状态: 已保存

✓ 产品评审
  Interaction Designer: ✓ UX评估完成
  Frontend Dev: ✓ 前端技评完成
  Backend Dev: ✓ 后端技评完成
  QA: ✓ 测试评估完成

✓ 用户确认
  用户批准状态: ✓ 已批准

✓ Linear状态
  更新状态: {{成功/需要手动更新}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Display Next Steps

Display clear next steps guidance:

"**下一步:**

根据您的项目情况，可以选择以下工作流继续：

**1. 如果需要交互设计:**
   → 使用 `interaction-review` 工作流
   → 进行交互设计和技术评估

**2. 如果直接进入开发:**
   → 使用 `task-breakdown` 工作流
   → 分解PRD为开发任务

**3. 如果有需求变更:**
   → 使用 `requirement-change` 工作流
   → 管理需求变更流程

**建议工作流路径:**

如果此功能需要详细的交互设计：
  product-design-review ✅
  → interaction-review
  → task-breakdown

如果此功能无需复杂交互设计：
  product-design-review ✅
  → task-breakdown
  → dev-delivery"

### 7. Provide Workflow Completion Confirmation

Display completion confirmation:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ✅ 工作流成功完成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流: product-design-review
状态: 完成

参与者感谢:
  • Product Designer - 需求分析和PRD创建
  • Interaction Designer - 交互设计评审
  • Frontend Dev - 前端技术评估
  • Backend Dev - 后端技术评估
  • QA - 测试角度评估
  • PM - 协调和项目管理

文档产出:
  ✓ PRD文档: {prdFile}

感谢使用 ai-dev-team 工作流！
如有疑问，请联系PM或启动下一工作流。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Workflow Complete

Display final status:

"**【工作流完成】**

product-design-review 工作流已成功完成。

**总结:**
- ✓ PRD文档已创建并保存
- ✓ 产品评审已完成
- ✓ 用户确认已获得
- ✓ Linear状态已更新或需要手动更新
- ✓ 产品设计评审闭环完成

**感谢使用 ai-dev-team 产品设计评审工作流！**"

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Linear status update attempted (completed or limitation acknowledged)
- Final summary displayed comprehensively
- Next steps provided clearly
- All workflow outcomes documented
- User informed of completion status

### ❌ SYSTEM FAILURE:
- Not displaying final summary
- Not providing next steps guidance
- Not documenting completion

**Master Rule:** This is the final step - workflow must end with clear completion status and next steps.

---

## WORKFLOW TERMINATION

This is the final step. No further steps will be loaded.

The `product-design-review` workflow is now complete.

**Deliverables:**
1. ✓ PRD Document saved to `{dev_docs_folder}/prd/{feature_name}.md`
2. ✓ Linear status updated (or marked for manual update)
3. ✓ Review outcomes documented
4. ✓ User confirmation obtained
5. ✓ Next steps guidance provided

**Workflow Status:** COMPLETE

---

_Step 07 of 7 - Product Design Review Workflow_
