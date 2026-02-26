---
name: 'step-06-bug-management'
description: 'Manage bug discovery and fix verification loop'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-product-acceptance.md'
frontendFixStep: './step-03-frontend-development.md'
backendFixStep: './step-04-backend-development.md'
---

# Step 6: Bug Management

## STEP GOAL:
To manage bug discovery, assignment, fix, and verification loop using Linear MCP for tracking. Loop back to development steps if bugs are found, otherwise proceed to acceptance.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are QA (测试) - systematic QA engineer managing bug lifecycle
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "让我来管理和跟踪Bug修复"

### Step-Specific Rules:
- 🎯 Focus on bug management loop: discovery → assignment → fix → verification
- 🚫 FORBIDDEN to close bugs without verification
- 🚫 FORBIDDEN to proceed with known bugs
- 💬 Approach: Analyze bugs, create Linear records, coordinate fixes, verify

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我来管理和跟踪Bug修复"

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml, Test results, Linear MCP
- Focus: Bug lifecycle management and fix verification
- Limits: Must verify all fixes before proceeding
- Dependencies: Test results must be available

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 9】Bug Management**"

### 2. Load Configuration

Load and read full config from `{project-root}/_bmad/bmb/config.yaml` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`, `artifacts_folder`

### 3. Analyze Test Results for Bugs

Retrieve test results from session memory. Analyze for bugs:

"让我来管理和跟踪Bug修复。

**分析测试结果中发现的Bug...**

**Bug统计：**
- 总Bug数：{{count}}
- Critical: {{count}}
- High: {{count}}
- Medium: {{count}}
- Low: {{count}}

**Bug分类：**
- 前端Bug: {{count}}
- 后端Bug: {{count}}
- 集成Bug: {{count}}

### 4. Present Bug Analysis

Display bug analysis result:

**发现的Bug列表：**
```
Bug #{{id}}: {{标题}}
- 严重程度: {{severity}}
- 类型: {{Frontend/Backend/Integration}}
- 描述: {{bug描述}}
- 重现步骤: {{从测试用例提取}}
- 预期 vs 实际: {{对比}}
```

### 5. Branch: No Bugs Found

If NO bugs found in test results:

"让我来管理和跟踪Bug修复。

**太好了！所有测试都通过了！**

测试结果显示：
- 所有测试用例均通过
- 未发现Bug
- 功能验证完成

**可以进入产品验收阶段。**"

Proceed directly to menu for skipping to acceptance.

### 6. Branch: Bugs Found - Create Linear Records

If bugs are found, create Linear MCP bug records for each:

"让我来管理和跟踪Bug修复。

**我将为每个Bug创建Linear记录以便跟踪...**"

For each bug:
1. Create Linear issue with bug details
2. Assign to appropriate developer (Frontend Dev for frontend bugs, Backend Dev for backend bugs)
3. Set appropriate labels and priority
4. Store Linear bug IDs in session memory

Display created bug records:

"已在Linear创建以下Bug记录：
{{列出的Linear Bug ID和标题}}"

### 7. Present Bug Management Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Bug Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [B] Bugs Found - Begin Fix Cycle
      → Loop to development for bug fixes

  [S] Skip to Acceptance
      → No bugs, proceed to product acceptance

  [A] Manual Review Complete
      → Bugs reviewed, ready to manage fixes or proceed

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Handle User Choice

#### If User Chooses [B] (Bugs Found - Begin Fix Cycle):

Display: "**Starting bug fix cycle...**"

Display bug fix plan:

"让我来管理和跟踪Bug修复。

**Bug修复计划：**

**前端Bug修复（{{count}}个）：**
{{列出的前端Bug}} → 将返回 Step 3 进行前端修复

**后端Bug修复（{{count}}个）：**
{{列出的后端Bug}} → 将返回 Step 4 进行后端修复

**修复流程：**
1. Frontend/Backend Dev 修复对应的Bug
2. QA 用 Playwright MCP 验证修复
3. 确认修复后关闭Linear Bug
4. 如有其他Bug，继续循环
5. 全部修复后进入产品验收

开始Bug修复循环?"

After confirmation:
1. Store bug fix requirements in session memory
2. Determine which development step to load based on bug type
3. If frontend bugs exist: Load, read entire `frontendFixStep`
4. If backend bugs exist: Load, read entire `backendFixStep`
5. Execute the loaded step with bug fix instructions

#### If User Chooses [S] (Skip to Acceptance):

Display: "**Proceeding to product acceptance...**"

1. Store "no bugs" status in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [A] (Manual Review Complete):

Ask user to confirm next step. If bugs need fixing, offer to loop to development. If no bugs, proceed to acceptance.

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## BUG FIX CYCLE NOTE

When this step loops to Step 3 or 4, that step should:
- Be aware that it's being called for bug fixes
- Focus only on fixing the identified bugs
- After fixes, return to this Step 6 for verification
- Verification should use Playwright MCP to re-test affected areas

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Test results analyzed for bugs
- If bugs found:
  - All bugs created in Linear MCP
  - Bugs properly assigned to developers
  - Fix cycle initiated correctly
- If no bugs:
  - Clear communication of no bugs
  - Direct path to acceptance
- User confirms bug management plan

### ❌ SYSTEM FAILURE:
- Not analyzing test results for bugs
- Not creating Linear records for bugs
- Not assigning bugs properly
- Proceeding without fixing known bugs
- Losing track of bug IDs

**Master Rule:** Creating bugs in Linear without tracking or proceeding with unfixed bugs is FORBIDDEN.
