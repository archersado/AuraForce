# Workflow Specification: doc-view-update

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-04

---

## Workflow Overview

**Goal:** 查看/更新项目文档

**Description:** 用户或团队成员可以查看或更新项目文档。支持查看PRD、交互设计、技术设计、测试用例等文档。文档使用Markdown格式，存储在dev-docs文件夹下。

**Workflow Type:** Utility Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: doc-view-update
description: 文档类型 → 文档内容
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Receive Request | 接收文档查看或更新请求 |
| 2 | Identify Document | 识别目标文档类型（PRD/交互设计/技术设计/测试用例）|
| 3 | View Document | 查看文档内容并展示给用户 |
| 4 | Receive Updates | 如有更新请求，接收修改内容 |
| 5 | Validate Updates | 验证更新内容的合理性 |
| 6 | Update Document | 更新文档内容 |
| 7 | Notify Stakeholders | 如必要，通知相关利益方 |

---

## Workflow Inputs

### Required Inputs

- 文档类型

### Optional Inputs

- 文档更新内容
- 更新原因

---

## Workflow Outputs

### Output Format

- [x] Document-displaying
- [x] Document-updating

### Output Files

- 更新的文档文件

---

## Agent Integration

### Primary Agent

相关角色（文档类型对应的负责角色）

### Other Agents

- PM — 文档管理
- 相关协作角色收到更新通知

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**文档类型:**
- PRD（产品需求文档）- {dev_docs_folder}/prd/
- 交互设计文档 - {dev_docs_folder}/interaction-design/
- 技术设计文档 - {dev_docs_folder}/technical-design/
- 测试用例文档 - {dev_docs_folder}/test-cases/

**文档权限:**
- 任何人都可以查看
- 更新需要相关角色确认（PM或对应文档负责角色）

---

_Spec created on 2026-02-03 via BMAD Module workflow_
