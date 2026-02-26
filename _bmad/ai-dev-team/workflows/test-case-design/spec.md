# Workflow Specification: test-case-design

**Module:** ai-dev-team
**Status:** Complete — All 7 steps implemented
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## Workflow Overview

**Goal:** 根据需求/设计设计测试用例

**Description:** QA根据产品设计文档和交互设计文档设计全面的测试用例。包括功能测试用例、边界测试用例、集成测试用例。测试用例被保存到文档库，为后续的功能测试提供依据。

**Workflow Type:** Feature Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: test-case-design
description: 需求/设计 → 测试策略 → 测试用例
web_bundle: true
continuable: false
document_output: true
mode: create-only
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/test-case-design'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

### Session Type

Single-session (non-continuable)

---

## Implemented Steps

| Step | Name | File | Goal |
|------|------|------|------|
| 1 | Analyze Requirements | steps-c/step-01-analyze-requirements.md | 分析PRD和交互设计 |
| 2 | Define Test Strategy | steps-c/step-02-define-test-strategy.md | 定义测试策略和覆盖范围 |
| 3 | Design Functional Tests | steps-c/step-03-design-functional-tests.md | 设计功能测试用例 |
| 4 | Design Boundary Tests | steps-c/step-04-design-boundary-tests.md | 设计边界测试用例 |
| 5 | Design Integration Tests | steps-c/step-05-design-integration-tests.md | 设计集成测试用例 |
| 6 | Document Test Cases | steps-c/step-06-document-test-cases.md | 记录测试用例到文档库 |
| 7 | Prepare Test Environment | steps-c/step-07-prepare-test-environment.md | 准备Playwright测试环境 |

### Step Type Pattern

- **Step 01:** Init/Gather - Analyze requirements and gather context
- **Step 02:** Analysis - Define comprehensive test strategy
- **Step 03-05:** Test Design - Design functional, boundary, and integration tests
- **Step 06:** File Operation - Document all test cases
- **Step 07:** Integration - Prepare Playwright environment (optional MCP integration)

---

## Workflow Inputs

### Required Inputs

- 产品设计文档（PRD）
- 交互设计文档
- Story列表

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{dev_docs_folder}/test-cases/{feature-name}.md` — 测试用例文档
- Playwright测试脚本

---

## Agent Integration

### Primary Agent

QA (测试) — 测试用例设计、Playwright脚本编写

### Other Agents

- Product Designer — 答疑需求细节
- Frontend/Backend Dev — 确认技术细节

---

## Implementation Notes

**Workflow Status:** Complete — All 7 steps fully implemented

**测试用例应包含:**
- 用例ID
- 用例标题
- 前置条件
- 测试步骤
- 预期结果
- 优先级

**MCP Tools Used:**
- Playwright MCP — 准备测试环境、编写测试脚本

**QA Agent Communication Style:**
- "让我帮你确保测试覆盖面完整"
- Systematic and detail-oriented
- Clear documentation with structured format
- Collaborative with Product Designers and Developers

**Workflow Pattern:** Simple linear flow (no branching)

**Key Features:**
1. Comprehensive requirements analysis with PRD, interaction design, and Story list
2. Strategic test coverage planning across functional, boundary, and integration tests
3. Three-tier test design (Functional, Boundary, Integration)
4. Document output with structured test case format
5. Optional Playwright automation integration with graceful fallback

**File Locations:**
- Main workflow: `/src/modules/ai-dev-team/workflows/test-case-design/workflow.md`
- Step files: `/src/modules/ai-dev-team/workflows/test-case-design/steps-c/step-*.md`

---

_Originally spec created on 2026-02-03 via BMAD Module workflow_
_Implementation completed on 2026-02-03_
