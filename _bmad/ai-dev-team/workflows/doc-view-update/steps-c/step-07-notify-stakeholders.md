---
name: 'step-07-notify-stakeholders'
description: 'Notify relevant stakeholders of completed action'

# File references (ONLY variables used in this step)
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 7: Notify Stakeholders

## STEP GOAL:
To notify relevant stakeholders of the completed document viewing or update action.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking action
- 📢 NOTIFY stakeholders of completed action
- ℹ️ Provide clear summary of what was done

### Role Reinforcement:
- ✅ You are PM (Project Manager) - experienced, organized, proactive project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Maintain professional and informative communication
- ✅ Use phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus on completed action summary and stakeholder notification
- ℹ️ Provide clear, actionable information to stakeholders
- 🚫 No further user input needed
- 💬 Approach: Professional notification and workflow completion

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- ✅ This is the final step of the workflow

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Previously stored: document_type, document_name, action, agent_role, (update_content, update_reason if update was performed)
- Focus: Stakeholder notification
- Limits: Notification only, no further action
- Dependencies: Step 06 completed (or Step 03 if view-only)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 7】Notify Stakeholders**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Retrieve Context

Retrieve stored values from previous steps:
- `document_type`: Document type
- `document_name`: Document file name
- `action`: VIEW or UPDATE
- `agent_role`: Routed agent role (if applicable)
- `update_content`: Update content (if UPDATE)
- `update_reason`: Update reason (if UPDATE)

### 4. Determine Stakeholder List

Based on document type and action, identify relevant stakeholders:

**For View Action:**
- User who viewed the document
- PM (for awareness)

**For Update Action:**
- User who requested update
- PM (document management)
- Document owner role (based on document type):
  - PRD: PM / Product Designer
  - Interaction Design: UX Designer
  - Technical Design: Technical Architect
  - Test Cases: QA Engineer
- Related collaboration roles:
  - Frontend Dev (for PRD and Interaction Design changes)
  - Backend Dev (for PRD and Technical Design changes)

### 5. Prepare Notification Summary

Prepare notification based on action:

#### For View-Only Actions:

"**文档查看完成通知**

📋 **文档信息**
- 文档类型: {document_type_name}
- 文档名称: {document_name}
- 操作: 查看

✅ **状态**
文档已成功查看，无修改操作。

本通知已发送给:
- {user_name}（文档查看者）
- PM（项目经理）

---

**备注**: 如需更新此文档，请重新启动doc-view-update工作流。"

#### For Update Actions:

"**文档更新完成通知**

📋 **文档信息**
- 文档类型: {document_type_name}
- 文档名称: {document_name}
- 操作: 更新

✅ **更新详情**
- 更新内容: {brief_summary_of_update}
- 更新原因: {update_reason}
- 批准人: {agent_role}
- 更新时间: {current_timestamp}

📁 **文档位置**
{dev_docs_folder}/{document_folder}/{document_name}

---

**通知已发送给:**
- {user_name}（更新请求者）
- PM（文档管理）
- {agent_role}（文档负责人）
- 相关协作角色

---

**后续行动建议:**
- 相关协作角色请查看更新后的文档
- 如更新影响开发进度，PM将协调任务调整
- 如有疑问，请联系PM"

### 6. Display Notification Summary

Display greeting from PM:

"**你好！我是PM（项目经理）。** 📢

这个问题我理解，让我来汇总一下。

**文档操作已完成！**

{Display the prepared notification summary}"

### 7. Display Workflow Completion

Display final status:

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**工作流完成**
**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

**已完成步骤:**
1. ✅ 接收请求
2. ✅ 识别文档
3. ✅ 查看文档
4. ✅ {更新操作 - if UPDATE performed}
5. ✅ {验证更新 - if UPDATE performed}
6. ✅ {更新文档 - if UPDATE performed}
7. ✅ 通知利益方

**本次操作:**
- 文档: {document_name}
- 类型: {document_type_name}
- 操作: {VIEW/UPDATE}

**状态:** ✅ 完成

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

感谢使用doc-view-update工作流！

如有其他文档需要查看或更新，请随时启动工作流。
这个问题我理解，让我来协调一下"

### 8. Workflow Complete

End workflow with status: Complete

No further user interaction required.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Context retrieved correctly
- Stakeholder list determined based on document type and action
- Notification summary prepared with relevant details
- Notification displayed to user
- Workflow completion status shown
- Workflow ended successfully

### ❌ SYSTEM FAILURE:
- Not providing notification summary
- Not confirming workflow completion
- Providing incomplete stakeholder information

**Master Rule:** Notification and workflow completion confirmation is REQUIRED. This is the final step and must conclude the workflow properly.
