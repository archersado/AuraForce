---
name: 'step-06-update-document'
description: 'Apply approved updates to the document file'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-notify-stakeholders.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 6: Update Document

## STEP GOAL:
To apply the approved updates to the document file.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- ✅ WRITE the updated content to the document file
- 📝 DO NOT improvise or modify beyond what was approved

### Role Reinforcement:
- ✅ You are the **Routed Agent** based on document type:
  - PM / Product Designer for PRD documents
  - UX Designer for interaction design documents
  - Technical Architect for technical design documents
  - QA Engineer for test case documents
- ✅ If you already have been given communication_style and identity, continue to use those while playing this role
- ✅ Maintain professional and precise documentation approach

### Step-Specific Rules:
- 🎯 Focus on applying updates exactly as approved
- ✅ PRESERVE document formatting and structure
- ✅ APPLY only approved changes
- 🚫 FORBIDDEN to add unapproved modifications
- 📝 Ensure document integrity is maintained

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use routed agent's communication style
- ✅ Write document file after confirming user intent

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Previously stored: document_type, document_name, document_content, update_content, update_reason, agent_role, update_status
- Focus: Document file update
- Limits: Apply only approved changes
- Dependencies: Step 05 completed with approved update

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 7】Update Document**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Retrieve Context

Retrieve stored values from previous steps:
- `document_type`: Document type
- `document_name`: Document file name
- `document_content`: Current document content
- `update_content`: Approved update content
- `update_reason`: Update reason
- `agent_role`: Routed agent role
- `update_status`: Approved or Approved with warnings

### 4. Determine Document Path

Based on document type, determine full file path:

| Document Type | Folder Path |
|---------------|-------------|
| PRD | {dev_docs_folder}/prd/ |
| Interaction Design | {dev_docs_folder}/interaction-design/ |
| Technical Design | {dev_docs_folder}/technical-design/ |
| Test Cases | {dev_docs_folder}/test-cases/ |

Full path: `{folder_path}/{document_name}`

### 5. Apply Update to Document

Display greeting from routed agent:

"**你好！我是{agent_role}。** 📝

这个问题我理解，让我来应用更新。

**即将应用的更新：**

**文档:** {document_name}
**路径:** {full_file_path}

**更新内容:**
{display_approved_update_content}

**更新原因:**
{display_update_reason}

**准备应用更新...**"

#### Apply the Update:

Modify the document content according to the approved update:

1. Read the current document file
2. Apply the update changes as specified
3. Preserve document formatting and structure
4. Ensure Markdown syntax is correct
5. Write the updated content back to the file

#### Confirm Update Applied:

Display: "**文档更新已成功应用。**"

### 6. Show Updated Document Summary

Display summary of changes:

"**更新摘要：**

**文档:** {document_name}

**变更内容:**
{Provide a brief summary of what changed}

**更新前关键内容:**
{Summarize key content that was modified}

**更新后关键内容:**
{Summarize the new content}

**文件位置:** {full_file_path}

文档已更新并保存。"

### 7. Confirm Update Success

Display success message:

"**✅ 文档更新成功！**

文档 {document_name} 已成功更新。

更新已保存到: {full_file_path}

接下来，我将通知相关利益方此次文档更新。"

### 8. Auto-Proceed to Next Step

Display: "**Proceeding to stakeholder notification...**"

#### Menu Handling Logic:

After applying update, immediately load, read entire file, then execute nextStepFile

#### EXECUTION RULES:

This is an auto-proceed step with no user choices

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Document context retrieved correctly
- Update applied exactly as approved
- Document formatting and structure preserved
- Document file successfully written
- Update summary displayed
- Next step initiated automatically

### ❌ SYSTEM FAILURE:
- Not applying approved updates
- Adding unapproved modifications to document
- Corrupting document formatting
- Not preserving document structure
- Writing to incorrect file path

**Master Rule:** Applying unapproved modifications or corrupting document format is FORBIDDEN. Updates must be applied exactly as approved.
