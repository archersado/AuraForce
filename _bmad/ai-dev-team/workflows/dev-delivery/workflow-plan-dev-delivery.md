# Workflow Plan: Dev Delivery

**Module:** ai-dev-team
**Status:** Production Ready
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## EXECUTIVE SUMMARY

The **dev-delivery** workflow implements a comprehensive delivery process where the development team breaks down tasks, implements frontend and backend code, QA designs and executes tests, manages bugs through a fix-verification loop, performs user acceptance, and PM celebrates successful delivery.

**Key Value Proposition:**
- End-to-end delivery workflow from task breakdown to final delivery
- Integrated bug management loop for quality assurance
- Automated testing with Playwright MCP
- Clear stakeholder coordination and user acceptance
- Celebration on successful delivery

---

## WORKFLOW ARCHITECTURE

### Design Pattern

**Pattern Type:** Linear Flow with Loop at Step 6

**Rationale:** This workflow follows a sequential process through development and testing, with a loop at bug management to allow fixes and retesting. The loop ensures bugs are properly addressed before proceeding to user acceptance.

### Session Management

**Session Type:** Single-Session (Non-Continuable)

- Complete workflow execution in one session
- No intermediate save/resume points
- All agents collaborate in real-time
- Efficient for focused delivery workflows

### Agent Collaboration Model

**Multi-Agent Sequential Collaboration:**

1. **PM + Dev Team** (Step 1): Task breakdown into stories
2. **QA** (Step 2): Test case design
3. **Frontend Dev** (Step 3): Frontend code implementation
4. **Backend Dev** (Step 4): Backend and API implementation
5. **QA** (Step 5): Testing execution with Playwright
6. **QA** (Step 6): Bug management with potential loop
7. **PM** (Step 7): User acceptance
8. **PM** (Step 8): File delivery
9. **PM** (Step 9): Celebration and reporting

---

## STEP-BY-STEP EXECUTION PLAN

### Step 1: Task Breakdown

**Agent:** PM, Frontend Dev, Backend Dev
**Type:** Analysis/Generation
**Menu Options:** A/P/C (Approve/Provide More/Cancel)

**Objective:**
- Analyze product design and interaction design documents
- Break down requirements into fine-grained Stories
- Define acceptance criteria for each story
- Assign ownership (Frontend Dev / Backend Dev / QA)

**Success Criteria:**
- All requirements covered
- Stories are fine-grained and actionable
- Clear acceptance criteria defined
- Ownership assigned

**Next Step:** step-02-test-case-design

---

### Step 2: Test Case Design

**Agent:** QA
**Type:** Document Generation
**Menu Options:** A/P/C (Approve/Provide More/Cancel)

**Objective:**
- Design test cases based on product requirements and Story list
- Cover functional, boundary, and integration scenarios
- Define test steps and expected results
- Save test cases to `{dev_docs_folder}/test-cases/`

**Success Criteria:**
- Test cases cover all stories
- Clear test steps defined
- Expected results specified
- Files saved correctly

**Next Step:** step-03-frontend-development

---

### Step 3: Frontend Development

**Agent:** Frontend Dev
**Type:** Code Generation
**Menu Options:** A/P/C (Approve/Provide More/Cancel)

**Objective:**
- Implement frontend code according to design and stories
- Follow best practices and coding standards
- Ensure responsive design and accessibility
- Save code to `{artifacts_folder}/code/frontend/`

**Success Criteria:**
- All frontend stories implemented
- Code follows standards
- UI matches interaction design
- Files saved correctly

**Next Step:** step-04-backend-development

---

### Step 4: Backend Development

**Agent:** Backend Dev
**Type:** Code Generation
**Menu Options:** A/P/C (Approve/Provide More/Cancel)

**Objective:**
- Implement backend code and API endpoints
- Follow best practices and coding standards
- Ensure API functionality and performance
- Save code to `{artifacts_folder}/code/backend/`

**Success Criteria:**
- All backend stories implemented
- API endpoints functional
- Code follows standards
- Files saved correctly

**Next Step:** step-05-testing-execution

---

### Step 5: Testing Execution

**Agent:** QA (using Playwright MCP)
**Type:** Testing
**Menu Options:** A/P/C (Approve/Provide More/Cancel)

**Objective:**
- Execute test cases using Playwright MCP
- Verify functional requirements
- Capture test results
- Generate test report

**Success Criteria:**
- All test cases executed
- Results captured
- Test report generated
- Bugs identified (if any)

**Next Step:** step-06-bug-management

---

### Step 6: Bug Management

