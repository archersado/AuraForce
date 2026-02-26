# Workflows 参考

AI Dev Team 模块包含 11 个工作流，涵盖从项目创建到产品交付的完整敏捷开发流程。

---

## 核心工作流 (Core Workflows)

### project-create-requirement
**项目创建与需求收集**

**前置工作流:** 无（入口工作流）

**后续工作流:** product-design-review

**负责人:** PM

**目标:** 启动新项目并收集用户需求，创建项目文档和 Linear 项目管理结构。

**步骤概览:**
1. 初始化工作流，向用户打招呼
2. 确认需求模式（完整产品需求 / 特定变更需求）
3. 收集需求信息
4. 生成需求/变更文档
5. 设置 Linear 项目/Epic（如果可用）
6. 汇报项目初始化状态

**输出:**
- 需求文档: `{output_folder}/prd/{project_name}-requirements.md`
- Linear 项目和 Epic（如果配置了 Linear MCP）

---

## 特性工作流 (Feature Workflows)

### product-design-review
**产品设计与评审**

**前置工作流:** project-create-requirement

**后续工作流:** interaction-review

**负责人:** Product Designer, PM

**目标:** 分析用户需求并编写 PRD，组织产品评审会议。

**步骤概览:**
1. 加载并分析用户需求
2. 组织产品评审会议
3. 保存 PRD 文档
4. 收集评审反馈
5. 决定评审结果
6. 记录决策
7. 更新 Linear 状态

**输出:**
- PRD 文档: `{dev_docs_folder}/prd/{feature_name}-prd.md`

---

### product-review
**产品评审**

**前置工作流:** product-design-review

**后续工作流:** interaction-review

**负责人:** PM, Product Designer

**目标:** 召集团队评审产品设计，确认产品功能范围。

**步骤概览:**
1. 验证产品设计
2. 召集评审会议
3. 进行评审
4. 收集反馈
5. 确定结果
6. 记录决策
7. 更新 Linear 状态

---

### interaction-review
**交互评审**

**前置工作流:** product-review

**后续工作流:** task-breakdown

**负责人:** Interaction Designer, PM

**目标:** 设计交互流程和原型，组织交互评审会议。

**步骤概览:**
1. 审查产品设计文档
2. 组织交互评审会议
3. 设计交互流程
4. 创建交互原型
5. 进行评审
6. 确定结果
7. 记录决策

**输出:**
- 交互设计文档: `{dev_docs_folder}/interaction-design/{feature_name}-interaction.md`

---

### task-breakdown
**任务拆解**

**前置工作流:** product-design-review, interaction-review

**后续工作流:** dev-delivery

**负责人:** PM, Frontend Dev, Backend Dev

**目标:** 将需求/设计拆分为可执行的 Story 列表。

**步骤概览:**
1. 分析需求和设计文档
2. 识别要实现的功能
3. 为每个功能创建详细的 Story
4. 评估每个 Story 的复杂度
5. 估算每个 Story 的完成时间
6. 将 Story 列表保存到 dev-docs 文件夹
7. 创建 Linear Story 记录

**输出:**
- Story 列表: `{dev_docs_folder}/stories/{feature_name}.md`

---

### test-case-design
**测试用例设计**

**前置工作流:** dev-delivery（开发完成后）

**负责人:** QA

**目标:** 根据需求和设计设计测试用例。

**步骤概览:**
1. 分析需求/设计文档
2. 确定测试矩阵（功能维 × 状态维 × 场景维）
3. 设计测试用例
4. 验证测试覆盖范围
5. 保存测试用例文档

**输出:**
- 测试用例文档: `{dev_docs_folder}/test-cases/{feature_name}-test-cases.md`

---

### bug-fix-verify
**Bug 修复与验证**

**前置工作流:** 任何发现 Bug 的工作流（测试、用户反馈）

**负责人:** PM, QA, Frontend/Backend Dev

**目标:** Bug 环境开辟、修复、验证的完整闭环。

**步骤概览:**
1. QA 发现并报告 Bug
2. QA 开辟 Bug 测试环境并重现 Bug
3. QA 记录 Bug 详情
4. QA 识别受影响的组件（前端/后端）
5. PM 在 Linear 上创建 Bug Story
6. PM 分配 Bug 给开发人员
7. 开发人员修复 Bug
8. QA 使用 Playwright 重新测试
9. 确定修复结果（成功/失败，失败则回步骤 7）
10. PM 在 Linear 上关闭 Bug

**输出:**
- Bug 报告: `{artifacts_folder}/bugs/{bug_id}-report.md`

---

## 工具工作流 (Utility Workflows)

### dev-delivery
**研发与交付**

**前置工作流:** task-breakdown

**负责人:** Frontend Dev, Backend Dev, QA

**目标:** 执行开发任务，进行测试，最终交付。

**步骤概览:**
1. 分析 Story 列表
2. 前端开发
3. 后端开发
4. 联调测试
5. QA 测试
6. 生成测试报告
7. 交付产品

---

### project-progress-query
**项目进度查询**

**负责人:** PM

**目标:** 查询和汇报项目当前进度和状态。

**步骤概览:**
1. 加载项目状态
2. 查询 Linear 状态（如果可用）
3. 生成进度报告
4. 汇报给用户

---

### doc-view-update
**文档查看/更新**

**负责人:** 任何 Agent

**目标:** 查看或更新项目文档。

**步骤概览:**
1. 选择文档类型
2. 查看现有内容
3. 更新文档（如果需要）

---

### requirement-change
**需求变更处理**

**负责人:** PM, Product Designer

**目标:** 处理用户提出的需求变更。

**步骤概览:**
1. 收集变更需求
2. 评估变更影响
3. 更新相关文档
4. 通知团队调整计划
5. 更新 Linear（如果可用）

---

## 工作流链

```
project-create-requirement
         │
         ▼
product-design-review ──► product-review
         │
         ▼
interaction-review
         │
         ▼
task-breakdown
         │
         ▼
dev-delivery
         │
         ├──► QA 测试 ──► test-case-design
         │
         └──► 产品交付


[工具工作流 - 可随时调用]
├── project-progress-query (查询进度)
├── doc-view-update (查看/更新文档)
├── requirement-change (需求变更)
└── bug-fix-verify (Bug 修复)
```

---

## 快速参考

| 工作流 | 命令 | 角色 | 用途 |
|--------|------|------|------|
| project-create-requirement | [PC] | PM | 创建新项目 |
| product-design-review | [PD] | Product Designer | 设计产品 |
| product-review | [PR] | PM | 产品评审 |
| interaction-review | [IR] | Interaction Designer | 交互设计 |
| task-breakdown | [TB] | PM | 任务拆解 |
| dev-delivery | [FD]/[BD] | Frontend/Backend Dev | 研发 |
| test-case-design | [TD] | QA | 设计测试 |
| bug-fix-verify | [BF]/[BB] | Frontend/Backend Dev | 修复 Bug |
| project-progress-query | [PR] | PM | 查询进度 |
| doc-view-update | - | 任何 Agent | 查看文档 |
| requirement-change | [RC] | PM | 需求变更 |

---

## 外部集成

### Linear MCP

用于项目管理和任务跟踪：
- 创建项目和 Epic
- 创建 Story 记录
- 分配任务
- 追踪状态
- 关闭 Bug

### Playwright MCP

用于自动化测试：
- 渲染页面
- 捕获截图
- 执行测试
- 验证修复

### 绘图 MCP (Excalidraw / Draw.io)

用于设计可视化：
- 创建交互流程图
- 创建 API 架构图
- 创建数据库 ER 图
- 创建原型图
