# Workflow Specification: project-create-requirement

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-03

---

## Workflow Overview

**Goal:** 启动新项目并收集用户需求，创建项目文档和Linear项目管理结构

**Description:** 用户向项目经理（PM）提出产品需求，PM记录需求并创建项目。PM使用Linear MCP在Linear上创建项目、Epic和初始Story。项目基础文档（需求文档）被创建并存储在dev-docs文件夹。

**Workflow Type:** Core Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: project-create-requirement
description: 启动新项目，收集用户需求，创建项目文档和Linear项目结构
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/project-create-requirement'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Record Requirements | PM记录用户提出的产品需求 |
| 2 | Analyze Requirements | 分析需求，识别核心功能和范围 |
| 3 | Create Project Documents | 创建项目基础文档 |
| 4 | Setup Linear Project | 使用Linear MCP创建项目、Epic、Story |
| 5 | Create Backlog | 创建初始Backlog（任务列表） |
| 6 | Report Status | 向用户汇报项目初始化状态 |

---

## Workflow Inputs

### Required Inputs

- 用户需求描述（口头或书面）
- 项目基本信息（如名称、范围）

### Optional Inputs

- 技术约束
- 时间约束
- 其他限制条件

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{dev_docs_folder}/prd/requirements.md` — 需求文档
- Linear Epic（通过Linear MCP创建）
- Linear Stories（通过Linear MCP创建）

---

## Agent Integration

### Primary Agent

PM (项目经理) — 负责需求收集、记录、项目初始化

### Other Agents

无（主要阶段为PM）

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**Key Features:**
- 使用 Linear MCP 集成创建项目和任务
- 需求文档使用 Markdown 格式
- 像对待老板一样的汇报风格

**MCP Tools Used:**
- Linear MCP — 创建Epic、Story

---

_Spec created on 2026-02-03 via BMAD Module workflow_
