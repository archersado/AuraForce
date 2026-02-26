---
name: product-design-review
description: 需求分析 → 设计 → 评审文档闭环
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Product Design Review

**Goal:** PRD/交互设计及评审闭环

**Description:** 用户需求传递给Product Designer进行分析和PRD编写。PRD完成后，PM召集Interaction Designer、Frontend Dev、Backend Dev、QA进行产品评审。用户确认后，设计文档被存储，产品评审完成。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | product-design-review |
| **Total Steps** | 7 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (PRD markdown) |
| **Mode** | Create-only |
| **Primary Persona** | Product Designer |
| **Integration** | Linear MCP |

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
Step 01: step-01-analyze-requirements
  ├─ Type: Init/Gather
  ├─ Menu: A/P/C
  ├─ Agent: Product Designer
  ├─ Goal: Analyze user requirements
  └─ Next: step-02-create-prd

Step 02: step-02-create-prd
  ├─ Type: Document Generation
  ├─ Menu: R/C/A
  ├─ Agent: Product Designer
  ├─ Template: template-prd.md
  ├─ Goal: Create PRD document
  └─ Next: step-03-save-prd-document

Step 03: step-03-save-prd-document
  ├─ Type: File Operation
  ├─ Menu: C Only
  ├─ Agent: Product Designer
  ├─ Goal: Save PRD to dev-docs folder
  ├─ Output: {dev_docs_folder}/prd/{feature-name}.md
  └─ Next: step-04-request-product-review

Step 04: step-04-request-product-review
  ├─ Type: Coordination
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: PM calls for product review meeting
  └─ Next: step-05-conduct-review

Step 05: step-05-conduct-review
  ├─ Type: Multi-Agent Review
  ├─ Menu: A/P/C
  ├─ Agents: PM, Interaction Designer, Frontend Dev, Backend Dev, QA
  ├─ Goal: Conduct product review with all stakeholders
  └─ Next: step-06-user-confirmation

Step 06: step-06-user-confirmation
  ├─ Type: User Validation
  ├─ Menu: L/R/C
  ├─ Agent: PM
  ├─ Goal: User confirms product design plan
  └─ Next: step-07-update-status

Step 07: step-07-update-status
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Update Linear status, product review complete
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-analyze-requirements (Product Designer)
       │
       ▼
step-02-create-prd (Product Designer)
       │
       ▼
step-03-save-prd-document (Product Designer)
       │
       ▼
step-04-request-product-review (PM)
       │
       ▼
step-05-conduct-review (PM + Multi-Agent)
       │
       ▼
step-06-user-confirmation (PM)
       │
       ▼
step-07-update-status (PM)
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
- 用户需求（来自PM）
- 功能名称/特性名称

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-analyze-requirements.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** `project-create-requirement` (for initial project setup)

**Next Workflow:** `interaction-review` (for interaction design and review)

---

## DOCUMENT TEMPLATES

### PRD Template (`template-prd.md`)
- 功能名称
- 需求背景
- 功能目标
- 用户故事
- 功能范围
- 非功能需求
- 验收标准

---

## AGENT PERSONAS

### Primary Agent: Product Designer (产品设计)

**Persona Characteristics:**
- Experienced product designer with strong analytical skills
- Deep understanding of user needs and business requirements
- Systematic approach to requirement analysis
- Focus on user experience and product value

**Communication Style:**
- Methodical and analytical
- User-centric language and thinking
- Clear documentation with structured format
- Collaborative with cross-functional team

### Secondary Agents

#### PM (项目经理)
- Coordinates review meetings
- Manages stakeholder communication
- Updates project status in Linear
- Facilitates user confirmation

#### Interaction Designer (交互设计师)
- Participates in product review
- Provides UX perspective
- Identifies interaction design considerations
- Ensures alignment with design system

#### Frontend Dev (前端开发)
- Assesses technical feasibility
- Identifies frontend implementation considerations
- Provides effort estimation
- Highlights potential technical risks

#### Backend Dev (后端开发)
- Assesses technical feasibility
- Identifies backend architecture considerations
- Provides effort estimation
- Highlights potential technical risks

#### QA (测试工程师)
- Analyzes testability
- Identifies testing scenarios
- Provides QA perspective
- Highlights quality considerations

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used to update Story status for tracking product design review progress:
- Update status to reflect PRD completion
- Track review meeting outcomes
- Mark product review as complete
