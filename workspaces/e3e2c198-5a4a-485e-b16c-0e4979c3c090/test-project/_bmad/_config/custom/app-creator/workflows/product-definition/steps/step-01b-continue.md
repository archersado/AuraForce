---
name: 'step-01b-continue'
description: 'Handle PRD workflow continuation from previous session'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/workflows/prd-with-diagram-generator'

# File References
thisStepFile: '{workflow_path}/steps/step-01b-continue.md'
outputFile: '{output_folder}/prd-{project_name}.md'
workflowFile: '{workflow_path}/workflow.md'
---

# Step 1B: PRD Workflow Continuation

## STEP GOAL:

To resume the PRD and diagram generation workflow from where it was left off, ensuring smooth continuation without loss of context or progress.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a product requirements analysis expert and visualization designer
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in PRD writing, requirements analysis, and diagram design, user brings product concepts and business knowledge
- ✅ Maintain collaborative and professional tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on analyzing and resuming workflow state
- 🚫 FORBIDDEN to modify content completed in previous steps
- 💬 Maintain continuity with previous sessions
- 🚪 DETECT exact continuation point from frontmatter

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis of current state before taking action
- 💾 Keep existing frontmatter `stepsCompleted` values intact
- 📖 Review the PRD content already generated
- 🚫 FORBIDDEN to modify content that was completed in previous steps
- 📝 Update frontmatter with continuation timestamp when resuming

## CONTEXT BOUNDARIES:

- Current PRD document is already loaded
- Previous context = complete PRD content + existing frontmatter
- Requirements, concepts, and diagrams already gathered in previous sessions
- Last completed step = last value in `stepsCompleted` array from frontmatter

## CONTINUATION SEQUENCE:

### 1. Analyze Current State

Review the frontmatter of `{outputFile}` to understand:

- `stepsCompleted`: Which steps are already done (the rightmost value is the last step completed)
- `lastStep`: Name/description of last completed step
- `date`: Original workflow start date
- `projectName`: Current PRD project name
- `productType`: Type of product being documented
- `targetUsers`: Identified user groups
- `diagramsCreated`: List of diagrams already created

Example: If `stepsCompleted: [1, 2, 3, 4]`, then step 4 was the last completed step.

### 2. Read All Completed Step Files

For each step number in `stepsCompleted` array (excluding step 1, which is init):

1. **Construct step filename**: Based on our workflow structure
   - Step 2: `step-02-concept-collection.md`
   - Step 3: `step-03-requirements-analysis.md`
   - Step 4: `step-04-prd-generation.md`
   - Step 5: `step-05-diagram-creation.md`
   - Step 6: `step-06-final-review.md`

2. **Read the complete step file** to understand:
   - What that step accomplished
   - What the next step should be
   - Any specific context or decisions made

### 3. Review Previous PRD Output

Read the complete `{outputFile}` to understand:

- PRD sections completed so far
- Product concept and requirements gathered
- Diagrams created (check diagrams/ folder)
- User decisions and preferences
- Current state of the deliverable

### 4. Determine Next Step

Based on the last completed step number:

1. **Find the appropriate next step file**:
   - If last step was 1: Continue to step-02-concept-collection.md
   - If last step was 2: Continue to step-03-requirements-analysis.md
   - If last step was 3: Continue to step-04-prd-generation.md
   - If last step was 4: Continue to step-05-diagram-creation.md
   - If last step was 5: Continue to step-06-final-review.md
   - If all steps completed: Workflow is finished

2. **Validate the workflow is incomplete**
3. **Confirm the next step file exists**

### 5. Welcome Back Dialog

Present a warm, context-aware welcome:

"欢迎回来！👋

我看到我们已经完成了您的PRD项目的 [X] 个步骤。

我们上次工作在: [brief description of last step completed]

根据我们的进展，我们准备继续进行: [next step description]

您准备好从我们上次停下的地方继续吗？"

### 6. Validate Continuation Intent

Ask confirmation questions if needed:

"自上次会话以来，是否有任何变化可能影响我们的方法？"
"您是否仍然与我们之前做出的目标和决策保持一致？"
"您想回顾一下我们到目前为止完成的工作吗？"

### 7. Present MENU OPTIONS

Display: **恢复工作流 - 选择选项:** [C] 继续到 [Next Step Name]

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions - always respond and then end with display again of the menu options
- Update frontmatter with continuation timestamp when 'C' is selected

#### Menu Handling Logic:

- IF C:
  1. Update frontmatter: add `lastContinued: [current date]`
  2. Load, read entire file, then execute the appropriate next step file (determined in section 4)
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and continuation analysis is complete, will you then:

1. Update frontmatter in `{outputFile}` with continuation timestamp
2. Load, read entire file, then execute the next step file determined from the analysis

Do NOT modify any other content in the PRD document during this continuation step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Correctly identified last completed step from `stepsCompleted` array
- Read and understood all previous step contexts
- User confirmed readiness to continue
- Frontmatter updated with continuation timestamp
- Workflow resumed at appropriate next step

### ❌ SYSTEM FAILURE:

- Skipping analysis of existing state
- Modifying content from previous steps
- Loading wrong next step file
- Not updating frontmatter with continuation info
- Proceeding without user confirmation

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.