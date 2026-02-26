---
name: project-progress-query
description: 查询当前项目状态和进度
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Project Progress Query

**Goal:** 查询当前项目状态和进度 - 用户可以随时向PM查询项目进度

**Description:** 用户可以随时向PM查询项目进度。PM从Linear读取当前项目状态（Epic、Story、Bug），生成项目进度报告。报告包含：当前里程碑、完成进度、任务状态分布、需要关注的问题。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | project-progress-query |
| **Total Steps** | 5 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (Progress report markdown - optional save) |
| **Mode** | Create-only |
| **Primary Persona** | PM |
| **Integration** | Linear MCP |

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-File Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Sequence within the step files must be completed in order
- **Session-based**: Single-session workflow with no intermediate state persistence
- **Report Generation**: Output is a formatted progress report (optional save)

---

## STEP OVERVIEW

```
Step 01: step-01-receive-query
  ├─ Type: Input/Gather
  ├─ Menu: S/C
  ├─ Agent: PM
  ├─ Goal: Receive user's project progress query
  └─ Next: step-02-query-linear

Step 02: step-02-query-linear
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Query Epic, Story, Bug status from Linear
  └─ Next: step-03-analyze-status

Step 03: step-03-analyze-status
  ├─ Type: Analysis
  ├─ Menu: C/Only
  ├─ Agent: PM
  ├─ Goal: Analyze overall project status
  └─ Next: step-04-generate-report

Step 04: step-04-generate-report
  ├─ Type: Report Generation
  ├─ Menu: R/S/C
  ├─ Agent: PM
  ├─ Template: template-progress-report.md
  ├─ Goal: Generate formatted progress report
  └─ Next: step-05-present-to-user

Step 05: step-05-present-to-user
  ├─ Type: Presentation
  ├─ Menu: R/C
  ├─ Agent: PM
  ├─ Goal: Present progress report to user like reporting to boss
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-receive-query (PM)
       │
       ▼
step-02-query-linear (PM - Linear MCP)
       │
       ▼
step-03-analyze-status (PM)
       │
       ▼
step-04-generate-report (PM)
       │
       ▼
step-05-present-to-user (PM)
       │
       ▼
   COMPLETE
```

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 2. Input Validation

Gather required inputs:
- 项目名称

Optional inputs:
- 特定时间范围
- 特定组件

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-receive-query.md`

---

## WORKFLOW CHAINING

**Previous Workflows:** None (standalone query workflow)

**Next Workflow:** None (report presentation is the endpoint)

**Related Workflows:**
- `task-breakdown` - Provides story data for progress tracking
- `bug-fix-verify` - Provides bug status for progress report

---

## DOCUMENT TEMPLATES

### Progress Report Template (`template-progress-report.md`)
- Current milestone
- Completion percentage
- Estimated completion time
- Issues needing attention
- Statistics summary:
  - Epic/Story total count
  - Story count distribution by status
  - Bug count and status
  - Milestone completion progress
- Links to relevant documents

---

## AGENT PERSONAS

### Primary Agent: PM (Project Manager)

**Persona Characteristics:**
- Experienced project manager with strong communication skills
- Deep understanding of project status tracking and reporting
- Professional presentation approach
- Focus on clarity and actionable information

**Communication Style:**
- Professional and clear presentation
- Like reporting to boss
- "这个问题我理解，让我来协调一下"
- Structured report format with visual elements

### Secondary Agents

None (PM handles the entire workflow)

---

## EXTERNAL INTEGRATIONS

### Linear MCP

**Purpose:** Query project status and progress data

**Query Operations:**
- List Epics with status
- List Stories with status filtering
- List Bugs with status
- Get Milestone information
- Retrieve project statistics

**Usage:**
- Attempt to query using MCP tools
- Handle unavailability gracefully with user notification
- Provide partial information if full query fails

**Available MCP Tools:**
- `mcp__linear__list_projects` - Get project list
- `mcp__linear__list_issues` - Get Epic/Story/Bug data
- `mcp__linear__list_milestones` - Get milestone information
- `mcp__linear__get_project` - Get project details

---

## REPORT FORMAT

### Progress Report Template (like reporting to boss):

```
┌────────────────────────────────────────────────────────┐
│  📋 项目进度汇报 - 给老板                               │
├────────────────────────────────────────────────────────┤
│  🎯 当前里程碑：产品设计评审                             │
│  ✅ 完成进度：70%                                       │
│  ⏰ 预计完成时间：本周五                                 │
│  ⚠️  需要您关注的：交互设计有个细节想请示您                │
│  📝 附：设计文档链接                                     │
└────────────────────────────────────────────────────────┘

📊 项目统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Epic 总计：X 个
  ✅ 已完成：X 个  🔄 进行中：X 个  ⏸️ 未开始：X 个

• Story 总计：Y 个
  ✅ 已完成：Y 个  🔄 进行中：Y 个  ⏸️ 待开始：Y 个

• Bug 统计：Z 个
  🔴 Critical：Z 个  🟡 High：Z 个  🟢 Normal：Z 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 状态分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Visual bar chart represents status distribution]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  需要您关注的问题
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [问题描述]
   - 影响范围：[影响描述]
   - 建议行动：[建议]

2. [问题描述]
   - 影响范围：[影响描述]
   - 建议行动：[建议]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 相关链接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PRD 文档：[链接]
• 交互设计：[链接]
• Linear 项目：[链接]
• 更多详情：[链接]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## USER INTERACTION

### Who it's for:
- 用户随时向PM查询项目进度
- PM 查询Linear、生成报告、向用户汇报

### User interaction style:
- PM reports progress like reporting to boss
- Professional and clear presentation

### Instruction style:
- **Intent-Based** - agents adapt naturally to dialogue
- Direct query-response pattern

---

## CONFIGURATION

### Session Type

- **Single-session** (Non-continuable)
- Complete workflow execution in one session
- No intermediate save/resume points

### Pattern

- **Simple linear flow** (no branching)
- Sequential execution with no conditional loops

### Document Output

- **Yes** - Semi-structured documents
- Progress report template provides structure
- Optional save to file

---

## REQUIRED INPUTS

- 项目名称

---

## OPTIONAL INPUTS

- 特定时间范围
- 特定组件

---

## DELIVERABLES

- Temporary progress report (can choose to save)
- Optional: Saved report file in `{dev_docs_folder}/reports/`

---

## STATISTICS TO INCLUDE IN REPORT

- Epic/Story total count
- Story count distribution by status
- Bug count and status
- Milestone completion progress

---

## PM COMMUNICATION STYLE

- Professional
- Like reporting to boss
- "这个问题我理解，让我来协调一下"

---

### Summary

This workflow provides a professional project progress reporting mechanism where the PM queries Linear for the current project status, analyzes the data, and presents a clear, structured progress report to the user in a professional style like reporting to boss.
