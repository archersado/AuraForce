---
name: interaction-review
description: 交互设计 → 技术评估 → 评审结果
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Interaction Review

**Goal:** 交互设计完成后的研发评审

**Description:** Interaction Designer完成交互设计和原型后，PM召集产品设计团队和研发团队进行交互评审。产品角度评估交互是否符合需求，研发角度评估技术可行性。用户确认后，交互设计定稿并保存到文档库。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | interaction-review |
| **Total Steps** | 8 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (interaction design files, review record) |
| **Mode** | Create-only |
| **Primary Persona** | PM |
| **Integration** | Linear MCP, Drawing MCP |

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
Step 01: step-01-verify-interaction-design
  ├─ Type: Init/Gather
  ├─ Menu: A/P/C
  ├─ Agent: PM
  ├─ Goal: Verify interaction design completion
  └─ Next: step-02-call-review-meeting

Step 02: step-02-call-review-meeting
  ├─ Type: Coordination
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: PM calls for interaction review meeting
  └─ Next: step-03-conduct-review

Step 03: step-03-conduct-review
  ├─ Type: Multi-Agent Review
  ├─ Menu: A/P/C
  ├─ Agents: PM, Interaction Designer, Product Designer, Frontend Dev, Backend Dev, QA
  ├─ Goal: Conduct interaction review with all stakeholders
  └─ Next: step-04-collect-feedback

Step 04: step-04-collect-feedback
  ├─ Type: Feedback Collection
  ├─ Menu: A/P/C
  ├─ Agents: PM (facilitator), All stakeholders
  ├─ Goal: Collect and summarize feedback from all participants
  └─ Next: step-05-determine-result

Step 05: step-05-determine-result
  ├─ Type: Decision
  ├─ Menu: A/M/R
  ├─ Agent: PM
  ├─ Goal: Determine review result (approved/modification/redesign)
  └─ Next: step-06-record-decisions

Step 06: step-06-record-decisions
  ├─ Type: Documentation
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: Record review decisions and action items
  └─ Next: step-07-save-design-files

Step 07: step-07-save-design-files
  ├─ Type: File Operation
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: Save interaction design files to artifacts folder
  ├─ Output: {artifacts_folder}/designs/interaction/*
  └─ Next: step-08-update-linear-status

Step 08: step-08-update-linear-status
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Update Linear status, interaction review complete
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-verify-interaction-design (PM)
       │
       ▼
step-02-call-review-meeting (PM)
       │
       ▼
step-03-conduct-review (PM + Multi-Agent)
       │
       ▼
step-04-collect-feedback (PM + All stakeholders)
       │
       ▼
step-05-determine-result (PM)
       │
       ▼
step-06-record-decisions (PM)
       │
       ▼
step-07-save-design-files (PM)
       │
       ▼
step-08-update-linear-status (PM)
       │
       ▼
   COMPLETE
```

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `artifacts_folder`

### 2. Input Validation

Ensure required inputs are available:
- 完成的交互设计文档/原型（由Interaction Designer）
- 评审邀请/Story ID（如果需要更新Linear）

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-verify-interaction-design.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** `product-design-review` (for initial product requirements and PRD)

**Next Workflow:** `task-breakdown` (after interaction design is approved)

---

## DOCUMENT TEMPLATES

### Interaction Design Review Record (`review-record.md`)
- 评审主题
- 参与人员
- 评审议程
- 各角色反馈摘要
- 决定与行动项
- 评审结果

---

## AGENT PERSONAS

### Primary Agent: PM (项目经理)

**Persona Characteristics:**
- Professional project manager with strong coordination skills
- Expert at facilitating cross-team collaboration
- Clear and structured communication style
- Focus on delivering results and maintaining project momentum

**Communication Style:**
- Proactive and organized: "这个问题我理解，让我来协调一下"
- Clear expectations and timelines
- Professional coordination between teams
- Records decisions and action items systematically

### Secondary Agents

#### Interaction Designer (交互设计师)
- Presents interaction design work
- Explains design decisions and rationale
- Responds to feedback and questions
- Ensures design meets user experience goals

#### Product Designer (产品设计)
- Validates interaction consistency with product requirements
- Assesses alignment with PRD
- Provides product perspective on design decisions
- Ensures user story requirements are met

#### Frontend Dev (前端开发)
- Assesses frontend implementation feasibility
- Identifies technical constraints and considerations
- Provides implementation suggestions
- Highlights potential frontend risks

#### Backend Dev (后端开发)
- Assesses backend support requirements
- Identifies API and data layer needs
- Provides architectural perspective
- Highlights potential backend risks

#### QA (测试工程师)
- Evaluates testability of interactions
- Identifies testing scenarios and edge cases
- Provides quality perspective
- Highlights potential quality risks

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used to update Story/Task status for tracking interaction review progress:
- Update status to reflect interaction design review completion
- Track review meeting outcomes
- Mark interaction review as complete when approved

### Drawing MCP (Excalidraw)

Used to create interaction design diagrams and flowcharts during the review:
- Create visual representations of interaction flows
- Document user journey diagrams
- Create design system component diagrams

---

## OUTPUT ARTIFACTS

### Primary Outputs

**Interaction Design Files:** `{artifacts_folder}/designs/interaction/*`
- Interaction design documents (.md)
- Wireframe diagrams (PNG/SVG via Excalidraw exports)
- User flow diagrams
- Component specifications

**Review Record:** `{artifacts_folder}/reviews/interaction/{feature-name}-review.md`
- Meeting participants
- Review agenda
- Feedback summary from each stakeholder
- Decisions made
- Action items with owners

---

## SUCCESS CRITERIA

Workflow is considered successful when:

1. All interaction design materials are ready for review
2. Interaction review meeting is conducted with all stakeholders
3. Feedback is collected from Product Designer, Frontend Dev, Backend Dev, and QA
4. Review result is determined (approved/modification/redesign)
5. Review decisions and action items are documented
6. Interaction design files are saved to artifacts folder
7. Linear status is updated to reflect completion

---

_Interaction Review Workflow - Created for BMAD Core ai-dev-team module_
