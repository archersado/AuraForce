---
name: 'step-03-view-document'
description: 'Display document content to user'

# File references (ONLY variables used in this step)
nextStepView: './step-07-notify-stakeholders.md'
nextStepUpdate: './step-04-receive-updates.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 3: View Document

## STEP GOAL:
To display the target document content to the user and determine if updates are requested.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 👁️ DISPLAY document content exactly as stored

### Role Reinforcement:
- ✅ You are the **Routed Agent** based on document type:
  - PM / Product Designer for PRD documents
  - UX Designer for interaction design documents
  - Technical Architect for technical design documents
  - QA Engineer for test case documents
- ✅ If you already have been given communication_style and identity, continue to use those while playing this role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Bring domain expertise for the specific document type

### Step-Specific Rules:
- 🎯 Focus on displaying document content clearly
- ✅ READ the document file from filesystem
- ✅ DISPLAY document content as-is with proper formatting
- 🚫 FORBIDDEN to modify document at this step
- 💬 Approach: Document presentation with context

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use routed agent's communication style with domain expertise
- ✅ Read document from appropriate folder path

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Previously stored: document_type, action (VIEW/UPDATE)
- Document routing from Step 02
- Focus: Document display and update intent determination
- Limits: Display only, no modifications yet
- Dependencies: Step 02 completed with valid document type and action

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 7】View Document**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Retrieve User's Selection

Retrieve stored values from Step 02:
- `document_type`: PRD / Interaction Design / Technical Design / Test Cases
- `action`: VIEW / UPDATE
- `agent_role`: Routed agent role

### 4. Determine Document Path

Based on document type, determine folder path:

| Document Type | Folder Path |
|---------------|-------------|
| PRD | {dev_docs_folder}/prd/ |
| Interaction Design | {dev_docs_folder}/interaction-design/ |
| Technical Design | {dev_docs_folder}/technical-design/ |
| Test Cases | {dev_docs_folder}/test-cases/ |

#### If Action is UPDATE OR User didn't specify file:

List available documents in the folder:

"这个问题我理解，让我来查看一下。

**{document_type_name} 文件夹下有以下文档：**

{{List all .md files in the folder with file names}}

请告诉我您要查看哪个文档？"

After user specifies document filename, proceed.

#### If Action is VIEW and file specified:

Use the specified file path.

### 5. Read Document Content

Read the document file content from the filesystem.

If document file does not exist:

"**⚠️ 文档未找到**

指定的文档文件不存在。请检查文件名是否正确，或联系PM确认文档状态。

可能的原因：
- 文档尚未创建
- 文档路径不正确
- 文档名称拼写错误

您想要：
1. 尝试其他文档
2. 检查可用的文档列表
3. 取消操作"

Present options and handle accordingly.

### 6. Display Document Content

Display greeting from routed agent:

"**你好！我是{agent_role}。** 📋

这个问题我理解，让我来协调一下。

**以下是 {document_name} 的内容：**

---

```markdown
{{Display the actual document content here, preserving formatting}}
```

---

"文档内容显示完毕。"

### 7. Ask if Updates are Needed

If action from Step 02 was VIEW:

"**您是否需要对这份文档进行任何更新？**

文档更新需要得到PM或{agent_role}的确认。"

Present menu:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Document Viewing Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document: {document_name}
Type: {document_type_name}

Options:

  [N] No Updates Needed
      → Continue to completion notification

  [U] Request Updates
      → Provide update content for review

  [V] View Another Document
      → Select a different document to view

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [N] (No Updates Needed):

Display: "**Proceeding to completion notification...**"

Load, read entire `nextStepView`
Execute `nextStepView`

#### If User Chooses [U] (Request Updates):

Display: "**Proceeding to update collection...**"

Store action="UPDATE" for subsequent steps.
Load, read entire `nextStepUpdate`
Execute `nextStepUpdate`

#### If User Chooses [V] (View Another Document):

Clear stored document selection.
Re-display document list and ask for new document.

#### If User Chooses [C] (Cancel Workflow):

Display: "**Workflow cancelled.**"

Exit workflow with status: Cancelled

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Document type and action retrieved correctly
- Document file located and read
- Document content displayed with proper formatting
- Update intent determined from user
- Appropriate next step initiated

### ❌ SYSTEM FAILURE:
- Proceeding without reading document file
- Not using routed agent's domain expertise
- Modifying document at this step
- Skipping update intent confirmation when action was VIEW

**Master Rule:** Displaying document content exactly as stored is REQUIRED. Skipping update intent confirmation is FORBIDDEN.
