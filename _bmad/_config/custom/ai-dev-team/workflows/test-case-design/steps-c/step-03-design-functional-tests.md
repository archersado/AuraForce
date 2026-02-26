---
name: 'step-03-design-functional-tests'
description: 'Design functional test cases'

# File references (ONLY variables used in this step)
nextStepFile: './step-04-design-boundary-tests.md'
---

# Step 3: Design Functional Tests

## STEP GOAL:
To design comprehensive functional test cases for core features and user flows.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR AND TEST DESIGNER for this step

### Role Reinforcement:
- ✅ You are QA (测试) - systematic, detailed test designer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Create structured, thorough functional test cases
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on designing functional test cases
- 🚫 FORBIDDEN to skip this step or proceed without functional tests
- 📋 Follow Test Case Structure for each test case

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"
- 📝 Design test cases with all required fields

## CONTEXT BOUNDARIES:
- Available context: Requirements analysis and test strategy from steps 01-02
- Focus: Designing functional test cases
- Limits: Only functional tests, no boundary or integration tests yet
- Dependencies: Steps 01-02 complete

## TEST CASE STRUCTURE

Each test case must include:
- **用例ID** (e.g., TC-FUNC-001)
- **用例标题** (descriptive title)
- **前置条件** (preconditions)
- **测试步骤** (detailed steps)
- **预期结果** (expected results)
- **优先级** (P0/P1/P2)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 7】Design Functional Tests**"

### 2. Design Functional Test Cases

Based on requirements and test strategy, design comprehensive functional test cases:

"让我帮你确保测试覆盖面完整。

**以下是我设计的功能测试用例：**

---

**功能模块：{{模块名称}}**

**TC-FUNC-001: {{用例标题}}**
- **前置条件:**
  - {{条件1}}
  - {{条件2}}
- **测试步骤:**
  1. {{步骤1}}
  2. {{步骤2}}
  3. {{步骤3}}
- **预期结果:**
  - {{结果1}}
  - {{结果2}}
- **优先级:** P0

**TC-FUNC-002: {{用例标题}}**
- **前置条件:**
  - {{条件1}}
- **测试步骤:**
  1. {{步骤1}}
  2. {{步骤2}}
- **预期结果:**
  - {{结果1}}
- **优先级:** P1

{{继续其他功能测试用例}}

---

**功能模块：{{模块名称}}**

{{继续为其他模块设计测试用例}}

---

我已完成核心功能模块的测试用例设计。每个测试用例都包含了必需的字段：用例ID、用例标题、前置条件、测试步骤、预期结果和优先级。

你确认这些功能测试用例吗？需要调整吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Functional Test Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Case Summary:
  Functional Test Cases: {{count}}
  P0 (High Priority): {{count}}
  P1 (Medium Priority): {{count}}
  P2 (Low Priority): {{count}}
  Test Modules: {{count}}

Options:

  [R] Revise Test Cases
      → Make changes to functional test cases

  [A] Approve & Continue
      → Functional tests look good, proceed to boundary tests

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [R] (Revise Test Cases):

Ask which test cases need to be revised. Collect changes, update test cases, then redisplay menu.

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to design boundary tests...**"

1. Store functional test cases in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Functional test cases designed for all core features
- Each test case includes all required fields
- Test cases cover positive and negative scenarios
- Priority levels assigned appropriately
- User approves test cases

### ❌ SYSTEM FAILURE:
- Test cases missing required fields
- Not covering all functional requirements
- Priority levels not assigned
- Proceeding without user confirmation

**Master Rule:** Proceeding without complete functional test cases is FORBIDDEN.
