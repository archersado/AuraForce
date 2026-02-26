# Workflow Specification: bug-fix-verify

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-04

---

## Workflow Overview

**Goal:** Bug环境开辟、修复、验证的完整闭环

**Description:** QA发现Bug后，开辟Bug测试环境，记录Bug详情。PM将Bug分配给对应的开发角色（Frontend Dev或Backend Dev）。开发人员修复Bug，QA重新测试。Bug状态由PM全程追踪管理。修复通过后Bug关闭。

**Workflow Type:** Feature Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: bug-fix-verify
description: Bug → 开发修复 → 测试验证 → 关闭
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Discover Bug | QA发现Bug |
| 2 | Create Bug Environment | 使用Playwright开辟Bug环境并复现Bug |
| 3 | Record Bug | 记录Bug详情（复现步骤、期望行为、实际行为）|
| 4 | Identify Affected Component | 确定是前端还是后端Bug |
| 5 | Create Bug Story | PM创建Bug Story |
| 6 | Assign Bug to Dev | 分配给Frontend Dev或Backend Dev |
| 7 | Developer Fix | 开发人员修复Bug |
| 8 | QA Verification | QA使用Playwright重新测试 |
| 9 | Determine Result | 修复通过或继续修复循环 |
| 10 | Close Bug | 修复通过，PM关闭Bug状态 |

---

## Workflow Inputs

### Required Inputs

- Bug报告（来自测试或用户）

---

## Workflow Outputs

### Output Format

- [x] Non-document
- [x] Status-updating

### Output Files

- Linear Bug Story（通过Linear MCP创建和更新）
- Bug报告文档

---

## Agent Integration

### Primary Agent

PM (项目经理) — 创建Bug Story、分配任务、追踪状态、关闭Bug

### Other Agents

- QA — 发现Bug、开辟环境、验证修复
- Frontend Dev（如涉及） — 修复前端Bug
- Backend Dev（如涉及） — 修复后端Bug

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**Bug管理闭环:**
```
Bug发现 → 分配给研发 → 开发修复 → QA验证
    ↑                                    ↓
    └────── 通过？关闭 ←── 未通过：重新修复
```

**Bug状态:**
- 新建 → 分配给研发 → 进行中 → 已修复 → 待验证 → 已关闭

**MCP Tools Used:**
- Linear MCP — 创建Bug Story、追踪状态
- Playwright MCP — Bug环境开辟、测试验证

---

_Spec created on 2026-02-03 via BMAD Module workflow_
