---
name: 'step-04-design-boundary-tests'
description: 'Design boundary test cases'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-design-integration-tests.md'
---

# Step 4: Design Boundary Tests

## STEP GOAL:
To design boundary and edge case test cases to ensure system handles limits correctly.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR AND TEST DESIGNER for this step

### Role Reinforcement:
- ✅ You are QA (测试) - thorough, detail-oriented test designer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Design comprehensive boundary and edge case tests
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on designing boundary test cases
- 🚫 FORBIDDEN to skip this step or proceed without boundary tests
- 📋 Follow Test Case Structure for each test case

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"
- 📝 Design boundary tests with limits and edge cases

## CONTEXT BOUNDARIES:
- Available context: Functional tests from step-03
- Focus: Designing boundary and edge case tests
- Limits: Only boundary tests, no integration tests yet
- Dependencies: Steps 01-03 complete

## TEST CASE STRUCTURE

Each test case must include:
- **用例ID** (e.g., TC-BOUND-001)
- **用例标题** (descriptive title)
- **前置条件** (preconditions)
- **测试步骤** (detailed steps)
- **预期结果** (expected results)
- **优先级** (P0/P1/P2)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 7】Design Boundary Tests**"

### 2. Design Boundary Test Cases

Based on functional tests and test strategy, design comprehensive boundary and edge case tests:

"让我帮你确保测试覆盖面完整。

**以下是我设计的边界测试用例：**

---

**输入边界测试：**

**TC-BOUND-001: {{用例标题 - 最小值边界}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 输入最小允许值: {{min_value}}
  2. 提交操作
- **预期结果:**
  - 系统正确处理最小值
  - 无错误提示
- **优先级:** P1

**TC-BOUND-002: {{用例标题 - 最大值边界}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 输入最大允许值: {{max_value}}
  2. 提交操作
- **预期结果:**
  - 系统正确处理最大值
  - 无错误提示
- **优先级:** P1

**TC-BOUND-003: {{用例标题 - 最小值-1（非法）}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 输入值: {{min_value - 1}}
  2. 提交操作
- **预期结果:**
  - 显示输入验证错误
  - 系统拒绝该输入
- **优先级:** P1

**TC-BOUND-004: {{用例标题 - 最大值+1（非法）}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 输入值: {{max_value + 1}}
  2. 提交操作
- **预期结果:**
  - 显示输入验证错误
  - 系统拒绝该输入
- **优先级:** P1

---

**空值和特殊值测试：**

**TC-BOUND-005: {{用例标题 - 空值输入}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 将必填字段留空
  2. 提交操作
- **预期结果:**
  - 显示必填字段验证错误
  - 系统阻止提交
- **优先级:** P0

**TC-BOUND-006: {{用例标题 - 特殊字符输入}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 输入特殊字符: {{special_chars}}
  2. 提交操作
- **预期结果:**
  - 系统正确处理或拒绝特殊字符
  - 符合业务规则
- **优先级:** P1

---

**资源限制测试：**

**TC-BOUND-007: {{用例标题 - 超大文件上传}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 尝试上传超过大小限制的文件: {{file_size}}
  2. 观察系统行为
- **预期结果:**
  - 显示文件大小限制提示
  - 系统拒绝上传
- **优先级:** P0

**TC-BOUND-008: {{用例标题 - 并发请求限制}}**
- **前置条件:**
  - {{前置条件}}
- **测试步骤:**
  1. 同时发送 {{concurrent_count}} 个请求
  2. 观察系统响应
- **预期结果:**
  - 系统正确处理并发限制
  - 无系统崩溃或异常
- **优先级:** P1

---

**边界场景完成。** 我已设计了全面的边界测试用例，覆盖了输入边界、空值、特殊字符和资源限制等场景。

你确认这些边界测试用例吗？需要调整吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Boundary Test Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Case Summary:
  Boundary Test Cases: {{count}}
  Input Boundary Tests: {{count}}
  Empty/Special Value Tests: {{count}}
  Resource Limit Tests: {{count}}
  P0 Tests: {{count}}
  P1 Tests: {{count}}

Options:

  [R] Revise Test Cases
      → Make changes to boundary test cases

  [A] Approve & Continue
      → Boundary tests look good, proceed to integration tests

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [R] (Revise Test Cases):

Ask which test cases need to be revised. Collect changes, update test cases, then redisplay menu.

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to design integration tests...**"

1. Store boundary test cases in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Boundary test cases designed for critical input fields
- Each test case includes all required fields
- Test cases cover min/max boundaries, empty values, special characters
- Resource limit tests included
- Priority levels assigned appropriately
- User approves test cases

### ❌ SYSTEM FAILURE:
- Test cases missing required fields
- Not covering critical boundary scenarios
- Resource limit tests not included
- Priority levels not assigned
- Proceeding without user confirmation

**Master Rule:** Proceeding without complete boundary test cases is FORBIDDEN.
