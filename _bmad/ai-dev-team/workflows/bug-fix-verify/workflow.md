---
name: bug-fix-verify
description: Bug发现 -> 开发修复 -> 测试验证 -> 关闭
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Bug Fix Verify

**Goal:** Bug环境开辟、修复、验证的完整闭环

**Description:** QA发现Bug后，开辟Bug测试环境，记录Bug详情。PM将Bug分配给对应的开发角色（Frontend Dev或Backend Dev）。开发人员修复Bug，QA重新测试。Bug状态由PM全程追踪管理。修复通过后Bug关闭。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | bug-fix-verify |
| **Total Steps** | 10 (linear flow with loop at step 9) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (Bug report document) |
| **Mode** | Create-only |
| **Primary Persona** | PM |
| **Integration** | Linear MCP, Playwright MCP |

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-File Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Sequence within the step files must be completed in order
- **Append-Only Building**: Build documents by appending content as directed
- **State Tracking**: No tracking needed (single-session workflow)
- **Loop Handling**: Step 9 can loop back to Step 7 if verification fails

---

## STEP OVERVIEW

```
Step 01: step-01-discover-bug
  ├─ Type: Init/Gather
  ├─ Menu: A/P/C
  ├─ Agent: PM
  ├─ Goal: QA discovers and reports a bug
  └─ Next: step-02-create-bug-environment

Step 02: step-02-create-bug-environment
  ├─ Type: Environment Setup
  ├─ Menu: C Only
  ├─ Agent: QA
  ├─ Integration: Playwright MCP
  ├─ Goal: Set up bug environment and reproduce the bug
  └─ Next: step-03-record-bug

Step 03: step-03-record-bug
  ├─ Type: Documentation
  ├─ Menu: C Only
  ├─ Agent: QA
  ├─ Template: template-bug-report.md
  ├─ Output: {artifacts_folder}/bugs/{bug-id}-report.md
  ├─ Goal: Record bug details with reproduction steps
  └─ Next: step-04-identify-affected-component

Step 04: step-04-identify-affected-component
  ├─ Type: Analysis
  ├─ Menu: C/Only
  ├─ Agent: QA
  ├─ Goal: Identify if bug is frontend or backend
  └─ Next: step-05-create-bug-story

Step 05: step-05-create-bug-story
  ├─ Type: Integration
  ├─ Menu: C/Only
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: PM creates Linear Bug Story
  └─ Next: step-06-assign-bug-to-dev

Step 06: step-06-assign-bug-to-dev
  ├─ Type: Assignment
  ├─ Menu: C/Only
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: Assign bug to Frontend Dev or Backend Dev
  └─ Next: step-07-developer-fix

Step 07: step-07-developer-fix
  ├─ Type: Implementation
  ├─ Menu: C/Only
  ├─ Agent: Frontend Dev (or Backend Dev)
  ├─ Goal: Developer fixes the bug
  └─ Next: step-08-qa-verification

Step 08: step-08-qa-verification
  ├─ Type: Testing
  ├─ Menu: C/Only
  ├─ Agent: QA
  ├─ Integration: Playwright MCP
  ├─ Goal: QA re-tests the bug with Playwright
  └─ Next: step-09-determine-result

Step 09: step-09-determine-result
  ├─ Type: Decision
  ├─ Menu: F (pass) or R (retry)
  ├─ Agent: QA
  ├─ Goal: Determine if fix is successful
  ├─ Loop: If failed, go back to step-07-developer-fix
  └─ Next: step-10-close-bug (if pass)

Step 10: step-10-close-bug
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: PM
  ├─ Integration: Linear MCP
  ├─ Goal: PM closes bug status in Linear
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-discover-bug (PM)
       │
       ▼
step-02-create-bug-environment (QA + Playwright MCP)
       │
       ▼
step-03-record-bug (QA)
       │
       ▼
step-04-identify-affected-component (QA)
       │
       ▼
step-05-create-bug-story (PM + Linear MCP)
       │
       ▼
step-06-assign-bug-to-dev (PM + Linear MCP)
       │
       ▼
step-07-developer-fix (Frontend Dev / Backend Dev)
       │
       │
       ▼
step-08-qa-verification (QA + Playwright MCP)
       │
       ▼
step-09-determine-result (QA)
       │
   ┌───┴──────┐
   │         │
  Pass      Fail (loop)
   │         │
   ▼         │
step-10-close-bug (PM + Linear MCP)    │
       │                                 │
       ▼                                 └──→ step-07-developer-fix (retry)
   COMPLETE
```

