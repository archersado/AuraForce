# Workflow Specification: interaction-review

**Module:** ai-dev-team
**Status:** Created — Workflow successfully built and deployed
**Created:** 2026-02-03
**Completed:** 2026-02-03

---

## Workflow Overview

**Goal:** 交互设计完成后的研发评审

**Description:** Interaction Designer完成交互设计和原型后，PM召集产品设计团队和研发团队进行交互评审。产品角度评估交互是否符合需求，研发角度评估技术可行性。用户确认后，交互设计定稿并保存到文档库。

**Workflow Type:** Feature Workflow

---

## Workflow Structure

### Entry Point

```yaml
---
name: interaction-review
description: 交互设计 → 技术评估 → 评审结果
web_bundle: true
installed_path: '{project-root}/_bmad/ai-dev-team/workflows/interaction-review'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Verify Interaction Design | 交互设计完成，准备评审 |
| 2 | Call Review Meeting | PM召集Interaction Design参与者 |
| 3 | Conduct Review | Product Designer验证需求一致性，Dev评估技术可行性 |
| 4 | Collect Feedback | 收集各方反馈意见 |
| 5 | Determine Result | 交互设计通过、需修改或需重做 |
| 6 | Record Decisions | 记录评审决定和行动项 |
| 7 | Save Design Files | 保存交互设计稿到artifacts文件夹 |
| 8 | Update Linear Status | 更新Linear Story状态 |

---

## Workflow Inputs

### Required Inputs

- 完成的交互设计文档/原型（由Interaction Designer）
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

- `{artifacts_folder}/designs/interaction/*` — 交互设计文件
- 评审会议记录文档
- Linear状态更新

---

## Agent Integration

### Primary Agent

PM (项目经理) — 召集评审会议、记录决定、更新状态

### Other Agents

- Interaction Designer — 展示设计、回应反馈
- Product Designer — 验证交互与需求一致性
- Frontend Dev — 前端实现可行性评估
- Backend Dev — 后端实现可行性评估
- QA — 测试场景评估

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

**Key Features:**
- PM协调产品+研发双方评审
- 交互设计保存到artifacts文件夹
- 用户确认是关键里程碑

**MCP Tools Used:**
- Linear MCP — 更新Story/Task状态
- 绘图 MCP — 交互设计图、流程图

---

_Spec created on 2026-02-03 via BMAD Module workflow_
