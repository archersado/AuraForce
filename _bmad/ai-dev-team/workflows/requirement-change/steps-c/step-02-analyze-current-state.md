---
name: 'step-02-analyze-current-state'
description: 'Analyze current project state'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-assess-impact.md'
---

# Step 2: Analyze Current State

## STEP GOAL:
To query and analyze the current project state (completed/in-progress tasks).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'A', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, analytical project manager
- ✅ Use PM's communication style
- ✅ We engage in collaborative dialogue, not command-response

### Step-Specific Rules:
- 🎯 Focus on querying current project state from Linear
- 🚫 FORBIDDEN to skip state analysis
- 💬 Approach: Query, summarize, confirm

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style
- 🔄 Use Linear MCP to query project state

## CONTEXT BOUNDARIES:
- Available context: Change request from Step 1
- Focus: Querying current project status (completed/in-progress tasks)
- Integration: Linear MCP
- Dependencies: Change request from previous step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 8】Analyze Current State**"

### 2. Retrieve Change Request

Retrieve the change request details from session memory.

### 3. Query Current Project State from Linear

Use Linear MCP to query the current project state:

1. **Query Project Information:**
   - Use `mcp__linear__list_projects` to find the current project
   - Get project details with `mcp__linear__get_project`

2. **Query Epics:**
   - Use `mcp__linear__list_issues` to list epics (may have a specific label or be parent issues)
   - Get details for relevant epics

3. **Query Stories by Status:**
   - Query completed stories: Use `mcp__linear__list_issues` with appropriate state filter
   - Query in-progress stories: Use `mcp__linear__list_issues` with appropriate state filter
   - Query pending stories: Use `mcp__linear__list_issues` with appropriate state filter

4. **Query Current Cycle:**
   - Use `mcp__linear__list_cycles` to get the current cycle information

**Handle Linear MCP unavailability gracefully:**
- If Linear MCP is not available, inform the user and proceed with manual state collection
- Ask user to provide:
  - List of completed features
  - List of in-progress tasks
  - List of pending tasks
  - Current project status

### 4. Summarize Current Project State

Display a summary of the current project state for user review:

"我已经查询了当前的项目状态。

**项目概览：**
- 项目名称：{{from Linear/config}}
- 当前周期：{{from Linear}}

**已完成的任务（{{count}}个）：**
{{List completed stories with key details}}

**进行中的任务（{{count}}个）：**
{{List in-progress stories with key details}}

**待处理的任务（{{count}}个）：**
{{List pending stories with key details}}

**当前项目进度：** {{summary of overall progress}}"

### 5. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] Analyze Current State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [A] Accept Analysis
      → Project state analysis correct, proceed to assess impact

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Handle User Choice

#### If User Chooses [A] (Accept Analysis):

Display: "**分析已确认，开始评估变更影响...**"

1. Store current project state in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Current project state queried from Linear
- State summary displayed to user
- User confirms analysis

### ❌ SYSTEM FAILURE:
- Skipping state query
- Not displaying summary to user
- Proceeding without user confirmation

**Master Rule:** Skipping state query or proceeding without confirmation is FORBIDDEN.
