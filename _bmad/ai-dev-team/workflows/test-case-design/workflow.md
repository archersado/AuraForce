---
name: test-case-design
description: 需求/设计 → 测试策略 → 测试用例
web_bundle: true
continuable: false
document_output: true
mode: create-only
---

# Test Case Design

**Goal:** 根据需求/设计设计测试用例

**Description:** QA根据产品设计文档和交互设计文档设计全面的测试用例。包括功能测试用例、边界测试用例、集成测试用例。测试用例被保存到文档库，为后续的功能测试提供依据。

---

## WORKFLOW SPECIFICATION

| Property | Value |
|----------|-------|
| **Workflow Name** | test-case-design |
| **Total Steps** | 7 (linear flow) |
| **Continuable** | No (single-session) |
| **Document Output** | Yes (Test case markdown + Playwright scripts) |
| **Mode** | Create-only |
| **Primary Persona** | QA |
| **Integration** | Playwright MCP |

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
  ├─ Agent: QA
  ├─ Goal: Analyze PRD and interaction design documents
  └─ Next: step-02-define-test-strategy

Step 02: step-02-define-test-strategy
  ├─ Type: Analysis
  ├─ Menu: A/M/C
  ├─ Agent: QA
  ├─ Goal: Define test strategy and coverage scope
  └─ Next: step-03-design-functional-tests

Step 03: step-03-design-functional-tests
  ├─ Type: Test Design
  ├─ Menu: R/A/C
  ├─ Agent: QA
  └─ Next: step-04-design-boundary-tests

Step 04: step-04-design-boundary-tests
  ├─ Type: Test Design
  ├─ Menu: R/A/C
  ├─ Agent: QA
  └─ Next: step-05-design-integration-tests

Step 05: step-05-design-integration-tests
  ├─ Type: Test Design
  ├─ Menu: R/A/C
  ├─ Agent: QA
  └─ Next: step-06-document-test-cases

Step 06: step-06-document-test-cases
  ├─ Type: File Operation
  ├─ Menu: C/Only
  ├─ Agent: QA
  ├─ Output: {dev_docs_folder}/test-cases/{feature-name}.md
  └─ Next: step-07-prepare-test-environment

Step 07: step-07-prepare-test-environment
  ├─ Type: Integration
  ├─ Menu: None
  ├─ Agent: QA
  ├─ Integration: Playwright MCP
  └─ Workflow Complete
```

---

## WORKFLOW FLOW DIAGRAM

```
step-01-analyze-requirements (QA)
       |
       ▼
step-02-define-test-strategy (QA)
       |
       ▼
step-03-design-functional-tests (QA)
       |
       ▼
step-04-design-boundary-tests (QA)
       |
       ▼
step-05-design-integration-tests (QA)
       |
       ▼
step-06-document-test-cases (QA)
       |
       ▼
step-07-prepare-test-environment (QA)
       |
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
- Story列表

### 3. Route to First Step

Load, read completely, then execute `steps-c/step-01-analyze-requirements.md`

---

## WORKFLOW CHAINING

**Previous Workflows:**
- `task-breakdown` - Provides Story list
- `product-design-review` - Provides PRD document
- `interaction-review` - Provides interaction design document

**Next Workflow:**
- `dev-delivery` - For actual development execution based on test cases

---

## DOCUMENT TEMPLATES

### Test Case Template

Each test case must include:
- 用例ID
- 用例标题
- 前置条件
- 测试步骤
- 预期结果
- 优先级

### Test Case Document Structure
- Feature Overview
- Test Strategy Summary
- Functional Test Cases
- Boundary Test Cases
- Integration Test Cases
- Test Execution Checklist

---

## AGENT PERSONAS

### Primary Agent: QA (测试)

**Persona Characteristics:**
- Experienced QA engineer with strong analytical skills
- Deep understanding of testing methodologies and best practices
- Systematic approach to test case design
- Focus on comprehensive test coverage and quality assurance
- Playwright expertise for test automation

**Communication Style:**
- "让我帮你确保测试覆盖面完整"
- Methodical and detail-oriented
- Clear documentation with structured format
- Collaborative with Product Designers and Developers

### Secondary Agents

#### Product Designer (产品设计)
- Answers questions about requirements details
- Clarifies expected behaviors
- Confirms business logic rules
- Helps understand edge cases

#### Frontend/Backend Dev (前端/后端开发)
- Confirms technical implementation details
- Identifies potential integration points
- Highlights areas requiring special testing attention
- Assists with Playwright test environment setup

---

## EXTERNAL INTEGRATIONS

### Playwright MCP

Used to prepare test environment and write test scripts:
- Initialize Playwright project structure
- Create test configuration files
- Generate test script templates
- Configure test runners and reporters
- Handle unavailability gracefully

---

## TEST CASE STRUCTURE

Each test case must include:

| Field | Description |
|-------|-------------|
| **用例ID** | Unique identifier (e.g., TC-001) |
| **用例标题** | Test case title describing the scenario |
| **前置条件** | Conditions that must be met before testing |
| **测试步骤** | Detailed step-by-step test execution |
| **预期结果** | Expected outcome for each step |
| **优先级** | Priority level (High/Medium/Low) |

---

## USER INTERACTION

### Who it's for:
- QA 作为主要执行者
- Product Designer 答疑需求细节
- Frontend/Backend Dev 确认技术细节

### User interaction style:
- QA leads the test case design process
- Product Designer and Developers provide input
- Collaborative test case creation

### Instruction style:
- **Intent-Based** - agents adapt naturally to dialogue
- Collaborative and interactive

---

## PROJECT CONTEXT

The test case design workflow creates comprehensive test cases for features based on:

1. **Product Design Documents (PRD)** - Business requirements and feature specifications
2. **Interaction Design Documents** - UI/UX specifications and user flow
3. **Story List** - Detailed user stories with acceptance criteria

Test cases ensure:
- Functional correctness
- Boundary condition handling
- Integration point reliability
- Regression testing coverage

---

## WORKFLOW GUARDRAILS

### Do's:
- QA leads systematic test case design
- Collaborate with Product Designer for requirement clarification
- Consult Frontend/Backend Dev for technical implementation details
- Structure test cases with all required fields
- Generate both manual test cases and Playwright scripts

### Don'ts:
- Don't skip test coverage for edge cases
- Don't create test cases without confirming requirements
- Don't proceed without user confirmation at each step
- Don't miss required test case fields
- Don't ignore integration testing needs

---

## SUPPORTED OUTPUT FORMATS

1. **Test Cases Document** (Markdown)
   - `{dev_docs_folder}/test-cases/{feature-name}.md`
   - Comprehensive test case documentation
   - Organized by test type (Functional, Boundary, Integration)

2. **Playwright Test Scripts** (TypeScript/JavaScript)
   - Automated test scripts
   - Test configuration files
   - Test utilities and helpers

---
