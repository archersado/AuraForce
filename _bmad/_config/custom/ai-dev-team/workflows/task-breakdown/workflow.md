---
name: task-breakdown
description: 需求/设计 → Story列表 → Linear同步
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Task Breakdown

**Goal:** 将需求/设计拆分为可执行的Story列表

**Description:** 根据产品设计和交互设计，PM或开发团队将需求拆分为细粒度的、可执行的Story。每个Story包括：需求描述、验收标准、复杂度评估、时间估算。Story被记录到文档库并同步到Linear。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | task-breakdown |
| **Total Steps** | 7 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (Story list markdown) |
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
- **Append-Only Building**: Build documents by appending content as directed
- **State Tracking:** No tracking needed (single-session workflow)

---

## STEP OVERVIEW

```
Step 01: step-01-analyze-requirements
  ├─ Type: Init/Gather
  ├─ Menu: A/P/C
  ├─ Agent: PM
  ├─ Goal: Analyze requirements and design documents
  └─ Next: step-02-identify-features

Step 02: step-02-identify-features
  ├─ Type: Analysis
  ├─ Menu: A/S/C
  ├─ Agent: PM
  ├─ Goal: Identify features to be implemented
  └─ Next: step-03-create-stories

Step 03: step-03-create-stories
  ├─ Type: Document Generation
  ├─ Menu: R/A/C
  ├─ Agents: PM, Frontend Dev, Backend Dev
  ├─ Template: template-story-list.md
  ├─ Goal: Create detailed stories for each feature
  └─ Next: step-04-estimate-complexity

Step 04: step-04-estimate-complexity
  ├─ Type: Assessment
  ├─ Menu: F/B/C
  ├─ Agents: Frontend Dev, Backend Dev
  ├─ Goal: Estimate complexity for each story
  └─ Next: step-05-estimate-time

Step 05: step-05-estimate-time
  ├─ Type: Estimation
  ├─ Menu: A/S/C
  ├─ Agents: Frontend Dev, Backend Dev
  ├─ Goal: Estimate completion time for each story
  └─ Next: step-06-document-stories

Step 06: step-06-document-stories
  ├─ Type: File Operation
  ├─ Menu: C/Only
  ├─ Agent: PM
  ├─ Goal: Save story list to dev-docs folder
  ├─ Output: {dev_docs_folder}/stories/{feature-name}.md
  └─ Next: step-07-sync-to-linear

Step 07: step-07-sync-to-linear
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Create Linear Story records
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-analyze-requirements (PM)
       │
       ▼
step-02-identify-features (PM)
       │
       ▼
step-03-create-stories (PM + Frontend Dev + Backend Dev)
       │
       ▼
step-04-estimate-complexity (Frontend Dev + Backend Dev)
       │
       ▼
step-05-estimate-time (Frontend Dev + Backend Dev)
       │
       ▼
step-06-document-stories (PM)
       │
       ▼
step-07-sync-to-linear (PM)
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

Ensure required inputs are available:
- 产品设计文档（PRD）
- 交互设计文档
- 技术设计文档

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-analyze-requirements.md`

---

## WORKFLOW CHAINING

**Previous Workflows:**
- `product-design-review` - Provides PRD document
- `interaction-review` - Provides interaction design document

**Next Workflow:**
- `dev-delivery` - For actual development execution

---

## DOCUMENT TEMPLATES

### Story List Template (`template-story-list.md`)
- Feature Overview
- Story List with:
  - Story ID
  - Title
  - Description
  - Acceptance Criteria
  - Complexity Assessment
  - Time Estimation
  - Owner
  - Status

---

## AGENT PERSONAS

### Primary Agent: PM (Project Manager)

**Persona Characteristics:**
- Experienced project manager with strong analytical skills
- Deep understanding of product requirements and technical constraints
- Systematic approach to task breakdown
- Focus on deliverable clarity and team coordination

**Communication Style:**
- "这个问题我理解，让我来协调一下"
- Methodical and organized
- Clear documentation with structured format
- Collaborative with cross-functional team

### Secondary Agents

#### Frontend Dev (前端开发)
- Participates in story creation
- Provides frontend technical input
- Assesses complexity from frontend perspective
- Estimates frontend effort and time
- Highlights potential technical risks

#### Backend Dev (后端开发)
- Participates in story creation
- Provides backend technical input
- Assesses complexity from backend perspective
- Estimates backend effort and time
- Highlights potential technical risks

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used to create Story records for tracking task breakdown progress:
- Create Linear Story records for each story generated
- Include story title, description, acceptance criteria, and estimates
- Assign stories to appropriate team members
- Set labels and project associations
- Handle unavailability gracefully

---

## STORY STRUCTURE

Each story must include:

| Field | Description |
|-------|-------------|
| **Story ID** | Unique identifier (e.g., STORY-001) |
| **标题** | Story title in Chinese/English |
| **描述** | Detailed description of what needs to be done |
| **验收标准** | Clear acceptance criteria for completion |
| **复杂度评估** | Complexity rating (Low/Medium/High) |
| **时间估算** | Estimated completion time (hours/days) |
| **负责人** | Owner (Frontend Dev/Backend Dev/QA) |
| **状态** | Status (待处理/进行中/已完成/已验收) |

---

## USER INTERACTION

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
- Collaborative and interactive

---
