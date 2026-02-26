# Workflow Specification: task-breakdown

**Module:** ai-dev-team
**Status:** Complete - All steps and configuration created
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## Workflow Overview

**Goal:** 将需求/设计拆分为可执行的Story列表

**Description:** 根据产品设计和交互设计，PM或开发团队将需求拆分为细粒度的、可执行的Story。每个Story包括：需求描述、验收标准、复杂度评估、时间估算。Story被记录到文档库并同步到Linear。

**Workflow Type:** Feature Workflow

**Mode:** Create-only (steps-c/ only)

---

## Workflow Structure

### Entry Point

```yaml
---
name: task-breakdown
description: 需求/设计 → Story列表 → Linear同步
web_bundle: true
continuable: false
document_output: true
mode: create-only
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/task-breakdown'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Workflow Steps

| Step | Name | Goal | Agent | Menu Options |
|------|------|------|-------|--------------|
| 1 | Analyze Requirements | 分析需求和设计文档 | PM | A/P/C |
| 2 | Identify Features | 识别需要实现的功能点 | PM | A/S/C |
| 3 | Create Stories | 为每个功能创建Story | PM + Multi-Agent | R/A/C |
| 4 | Estimate Complexity | 评估每个Story的复杂度 | Frontend Dev + Backend Dev | F/B/C |
| 5 | Estimate Time | 估算每个Story的完成时间 | Frontend Dev + Backend Dev | A/S/C |
| 6 | Document Stories | 记录Story到文档库 | PM | C |
| 7 | Sync to Linear | 使用Linear MCP同步到Linear | PM | None |

---

## Workflow Files

### Core Workflow Files

- `workflow.md` - Main workflow definition
- `workflow-plan-task-breakdown.md` - Detailed execution plan
- `spec.md` - This specification document

### Step Files (steps-c/)

- `step-01-analyze-requirements.md` - Requirements analysis by PM
- `step-02-identify-features.md` - Features identification by PM
- `step-03-create-stories.md` - Story creation with multi-agent input
- `step-04-estimate-complexity.md` - Complexity assessment by developers
- `step-05-estimate-time.md` - Time estimation by developers
- `step-06-document-stories.md` - Save story list to document library
- `step-07-sync-to-linear.md` - Sync stories to Linear via MCP

### Template Files (templates/)

- `template-story-list.md` - Story list document template

---

## Workflow Flow Diagram

```
step-01-analyze-requirements (PM)
       │ Menu: A/P/C
       │
       ▼
step-02-identify-features (PM)
       │ Menu: A/S/C
       │
       ▼
step-03-create-stories (PM + Frontend Dev + Backend Dev)
       │ Menu: R/A/C
       │
       ▼
step-04-estimate-complexity (Frontend Dev + Backend Dev)
       │ Menu: F/B/C
       │
       ▼
step-05-estimate-time (Frontend Dev + Backend Dev)
       │ Menu: A/S/C
       │
       ▼
step-06-document-stories (PM)
       │ Menu: C Only
       │
       ▼
step-07-sync-to-linear (PM)
       │ Menu: None
       │
       ▼
   WORKFLOW COMPLETE
```

---

## Workflow Inputs

### Required Inputs

- 产品设计文档（PRD）
- 交互设计文档
- 技术设计文档

### Optional Inputs

- 技术约束
- 时间约束
- Linear Project ID

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{dev_docs_folder}/stories/{feature-name}.md` — Story列表文档（Markdown格式）
- Linear Stories created via Linear MCP

---

## Agent Integration

### Primary Agent

**PM (项目经理)** — 负责人、需求分析、Story创建协调

- Steps: 1, 2, 3, 6, 7
- Style: "这个问题我理解，让我来协调一下"
- Key phrase: 协调、整理、确认

### Secondary Agents

**Frontend Dev (前端开发)** — 从实现角度给出建议

- Steps: 3, 4, 5
- Contribution: 前端技术建议、复杂度评估、时间估算

**Backend Dev (后端开发)** — 从实现角度给出建议

- Steps: 3, 4, 5
- Contribution: 后端技术建议、复杂度评估、时间估算

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

- **Yes** - Semi-structured documents
- Story list template provides structure

---

## External Integrations

### Linear MCP

**Purpose:** Create Linear Story records for task tracking

**Story Creation:**
- Step 7 complete: Create Linear Stories for all generated stories
- Include story details: title, description, acceptance criteria
- Include estimates: complexity, time
- Assign to appropriate team members
- Set labels and project associations

**Usage:**
- Attempt to create stories using MCP
- Manual fallback if MCP not available
- Graceful handling of unavailability

---

## Story Structure

Each story must include:

| Field | Description | Format |
|-------|-------------|--------|
| Story ID | Unique identifier | STORY-001, STORY-002... |
| 标题 | Story title | Brief, action-oriented |
| 描述 | Detailed description | What needs to be done |
| 验收标准 | Acceptance criteria | Measurable completion criteria |
| 复杂度评估 | Complexity rating | Low/Medium/High |
| 时间估算 | Time estimation | Hours or days |
| 负责人 | Owner | Frontend Dev/Backend Dev/QA |
| 状态 | Status | 待处理/进行中/已完成/已验收 |

---

## Key Features

- Story list uses Markdown format with structured template
- Multi-agent collaboration for story creation and estimation
- PM coordinates the task breakdown process
- Frontend Dev and Backend Dev provide technical input
- Linear integration for story tracking
- Clear complexity and time estimation

---

## Implementation Status

**Status:** COMPLETE

**Completed Components:**
- [x] workflow.md
- [x] workflow-plan-task-breakdown.md
- [x] spec.md
- [x] steps-c/step-01-analyze-requirements.md
- [x] steps-c/step-02-identify-features.md
- [x] steps-c/step-03-create-stories.md
- [x] steps-c/step-04-estimate-complexity.md
- [x] steps-c/step-05-estimate-time.md
- [x] steps-c/step-06-document-stories.md
- [x] steps-c/step-07-sync-to-linear.md
- [x] templates/template-story-list.md

**Ready for Use:** Yes

---

## Usage Examples

### Starting the Workflow

The workflow can be invoked via:
```bash
/ai-dev-team:workflows:task-breakdown
```

### Expected User Flow

1. PM analyzes requirements and design documents
2. PM identifies features to be implemented
3. PM, Frontend Dev, Backend Dev collaboratively create stories
4. Frontend Dev and Backend Dev estimate complexity for each story
5. Frontend Dev and Backend Dev estimate time for each story
6. PM saves story list to document library
7. PM syncs stories to Linear
8. Workflow complete

---

## Workflows Chaining

**Previous Workflows:**
- `product-design-review` - Provides PRD document
- `interaction-review` - Provides interaction design document

**Next Workflows:**
- `dev-delivery` - For actual development execution

---

## User Interaction

### Who it's for:
- PM 作为首要负责人
- 开发团队参与
- Frontend Dev 从实现角度给出建议
- Backend Dev 从实现角度给出建议

### User interaction style:
- PM leads the task breakdown process
- Developers provide technical input
- Collaborative story creation

### Instruction style:
- **Intent-Based** - agents adapt naturally to dialogue

---

_Spec created on 2026-02-03_
_Spec updated on 2026-02-03 - Workflow implementation complete_
