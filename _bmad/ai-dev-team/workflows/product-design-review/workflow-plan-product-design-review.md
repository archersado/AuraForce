# Workflow Plan: Product Design Review

**Module:** ai-dev-team
**Status:** Production Ready
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## EXECUTIVE SUMMARY

The **product-design-review** workflow implements a comprehensive product design review process where Product Designer analyzes requirements, creates PRD documentation, coordinates multi-stakeholder review meetings, gets user confirmation, and updates project status in Linear.

**Key Value Proposition:**
- Ensures thorough requirement analysis before design
- Facilitates cross-functional collaboration on product decisions
- Captures user confirmation as critical milestone
- Maintains traceability through Linear integration

---

## WORKFLOW ARCHITECTURE

### Design Pattern

**Pattern Type:** Simple Linear Flow (No Branching)

**Rationale:** This workflow follows a straightforward sequential process where each step must complete before advancing. No decision points or branches are needed as the workflow always proceeds from requirement analysis to final status update.

### Session Management

**Session Type:** Single-Session (Non-Continuable)

- Complete workflow execution in one session
- No intermediate save/resume points
- All agents collaborate in real-time
- Efficient for focused product design workflows

### Agent Collaboration Model

**Multi-Agent Sequential Collaboration:**

1. **Product Designer** (Steps 1-3): Analysis and PRD creation
2. **PM** (Steps 4, 6-7): Coordination and status management
3. **Multi-Agent Review** (Step 5): Product Designer, PM, Interaction Designer, Frontend Dev, Backend Dev, QA

---

## STEP-BY-STEP EXECUTION PLAN

### Step 1: Analyze Requirements

**Agent:** Product Designer
**Type:** Init/Gather
**Menu Options:** A/P/C (Approve/Revise/Cancel)

**Objective:**
- Receive user requirements from PM
- Analyze and clarify requirements
- Identify gaps and ask clarifying questions
- Gather all necessary information for PRD

**Success Criteria:**
- Requirements are clear and complete
- All ambiguities resolved
- Key features identified
- User needs well understood

**Next Step:** step-02-create-prd

---

### Step 2: Create PRD

**Agent:** Product Designer
**Type:** Document Generation
**Menu Options:** R/C/A (Review/Continue/Approve)

**Objective:**
- Create PRD document based on analyzed requirements
- Use template-prd.md as structure
- Ensure comprehensive coverage of all requirements
- Maintain clear, professional documentation style

**Success Criteria:**
- PRD follows template structure
- All requirements captured accurately
- Clear user stories defined
- Acceptance criteria specified

**Next Step:** step-03-save-prd-document

---

### Step 3: Save PRD Document

**Agent:** Product Designer
**Type:** File Operation
**Menu Options:** C Only (Continue)

**Objective:**
- Save PRD to ` {dev_docs_folder}/prd/{feature-name}.md `
- Ensure file is properly formatted with YAML frontmatter
- Verify file creation successful

**Success Criteria:**
- File created at correct location
- Proper YAML frontmatter included
- Document content complete and valid

**Next Step:** step-04-request-product-review

---

### Step 4: Request Product Review

**Agent:** PM
**Type:** Coordination
**Menu Options:** C Only (Continue)

**Objective:**
- PM calls for product review meeting
- Coordinates scheduling with all stakeholders
- Sends review invitations to: Interaction Designer, Frontend Dev, Backend Dev, QA
- Sets agenda and expectations for review meeting

**Success Criteria:**
- All stakeholders invited
- Review meeting scheduled/agreed upon
- Agenda clearly communicated

**Next Step:** step-05-conduct-review

---

### Step 5: Conduct Review

**Agent:** PM (coordinating), Multi-Agent participation
**Type:** Multi-Agent Review
**Menu Options:** A/P/C (Approve/Revise/Cancel)

**Objective:**
- Conduct product review meeting with all stakeholders
- Product Designer presents PRD
- Interaction Designer provides UX perspective
- Frontend Dev assesses frontend feasibility
- Backend Dev assesses backend feasibility
- QA provides testing perspective
- Collect feedback and identify issues

**Success Criteria:**
- All stakeholders participated
- Technical feasibility assessed
- UX considerations discussed
- QA perspective captured
- Action items documented

**Next Step:** step-06-user-confirmation

---

### Step 6: User Confirmation

**Agent:** PM
**Type:** User Validation
**Menu Options:** L/R/C (Left=Approve/Right=Request Changes/Cancel)

**Objective:**
- Present product design plan to user
- Get user confirmation on design direction
- Gather final user feedback
- Ensure user alignment before proceeding

**Success Criteria:**
- User confirms design plan
- OR User requests specific changes (requires loop back to step 2)
- OR User rejects (workflow exit)

**Branching Logic:**
- If L (Approve): Proceed to step-07-update-status
- If R (Request Changes): Loop back to step-02-create-prd
- If C (Cancel): Exit workflow

**Next Step:** step-07-update-status (on approval)

---

### Step 7: Update Status

**Agent:** PM
**Type:** Integration
**Menu Options:** None (Final step)

**Objective:**
- Update Linear Story status to reflect product review completion
- Record workflow completion
- Provide final summary to user

**Success Criteria:**
- Linear status updated successfully
- Workflow summary provided
- Clear next steps communicated

