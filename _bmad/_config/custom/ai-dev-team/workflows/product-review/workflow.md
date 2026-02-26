---
name: product-review
description: 产品设计 → 多方评审 → 评审结果
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Product Review

**Goal:** 产品设计完成后的多方评审

**Description:** Product Designer完成产品设计后，PM召集Interaction Designer、Frontend Dev、Backend Dev、QA进行产品评审会议。各方从不同角度评估设计方案，提出反馈意见。评审结果被记录，如需修改则PM驱动Product Designer进行调整。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | product-review |
| **Total Steps** | 7 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (review meeting record) |
| **Mode** | Create-only |
| **Primary Persona** | PM |
| **Integration** | Linear MCP, Drawing MCP (optional) |

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
Step 01: step-01-verify-product-design
  ├─ Type: Init/Gather
  ├─ Menu: A/P/C
  ├─ Agent: PM
  ├─ Goal: Verify product design (PRD) completion
  └─ Next: step-02-call-review-meeting

Step 02: step-02-call-review-meeting
  ├─ Type: Coordination
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: PM calls for product review meeting
  └─ Next: step-03-conduct-review

Step 03: step-03-conduct-review
  ├─ Type: Multi-Agent Review
  ├─ Menu: A/P/C
  ├─ Agents: PM, Product Designer, Interaction Designer, Frontend Dev, Backend Dev, QA
  ├─ Goal: Conduct product review with all stakeholders
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
  └─ Next: step-07-update-linear-status

Step 07: step-07-update-linear-status
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
step-01-verify-product-design (PM)
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
step-07-update-linear-status (PM)
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
- 完成的PRD文档（由Product Designer）
- 评审邀请/Story ID（如果需要更新Linear）

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-verify-product-design.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** `product-design-review` (for initial PRD creation)

**Next Workflow:** `interaction-review` (if approved) or return to Product Designer (if modification/redesign needed)

---

## DOCUMENT TEMPLATES

### Product Design Review Record (`review-record.md`)
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

#### Product Designer (产品设计)
- Presents product design work (PRD)
- Explains design decisions and rationale
- Responds to feedback and questions
- Ensures design meets product requirements

#### Interaction Designer (交互设计师)
- Assesses design from UX perspective
- Provides interaction feedback
- Identifies potential UX improvements
- Highlights user experience considerations

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
- Evaluates testability of product design
- Identifies testing scenarios and edge cases
- Provides quality perspective
- Highlights potential quality risks

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used to update Story/Task status for tracking product review progress:
- Update status to reflect product design review completion
- Track review meeting outcomes
- Mark product review as complete when approved

### Drawing MCP (Excalidraw) - Optional

Used to create product design diagrams during the review:
- Create visual representations of product concepts
- Document user journey diagrams
- Create design system component diagrams

---

## OUTPUT ARTIFACTS

### Primary Outputs

**Review Record:** `{artifacts_folder}/reviews/product/{feature-name}-review.md`
- Meeting participants
- Review agenda
- Feedback summary from each stakeholder
- Decisions made
- Action items with owners

**Linear Status Update:**
- Story/Task status updated to reflect review completion

---

## SUCCESS CRITERIA

Workflow is considered successful when:

1. Product design (PRD) materials are ready for review
2. Product review meeting is conducted with all stakeholders
3. Feedback is collected from Product Designer, Interaction Designer, Frontend Dev, Backend Dev, and QA
4. Review result is determined (approved/modification/redesign)
5. Review decisions and action items are documented
6. Linear status is updated to reflect completion

---

_Product Review Workflow - Created for BMAD Core ai-dev-team module_
