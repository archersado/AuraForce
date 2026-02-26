# AI Dev Team: 协作式AI产研团队

协作式AI产研团队 - 通过多Agent协作实现敏捷开发全流程自动化

Agent and Workflow Configuration for AI Dev Team

---

## Overview

AI Dev Team 是一个协作式AI产研团队模块，通过多AI Agent协作自动完成从需求收集到产品交付的完整敏捷开发流程。模块包含项目经理、产品设计、交互设计、前端开发、后端开发和测试六个专业角色代理，通过细粒度的任务管理和完整的文档协同体系，为软件公司老板和资源有限的小团队提供敏捷、高效、可信任的开发服务。

---

## Installation

```bash
bmad install ai-dev-team
```

---

## Quick Start

1. 安装模块后，向项目经理（PM）提出你的产品需求
2. PM将协调AI团队进行需求分析、产品设计、交互设计、代码研发和测试
3. 在关键里程碑节点（产品评审、交互评审、产品验收）确认进度
4. 获得完整的产品交付（设计文档、代码、测试报告）

**For detailed documentation, see [docs/](docs/).**

---

## Components

### Agents

| Agent | Role | Icon |
|-------|------|------|
| PM | 项目经理 - 需求记录、Backlog管理、任务分配、里程碑汇报 | 📊 |
| Product Designer | 产品设计 - PRD编写、需求分析、用户体验设计 | 🎨 |
| Interaction Designer | 交互设计 - 交互流程设计、原型输出 | 🖌️ |
| Frontend Dev | 前端开发 - 前端架构、UI实现、性能优化 | 💻 |
| Backend Dev | 后端开发 - 后端架构、API设计、数据库设计 | ⚙️ |
| QA | 测试 - 测试用例设计、功能验证、Bug管理 | 🧪 |

### Workflows

**核心工作流（Core Workflows）:**
- 项目创建与需求收集
- 产品设计与评审
- 研发与交付

**特性工作流（Feature Workflows）:**
- 产品评审
- 交互评审
- 任务拆解
- 测试用例设计
- Bug修复与验证

**工具工作流（Utility Workflows）:**
- 项目进度查询
- 文档查看/更新
- 需求变更处理

---

## Configuration

模块支持以下配置选项（安装时设置）：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| project_name | 项目名称 | {directory_name} |
| artifacts_folder | 项目产物存储位置 | {output_folder}/project-artifacts |
| dev_docs_folder | 开发文档存储位置 | dev-docs |

---

## Module Structure

```
ai-dev-team/
├── module.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
├── workflows/
└── _module-installer/
```

---

## Documentation

详细的用户指南和文档，请查看 **[docs/](docs/)** 文件夹：
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Examples](docs/examples.md)

---

## Development Status

本模块目前处于开发阶段。以下组件已规划：

- [ ] Agents: 6个代理（规范已创建，待使用 agent-builder 构建）
- [ ] Workflows: 11个工作流（规范待创建）

详见 TODO.md 了解详细状态。

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
