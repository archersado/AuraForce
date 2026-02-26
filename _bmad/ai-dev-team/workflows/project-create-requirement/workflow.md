---
name: project-create-requirement
description: 启动新项目，收集用户需求，创建项目文档和Linear项目结构
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Project Create Requirement

**Goal:** 启动新项目并收集用户需求，创建项目文档和Linear项目管理结构

**Description:** 用户向项目经理（PM）提出产品需求，PM记录需求并创建项目。PM使用Linear MCP在Linear上创建项目、Epic和初始Story。项目基础文档（需求文档）被创建并存储在dev-docs文件夹。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | project-create-requirement |
| **Total Steps** | 6 (with branching) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (semi-structured) |
| **Mode** | Create-only |
| **AI Persona** | PM (Project Manager) |
| **Integration** | Linear MCP (optional) |

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-File Design**: Each step is a self contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Sequence within the step files must be completed in order
- **Append-Only Building**: Build documents by appending content as directed
- **State Tracking**: No tracking needed (single-session workflow)

---

## STEP OVERVIEW

```
Step 01: step-01-init
  ├─ Type: Init (Non-Continuable)
  ├─ Menu: Auto-proceed (no choices)
  ├─ Goal: Initialize workflow, greet user as PM
  └─ Next: step-02-confirm-mode

Step 02: step-02-confirm-mode  [BRANCH POINT]
  ├─ Type: Branching Step
  ├─ Menu: L/R/C
  │   L: Full Product Requirements → step-03a-gather-full
  │   R: Specific Change Requirements → step-03b-gather-change
  │   C: Cancel workflow
  └─ Goal: Confirm requirement mode

Step 03a: step-03a-gather-full  [PATH A - Full Requirements]
  ├─ Type: Standard Gather
  ├─ Menu: A/P/C (P=Brainstorming)
  ├─ Template: template-full.md
  ├─ Goal: Collect full product requirements
  └─ Next: step-04a-generate-full

Step 03b: step-03b-gather-change  [PATH B - Change Requirements]
  ├─ Type: Standard Gather
  ├─ Menu: A/P/C (P=Brainstorming)
  ├─ Template: template-change.md
  ├─ Goal: Collect change requirements
  └─ Next: step-04b-generate-change

Step 04a: step-04a-generate-full  [PATH A]
  ├─ Type: Simple Document Generation
  ├─ Menu: C Only
  ├─ Goal: Generate PRD document
  ├─ Output: {output_folder}/prd/{project_name}-requirements.md
  └─ Next: step-05-linear-setup

Step 04b: step-04b-generate-change  [PATH B]
  ├─ Type: Simple Document Generation
  ├─ Menu: C Only
  ├─ Goal: Generate change requirements document
  ├─ Output: {output_folder}/prd/{project_name}-requirements.md
  └─ Next: step-05-linear-setup

Step 05: step-05-linear-setup  [MERGE POINT]
  ├─ Type: Simple Integration
  ├─ Menu: C Only
  ├─ Integration: Linear MCP (optional)
  ├─ Goal: Set up Linear project/Epic (if available)
  └─ Next: step-06-report-status

Step 06: step-06-report-status
  ├─ Type: Final Step
  ├─ Menu: None
  ├─ Goal: Report project initialization status
  └─ Workflow Complete
```

---

## BRANCHING LOGIC

```
                 step-01-init
                       │
                       ▼
              step-02-confirm-mode
                    /      \
                  L/        \R
                  /          \
      step-03a-gather    step-03b-gather
           -full            -change
                │              │
                ▼              ▼
      step-04a-generate    step-04b-generate
           -full            -change
                \            /
                 \          /
                  \        /
                   \      /
                    \    /
                     \  /
                      ▼
              step-05-linear-setup
                      │
                      ▼
              step-06-report-status
                      │
                      ▼
                  COMPLETE
```

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `bmb_creations_output_folder`

### 2. Route to First Step

Load, read completely, then execute `steps-c/step-01-init.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** None (entry point workflow)

**Next Workflow:** `product-design-review` (for design planning and review)

---

## DOCUMENT TEMPLATES

### Full Product Requirements Template (`template-full.md`)
- 需求名称
- 背景
- 目标
- 范围
- 用户故事

### Change Requirements Template (`template-change.md`)
- 需求名称
- 描述
- 范围

---

## AI PERSONA: PM (Project Manager)

**Persona Characteristics:**
- Experienced, organized, proactive project manager
- First-principles thinking - asks "why" to understand root needs
- Open-ended questions to guide users
- Phrase: "这个问题我理解，让我来协调一下"

**Communication Style:**
- Professional yet warm
- Collaborative dialogue, not command-response
- Proactive progress reporting
- Gives user control and reliability
