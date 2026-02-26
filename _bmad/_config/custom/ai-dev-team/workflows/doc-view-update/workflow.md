---
name: doc-view-update
description: 查看/更新项目文档 - 支持查看PRD、交互设计、技术设计、测试用例等文档
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Document View Update

**Goal:** 查看/更新项目文档

**Description:** 用户或团队成员可以查看或更新项目文档。支持查看PRD、交互设计、技术设计、测试用例等文档。文档使用Markdown格式，存储在dev-docs文件夹下。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | doc-view-update |
| **Total Steps** | 7 (simple linear flow, no branching) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (document display and update) |
| **Mode** | Create-only |
| **AI Persona** | Primary: Document Owner Role (PM/Product Designer/UX Designer/Technical Architect/Dev/QA) |
| **AI Role Routing** | Dynamic based on document type |
| **Access Pattern** | Anyone can view, updates require PM or document role confirmation |

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-File Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps must be completed in order
- **State Tracking**: Minimal state tracking needed (single-session workflow)
- **Role Routing**: Primary agent role changes based on document type

---

## STEP OVERVIEW

```
Step 01: step-01-receive-request
  ├─ Type: Init (Non-Continuable)
  ├─ Menu: Auto-proceed
  ├─ Goal: Initialize workflow, greet user as PM
  └─ Next: step-02-identify-document

Step 02: step-02-identify-document
  ├─ Type: Standard Input
  ├─ Menu: V/U/C (View/Update/Cancel)
  ├─ Goal: Identify target document type and action
  └─ Next: step-03-view-document

Step 03: step-03-view-document
  ├─ Type: Document Display
  ├─ Menu: A/C/N (Continue/Cancel/No Updates)
  ├─ Goal: Display document content to user
  └─ Next: step-04-receive-updates OR step-07-notify-stakeholders

Step 04: step-04-receive-updates  [OPTIONAL]
  ├─ Type: Standard Input
  ├─ Menu: A/P/C (Proceed/Provide More/Cancel)
  ├─ Goal: Receive document update content if requested
  └─ Next: step-05-validate-updates

Step 05: step-05-validate-updates  [OPTIONAL]
  ├─ Type: Validation
  ├─ Menu: V/R/C (Validated/Requires Changes/Cancel)
  ├─ Goal: Validate update content for reasonability
  └─ Next: step-06-update-document

Step 06: step-06-update-document  [OPTIONAL]
  ├─ Type: Document Update
  ├─ Menu: C Only
  ├─ Goal: Update document file with approved changes
  └─ Next: step-07-notify-stakeholders

Step 07: step-07-notify-stakeholders
  ├─ Type: Final Step
  ├─ Menu: None
  ├─ Goal: Notify relevant stakeholders of action completed
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
                  step-01-receive-request
                           │
                           ▼
                  step-02-identify-document
                           │
                           ▼
                  step-03-view-document
                           │
          ┌────────────────┴────────────────┐
          │                                  │
    User views only                   User wants to update
          │                                  │
          ▼                                  ▼
 step-07-notify-                   step-04-receive-updates
   stakeholders                           │
          │                                  ▼
          ▼                         step-05-validate-updates
     COMPLETE                                 │
                                             ▼
                                    step-06-update-document
                                             │
                                             ▼
                                    step-07-notify-stakeholders
                                             │
                                             ▼
                                         COMPLETE
```

---

## DOCUMENT TYPES AND FOLDERS

| Document Type | Folder Path | Owner Role |
|---------------|-------------|------------|
| PRD（产品需求文档） | {dev_docs_folder}/prd/ | PM / Product Designer |
| 交互设计文档 | {dev_docs_folder}/interaction-design/ | UX Designer |
| 技术设计文档 | {dev_docs_folder}/technical-design/ | Technical Architect |
| 测试用例文档 | {dev_docs_folder}/test-cases/ | QA Engineer |

---

## DOCUMENT PERMISSIONS

**View Permissions:**
- Anyone can view documents
- No authentication or authorization required

**Update Permissions:**
- Updates require confirmation from PM or corresponding document owner role
- PM can approve updates for any document type
- Document owner roles can approve/commit updates for their document types
- Other users' update requests must go through approval workflow

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 2. Route to First Step

Load, read completely, then execute `steps-c/step-01-receive-request.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** None (utility workflow - can be called independently)

**Related Workflows:**
- `project-create-requirement` - Creates initial PRD documents
- `product-design-review` - Updates PRD documents
- `interaction-review` - Updates interaction design documents
- `test-case-design` - Updates test case documents

---

## AGENT ROLE ROUTING

When entering Step 02 (Identify Document), the workflow routes to the appropriate primary agent based on document type:

- PM / Product Designer for PRD documents
- UX Designer for interaction design documents
- Technical Architect for technical design documents
- QA Engineer for test case documents

PM remains as secondary agent throughout for document management coordination.

---

## AI PERSONAS

### Primary Agent (Dynamic): Document Owner Role

**Persona Characteristics:**
- Expert in respective document domain
- Knowledgeable about project context
- Collaborative and detail-oriented
- Maintains document quality and accuracy

### Secondary Agent: PM (Project Manager)

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
