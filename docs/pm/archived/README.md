# 已归档项目

本目录包含 AuraForce 项目已完成的 Epic、Story 和其他相关文档，以及从 _bmad-output 归档的项目文档。

## 📦 归档原则

### 归档条件
- Epic 已完成并通过验收
- Story 已上线并稳定运行
- Sprint 已完成并复盘结束
- 相关文档已完整整理
- 项目文档和分析报告从 _bmad-output 归档

### 归档流程
1. 确认完成并通过验收
2. 更新项目追踪和总结
3. 整理相关文档和数据
4. 移动到归档目录
5. 更新归档索引

---

## 📂 归档目录结构

```
archived/
├── README.md                    # 本文件：归档索引
├── SUMMARY.md                   # 归档总结报告（待创建）
├── epics/                       # 已完成的 Epic
├── stories/                     # 已完成的 Story
├── sprints/                     # 已完成的 Sprint
└── reviews/                     # 复盘和总结
    ├── code-review-report.md        # 代码审查报告
    └── testarch-nfr-assessment.md    # 测试非功能需求评估
```

---

## 📋 归档模板

### Epic 归档模板

```markdown
# EPIC-[序号]: [Epic 标题] (已完成)

## 基本信息
- **Epic ID**: EPIC-[序号]
- **标题**: [标题]
- **状态**: ✅ 已完成
- **开始日期**: YYYY-MM-DD
- **完成日期**: YYYY-MM-DD
- **负责团队**: [团队名称]

## 概述（从原 Epic 复制）
[Epic 的概述]

## 完成情况

### Story 完成情况
| Story ID | 标题 | 计划时间 | 实际时间 | 状态 |
|----------|------|----------|----------|------|
| STORY-001 | 标题 | X 天 | X 天 | ✅ 完成 |
| STORY-002 | 标题 | X 天 | X 天 | ✅ 完成 |

### 统计
- **计划 Story 数**: X
- **完成 Story 数**: X
- **完成率**: X%
- **计划时间**: X 天
- **实际时间**: X 天
- **偏差**: +X / -X 天

## 成果
- [ ] [成果 1]
- [ ] [成果 2]
- [ ] [成果 3]

## 经验总结

### 做得好的
1. [好的地方]
2. [好的地方]

### 遇到的问题
1. [问题描述]
   - 原因: [原因]
   - 解决: [解决方法]

### 改进建议
1. [建议]

## 文档归档位置
- Epic 文档: `archived/epics/EPIC-[序号]-xxx.md`
- Story 文档: `archived/stories/` (相关 Story)
- 设计文档: `archived/reviews/EPIC-[序号]-review.md`
```

---

## 📊 归档统计

### 从 _bmad-output 归档的文档

#### 项目文档
- **AuraForce-MVP构建完成总结.md** - MVP 构建完成总结
- **AuraForce-项目战略蓝图.md** - 项目战略蓝图
- **project-context.md** - 项目上下文文档
- **bmm-workflow-status.yaml** - BMM 工作流状态

#### 技术评估
- **code-review-report.md** - 代码审查报告
- **testarch-nfr-assessment.md** - 测试非功能需求评估

#### 项目 Artifacts
- **implementation-artifacts/** - 实现相关文档
- **planning-artifacts/** - 计划相关文档
- **project-planning-artifacts/** - 项目规划文档
- **analysis/** - 分析文档

**统计：**
- 文档数：50+
- 目录数：4
- 归档时间：2025-02-02

### Epic 归档统计
| 年份 | Q1 | Q2 | Q3 | Q4 | 总计 |
|------|----|----|----|----|------|
| 2025 | 0 | 0 | 0 | 0 | 0 |

### Story 归档统计
| 年份 | Q1 | Q2 | Q3 | Q4 | 总计 |
|------|----|----|----|----|------|
| 2025 | 0 | 0 | 0 | 0 | 0 |

---

## 🚀 归档操作步骤

### Epic 归档
1. 确认 Epic 已完成
2. 更新 Epic 文档为归档模板
3. 移动 Epic 文档到 `archived/epics/`
4. 归档相关 Story 到 `archived/stories/`
5. 撰写 Epic 复盘到 `archived/reviews/`
6. 更新本 README 的归档列表

### Story 归档
1. 确认 Story 已完成并通过验收
2. 更新 Story 文档为归档模板
3. 移动 Story 文档到 `archived/stories/`
4. 更新归档索引

---

## 🔍 查找归档

### 按时间查找
- 2025 Q1: `archived/2025-q1-summaray.md`

### 按 Epic 查找
- Epic 列表: `archived/epics/README.md`

### 按 Story 查找
- Story 列表: `archived/stories/README.md`

### 查找 _bmad-output 归档
- 项目文档: 在归档根目录
- 技术评估: `archived/reviews/`
- 项目 Artifacts: 在相应子目录

---

## 📝 归档清单

### 从 _bmad-output 归档

#### 项目文档
| 文件 | 大小 | 状态 |
|------|------|------|
| AuraForce-MVP构建完成总结.md | 9.4KB | ✅ 已归档 |
| AuraForce-项目战略蓝图.md | 13.4KB | ✅ 已归档 |
| project-context.md | 17.2KB | ✅ 已归档 |
| bmm-workflow-status.yaml | 1.6KB | ✅ 已归档 |

#### 技术评估
| 文件 | 大小 | 状态 |
|------|------|------|
| code-review-report.md | 9.1KB | ✅ 已归档 |
| testarch-nfr-assessment.md | 11.8KB | ✅ 已归档 |

#### 项目 Artifacts
| 目录 | 文件数 | 状态 |
|------|--------|------|
| implementation-artifacts/ | ？ | ✅ 已归档 |
| planning-artifacts/ | ？ | ✅ 已归档 |
| project-planning-artifacts/ | ？ | ✅ 已归档 |
| analysis/ | ？ | ✅ 已归档 |

#### Epic 归档列表
| ID | 标题 | 完成日期 | 负责人 | 复盘报告 |
|----|------|----------|--------|----------|
| - | - | - | - | - |

#### Story 归档列表
| ID | 标题 | Epic | 完成日期 |
|----|------|------|----------|
| - | - | - | - |

---

## 🔗 相关链接

- [任务拆解](../tasks/README.md) - 活跃中的任务
- [项目追踪](../tracking/README.md) - 当前项目进度
- [归档总结](./SUMMARY.md) - 完整的归档总结报告

---

## 📚 相关归档

### 其他归档位置
- **产品设计归档**: `../product/prd/prd-bmad-original.md`
- **产品设计归档**: `../product/design/` - UX 设计文档和图表
- **架构设计归档**: `../../architecture/design/` - 系统架构文档
- **开发 Epic 归档**: `../../development/epic/epics-bmad-original.md`

---

**最后更新：** 2025-02-02
**归档数：** _bmad-output 归档 50+ 个文件和目录; 0 Epic, 0 Story
**归档状态：** _bmad-output 文档已完全归档
