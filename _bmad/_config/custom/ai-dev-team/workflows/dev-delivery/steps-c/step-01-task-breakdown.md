---
name: 'step-01-task-breakdown'
description: 'Break down tasks into Story list'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-test-case-design.md'
---

# Step 1: Task Breakdown

## STEP GOAL:
To analyze product design and interaction design documents, break down requirements into fine-grained Stories with acceptance criteria and ownership assignment.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, analytical project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus on breaking down requirements into fine-grained Stories
- 🚫 FORBIDDEN to start implementation yet
- 🤝 Collaborate with Frontend Dev and Backend Dev for technical input
- 💬 Approach: Analyze, breakdown, confirm with team

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Focus: Analyzing PRD, interaction design documents
- Limits: Don't implement code, just create stories
- Dependencies: Product design and interaction design documents must be available

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 9】Task Breakdown**"

### 2. Load Configuration

Load and read full config from `{project-root}/_bmad/bmb/config.yaml` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`, `artifacts_folder`

### 3. Analyze Design Documents

Read and analyze:
- 产品设计文档（PRD）
- 交互设计文档
- 任何现有的技术设计文档

Display analysis summary for team discussion. Use PM's communication style:

"这个问题我理解，让我来协调一下。

**我已分析了你的设计文档。** 以下是关键需求摘要：

**产品目标：** {{从PRD提取的目标}}

**主要功能模块：**
- {{列出关键功能模块}}

**用户交互流程：**
- {{从交互设计提取的主要流程}}

**技术考虑：**
- {{识别的技术约束和考虑}}

接下来，我将和Frontend Dev、Backend Dev一起将这些需求拆分为细粒度的Story。

你确认这个准备可以开始吗？"

### 4. Collaborate with Dev Team to Break Down Stories

Engage with Frontend Dev and Backend Dev to create fine-grained Stories:

"让我们 collaborative 地将需求拆分为 Story。我会从产品角度定义功能，Frontend Dev 和 Backend Dev 请从实现角度补充技术细节。

**我们为每个 Story 需要定义：**
- Story ID（唯一标识）
- 标题
- 用户故事描述
- 验收标准
- 优先级
- 估算复杂度
- 负责人（Frontend Dev / Backend Dev / QA）
- 估算时间

让我们逐个功能模块来拆解..."

Proceed through each feature module, creating stories with input from the team. Store the story list temporarily.

### 5. Present Story List for Approval

Display the complete Story list for user confirmation:

"这个问题我理解，让我来协调一下。

**我们已完成了任务拆解。** 以下是 Story 列表摘要：

**总 Story 数：** {{count}}

**分配情况：**
- Frontend Dev: {{count}} Stories
- Backend Dev: {{count}} Stories
- QA: {{count}} Stories

**Story 列表：**
{{列出所有 Story，每个包括ID, 标题, 描述, 验收标准, 负责人}}

请确认这个 Story 列表是否完整和准确？"

### 6. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Task Breakdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [A] Approve & Continue
      → Story list confirmed, proceed to test case design

  [P] Provide Additional Information
      → Add more stories or modify existing ones

  [R] Request Team Input
      → Get more input from Frontend Dev or Backend Dev

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to test case design...**"

1. Store Story list in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [P] (Provide Additional Information):

Ask what modifications are needed. Collect updates, update story list, then redisplay menu.

#### If User Chooses [R] (Request Team Input):

Ask what specific input is needed. Engage with Frontend Dev or Backend Dev to gather additional information, update story list, then redisplay menu.

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Design documents analyzed
- Story list created with team collaboration
- Each story has clear acceptance criteria and ownership
- User confirms story list

### ❌ SYSTEM FAILURE:
- Skipping document analysis
- Not collaborating with dev team
- Stories missing acceptance criteria or ownership
- No ownership assignment
- Proceeding without user confirmation

**Master Rule:** Skipping team collaboration or proceeding without confirmation is FORBIDDEN.
