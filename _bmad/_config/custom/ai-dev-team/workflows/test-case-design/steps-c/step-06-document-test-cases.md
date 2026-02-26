---
name: 'step-06-document-test-cases'
description: 'Save the complete test case list to the document library'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-prepare-test-environment.md'
outputFolder: '{output_folder}/test-cases/'
---

# Step 6: Document Test Cases

## STEP GOAL:
To save the complete test case list to the document library.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR for this step

### Role Reinforcement:
- ✅ You are QA (测试) - organized, professional document creator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the QA role
- ✅ Create accurate, well-formatted documents
- ✅ Use your phrase: "让我帮你确保测试覆盖面完整"

### Step-Specific Rules:
- 🎯 Focus only on document creation and file operations
- 🚫 FORBIDDEN to ask more questions - use collected information only
- 📁 Write document to `{outputFolder}/{feature-name}.md`

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use QA's communication style: "让我帮你确保测试覆盖面完整"
- 📁 Ensure output folder exists before writing
- 🚫 This is a document generation step - no user choices

## CONTEXT BOUNDARIES:
- Available context: Complete test case list with all types from steps 01-05
- Focus: Generate and save test case document
- Limits: Use only collected information, don't add details not discussed
- Dependencies: Steps 01-05 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 7】Document Test Cases**"

### 2. Prepare Document Content

Prepare test case document with:

**Frontmatter:**
```yaml
---
stepsCompleted: ['step-01-analyze-requirements', 'step-02-define-test-strategy', 'step-03-design-functional-tests', 'step-04-design-boundary-tests', 'step-05-design-integration-tests', 'step-06-document-test-cases']
date: {{current_date}}
user_name: {{user_name}}
project_name: {{project_name}}
status: 'draft'
totalTestCases: {{count}}
testCoverage:
  functional: {{count}}
  boundary: {{count}}
  integration: {{count}}
automation:
  playwright: {{count}}
  manual: {{count}}
---
```

**Document Body:**
- Document title: {feature-name} - Test Cases
- Test Strategy Summary
- Functional Test Cases section
- Boundary Test Cases section
- Integration Test Cases section
- Test Execution Checklist

Each test case should include:
- 用例ID
- 用例标题
- 前置条件
- 测试步骤
- 预期结果
- 优先级
- 自动化标识 (Playwright/Manual)

Use user's exact language and terminology.

### 3. Ensure Output Folder Exists

Ensure folder `{output_folder}/test-cases/` exists (create if needed)

### 4. Write Document File

Write document to: `{output_folder}/test-cases/{feature-name}.md`

Display: "**Creating test case document at: {output_folder}/test-cases/{feature-name}.md**"

### 5. Display Summary

Display document summary:
"让我帮你确保测试覆盖面完整。

**测试用例文档已成功创建！**

- 位置: `{output_folder}/test-cases/{feature-name}.md`
- 总测试用例数: {{count}}
- 功能测试用例: {{count}}
- 边界测试用例: {{count}}
- 集成测试用例: {{count}}

**优先级分布:**
- P0 (高): {{count}} 个
- P1 (中): {{count}} 个
- P2 (低): {{count}} 个

**自动化计划:**
- Playwright自动化: {{count}} 个
- 手动执行: {{count}} 个"

### 6. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Test Cases Documented
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document Status:
  ✅ Test case document created and saved

Options:

  [C] Continue to Test Environment Preparation
      → Prepare Playwright test environment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [C] (Continue):

Display: "**Proceeding to test environment preparation...**"

1. Load, read entire `nextStepFile`
2. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Document created with all collected information
- File written to correct location
- Proper frontmatter included
- All test case types documented
- Document summary displayed to user

### ❌ SYSTEM FAILURE:
- Document not created or saved
- Wrong file location
- Missing frontmatter metadata
- Not using user's collected information
- Missing test case sections

**Master Rule:** Continuing without creating the document is FORBIDDEN.
