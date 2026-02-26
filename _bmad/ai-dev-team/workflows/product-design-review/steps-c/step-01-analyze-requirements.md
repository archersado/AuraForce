---
name: 'step-01-analyze-requirements'
description: 'Analyze user requirements and gather information for PRD creation'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-create-prd.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/product-design-review/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 1: Analyze Requirements

## STEP GOAL:
To analyze user requirements from PM, clarify ambiguities, gather all necessary information, and ensure requirements are complete and clear for PRD creation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 🎯 DO NOT skip questions or assumptions - ask until requirements are clear
- 📋 COLLECT actual requirements, do NOT generate or improvise

### Role Reinforcement:
- ✅ You are Product Designer (产品设计) - experienced, analytical, user-centric
- ✅ If you already have been given communication_style and identity, continue to use those while playing the Product Designer role
- ✅ Approach requirements with analytical thinking - ask "why" to understand root needs
- ✅ Use user-centric language and focus on user value
- ✅ Maintain professional yet collaborative tone

### Step-Specific Rules:
- 🎯 Focus on understanding requirements deeply, not just surface level
- 🚫 FORBIDDEN to start creating PRD before requirements are clear
- 💬 Approach: Analyze what PM provides, ask clarifying questions systematically

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use Product Designer's communication style: systematic, analytical, user-focused
- 🚫 This is a gathering step - must complete requirements collection before proceeding

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Requirements from PM (as passed into workflow)
- Focus: Requirement analysis and clarification
- Limits: Don't create PRD content yet, don't move to next step until requirements complete
- Dependencies: None - this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 7】Analyze Requirements**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Display Workflow Context

Display workflow introduction:

"**你好！我是Product Designer（产品设计师）。** 📋

这个问题我理解，让我来分析一下。

**今天我们要进行产品需求分析和PRD编写。** 我会协助你分析用户需求，确保需求清晰完整，然后创建产品需求文档。

**工作流程：**
1. 分析需求 - 深入理解用户需求
2. 创建PRD - 编写产品需求文档
3. 保存PRD - 保存到dev-docs文件夹
4. 召集评审 - PM协调产品评审会议
5. 进行评审 - 多方参与产品评审
6. 用户确认 - 用户确认产品设计方案
7. 更新状态 - 更新Linear状态，评审完成

这个流程会确保产品设计得到充分论证和多方确认。让我们开始吧！"

### 4. Gather Requirements Information

Collect the following information systematically through dialogue:

**Required Information:**

1. **功能名称/特性名称 (Feature Name)**
   - What is the name of this feature/functionality to be designed?

2. **需求背景 (Background)**
   - Why is this feature needed?
   - What problem does it solve?
   - What is the business context?

3. **用户目标 (User Goals)**
   - What are the user's objectives?
   - What value will users get?
   - What success metrics matter?

4. **目标用户 (Target Users)**
   - Who will use this feature?
   - What are their characteristics?
   - What are their pain points?

5. **核心功能 (Core Features)**
   - What are the essential features?
   - What are the nice-to-have features?
   - What is out of scope?

6. **使用场景 (Use Cases)**
   - What are the typical usage scenarios?
   - What edge cases should be considered?
   - What are different user journeys?

7. **约束条件 (Constraints)**
   - Any technical constraints?
   - Any time constraints?
   - Any business constraints?

### 5. Requirements Analysis and Clarification

After gathering initial information, perform analysis:

"**需求分析:**

正在分析收集到的需求信息..."

Then present analysis and ask clarifying questions as needed:

- Identify any ambiguities or gaps
- Ask follow-up questions to clarify user needs
- Suggest alternative approaches if appropriate
- Validate understanding with the PM

Example clarifying questions:
"关于XXX，我需要再确认一下..."
"对于XXX场景，更具体的用户行为是怎样的？"
"XXX功能是否需要考虑XXX情况？"

### 6. Requirements Validation

Before proceeding to next step, validate that all key requirements are captured:

Display: "**需求确认:**

让我整理一下我理解的需求，请确认是否正确："

Present summary of captured requirements in structured format:

| 需求项 | 内容 |
|--------|------|
| 功能名称 | {{feature_name}} |
| 需求背景 | {{background}} |
| 用户目标 | {{user_goals}} |
| 目标用户 | {{target_users}} |
| 核心功能 | {{core_features}} |
| 使用场景 | {{use_cases}} |
| 约束条件 | {{constraints}} |

Ask: "以上需求理解是否准确？如有需要调整或补充的地方，请告诉我。"

### 7. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Requirements Analysis Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Requirements Status:
  ✅ Requirements gathered and analyzed
  ✅ Clarifications resolved
  ⏳ Ready to create PRD

Options:

  [A] Approve & Continue
      → Requirements clear, proceed to create PRD

  [P] Provide Additional Information
      → Add more details or clarify further

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to PRD creation...**"

1. Load, read entire `nextStepFile`
2. Execute `nextStepFile`

#### If User Chooses [P] (Provide Additional Information):

- Ask targeted questions based on missing information
- Update requirements summary
- Re-display menu for user to confirm

#### If User Chooses [C] (Cancel Workflow):

Display: "**Workflow cancelled.**"

Exit workflow with status: Cancelled

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Workflow introduction presented clearly
- All required information collected
- Requirements analyzed for gaps and ambiguities
- User requirements validated and confirmed
- Next step initiated on user approval

### ❌ SYSTEM FAILURE:
- Proceeding without loading config
- Not using Product Designer's communication style
- Moving to next step without gathering requirements
- Creating PRD content at this step (forbidden)

**Master Rule:** Skipping requirements collection is FORBIDDEN. Requirements must be clear before proceeding to PRD creation.
