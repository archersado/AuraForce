# Workflow Specification: dev-delivery

**Module:** ai-dev-team
**Status:** Production Ready
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

## Workflow Overview

**Goal:** 代码研发、测试、验收的完整交付流程

**Description:** 开发团队拆解任务，Frontend Dev实现前端代码，Backend Dev实现后端代码和API。QA设计测试用例并执行测试。Bug发现时进行修复和验证。最终产品验收完成，PM向用户汇报交付成果。

**Workflow Type:** Core Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: dev-delivery
description: 任务拆解 → 开发 → 测试 → 验收
web_bundle: true
continuable: false
document_output: true
code_output: true
mode: create-only
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Steps Summary

| Step | Name | Goal | Agent | Menu |
|------|------|------|-------|------|
| 1 | Task Breakdown | PM/Dev拆解任务为Story列表 | PM + Frontend Dev + Backend Dev | A/P/C |
| 2 | Test Case Design | QA根据需求设计测试用例 | QA | A/P/C |
| 3 | Frontend Development | Frontend Dev实现前端代码 | Frontend Dev | A/P/C |
| 4 | Backend Development | Backend Dev实现后端代码和API | Backend Dev | A/P/C |
| 5 | Testing Execution | QA执行功能测试 | QA (Playwright MCP) | A/P/C |
| 6 | Bug Management | 如有Bug，Bug修复与验证闭环 | QA (Linear MCP) | B/S/A/C |
| 7 | Product Acceptance | 用户验收确认 | PM | L/R/C |
| 8 | Deliver Files | 交付代码、设计文档、测试报告 | PM | C only |
| 9 | Celebration | PM向用户汇报项目交付成功 | PM | D/F/E |

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [x] Code-producing

### Output Files

- `{artifacts_folder}/code/frontend/` - 前端源代码
- `{artifacts_folder}/code/backend/` - 后端源代码
- `{dev_docs_folder}/test-cases/` - 测试用例
- `{dev_docs_folder}/test-reports/` - 测试报告
- `{output_folder}/delivery-{timestamp}/` - 完整交付包

---

## Agent Integration

### Primary Agent

PM (项目经理) - 协调开发团队，管理进度，汇报交付

### Other Agents

- **Frontend Dev** - 前端代码实现
- **Backend Dev** - 后端代码和API实现
- **QA** - 测试用例设计、功能验证、Bug管理

---

## External Integrations

- **Linear MCP** - 任务状态追踪、Bug管理
- **Playwright MCP** - 功能测试、回归测试

---

## Bug Management Loop

**Step 6** includes a potential loop back to **Step 3** (Frontend) or **Step 4** (Backend) for bug fixes:

- If bugs found: Create bug records in Linear → Assign to开发者 → Loop to fix → Verify with Playwright → Close
- If no bugs: Proceed to Step 7 (Product Acceptance)

---

## File Structure

```
src/modules/ai-dev-team/workflows/dev-delivery/
├── workflow.md                              # Main workflow specification
├── workflow-plan-dev-delivery.md            # Detailed workflow plan
├── spec.md                                  # This file
└── steps-c/                                 # Step instruction files
    ├── step-01-task-breakdown.md
    ├── step-02-test-case-design.md
    ├── step-03-frontend-development.md
    ├── step-04-backend-development.md
    ├── step-05-testing-execution.md
    ├── step-06-bug-management.md
    ├── step-07-product-acceptance.md
    ├── step-08-deliver-files.md
    └── step-09-celebration.md
```

---

## Key Features

- 任务细粒度拆解（Story级别）
- Bug管理闭环（发现→分配→修复→验证→关闭）
- Playwright MCP用于自动化测试
- 产品交付时庆祝消息
- 完整的交付包生成

---

_Updated on 2026-02-03 - Workflow complete and ready for use_
