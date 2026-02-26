---
name: requirement-change
description: 需求变更 → 影响评估 → 状态更新
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Requirement Change

**Goal:** 处理用户提出的需求变更

**Description:** 用户在项目过程中提出需求变更请求。PM评估变更对项目的影响，包括对已完成工作、未完成任务的影响评估。PM给出变更建议，确认变更后更新Epic和Story列表。PM主动汇报变更处理结果。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | requirement-change |
| **Total Steps** | 8 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (Change handling report) |
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
Step 01: step-01-receive-change-request
  ├─ Type: Input/Collection
  ├─ Menu: C/V
  ├─ Agent: PM
  ├─ Goal: Receive change request from user
  └─ Next: step-02-analyze-current-state

Step 02: step-02-analyze-current-state
  ├─ Type: Analysis
  ├─ Menu: A/C
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Query current project state (completed/in-progress tasks)
  └─ Next: step-03-assess-impact

Step 03: step-03-assess-impact
  ├─ Type: Assessment
  ├─ Menu: A/C
  ├─ Agents: PM, Interaction Designer
  ├─ Goal: Assess impact of change on completed work
  └─ Next: step-04-assess-feasibility

Step 04: step-04-assess-feasibility
  ├─ Type: Assessment
  ├─ Menu: A/C
  ├─ Agents: PM, Product Designer
  ├─ Goal: Assess technical feasibility of the change
  └─ Next: step-05-provide-recommendations

Step 05: step-05-provide-recommendations
  ├─ Type: Decision
  ├─ Menu: A/R/Aj
  ├─ Agent: PM
  ├─ Goal: Provide change recommendations (accept/reject/adjust)
  └─ Next: step-06-confirm-with-user

Step 06: step-06-confirm-with-user
  ├─ Type: Confirmation
  ├─ Menu: C/R
  ├─ Agent: PM
  ├─ Goal: Confirm change decision with user
  └─ Next: step-07-update-linear

Step 07: step-07-update-linear
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Update Epic and Story in Linear
  └─ Next: step-08-report-results

Step 08: step-08-report-results
  ├─ Type: Output
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Goal: Report change handling results to user
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-receive-change-request (PM)
       │
       ▼
step-02-analyze-current-state (PM + Linear MCP)
       │
       ▼
step-03-assess-impact (PM + Interaction Designer)
       │
       ▼
step-04-assess-feasibility (PM + Product Designer)
       │
       ▼
step-05-provide-recommendations (PM)
       │
       ▼
step-06-confirm-with-user (PM)
       │
       ▼
step-07-update-linear (PM + Linear MCP)
       │
       ▼
step-08-report-results (PM)
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
- 需求变更请求

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-receive-change-request.md`

---

## WORKFLOW CHAINING

**Previous Workflows:**
- Any workflow in progress (this workflow can be called anytime a change request is needed)

**Next Workflows:**
- May transition to `task-breakdown` for additional story creation
- May transition to `dev-delivery` for implementation of approved changes

---

## DOCUMENT TEMPLATES

### Change Handling Report Template
- Change Request Summary
- Current Project State
- Impact Assessment
  - Completed Features Impact
  - In-progress Tasks Impact
  - Technical Feasibility
  - Time Impact
  - Resource Impact
- Recommendations
  - Accept/Reject/Adjust Decision
  - Rationale
- Linear Updates Summary
- Final Report

---

## AGENT PERSONAS

### Primary Agent: PM (Project Manager)

**Persona Characteristics:**
- Experienced project manager with strong change management skills
- Deep understanding of project scope and impact analysis
- Methodical approach to assess changes
- Focus on project delivery and stakeholder communication

**Communication Style:**
- "这个变更可以接受，影响不大"
- Methodical and organized
- Clear documentation with structured format
- Active reporting to user

**Key Phrases:**
- "这个变更可以接受，影响不大"
- "这个变更会影响已完成的X功能，需要重新评估"
- "这个变更比较复杂，建议推迟到下一版本"

### Secondary Agents

#### Product Designer (产品设计师)
- Assesses technical feasibility
- Evaluates design implications
- Provides technical recommendations

#### Interaction Designer (交互设计师)
- Assesses impact on user experience
- Evaluates interaction changes
- Provides UX recommendations

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used to query and update project state:
- Query current project status (completed/in-progress tasks)
- Query Epic and Story records
- Update Epic and Story records based on approved changes
- Handle unavailability gracefully

---

## CHANGE ASSESSMENT CRITERIA

| Assessment Area | Criteria |
|-----------------|----------|
| **Completed Features Impact** | Will change require rework of completed features? |
| **In-progress Tasks Impact** | Will change affect currently working tasks? |
| **Technical Feasibility** | Is the change technically achievable within constraints? |
| **Time Impact** | How much additional time will the change require? |
| **Resource Impact** | What additional resources (people, budget) are needed? |

---

## USER INTERACTION

### Who it's for:
- 用户提出变更请求
- PM 评估影响、给出建议、更新状态、汇报结果

### User interaction style:
- PM assesses change impact
- User confirms change decision
- Active reporting of change handling results

### Instruction style:
- **Intent-Based** - agents adapt naturally to dialogue
- Collaborative and interactive
- Proactive reporting from PM

---

## MENU OPTIONS REFERENCE

| Step | Menu Options |
|------|--------------|
| Step 01 | [C] Continue, [V] View Details |
| Step 02 | [A] Accept Analysis, [C] Cancel |
| Step 03 | [A] Accept Assessment, [C] Cancel |
| Step 04 | [A] Accept Assessment, [C] Cancel |
| Step 05 | [A] Accept Change, [R] Reject Change, [Aj] Adjust Change |
| Step 06 | [C] Confirm, [R] Reject Decision |
| Step 07 | No menu (automated) |
| Step 08 | No menu (output only) |

---
