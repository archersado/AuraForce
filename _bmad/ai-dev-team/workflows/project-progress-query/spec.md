# Workflow Specification: project-progress-query

**Module:** ai-dev-team
**Status:** Complete - All steps and configuration created
**Created:** 2026-02-03
**Last Updated:** 2026-02-04

---

## Workflow Overview

**Goal:** 查询当前项目状态和进度

**Description:** 用户可以随时向PM查询项目进度。PM从Linear读取当前项目状态（Epic、Story、Bug），生成项目进度报告。报告包含：当前里程碑、完成进度、任务状态分布、需要关注的问题。

**Workflow Type:** Query/Reporting Workflow

**Mode:** Create-only (steps-c/ only)

---

## Workflow Structure

### Entry Point

```yaml
---
name: project-progress-query
description: 查询当前项目状态和进度
web_bundle: true
continuable: false
document_output: true
mode: create-only
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/project-progress-query'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Workflow Steps

| Step | Name | Goal | Agent | Menu Options |
|------|------|------|-------|--------------|
| 1 | Receive Query | 接收用户进度查询请求 | PM | S/C |
| 2 | Query Linear | 使用Linear MCP查询Epic、Story、Bug状态 | PM | None |
| 3 | Analyze Status | 分析项目整体状态 | PM | C Only |
| 4 | Generate Report | 生成项目进度报告 | PM | R/S/C |
| 5 | Present to User | 像老板一样汇报进度 | PM | R/C |

---

## Workflow Files

### Core Workflow Files

- `workflow.md` - Main workflow definition
- `spec.md` - This specification document

### Step Files (steps-c/)

- `step-01-receive-query.md` - Receive project progress query from user
- `step-02-query-linear.md` - Query Linear MCP for Epic, Story, Bug status
- `step-03-analyze-status.md` - Analyze overall project status
- `step-04-generate-report.md` - Generate formatted progress report
- `step-05-present-to-user.md` - Present progress report to user

### Template Files (templates/)

- `template-progress-report.md` - Progress report document template

---

## Workflow Flow Diagram

```
step-01-receive-query (PM)
       │ Menu: S/C
       │
       ▼
step-02-query-linear (PM - Linear MCP)
       │ Menu: None
       │
       ▼
step-03-analyze-status (PM)
       │ Menu: C Only
       │
       ▼
step-04-generate-report (PM)
       │ Menu: R/S/C
       │
       ▼
step-05-present-to-user (PM)
       │ Menu: R/C
       │
       ▼
   WORKFLOW COMPLETE
```

---

## Workflow Inputs

### Required Inputs

- 项目名称

### Optional Inputs

- 特定时间范围
- 特定组件

---

## Workflow Outputs

### Output Format

- [x] Document-producing (optional save)
- [ ] Non-document

### Output Files

- `{dev_docs_folder}/reports/progress-{project-name}-{timestamp}.md` (optional) - Project progress report markdown file
- In-memory report presented to user

---

## Agent Integration

### Primary Agent

**PM (项目经理)** - 查询Linear、生成报告、向用户汇报

- Steps: All 5 steps
- Style: Professional, like reporting to boss
- Key phrase: "这个问题我理解,让我来协调一下"

### Secondary Agents

None - PM handles the entire workflow independently

---

## Configuration

### Session Type

- **Single-session** (Non-continuable)
- Complete workflow execution in one session
- No intermediate save/resume points

### Pattern

- **Simple linear flow** (no branching)
- Sequential execution with no conditional loops

### Document Output

- **Yes** - Semi-structured documents (optional save)
- Progress report template provides structure

---

## External Integrations

### Linear MCP

**Purpose:** Query project status and progress data from Linear

**Query Operations:**
- Step 2: List Projects to find target project
- Step 2: List Issues (Epics, Stories, Bugs) with status filtering
- Step 2: List Milestones for project
- Step 2: Get Project details and statistics

**Available MCP Tools to Use:**
- `mcp__linear__list_projects` - Get available projects
- `mcp__linear__list_issues` - Query Epic, Story, and Bug data with filters
- `mcp__linear__list_milestones` - Get milestone completion info
- `mcp__linear__get_project` - Get detailed project information

**Usage:**
- Attempt to query using MCP tools
- Handle unavailability gracefully with user notification
- Provide partial information if full query fails

---

## Report Format

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

[Visual bar chart representation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  需要您关注的问题
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 详细列出需要关注的问题、影响范围和建议行动

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 相关链接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PRD 文档、交互设计、Linear 项目链接等

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Statistics Include

The report must include:

- **Epic/Story Total Count**: Overall task volume
- **Story Count Distribution by Status**: Progress breakdown
- **Bug Count and Status**: Issue tracking
- **Milestone Completion Progress**: Timeline tracking

---

## PM Communication Style

### Characteristics

- **Professional**: Business-appropriate language
- **Clear**: Straightforward, easy to understand
- **Structured**: Organized presentation format
- **Like reporting to boss**: Respectful, factual presentation

### Key Phrases

- "这个问题我理解，让我来协调一下" (I understand this issue, let me coordinate)

---

## User Interaction

### Who it's for:
- 用户随时向PM查询项目进度
- PM 查询Linear、生成报告、向用户汇报

### User interaction style:
- PM reports progress like reporting to boss
- Professional and clear presentation

### Instruction style:
- **Intent-Based** - agents adapt naturally to dialogue

---

## Key Features

- Query project progress from Linear via MCP
- Analyze Epic, Story, and Bug status
- Generate professional progress report
- Present report like reporting to boss
- Optional report saving
- Includes statistics and issues needing attention

---

## Implementation Status

**Status:** COMPLETE

**Completed Components:**
- [x] workflow.md
- [x] spec.md
- [x] steps-c/step-01-receive-query.md
- [x] steps-c/step-02-query-linear.md
- [x] steps-c/step-03-analyze-status.md
- [x] steps-c/step-04-generate-report.md
- [x] steps-c/step-05-present-to-user.md
- [x] templates/template-progress-report.md

**Ready for Use:** Yes

---

## Usage Examples

### Starting the Workflow

The workflow can be invoked via:
```bash
/ai-dev-team:workflows:project-progress-query
```

### Expected User Flow

1. PM receives project progress query from user
2. PM queries Linear MCP for Epic, Story, Bug status
3. PM analyzes overall project status
4. PM generates formatted progress report
5. PM presents progress report to user in professional manner
6. Optionally saves report to file
7. Workflow complete

---

## Workflows Chaining

**Previous Workflows:** None (standalone query workflow)

**Next Workflows:** None (report presentation is the endpoint)

**Related Workflows:**
- `task-breakdown` - Provides story data for progress tracking
- `bug-fix-verify` - Provides bug status for progress report

---

## What it produces

- Temporary progress report (can choose to save)
- In-memory report presented to user immediately

---

---

_Spec created on 2026-02-03_
_Spec updated on 2026-02-04 - Workflow implementation complete_
