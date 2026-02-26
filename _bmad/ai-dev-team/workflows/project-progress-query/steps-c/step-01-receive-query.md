---
name: 'step-01-receive-query'
description: 'Receive user project progress query'

# File references (ONLY variables used in this step)
nextStepFile: './step-02-query-linear.md'
---

# Step 1: Receive Query

## STEP GOAL:
To receive user's project progress query and gather required inputs.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER query Linear or generate report at this step
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'S', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a data collector

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on receiving query and gathering inputs
- 🚫 FORBIDDEN to query Linear or generate report yet
- 💬 Approach: Listen, gather inputs, confirm

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's professional communication style

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Focus: Receiving project progress query request
- Limits: Don't query Linear yet, just gather inputs
- Dependencies: None - this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 1 of 5】Receive Project Progress Query**"

### 2. Load Configuration

Load and read full config from `{project-root}/_bmad/bmb/config.yaml` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Receive Query Request

Display professional greeting using PM's communication style:

"这个问题我理解，让我来协调一下。

您好，我是项目经理（PM）。我可以为您查询项目进度。

**我需要确认以下信息：**

1. **项目名称**（必填）：
   请提供您要查询的项目名称。

2. **特定时间范围**（可选）：
   - 全部时间（默认）
   - 最近一周
   - 最近一月
   - 自定义日期范围

3. **特定组件**（可选）：
   如果您只想查询特定功能的进度，请提供组件名称。

请提供以上信息，我将为您生成项目进度报告。"

### 4. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 1] Receive Project Progress Query
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [S] Start Query
      → Proceed with provided project name

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [S] (Start Query):

Validate that project name is provided. Then:

1. Store the following in session memory:
   - `project_name`: The project name provided by user
   - `time_range`: Time range (default: "全部时间" or user-specified)
   - `component_filter`: Component filter (default: None or user-specified)

2. Display: "**收到查询请求。正在准备查询数据...**"

3. Load, read entire `nextStepFile`
4. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Query request received from user
- Required inputs (project name) gathered
- User confirms to proceed

### ❌ SYSTEM FAILURE:
- Proceeding without project name
- Not displaying menu to user
- Skipping user confirmation

**Master Rule:** Proceeding without project name or user confirmation is FORBIDDEN.