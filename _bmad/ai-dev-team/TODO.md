# TODO: AI Dev Team: 协作式AI产研团队

ai-dev-team 模块开发路线图。

---

## Agents to Build

- [ ] **PM (项目经理)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/pm.spec.md`

- [ ] **Product Designer (产品设计)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/product-designer.spec.md`

- [ ] **Interaction Designer (交互设计)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/interaction-designer.spec.md`

- [ ] **Frontend Dev (前端开发)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/frontend-dev.spec.md`

- [ ] **Backend Dev (后端开发)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/backend-dev.spec.md`

- [ ] **QA (测试)**
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/qa.spec.md`

---

## Workflows to Build

- [ ] **project-create-requirement** (项目创建与需求收集)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/project-create-requirement/spec.md` ✓

- [ ] **product-design-review** (产品设计与评审)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/product-design-review/spec.md` ✓

- [ ] **dev-delivery** (研发与交付)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/dev-delivery/spec.md` ✓

- [ ] **product-review** (产品评审)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/product-review/spec.md` ✓

- [ ] **interaction-review** (交互评审)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/interaction-review/spec.md` ✓

- [ ] **task-breakdown** (任务拆解)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/task-breakdown/spec.md` ✓

- [ ] **test-case-design** (测试用例设计)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/test-case-design/spec.md` ✓

- [ ] **bug-fix-verify** (Bug修复与验证)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/bug-fix-verify/spec.md` ✓

- [ ] **project-progress-query** (项目进度查询)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/project-progress-query/spec.md` ✓

- [ ] **doc-view-update** (文档查看/更新)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/doc-view-update/spec.md` ✓

- [ ] **requirement-change** (需求变更处理)
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/requirement-change/spec.md` ✓

---

## Installation Testing

- [ ] 使用 `bmad install` 测试安装
- [ ] 验证 module.yaml 提示正确工作
- [ ] 测试 installer.js（如果存在）
- [ ] 测试IDE特定处理器（如果存在）

---

## Documentation

- [ ] 使用使用示例完善 README.md
- [ ] 在 docs/ 文件夹添加更多指南
- [ ] 添加故障排除部分
- [ ] 记录配置选项

---

## MCP Integration

- [ ] 集成 Linear MCP（项目管理）
- [ ] 集成 Playwright MCP（测试）
- [ ] 集成绘图 MCP（Excalidraw/Draw.io）

---

## Next Steps

1. 使用 create-agent 工作流构建代理
2. 使用 create-workflow 工作流构建工作流
3. 测试安装和功能
4. 根据测试结果迭代

---

_Last updated: 2026-02-03_