**Next Step:** Workflow Complete

---

## WORKFLOW FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    Step 01: Analyze Requirements                │
│                   Agent: Product Designer                       │
│                         Menu: A/P/C                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Step 02: Create PRD                       │
│                   Agent: Product Designer                       │
│                         Menu: R/C/A                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Step 03: Save PRD Document                  │
│                   Agent: Product Designer                       │
│                         Menu: C Only                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Step 04: Request Product Review                │
│                          Agent: PM                              │
│                         Menu: C Only                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Step 05: Conduct Review                      │
│              Agents: PM + Multi-Agent Review                    │
│                         Menu: A/P/C                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Step 06: User Confirmation                    │
│                          Agent: PM                              │
│                         Menu: L/R/C                     ┌──────┐
└────────────────────────────┬───┴─────────────────────────────┐│
                             │                                  ││
                    ┌────────▼────┐              ┌───────────▼──▼┘
                    │ L: Approve  │              │ R: Request Changes
                    └───────┬─────┘              └────────────┬───
                            │                               (Loop to Step 02)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Step 07: Update Status                      │
│                          Agent: PM                              │
│                         Menu: None                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                          WORKFLOW COMPLETE
```

---

## DOCUMENT OUTPUT SPECIFICATIONS

### Primary Output: PRD Document

**File Path:** `{dev_docs_folder}/prd/{feature-name}.md`

**File Format:** Markdown with YAML frontmatter

**Template Structure:**
```yaml
---
stepsCompleted: ['step-01-analyze-requirements', 'step-02-create-prd', 'step-03-save-prd-document', 'step-04-request-product-review', 'step-05-conduct-review', 'step-06-user-confirmation', 'step-07-update-status']
date: {{current_date}}
user_name: {{user_name}}
feature_name: {{feature_name}}
status: 'approved'
---
```

**Body Sections:**
1. 功能名称 (Feature Name)
2. 需求背景 (Background)
3. 功能目标 (Goals)
4. 用户故事 (User Stories)
5. 功能范围 (Scope)
6. 非功能需求 (Non-Functional Requirements)
7. 验收标准 (Acceptance Criteria)

### Secondary Output: Linear Status Update

**Integration:** Linear MCP

**Status Updates:**
- Initial: PRD In Progress
- After Step 3: PRD Complete, Review Requested
- After Step 5: Review Complete, Awaiting User Confirmation
- After Step 7: Product Design Review Approved

---

## AGENT RESPONSIBILITY MATRIX

| Step | Primary Agent | Support Role | Key Actions |
|------|---------------|--------------|-------------|
| 01 - Analyze Requirements | Product Designer | - | Analyze requirements, clarify gaps |
| 02 - Create PRD | Product Designer | - | Generate PRD document |
| 03 - Save PRD Document | Product Designer | - | Save to file system |
| 04 - Request Product Review | PM | Product Designer | Coordinate review meeting |
| 05 - Conduct Review | PM (coordination) | Interaction Designer, Frontend Dev, Backend Dev, QA | Multi-stakeholder review |
| 06 - User Confirmation | PM | Product Designer | Get user approval |
| 07 - Update Status | PM | - | Update Linear, complete workflow |

---

## ERROR HANDLING AND RECOVERY

### Step Recovery Points

- **After Step 3:** PRD saved to file - can restart from here
- **After Step 6:** User confirmation point - can loop back to step 2 for changes

### Common Error Scenarios

1. **Requirements Incomplete (Step 1)**
   - Add more clarifying questions
   - Ask for user stories specifically
   - Request use case examples

2. **Review Feedback Requires Changes (Step 5)**
   - Update PRD in step 2
   - Re-conduct review cycle
   - Track revision iterations

3. **User Requests Major Changes (Step 6)**
   - Loop back to step 2
   - Potentially require new requirements gathering (step 1)

---

## WORKFLOW METRICS

### Success Indicators

- PRD document created and saved
- All stakeholders participated in review
- User confirmed design plan
- Linear status updated correctly

### KPI Tracking

- Time to PRD completion
- Number of review iterations
- Time to user confirmation
- Stakeholder participation rate

---

## INTEGRATION POINTS

### Upstream Workflows

- **project-create-requirement:** Provides initial project requirements

### Downstream Workflows

- **interaction-review:** Proceeds to interaction design phase
- **task-breakdown:** Breaks down approved PRD into development tasks

### External Systems

- **Linear:** Status tracking and project management
- **File System:** Document storage in dev-docs folder

---

## TESTING GUIDELINES

### Unit Tests for Each Step

Verify:
- Correct agent persona used
- Menu options available as specified
- File operations successful
- External integration calls made correctly

### Integration Tests

Verify:
- Workflow completes all steps in sequence
- Documents generated correctly
- Linear status updates propagate
- Error handling works as expected

---

## MAINTENANCE NOTES

### Regular Updates Needed

- Template-prd.md sections if PRD format changes
- Linear status values if Linear schema changes
- Agent prompts if persona evolves

### Known Limitations

- Single-session only - no pause/resume capability
- Linear MCP availability not guaranteed
- User confirmation is critical blocking point

---

_Workflow Plan created on 2026-02-03 for BMAD Core Module_
