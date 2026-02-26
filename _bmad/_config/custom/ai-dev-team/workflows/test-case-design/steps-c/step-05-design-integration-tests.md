---
name: 'step-05-design-integration-tests'
description: 'Design integration test cases'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-document-test-cases.md'
---

# Step 5: Design Integration Tests

## STEP GOAL:
To design integration test cases to verify interactions between system components.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR AND TEST DESIGNER for this step

### Role Reinforcement:
- ✅ You are QA (测试) - comprehensive, system-level test designer
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Design thorough integration test cases
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on designing integration test cases
- 🚫 FORBIDDEN to skip this step or proceed without integration tests
- 📋 Follow Test Case Structure for each test case

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"
- 📝 Design integration tests for system interactions

## CONTEXT BOUNDARIES:
- Available context: Functional and boundary tests from steps 03-04
- Focus: Designing integration test cases
- Limits: Only integration tests
- Dependencies: Steps 01-04 complete

## TEST CASE STRUCTURE

Each test case must include:
- **用例ID** (e.g., TC-INT-001)
- **用例标题** (descriptive title)
- **前置条件** (preconditions)
- **测试步骤** (detailed steps)
- **预期结果** (expected results)
- **优先级** (P0/P1/P2)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 7】Design Integration Tests**"

### 2. Design Integration Test Cases

Based on Story list and technical design, design comprehensive integration test cases:

"让我帮你确保测试覆盖面完整。

**以下是我设计的集成测试用例：**

---

**前后端接口集成测试：**

**TC-INT-001: {{用例标题 - API端点集成}}**
- **前置条件:**
  - 前端服务运行中
  - 后端服务运行中
  - 数据库连接正常
- **测试步骤:**
  1. 前端发起 {{api_method}} 请求到 {{api_endpoint}}
  2. 发送请求参数: {{request_params}}
  3. 验证后端响应
  4. 检查数据库记录
- **预期结果:**
  - HTTP状态码: {{expected_status}}
  - 响应格式正确
  - 数据正确写入数据库
- **优先级:** P0

**TC-INT-002: {{用例标题 - 错误处理}}**
- **前置条件:**
  - 前端服务运行中
  - 后端服务运行中
- **测试步骤:**
  1. 模拟后端服务错误: {{error_type}}
  2. 前端发起请求
  3. 观察前端错误处理
- **预期结果:**
  - 前端显示友好的错误提示
  - 不显示技术错误细节
  - 用户可恢复操作
- **优先级:** P0

---

**第三方服务集成测试：**

**TC-INT-003: {{用例标题 - 第三方API集成}}**
- **前置条件:**
  - {{第三方服务}} 可访问
  - API凭证配置正确
- **测试步骤:**
  1. 调用第三方API: {{api_name}}
  2. 发送测试请求
  3. 验证响应数据
  4. 记录响应时间
- **预期结果:**
  - API调用成功
  - 返回数据格式正确
  - 响应时间在可接受范围内
- **优先级:** P1

**TC-INT-004: {{用例标题 - 第三方服务失败处理}}**
- **前置条件:**
  - 第三方服务可能不可用
- **测试步骤:**
  1. 模拟第三方服务不可用
  2. 执行依赖该服务的操作
  3. 观察系统行为
- **预期结果:**
  - 系统优雅降级
  - 显示适当的错误提示
  - 核心功能不受影响
- **优先级:** P0

---

**模块间数据流测试：**

**TC-INT-005: {{用例标题 - 数据传递完整性}}**
- **前置条件:**
  - {{模块A}} 和 {{模块B}} 集成正确
- **测试步骤:**
  1. 在 {{模块A}} 创建数据
  2. 验证数据传递到 {{模块B}}
  3. 在 {{模块B}} 更新数据
  4. 验证数据同步回 {{模块A}}
- **预期结果:**
  - 数据正确传递
  - 无数据丢失
  - 无数据重复
  - 数据格式保持一致
- **优先级:** P0

**TC-INT-006: {{用例标题 - 跨模块事务}}**
- **前置条件:**
  - 相关模块集成正确
- **测试步骤:**
  1. 执行跨模块操作
  2. 模拟其中一个操作失败
  3. 验证事务回滚
- **预期结果:**
  - 操作失败的事务正确回滚
  - 不产生不一致的数据状态
  - 系统保持数据一致性
- **优先级:** P0

---

**系统级集成测试：**

**TC-INT-007: {{用例标题 - 完整用户流程}}**
- **前置条件:**
  - 所有依赖服务正常运行
- **测试步骤:**
  1. 用户登录
  2. 执行 {{功能1}}
  3. 执行 {{功能2}}
  4. 执行 {{功能3}}
  5. 用户登出
- **预期结果:**
  - 流程顺利完成
  - 无中间错误
  - 数据正确保存
  - 用户体验流畅
- **优先级:** P0

---

**集成测试完成。** 我已设计了全面的集成测试用例，覆盖了前后端接口、第三方服务、模块间数据流和完整用户流程等场景。

你确认这些集成测试用例吗？需要调整吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Integration Test Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Case Summary:
  Integration Test Cases: {{count}}
  Frontend-Backend API Tests: {{count}}
  Third-Party Service Tests: {{count}}
  Data Flow Tests: {{count}}
  End-to-End Flow Tests: {{count}}
  P0 Tests: {{count}}
  P1 Tests: {{count}}

Options:

  [R] Revise Test Cases
      → Make changes to integration test cases

  [A] Approve & Continue
      → Integration tests look good, proceed to document test cases

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [R] (Revise Test Cases):

Ask which test cases need to be revised. Collect changes, update test cases, then redisplay menu.

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to document test cases...**"

1. Store integration test cases in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Integration test cases designed for all critical integration points
- Each test case includes all required fields
- Test cases cover frontend-backend API, third-party services, data flows
- End-to-end flow tests included
- Priority levels assigned appropriately
- User approves test cases

### ❌ SYSTEM FAILURE:
- Test cases missing required fields
- Not covering critical integration scenarios
- Error handling tests not included
- Priority levels not assigned
- Proceeding without user confirmation

**Master Rule:** Proceeding without complete integration test cases is FORBIDDEN.
