---
name: 'step-02-define-test-strategy'
description: 'Define test strategy and coverage scope'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-design-functional-tests.md'
---

# Step 2: Define Test Strategy

## STEP GOAL:
To define test strategy and coverage scope for comprehensive testing.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are QA (测试) - systematic, strategic QA engineer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on defining test strategy
- 🚫 FORBIDDEN to create test cases yet
- 💬 Approach: Define comprehensive test strategy covering multiple test types

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"

## CONTEXT BOUNDARIES:
- Available context: Requirements analysis from step-01
- Focus: Defining test strategy and coverage
- Limits: Don't create test cases yet, just define strategy
- Dependencies: Step 01 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 7】Define Test Strategy**"

### 2. Define Test Strategy

Based on requirements from Step 1, define comprehensive test strategy:

"让我帮你确保测试覆盖面完整。

**根据需求分析，我制定以下测试策略：**

**测试范围：**

**功能测试：**
- 核心功能验证
- 业务逻辑正确性
- 用户流程完整性
- 数据操作准确性

**边界测试：**
- 输入边界值（最小值、最大值、空值）
- 边界条件下的系统行为
- 极限情况处理
- 资源限制测试

**集成测试：**
- 前后端接口集成
- 第三方服务集成
- 模块间数据传递
- 系统间协作测试

**测试优先级定义：**

**P0（高优先级 - 必须通过）：**
- 核心业务流程
- 涉及数据完整性的功能
- 安全性相关功能

**P1（中优先级 - 重要）：**
- 主要功能点
- 用户体验关键路径
- 常用场景

**P2（低优先级 - 边缘）：**
- 边缘场景
- 非核心功能
- 优化性功能

**自动化测试规划：**

**Playwright自动化覆盖：**
- 回归测试用例
- 核心业务流程
- 可重复的测试场景

**手动测试覆盖：**
- UI/UX验证
- 视觉回归
- 复杂交互场景

这个测试策略是否全面？需要调整吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] Test Strategy Definition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Coverage Plan:
  Functional Tests: {{planned_count}} cases
  Boundary Tests: {{planned_count}} cases
  Integration Tests: {{planned_count}} cases
  Total: {{total_count}} cases

Automation Plan:
  Playwright Tests: {{planned_count}} cases
  Manual Tests: {{planned_count}} cases

Options:

  [A] Approve & Continue
      → Test strategy defined, proceed to design functional tests

  [M] Modify Strategy
      → Adjust test strategy or coverage plan

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to design functional tests...**"

1. Store test strategy in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [M] (Modify Strategy):

Ask what aspects of the test strategy need to be modified. Collect changes, update strategy, then redisplay menu.

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Test strategy defined clearly
- Coverage scope established
- Test priority levels defined
- Automation plan documented
- User approves test strategy

### ❌ SYSTEM FAILURE:
- Test strategy not covering all necessary test types
- Priority levels not defined
- Automation plan not specified
- Proceeding without user confirmation

**Master Rule:** Proceeding without comprehensive test strategy definition is FORBIDDEN.
