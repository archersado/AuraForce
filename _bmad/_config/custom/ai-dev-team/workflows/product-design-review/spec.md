# Workflow Specification: product-design-review

**Module:** ai-dev-team
**Status:** Complete - All steps and configuration created
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## Workflow Overview

**Goal:** PRD/交互设计及评审闭环

**Description:** 用户需求传递给Product Designer进行分析和PRD编写。PRD完成后，PM召集Interaction Designer、Frontend Dev、Backend Dev、QA进行产品评审。用户确认后，设计文档被存储，产品评审完成。

**Workflow Type:** Feature Workflow

**Mode:** Create-only (steps-c/ only)

---

## Workflow Structure

### Entry Point

```yaml
---
name: product-design-review
description: 需求分析 → 设计 → 评审文档闭环
web_bundle: true
continuable: false
document_output: true
mode: create-only
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/product-design-review'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Workflow Steps

| Step | Name | Goal | Agent | Menu Options |
|------|------|------|-------|--------------|
| 1 | Analyze Requirements | Product Designer分析用户需求 | Product Designer | A/P/C |
| 2 | Create PRD | Product Designer编写PRD | Product Designer | R/C/A |
| 3 | Save PRD Document | 保存PRD到dev-docs文件夹 | Product Designer | C |
| 4 | Request Product Review | PM召集产品评审 | PM | C |
| 5 | Conduct Review | Interaction Designer、Frontend Dev、Backend Dev、QA参与评审 | PM + Multi-Agent | A/P/C |
| 6 | User Confirmation | 用户确认产品设计方案 | PM | L/R/C |
| 7 | Update Status | 更新Linear状态，产品评审完成 | PM | None |

---

## Workflow Files

### Core Workflow Files

- `workflow.md` - Main workflow definition
- `workflow-plan-product-design-review.md` - Detailed execution plan
- `spec.md` - This specification document

### Step Files (steps-c/)

- `step-01-analyze-requirements.md` - Requirements analysis by Product Designer
- `step-02-create-prd.md` - PRD document generation
- `step-03-save-prd-document.md` - File save operation
- `step-04-request-product-review.md` - PM coordinates review meeting
- `step-05-conduct-review.md` - Multi-agent review execution
- `step-06-user-confirmation.md` - User approval gate
- `step-07-update-status.md` - Linear status update and completion

### Template Files (templates/)

- `template-prd.md` - PRD document template

---

## Workflow Flow Diagram

```
step-01-analyze-requirements (Product Designer)
       │ Menu: A/P/C
       │
       ▼
step-02-create-prd (Product Designer)
       │ Menu: R/C/A
       │
       ▼
step-03-save-prd-document (Product Designer)
       │ Menu: C Only
       │
       ▼
step-04-request-product-review (PM)
       │ Menu: C Only
       │
       ▼
step-05-conduct-review (PM + Multi-Agent)
       │ Menu: A/P/C
       │
       ▼
step-06-user-confirmation (PM)
       │ Menu: L/R/C
       │
       ├─ L: Approve ──────────┐
       │                        │
       ├─ R: Request Changes    │
       │   (Loop to Step 02)────┘
       │
       ├─ C: Cancel (Exit)
       │
       ▼
step-07-update-status (PM)
       │ Menu: None
       │
       ▼
   WORKFLOW COMPLETE
```

---

## Workflow Inputs

### Required Inputs

- 用户需求（来自PM）
- 功能名称/特性名称

### Optional Inputs

- 技术约束
- 时间约束
- Linear Issue ID

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{dev_docs_folder}/prd/{feature-name}.md` — PRD文档（Markdown格式）
- Linear评审状态更新

---

## Agent Integration

### Primary Agent

**Product Designer (产品设计)** — 需求分析、PRD编写

- Steps: 1, 2, 3
- Style: Systematic, analytical, user-centric
- Key phrase: "让我来分析一下"

### Secondary Agents

**PM (项目经理)** — 召集评审、更新状态

- Steps: 4, 6, 7
- Style: "这个问题我理解，让我来协调一下"
- Role: Coordination and status management

**Interaction Designer (交互设计师)** — 参与评审

- Step: 5
- Contribution: UX perspective, interaction feasibility

**Frontend Dev (前端开发)** — 技术可行性评估

- Step: 5
- Contribution: Frontend technical assessment

**Backend Dev (后端开发)** — 技术可行性评估

- Step: 5
- Contribution: Backend technical assessment, API design

**QA (测试工程师)** — 测试角度评估

- Step: 5
- Contribution: Testability assessment, quality perspective

---

## Configuration

### Session Type

- **Single-session** (Non-continuable)
- Complete workflow execution in one session
- No intermediate save/resume points

### Pattern

- **Simple linear flow** (no branching except user confirmation loop)
- Sequential execution with one conditional loop back option

### Document Output

- **Yes** - Semi-structured documents
- PRD template provides structure

---

## External Integrations

### Linear MCP

**Purpose:** Track product design review progress

**Status Updates:**
- Step 3 complete: PRD Created
- Step 5 complete: Review Complete
- Step 6 complete: User Approved
- Step 7 complete: Product Design Review Complete

**Usage:**
- Try to automatically update using MCP
- Manual fallback if MCP not available
- Graceful handling of unavailability

---

## Key Features

- ✓ PRD uses Markdown format with structured template
- ✓ Multi-agent collaboration for review
- ✓ PM coordinates review meetings
- ✓ User confirmation is critical milestone
- ✓ Linear status synchronization
- ✓ Clear branching logic for revisions

---

## Implementation Status

**Status:** COMPLETE

**Completed Components:**
- [x] workflow.md
- [x] workflow-plan-product-design-review.md
- [x] spec.md
- [x] steps-c/step-01-analyze-requirements.md
- [x] steps-c/step-02-create-prd.md
- [x] steps-c/step-03-save-prd-document.md
- [x] steps-c/step-04-request-product-review.md
- [x] steps-c/step-05-conduct-review.md
- [x] steps-c/step-06-user-confirmation.md
- [x] steps-c/step-07-update-status.md
- [x] templates/template-prd.md

**Ready for Use:** Yes

---

## Usage Examples

### Starting the Workflow

The workflow can be invoked via:
```bash
/ai-dev-team:workflows:product-design-review
```

### Expected User Flow

1. User receives requirements from PM
2. Product Designer analyzes requirements
3. Product Designer creates PRD
4. PM calls review meeting
5. Multi-agent review conducted
6. User confirms design
7. Status updated in Linear
8. Workflow complete

---

## Workflows Chaining

**Previous Workflow:**
- `project-create-requirement` - Provides initial requirements

**Next Workflows:**
- `interaction-review` - For interaction design phase
- `task-breakdown` - For development task breakdown

---

_Spec created on 2026-02-03_
_Spec updated on 2026-02-03 - Workflow implementation complete_
