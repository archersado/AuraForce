---
name: dev-delivery
description: 任务拆解 → 开发 → 测试 → 验收
web_bundle: true
continuable: false
document_output: true
code_output: true
mode: create-only
---

# Dev Delivery

**Goal:** 代码研发、测试、验收的完整交付流程

**Description:** 开发团队拆解任务，Frontend Dev实现前端代码，Backend Dev实现后端代码和API。QA设计测试用例并执行测试。Bug发现时进行修复和验证。最终产品验收完成，PM向用户汇报交付成果。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | dev-delivery |
| **Total Steps** | 9 (linear flow with loop) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (test cases, test reports) |
| **Code Output** | Yes (source code) |
| **Mode** | Create-only |
| **Primary Persona** | PM (Project Manager) |
| **Integrations** | Linear MCP, Playwright MCP |

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-File Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Sequence within the step files must be completed in order
- **Append-Only Building**: Build documents by appending content as directed
- **State Tracking**: No tracking needed (single-session workflow)
- **Looping Support**: Step 6 can loop back to Step 3 or 4 for bug fixes

---

## STEP OVERVIEW

```
Step 01: step-01-task-breakdown
  ├─ Type: Analysis/Generation
  ├─ Menu: A/P/C
  ├─ Agents: PM, Frontend Dev, Backend Dev
  ├─ Goal: Break down tasks into Story list
  └─ Next: step-02-test-case-design

Step 02: step-02-test-case-design
  ├─ Type: Document Generation
  ├─ Menu: A/P/C
  ├─ Agent: QA
  ├─ Goal: Design test cases based on requirements
  ├─ Output: {dev_docs_folder}/test-cases/{story-id}.md
  └─ Next: step-03-frontend-development

Step 03: step-03-frontend-development
  ├─ Type: Code Generation
  ├─ Menu: A/P/C
  ├─ Agent: Frontend Dev
  ├─ Goal: Implement frontend code
  ├─ Output: {artifacts_folder}/code/frontend/
  └─ Next: step-04-backend-development

Step 04: step-04-backend-development
  ├─ Type: Code Generation
  ├─ Menu: A/P/C
  ├─ Agent: Backend Dev
  ├─ Goal: Implement backend code and API
  ├─ Output: {artifacts_folder}/code/backend/
  └─ Next: step-05-testing-execution

Step 05: step-05-testing-execution
  ├─ Type: Testing
  ├─ Menu: A/P/C
  ├─ Agent: QA (using Playwright MCP)
  ├─ Goal: Execute functional testing
  ├─ Output: {dev_docs_folder}/test-reports/test-report-{timestamp}.md
  └─ Next: step-06-bug-management

Step 06: step-06-bug-management
  ├─ Type: Bug Detection/Management
  ├─ Menu: B/S/A/C
  ├─ Agent: QA
  ├─ Integration: Linear MCP
  ├─ Goal: Manage bug fix and verification loop
  └─ Next: step-07-product-acceptance (or loop to Step 3/4)

Step 07: step-07-product-acceptance
  ├─ Type: User Validation
  ├─ Menu: L/R/C
  ├─ Agent: PM
  ├─ Goal: User acceptance confirmation
  └─ Next: step-08-deliver-files

Step 08: step-08-deliver-files
  ├─ Type: File Operation
  ├─ Menu: C Only
  ├─ Agent: PM
  ├─ Goal: Deliver code, design docs, test reports
  └─ Next: step-09-celebration

Step 09: step-09-celebration
  ├─ Type: Completion/Reporting
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Goal: Report successful delivery to user
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-task-breakdown (PM + Dev Team)
       │
       ▼
step-02-test-case-design (QA)
       │
       ▼
step-03-frontend-development (Frontend Dev) ◄───────────┐
       │                                                │
       ▼                                                │  (Bug loop)
step-04-backend-development (Backend Dev) ◄────────────┤
       │                                                │
       ▼                                                │
step-05-testing-execution (QA)                         │
       │                                                │
       ▼                                                │
step-06-bug-management (QA) ────────────────────────────┘
       │
       ▼  (No bugs)
step-07-product-acceptance (PM)
       │
       ▼
step-08-deliver-files (PM)
       │
       ▼
step-09-celebration (PM)
       │
       ▼
   COMPLETE
```

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`, `artifacts_folder`

### 2. Input Validation

Ensure required inputs are available:
- 产品设计文档和交互设计文档
-任务列表（来自PM）

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-task-breakdown.md`

