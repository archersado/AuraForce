---
name: 'step-02-identify-document'
description: 'Identify target document type and action (view or update)'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-view-document.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 2: Identify Document

## STEP GOAL:
To identify the target document type (PRD/Interaction Design/Technical Design/Test Cases) and user's intended action (view or update).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- ☑️ COLLECT user's document type and action choice explicitly

### Role Reinforcement:
- ✅ You are PM (Project Manager) - experienced, organized, proactive project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus on identifying document type and action
- 🚫 FORBIDDEN to display documents yet
- 🤝 Role routing will occur after this step based on document type
- 💬 Approach: Document-focused, systematic identification

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Focus: Document type and action identification
- Limits: Don't display documents yet
- Dependencies: Step 01 completed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 7】Identify Document**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Display Available Document Types

"这个问题我理解，让我来协调一下。

**请选择您要处理的文档类型和操作。**

**可用文档类型：**

**[1] PRD（产品需求文档）**
- 文件夹: {dev_docs_folder}/prd/
- 负责角色: PM / Product Designer
- 内容: 产品需求和规格说明

**[2] 交互设计文档**
- 文件夹: {dev_docs_folder}/interaction-design/
- 负责角色: UX Designer
- 内容: 用户界面和交互流程设计

**[3] 技术设计文档**
- 文件夹: {dev_docs_folder}/technical-design/
- 负责角色: Technical Architect
- 内容: 系统架构和技术实现方案

**[4] 测试用例文档**
- 文件夹: {dev_docs_folder}/test-cases/
- 负责角色: QA Engineer
- 内容: 测试计划和测试用例"

### 4. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] Document Identification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document Types:
  [1] PRD（产品需求文档）
  [2] 交互设计文档
  [3] 技术设计文档
  [4] 测试用例文档

Actions:
  [V] View Document Only
      → View document content without making changes

  [U] Update Document
      → View and propose updates to document

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please specify both:
1. Document type [1-4]
2. Action [V/U]

Example: "1 V" for View PRD, or "3 U" for Update Technical Design
```

### 5. Handle User Choice

#### Parse User Input:

Extract document type and action from user input.

#### Route to Appropriate Agent:

Based on document type, set primary agent role:

- Document type [1] PRD: Route to PM / Product Designer
- Document type [2] Interaction Design: Route to UX Designer
- Document type [3] Technical Design: Route to Technical Architect
- Document type [4] Test Cases: Route to QA Engineer

Store this routing decision for subsequent steps.

#### If User Chooses [V] (View Document Only):

Display: "**View {document_type_name}...**"

Store action="VIEW" and proceed to next step.

#### If User Chooses [U] (Update Document):

Display: "**View and Update {document_type_name}...**

Note: Updates will require confirmation from PM or document owner role.**"

Store action="UPDATE" and proceed to next step.

#### If User Chooses [C] (Cancel Workflow):

Display: "**Workflow cancelled.**"

Exit workflow with status: Cancelled

#### Invalid Input:

If input is not in expected format, ask user to try again:

"请按格式输入，例如：'1 V' 或 '3 U'"

### 6. Confirm Selection

Before proceeding, confirm user's selection:

"**确认您的选择：**
- 文档类型: {document_type_name}
- 操作: {VIEW/UPDATE}

请确认是否正确？[Y/N]"

#### If [Y] (Yes):

Display: "**Proceeding to document view...**"

Load, read entire `nextStepFile`
Execute `nextStepFile`

#### If [N] (No):

Re-display menu and ask for new selection.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Available document types displayed clearly
- User provided valid document type and action
- Role routing determined based on document type
- User confirmed selection
- Next step initiated with context

### ❌ SYSTEM FAILURE:
- Proceeding without loading config
- Not using PM's communication style
- Displaying documents before document identification

**Master Rule:** Skipping document identification or proceeding without user confirmation is FORBIDDEN.