**Agent:** QA
**Type:** Bug Detection/Management
**Menu Options:** B/S/A/C (Bugs Found/Skip to Acceptance/Approve/Cancel)

**Objective:**
- Review test results
- If bugs found: Create bug records in Linear, track fix cycle
- Loop back to Step 3 (Frontend) or Step 4 (Backend) for fixes
- Verify fixes with Playwright MCP
- Close bugs when confirmed

**Success Criteria:**
- All bugs identified and tracked
- Bugs fixed and verified
- Or: No bugs found

**Branching Logic:**
- If B (Bugs Found): Loop back to Step 3 or 4 for fixes
- If S (Skip): Proceed to Step 7 (user acceptance - no bugs)
- If A (Approved): Proceed to Step 7
- If C (Cancel): Exit workflow

**Next Step:**
- Loop to step-03-frontend-development or step-04-backend-development (if bugs)
- step-07-product-acceptance (if no bugs/approved)

---

### Step 7: Product Acceptance

**Agent:** PM
**Type:** User Validation
**Menu Options:** L/R/C (Left=Approve/Right=Request Changes/Cancel)

**Objective:**
- Present product to user for acceptance
- Demonstrate functionality
- Gather user feedback
- Confirm acceptance

**Success Criteria:**
- User approves delivered product
- OR User requests specific changes (requires loop)
- OR User rejects (workflow exit)

**Branching Logic:**
- If L (Approve): Proceed to step-08-deliver-files
- If R (Request Changes): Determine severity - minor can continue, major may loop
- If C (Cancel): Exit workflow

**Next Step:** step-08-deliver-files (on approval)

---

### Step 8: Deliver Files

**Agent:** PM
**Type:** File Operation
**Menu Options:** C Only (Continue)

**Objective:**
- Gather all deliverables
- Package source code, design documents, test reports
- Deliver to specified location
- Update Linear status

**Success Criteria:**
- All files gathered
- Packages complete
- Location confirmed
- Linear updated

**Next Step:** step-09-celebration

---

### Step 9: Celebration

**Agent:** PM
**Type:** Completion/Reporting
**Menu Options:** None (Final step)

**Objective:**
- Celebrate successful delivery with user
- Provide delivery summary
- Outline next steps
- Complete workflow

**Success Criteria:**
- Celebration message delivered
- Summary provided
- Next steps clear
- Workflow complete

**Next Step:** Workflow Complete

---

## WORKFLOW FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────────┐
│              Step 01: Task Breakdown                             │
│        Agents: PM + Frontend Dev + Backend Dev                  │
│                        Menu: A/P/C                               │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│           Step 02: Test Case Design                              │
│                    Agent: QA                                     │
│                        Menu: A/P/C                               │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│         Step 03: Frontend Development        ◄──────────────────┐
│                 Agent: Frontend Dev                             │  │
│                        Menu: A/P/C                               │  │
└─────────────────────────────┬────────────────────────────┬───────┘  │
                              │                            │          │
                              ▼                            │          │
┌─────────────────────────────────────────────────────────────────┐│  │
│       Step 04: Backend Development          ◄───────────────────┘│
│                 Agent: Backend Dev                              │
│                        Menu: A/P/C                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             Step 05: Testing Execution                           │
│         Agent: QA (using Playwright MCP)                        │
│                        Menu: A/P/C                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Step 06: Bug Management                            │
│                      Agent: QA                                  │
│                     Menu: B/S/A/C                               │
└────────────────────┬────────────────────────────┬───────────────┘
                     │                            │
              ┌──────▼─────┐              ┌──────▼─────┐
              │ B: Bugs    │              │ S/A: Skip  │
              │   Found    │              │  or Approve│
              └──────┬─────┘              └──────┬─────┘
                     │                           │
        (Loop to Step 3/4 for fixes)             ▼
                                      ┌──────────────────────────┐
                                      │ Step 07: Product         │
                                      │ Acceptance               │
                                      │    Agent: PM             │
                                      │    Menu: L/R/C           │
                                      └──────────┬───────────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────────┐
                                      │ Step 08: Deliver Files   │
                                      │    Agent: PM             │
                                      │    Menu: C Only          │
                                      └──────────┬───────────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────────┐
                                      │ Step 09: Celebration     │
                                      │    Agent: PM             │
                                      │    Menu: None            │
                                      └──────────┬───────────────┘
                                                 │
                                                 ▼
                                      WORKFLOW COMPLETE
