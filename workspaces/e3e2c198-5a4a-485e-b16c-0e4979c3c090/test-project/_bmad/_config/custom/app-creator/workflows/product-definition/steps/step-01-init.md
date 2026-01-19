---
name: 'step-01-init'
description: 'Initialize the PRD and diagram generation workflow by detecting continuation state and creating output document'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/workflows/prd-with-diagram-generator'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-concept-collection.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd-{project_name}.md'
continueFile: '{workflow_path}/steps/step-01b-continue.md'
templateFile: '{workflow_path}/templates/prd-template.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
brainstormingTask: '{project-root}/_bmad/core/tasks/brainstorming.xml'
---

# Step 1: PRD Workflow Initialization

## STEP GOAL:

To initialize the PRD and diagram generation workflow by detecting continuation state, creating the output document structure, and preparing for collaborative product requirements gathering.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a product requirements analysis expert and visualization designer
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in PRD writing, requirements analysis, and diagram design, user brings product concepts and business knowledge, and together we produce professional requirements documents
- ✅ Maintain collaborative and professional tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and setup
- 🚫 FORBIDDEN to look ahead to future steps
- 💬 Handle initialization professionally
- 🚪 DETECT existing workflow state and handle continuation properly

## EXECUTION PROTOCOLS:

- 🎯 Show analysis before taking any action
- 💾 Initialize document and update frontmatter
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until setup is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from other steps
- Input document discovery happens in this step

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for file at `{output_folder}/prd-{project_name}.md`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

- **STOP here** and load `{workflow_path}/steps/step-01b-continue.md` immediately
- Do not proceed with any initialization tasks
- Let step-01b handle the continuation logic

### 3. Handle Completed Workflow

If the document exists AND all steps are marked complete in `stepsCompleted`:

- Ask user: "I found an existing PRD document from [date]. Would you like to:
  1. Create a new PRD project
  2. Update/modify the existing PRD"
- If option 1: Create new document with timestamp suffix
- If option 2: Load step-01b-continue.md

### 4. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

This workflow can optionally work with existing documents:

**Reference Documents (Optional):**

- Look for: `{output_folder}/*requirements*.md`
- Look for: `{output_folder}/*spec*.md`
- Look for: `{output_folder}/*brief*.md`
- If found, load completely and add to `inputDocuments` frontmatter

#### B. Create Project Structure

Create the project directory structure:
- Main PRD document: `{output_folder}/prd-{project_name}.md`
- Diagrams folder: `{output_folder}/diagrams/`

Copy the template from `{templateFile}` to `{output_folder}/prd-{project_name}.md`

Initialize frontmatter with:

```yaml
---
stepsCompleted: [1]
lastStep: 'init'
inputDocuments: []
date: [current date]
user_name: {user_name}
projectName: {project_name}
productType: ''
targetUsers: []
diagramsCreated: []
---
```

#### C. Show Welcome Message

"欢迎使用PRD和图表生成工作流！🚀

我是您的产品需求分析专家和可视化设计师。我将协助您创建专业的产品需求文档(PRD)和配套的系统图表。

我们将通过协作式对话，从您的产品概念出发，逐步深入分析需求，最终产出：
- 完整的PRD文档（包含产品概览、用户分析、功能需求、非功能需求、验收标准）
- 专业图表（用户-系统交互图、系统边界图、产品模块图、数据流转图）
- 企业级文档结构和视觉风格

让我们开始产品概念的收集和分析过程。"

### 5. Present MENU OPTIONS

Display: **正在准备产品概念收集阶段...**

#### EXECUTION RULES:

- This is an initialization step with no user choices
- Proceed directly to next step after setup
- Use menu handling logic section below

#### Menu Handling Logic:

- After setup completion, immediately load, read entire file, then execute `{nextStepFile}` to begin product concept collection

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN initialization setup is complete and document is created (OR continuation is properly routed), will you then immediately load, read entire file, then execute `{nextStepFile}` to begin product concept collection.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Document created from template (for fresh workflows)
- Frontmatter initialized with `stepsCompleted: [1]`
- Project structure created with diagrams folder
- User welcomed to the PRD creation process
- Ready to proceed to concept collection
- OR existing workflow properly routed to step-01b-continue.md

### ❌ SYSTEM FAILURE:

- Proceeding with step 2 without document initialization
- Not checking for existing documents properly
- Creating duplicate documents
- Skipping welcome message
- Not routing to step-01b-continue.md when appropriate

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.