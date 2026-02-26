# Workflow Specification: product-review

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-03

---

## Workflow Overview

**Goal:** 产品设计完成后的多方评审

**Description:** Product Designer完成产品设计后，PM召集Interaction Designer、Frontend Dev、Backend Dev、QA进行产品评审会议。各方从不同角度评估设计方案，提出反馈意见。评审结果被记录，如需修改則PM驱动Product Designer进行调整。

**Workflow Type:** Feature Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: product-review
description: 设计文档 → 评审会议 → 评审结果
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/product-review'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Verify Product Design | PRD完成，准备评审 |
| 2 | Call Review Meeting | PM召集Product Design参与者 |
| 3 | Conduct Review | Interaction Designer、Frontend Dev、Backend Dev、QA评估设计 |
| 4 | Collect Feedback | 收集各方反馈意见 |
| 5 | Determine Result | 设计方案通过、需修改或需重做 |
| 6 | Record Decisions | 记录评审决定和行动项 |
| 7 | Update Linear Status | 更新Linear Story状态 |

---

## Workflow Inputs

### Required Inputs

- 完成的PRD文档（由Product Designer）
- 评审邀请

### Optional Inputs

- 特殊关注点
- 技术约束

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- 评审会议记录文档
- Linear状态更新

---

## Agent Integration

### Primary Agent

PM (项目经理) — 召集评审会议、记录决定、更新状态

### Other Agents

- Product Designer — 展示设计、回应反馈
- Interaction Designer — UX角度评估
- Frontend Dev — 前端可实施性评估
- Backend Dev — 后端可实施性评估
- QA — 测试角度评估

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**Key Features:**
- PM协调多方评审
- 评审结果驱动后续行动（通过/修改/重做）
- Linear状态同步

**MCP Tools Used:**
- Linear MCP — 更新Story/Task状态
- 绘图 MCP（可选）- 用于评审时展示原型

---

_Spec created on 2026-02-03 via BMAD Module workflow_