---

## BUG MANAGEMENT LOOP

```
Bug发现 (QA) → 分配给研发 (PM) → 开发修复 (Dev) → QA验证 (QA)
    ↑                                                    ↓
    └────── 通过？关闭 (PM) ←── 未通过：重新修复 (Dev)
```

**Bug Status Flow:**
- 新建 → 分配给研发 → 进行中 → 已修复 → 待验证 → 已关闭

---

## INITIALIZATION SEQUENCE

### 1. Load Configuration

Load and read full config from {project-root}/_bmad/bmb/config.yaml and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `artifacts_folder`

### 2. Input Validation

Ensure required inputs are available:
- Bug报告（来自测试或用户）

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-discover-bug.md`

---

## WORKFLOW CHAINING

**Previous Workflow:** Any workflow where bugs are discovered (testing, user feedback)

**Next Workflow:** N/A (bug fix is a standalone loop)

---

## DOCUMENT TEMPLATES

### Bug Report Template (`template-bug-report.md`)
- Bug ID
- Bug Title
- Bug Description
- Bug Priority
- Reproduction Steps
- Expected Behavior
- Actual Behavior
- Affected Component (Frontend/Backend)
- Screenshots/Videos (optional)
- Environment Details
- Assigned Developer
- Status

---

## AGENT PERSONAS

### Primary Agent: PM (Project Manager)

**Persona Characteristics:**
- Professional project manager responsible for bug tracking
- Expert at coordinating QA and development teams
- Systematic approach to bug management
- Focus on timely resolution and status updates

**Communication Style:**
- Proactive: "这个Bug我来分配，确保及时修复"
- Clear ownership and timeline expectations
- Professional coordination between teams
- Tracks bug status systematically

### Secondary Agents

#### QA (Quality Assurance Engineer)
- Discovers bugs through testing
- Sets up bug environment using Playwright MCP
- Records bug details with clear reproduction steps
- Identifies affected component (frontend/backend)
- Verifies bug fixes with Playwright MCP
- Provides clear pass/fail feedback

#### Frontend Dev (Frontend Developer)
- Fixes frontend bugs assigned by PM
- Provides fix details and timeline
- Collaborates with QA for verification

#### Backend Dev (Backend Developer)
- Fixes backend bugs assigned by PM
- Provides fix details and timeline
- Collaborates with QA for verification

---

## EXTERNAL INTEGRATIONS

### Linear MCP

Used throughout the bug fix process:
- Create Bug Story with all details
- Assign bug to appropriate developer
- Update bug status through the fix cycle
- Close bug when verified

### Playwright MCP

Used for bug environment and verification:
- Navigate to application at bug location
- Capture screenshots of bug behavior
- Reproduce bug following reproduction steps
- Re-test fix to verify resolution
- Take screenshots of fixed behavior

---

## OUTPUT ARTIFACTS

### Primary Outputs

**Bug Report Document:** `{artifacts_folder}/bugs/{bug-id}-report.md`
- Complete bug details with reproduction steps
- Screenshots of bug behavior
- Identification of affected component
- Fix description (after development)
- Verification results

**Linear Bug Story:** Created via Linear MCP
- Bug title and description
- Priority level
- Assigned developer
- Status tracking through lifecycle

---

## SUCCESS CRITERIA

Workflow is considered successful when:

1. Bug is discovered and reported by QA
2. Bug environment is set up and bug is reproduced
3. Bug details are recorded with clear reproduction steps
4. Affected component is identified (frontend/backend)
5. Bug Story is created in Linear and assigned to developer
6. Developer fixes the bug
7. QA verifies the fix using Playwright
8. If verification fails, loop back to developer fix
9. When verification passes, PM closes the bug in Linear

---

## SPECIAL HANDLING

### Loop Behavior

At Step 9 (Determine Result):
- If verification PASSES → Proceed to Step 10 (Close Bug)
- If verification FAILS → Loop back to Step 7 (Developer Fix) for retry
- Update bug status in Linear accordingly
- Record verification result in bug report

### Bug Priority

Bugs should be prioritized based on:
- **Urgent (High Priority)**: Critical functionality broken, data loss, security issue
- **High**: Major functionality broken, significant impact
- **Normal**: Minor functionality issue, workarounds available
- **Low**: Cosmetic issues, minor UX problems

---

_Bug Fix Verify Workflow - Created for BMAD Core ai-dev-team module_