---

## WORKFLOW CHAINING

**Previous Workflows:**
- `task-breakdown` - Provides Story list for development
- `test-case-design` - Provides test case design (can be integrated into this workflow)

**Next Workflow:** None (end of delivery pipeline)

---

## DOCUMENT TEMPLATES

### Test Case Template
- Story ID
- Test Case ID
- Test Description
- Test Steps
- Expected Results
- Test Data
- Priority

### Test Report Template
- Summary
- Test Results (Passed/Failed/Skipped)
- Bug List
- Recommendations

---

## AGENT PERSONAS

### Primary Agent: PM (Project Manager)

**Persona Characteristics:**
- Experienced project manager with strong coordination skills
- Focus on delivery and team management
- Systematic approach to task breakdown and progress tracking
- Ensures quality delivery and user satisfaction

**Communication Style:**
- "这个问题我理解，让我来协调一下"
- Organized and methodical
- Clear documentation with structured format
- Collaborative with cross-functional team

### Secondary Agents

#### Frontend Dev (前端开发)
- Implements frontend code based on design and stories
- Ensures code quality and maintainability
- Follows best practices and coding standards
- Collaborates with Backend Dev for API integration

#### Backend Dev (后端开发)
- Implements backend code and API
- Ensures API functionality and performance
- Follows best practices and coding standards
- Collaborates with Frontend Dev for integration

#### QA (测试工程师)
- Designs test cases based on requirements
- Executes functional testing using Playwright MCP
- Identifies and manages bugs
- Verifies bug fixes and updates test reports

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used for tracking task and bug status:
- Create Linear Story records for development tasks
- Track bug lifecycle (discovery → assignment → fix → verification → closure)
- Update status for each story
- Handle unavailability gracefully

### Playwright MCP

Used for automated functional testing:
- Execute test scripts on deployed application
- Capture screenshots and test results
- Identify bugs and issues
- Generate test reports

---

## WORKFLOW METRICS

### Success Indicators
- All stories implemented
- All tests passing
- User acceptance confirmed
- Linear status updated correctly

### KPI Tracking
- Time to development complete
- Bug count and severity distribution
- Test coverage percentage
- Time to bug resolution

---

## WORKFLOW CHAINING

**Previous Workflow:** `task-breakdown` (provides Story list)

**Next Workflow:** None (this is terminal workflow for delivery)

---

## BUG MANAGEMENT LOOP (Step 6)

The bug management step includes a potential loop:

- **If bugs found:** Loop back to Step 3 (Frontend) or Step 4 (Backend) for fixes
- **If no bugs:** Proceed to Step 7 (Product Acceptance)

Bug Lifecycle:
1. Discovery (QA during testing)
2. Assignment (via Linear MCP)
3. Fix (Frontend Dev / Backend Dev)
4. Verification (QA using Playwright MCP)
5. Closure (confirmed fix working)

---

## OUTPUT LOCATIONS

### Code Output
- `{artifacts_folder}/code/frontend/` - Frontend source code
- `{artifacts_folder}/code/backend/` - Backend source code

### Document Output
- `{dev_docs_folder}/test-cases/` - Test case documents
- `{dev_docs_folder}/test-reports/` - Test reports

### Linear Integration
- Story status updates
- Bug tracking and lifecycle management
