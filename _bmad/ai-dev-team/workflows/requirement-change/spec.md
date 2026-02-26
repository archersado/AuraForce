# Workflow Specification: requirement-change

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-04

---

## Workflow Overview

**Goal:** 处理用户提出的需求变更

**Description:** 用户在项目过程中提出需求变更请求。PM评估变更对项目的影响，包括对已完成工作、未完成任务的影响评估。PM给出变更建议，确认变更后更新Epic和Story列表。PM主动汇报变更处理结果。

**Workflow Type:** Utility Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: requirement-change
description: 变更请求 → 影响评估 → 变更计划
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/requirement-change'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Receive Change Request | 接收用户变更请求 |
| 2 | Analyze Current State | 查询当前项目状态（已完成/进行中的任务）|
| 3 | Assess Impact | 评估变更对已做工作的影响 |
| 4 | Assess Feasibility | 评估变更的技术可行性 |
| 5 | Provide Recommendations | PM给出变更建议（接受/拒绝/调整）|
| 6 | Confirm with User | 用户确认变更决定 |
| 7 | Update Linear | 使用Linear MCP更新Epic和Story |
| 8 | Report Results | PM向用户汇报变更处理结果 |

---

## Workflow Inputs

### Required Inputs

- 需求变更请求

---

## Workflow Outputs

### Output Format

- [x] Status-updating
- [x] Report-producing

### Output Files

- Linear Epic/Story更新
- 变更处理报告

---

## Agent Integration

### Primary Agent

PM (项目经理) — 评估影响、给出建议、更新状态、汇报结果

### Other Agents

- Product Designer — 技术可行性评估
- Interaction Designer — 影响评估

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**变更评估包括:**
- 对已完成功能的影响
- 对未完成任务的影响
- 技术可行性
- 时间影响
- 资源影响

**PM口头禅（可选）:**
- "这个变更可以接受，影响不大"
- "这个变更会影响已完成的X功能，需要重新评估"
- "这个变更比较复杂，建议推迟到下一版本"

**MCP Tools Used:**
- Linear MCP — 查询当前状态、更新Epic和Story

---

_Spec created on 2026-02-03 via BMAD Module workflow_