```

---

## DOCUMENT OUTPUT SPECIFICATIONS

### Primary Outputs

#### Test Case Document
**File Path:** `{dev_docs_folder}/test-cases/{story-id}.md`

**Format:** Markdown with YAML frontmatter

**Content:**
- Story ID and description
- Test Case ID and description
- Test steps (detailed)
- Expected results
- Test data
- Priority level

#### Test Report
**File Path:** `{dev_docs_folder}/test-reports/test-report-{timestamp}.md`

**Content:**
- Test summary
- Test results (Passed/Failed/Skipped)
- Bug list with details
- Recommendations

### Secondary Output: Linear Status Updates

**Integration:** Linear MCP

**Status Updates:**
- Development start: In Progress
- Development complete: Ready for Testing
- Testing complete: Ready for Acceptance
- Bug created: Bug Created - Fix Required
- Bug fix verified: Bug - Verified
- Acceptance complete: Delivery Completed

---

## AGENT RESPONSIBILITY MATRIX

| Step | Primary Agent | Support Roles | Key Actions |
|------|---------------|---------------|-------------|
| 01 - Task Breakdown | PM | Frontend Dev, Backend Dev | Create stories, assign owners |
| 02 - Test Case Design | QA | - | Design comprehensive test cases |
| 03 - Frontend Development | Frontend Dev | - | Implement frontend code |
| 04 - Backend Development | Backend Dev | - | Implement backend and API |
| 05 - Testing Execution | QA | Playwright MCP | Execute tests, generate report |
| 06 - Bug Management | QA | Linear MCP, Frontend Dev, Backend Dev | Track bugs, coordinate fixes |
| 07 - Product Acceptance | PM | Frontend Dev, Backend Dev | Present to user, get confirmation |
| 08 - Deliver Files | PM | - | Package and deliver files |
| 09 - Celebration | PM | - | Celebrate, report summary |

---

## ERROR HANDLING AND RECOVERY

### Step Recovery Points

- **After Step 1:** Story list created - can restart from here
- **After Step 3:** Frontend code complete - can resume to backend
- **After Step 5:** Test complete - can review bugs
- **After Step 6:** Bug fix complete - can retest or proceed

### Common Error Scenarios

1. **Stories Incomplete (Step 1)**
   - Gather more requirements from PM
   - Consult with developers on technical scope
   - Refine acceptance criteria

2. **Test Cases Incomplete (Step 2)**
   - Review PRD for missing scenarios
   - Consult with developers on edge cases
   - Add integration test cases

3. **Bugs Found (Step 6)**
   - Create bug in Linear
   - Assign to appropriate developer
   - Loop to Step 3 or 4 for fix
   - Retest with Playwright

4. **User Requests Changes (Step 7)**
   - Minor UI changes: Can proceed with tracking
   - Major functional changes: May loop to Step 1 for new stories

---

## BUG MANAGEMENT LOOP DETAILS

### Bug Lifecycle

```
Discovery (QA) → Assignment (Linear) → Fix (Dev) → Verify (Playwright) → Close
```

### Bug Tracking

**Bug Record (Linear):**
- Title: Bug title
- Description: Detailed bug description
- Severity: Critical/High/Medium/Low
- Assignee: Frontend Dev or Backend Dev
- Status: In Progress/Fixed/Verified/Closed

### Fix Verification Process

1. Developer implements fix
2. QA re-tests with Playwright
3. If pass: Bug verified → Close
4. If fail: Bug reopened → Loop back to fix

---

## INTEGRATION POINTS

### Upstream Workflows

- **task-breakdown:** Provides Story list for development
- **test-case-design:** Provides test case design (or integrated)

### Downstream Workflows

- **None** (terminal delivery workflow)

### External Systems

- **Linear:** Story tracking, bug lifecycle management
- **Playwright MCP:** Automated testing, bug detection
- **File System:** Code and document storage

---

## TESTING GUIDELINES

### Unit Tests for Each Step

Verify:
- Correct agent persona used
- Menu options available as specified
- File operations successful
- Loop logic at Step 6 works correctly
- External integration calls made correctly

### Integration Tests

Verify:
- Workflow completes all steps in sequence
- Bug loop operates correctly
- Code generated and saved properly
- Documents generated correctly
- Linear status updates propagate
- Playwright testing works end-to-end

---

## MAINTENANCE NOTES

### Regular Updates Needed

- Test case templates if testing standards change
- Linear status values if Linear schema changes
- Playwright test patterns if Playwright updates
- Agent prompts if personas evolve

### Known Limitations

- Single-session only - no pause/resume capability
- Linear MCP availability not guaranteed
- Playwright MCP availability not guaranteed
- User acceptance is critical blocking point
- Bug loop may extend workflow duration significantly

---

_Workflow Plan created on 2026-02-03 for BMAD Core Module_
