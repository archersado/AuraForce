# App Creator Module

智能应用程序创建助手模块，帮助你从零开始构建、验证和实现MVP产品。

## 模块概述

App Creator是一个集成的BMAD模块，提供从创意生成到代码实现的完整工作流程。我们的专业代理团队将引导你完成产品定义、市场研究、用户体验设计和技术架构的每个阶段。

## 模块目标

帮助用户：
- 将创意转化为清晰的产品需求
- 验证市场需求和可行性
- 创建出色的用户体验设计
- 设计可扩展的技术架构
- 获得代码实现的详细指导

## 专业代理团队

| 代理 | 角色 | 图标 | 核心能力 |
|-----|------|------|---------|
| **Chen** | 产品策略专家 | 🎯 | 产品定义、价值主张、需求优先级 |
| **Nova** | 市场研究专家 | 📊 | 竞品分析、市场调研、用户洞察 |
| **Alex** | 商业分析师 | 📋 | 需求文档、功能规格、用户故事 |
| **Luna** | UX/UI设计师 | 🎨 | 用户体验、界面设计、交互设计 |
| **Atlas** | 技术架构师 | 🏗️ | 技术选型、系统架构、代码实现 |

## 工作流程

```
创意生成 → 产品定义 → 市场研究 → 需求分析 → 用户体验设计 → 技术架构 → 代码实现
    ↓           ↓           ↓           ↓              ↓              ↓          ↓
   Chen       Chen       Nova        Alex          Luna          Atlas       Atlas
```

### 可用工作流

1. **Idea Validation (创意验证)** - 验证创意并定义产品方向
2. **Product Definition (产品定义)** - 生成完整的产品需求文档
3. **Market Research (市场研究)** - 进行市场调研和竞争分析
4. **Project Planning (项目规划)** - 制定项目计划和时间表
5. **Design Sprint (设计冲刺)** - 创建用户体验和界面设计
6. **Tech Architecture (技术架构)** - 设计系统架构和技术方案
7. **MVP Builder Master (MVP构建)** - 端到端MVP构建流程
8. **MVP Implementation (MVP实现)** - 提供代码实现指导

## 快速开始

### 1. 与代理对话
使用 `bmad:start` 命令启动任何代理进行交互：

```bash
# 启动产品策略专家
bmad:start chen

# 启动市场研究专家
bmad:start nova

# 启动商业分析师
bmad:start alex

# 启动UX/UI设计师
bmad:start luna

# 启动技术架构师
bmad:start atlas
```

### 2. 运行完整工作流
使用 `bmad:start` 命令运行完整工作流：

```bash
# 运行创意验证工作流
bmad:start idea-validation

# 运行产品定义工作流
bmad:start product-definition

# 运行市场研究工作流
bmad:start market-research

# 运行完整的MVP构建工作流
bmad:start mvp-builder-master
```

### 3. 使用Party Mode
启动Party Mode让所有代理一起头脑风暴：

```bash
bmad:party
```

## 模块功能

### 产品发现阶段
- 创意生成和头脑风暴
- 产品定位和价值主张
- 目标用户和细分市场
- MVP功能范围定义

### 市场验证阶段
- 竞品分析和差距识别
- 市场机会评估
- 用户需求调研
- 商业模式设计

### 产品设计阶段
- 需求分析和功能规格
- 用户故事和验收标准
- 用户体验流程设计
- 原型和线框图制作

### 技术实现阶段
- 技术栈选型和评估
- 系统架构设计
- 数据库设计
- API接口规范

## 配置选项

### 用户技术配置
```yaml
user_configuration:
  coding_preference:
    options:
      - "详细指导" (Detailed Guidance)
      - "代码模板" (Code Templates)
      - "完整代码" (Full Code Generation)
  tech_stack_preference:
    options:
      - React + Node.js
      - Vue + Python
      - Next.js Full Stack
      - Custom Tech Stack
  deployment_preference:
    options:
      - Vercel/Netlify
      - AWS/GCP
      - Docker/Kubernetes
      - Custom Infrastructure
```

## 输出文件

所有工作流的输出将保存在 `_bmad-output/` 目录：

```
_bmad-output/
├── prd-*.md                 # 产品需求文档
├── market-*.md              # 市场研究报告
├── architecture-*.md        # 技术架构文档
├── design-*.md              # 用户体验设计文档
└── origin-product-asset/    # 原始产品资产
```

## 模块安装

确保已安装BMAD CLI，然后：

```bash
# 启用App Creator模块
bmad:module-enable app-creator

# 验证安装
bmad:list-modules
```

## 版本历史

### v1.0.0 (当前版本)
- 5个专业代理
- 8个完整工作流
- 完整的产品开发流程
- Party Mode支持

## 贡献指南

欢迎贡献！如果你有改进建议或发现了问题，请创建Issue或Pull Request。

## 许可证

MIT License

## 联系方式

如有问题或需要支持，请联系开发团队。