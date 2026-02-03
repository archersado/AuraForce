# PM & Linear 集成工作流程

**AuraForce 项目管理体系 + Linear 项目管理集成**

---

## 📋 概述

将 AuraForce 项目的 PM 管理体系与 Linear 项目管理无缝集成，实现：
- ✅ 任务创建时自动创建 Linear Issue
- ✅ 任务状态更新同步到 Linear Issue
- ✅ PM 文档与 Linear Issue 双向同步
- ✅ 完整的项目追踪和状态管理

---

## 🎯 Linear 项目集成配置

### Linear 项目信息
- **项目名称：** auraforce
- **项目 URL：** https://linear.app/archersado/project/auraforce-d9703902f025
- **项目 ID：** de0f9c3e-e112-4021-b484-d48f5af226f3
- **团队 ID：** 7964a781-528b-43cf-8b8c-0acbb479dd0a

### Linear 工具

**关键 Linear MCP 工具：**
- `linear.create_issue` - 创建 Issue
- `linear.update_issue` - 更新 Issue 状态
- `linear.get_issue` - 获取 Issue 详情
- `linear.list_issues` - 列出 Issues

---

## 📝 创建需求时自动创建 Linear Issue

### 工作流程

```
用户提出需求
    ↓
PM 创建需求 Story (REQ-XXX)
    ↓
PM 自动创建对应的 Linear Issue
    ↓
Linear Issue ID 记录在需求文档中
    ↓
后续所有更新都同步到 Linear
```

### 创建需求 Story 时添加 Linear 信息

在 `docs/pm/requirements/REQ-XXX-[标题].md` 中添加：

```markdown
# REQ-XXX: [需求标题]

## Linear 集成
- **Linear Project:** auraforce (https://linear.app/archersado/project/auraforce-d9703902f025)
- **Linear Issue ID:** 创建后填入（format: AUR-XXX）
- **同步状态：** 待创建 → 已创建 → 同步中 → 已同步
```

### PM 创建 Linear Issue 的规范

**时机：** 在创建需求 Story 后立即创建 Linear Issue

**Issue 信息：**
- **标题：** `[REQ-XXX] 需求标题`
- **标签：** 根据需求类型（Feature/Bug/Improvement）
- **状态：** Backlog
- **描述：** 包含需求描述、接受标准

---

## 🔄 任务状态同步

### 任务状态 → Linear Issue 状态映射

| PM 任务状态 | Linear Issue 状态 | 说明 |
|-------------|------------------|------|
| 待开发 | Backlog | 任务在待办列表 |
| 开发中 | In Progress | 任务正在开发 |
| 测试中 | In Review | 任务在测试/评审 |
| 已完成 | Done | 任务已完成 |

### 同步触发时机

**PM 在以下情况更新 Linear Issue：**
1. ✅ 创建新的需求时
2. ✅ Story 状态变更时
3. ✅ Task 状态变更时
4. ✅ Story 完成时
5. ✅ Epic 完成时

---

## 📋 集成模板

### 需求 Story 模板（增加 Linear 部件）

```markdown
# REQ-XXX: [需求标题]

## 需求类型
- 类型: 用户需求 / 产品需求 / 技术需求
- 优先级: P0 / P1 / P2 / P3
- 状态: 待评审 / 已评审 / 开发中 / 已完成 / 已拒绝
- 提出日期: YYYY-MM-DD

## Linear 集成
- **Linear Project:** auraforce
- **Linear Issue URL:** 创建后填入 (https://linear.app/archersado/issue/AUR-XXX)
- **Linear Issue ID:** AUR-XXX
- **同步状态:** 已创建 ✅
- **最后同步时间:** YYYY-MM-DD HH:MM

## 需求描述
[需求的详细描述]

## 用户价值
[描述这个需求对用户的价值]

## 接受标准 (Acceptance Criteria)
- [ ] 标准 1
- [ ] 标准 2
- [ ] 标准 3

## 依赖项
- 前置需求：[需求 ID]
- 相关需求：[需求 ID]

## 估算
- 开发估算：X 天
- 测试估算：X 天
- 总估算：X 天

## 备注
[其他注意事项]
```

---

## 🔒 PM 角色任务（增加 Linear 同步）

### PM 的 Linear 集成职责

**增加的职责：**

1. **Issue 管理**
   - 创建需求时同时创建 Linear Issue
   - 任务状态更新时同步到 Linear
   - 定期检查 Linear Issue 状态

2. **状态同步**
   - 记录 Linear Issue ID
   - 更新同步时间戳
   - 维护 PM 文档 ↔ Linear Issue 的双向同步

3. **追踪和报告**
   - 定期生成 PM → Linear 同步报告
   - 标记同步问题
   - 处理同步异常

---

## 📝 PM 创建 Linear Issue 的步骤

### 步骤 1: 创建需求文档

创建 `docs/pm/requirements/REQ-[序号]-[标题].md`

### 步骤 2: 创建 Linear Issue

```bash
# 使用 mcporter 创建
mcporter call linear.create_issue \
  title="需求标题" \
  description="需求描述" \
  label="Feature"  # Feature / Bug / Improvement
```

### 步骤 3: 记录 Linear Issue 信息

更新需求文档，填入：
- `Linear Issue ID`
- `Linear Issue URL`
- `同步状态`

### 步骤 4: 验证同步

```bash
# 获取 Issue 详情验证
mcporter call linear.get_issue issue_id="AUR-XXX"
```

### 步骤 5: 更新 PM 工作流文档

更新 PM 的工作日志，记录 Linear 同步

---

## 🔄 状态自动同步流程

### 当 Story/Task 状态变更时

```javascript
// 伪代码：状态同步逻辑
function updateStatus(task, newStatus) {
  // 1. 更新任务文档状态
  updateTaskDocument(task, newStatus);
  
  // 2. 映射到 Linear 状态
  const linearStatus = mapStatus(newStatus);
  
  // 3. 更新 Linear Issue
  mcporter.call('linear.update_issue', {
    issueId: task.linearIssueId,
    stateId: linearStatus
  });
  
  // 4. 记录同步时间
  updateSyncTime(task);
}
```

### 状态映射函数

```typescript
function mapStatus(pmStatus: string): string {
  const statusMap = {
    '待开发': 'Backlog',
    '开发中': 'In Progress',
    '测试中': 'In Review',
    '已完成': 'Done',
    '已拒绝': 'Canceled'
  };
  return statusMap[pmStatus] || 'Backlog';
}
```

---

## 📊 同步追踪和报告

### 同步状态追踪

在 `docs/pm/tracking/` 创建同步报告文件：`SYNC_REPORT.md`

包含：
- 所有任务的 Linear Issue ID
- PM 状态 ↔ Linear 状态对比
- 同步历史和问题记录

### 定期同步检查

**PM 应该定期检查同步状态：**

- **每天检查** - 高优先级任务的同步状态
- **每周检查** - 所有任务的同步状态
- **每月检查** - 归档前的同步验证

### 异常处理

**当同步失败时：**

1. 记录错误日志
2. 在 PM 工作日志中标记同步问题
3. 尝试重新同步
4. 如无法解决，标记为"同步失败"并记录原因

---

## 💡 使用示例

### 示例 1: 创建新需求并同步到 Linear

**1. 创建需求文档：**
```
docs/pm/requirements/REQ-001-user-auth.md
```

**2. 创建 Linear Issue：**
```bash
mcporter call linear.create_issue \
  title="[REQ-001] 用户认证功能" \
  description="..." \
  label="Feature"
```

**3. 记录信息：**
- Linear Issue URL: https://linear.app/archersado/issue/AUR-123
- 线性 Issue ID: AUR-123
- 同步状态: 已创建

---

### 示例 2: 任务状态变更同步

**Story 状态变更为"开发中"：**

1. 更新任务文档状态为"开发中"
2. PM 调用 `linear.update_issue`：
   ```bash
   mcporter call linear.update_issue \
     issue_id="AUR-123" \
     state_id="In Progress" \
     assignee_id="user-id"
   ```
3. 更新同步记录

---

## 📁 文档组织

### Linear 集成相关的文档结构

```
docs/pm/
├── linear/                     # Linear 集成专用目录
│   ├── issue-mapping.md        # PM 文档 ↔ Linear Issue 映射
│   ├── sync-report.md          # 同步报告
│   └── issues/                # Linear Issue 文件（可选择）
│       ├── AUR-001.md
│       ├── AUR-002.md
│       └── ...
├── requirements/              # 需求文档
│   ├── REQ-001-xxx.md         # 包含 Linear Issue 信息
│   └── ...
└── tracking/                  # 项目追踪
    ├── sync-report.md         # 同步报告
    └── linearsync.md          # Linear 同步日志
```

---

## 🎯 最佳实践

### 1. 命名约定

**PM 文档命名：** `REQ-XXX-[标题].md`  
**Linear Issue 标题：** `[REQ-XXX] [标题]`

这样便于双向追踪和管理

### 2. 记录完整的映射信息

在 PM 文档中始终记录：
- Linear Issue ID
- Linear Issue URL
- 最后同步时间
- 同步状态

### 3. 及时同步

- ✅ 任务状态变更后**立即同步**到 Linear
- ✅ 每日检查同步状态
- ✅ 保持 PM 文档和 Linear Issue 状态一致

### 4. 双向管理

- PM 文档 ←→ Linear Issue
- Linear Issue ←→ PM 状态更新
- 避免信息不一致

---

## 📊 性能和可靠性

### 同步优化

- **批量创建** - 创建多个需求时批量同步
- **异步更新** - 使用异步调用，避免阻塞
- **错误重试** - 失败时自动重试（最多 3 次）

### 可靠性

- **幂等性** - 重复创建 Issue 不会重复
- **版本控制** - PM 文档和 Linear 都记录变更历史
- **审计日志** - 所有同步操作都有日志

---

## 🔄 完整工作流程示例

### 场景：创建一个新功能需求

**步骤 1: 用户提出需求**
```
"我想添加一个用户认证功能"
```

**步骤 2: PM 创建需求文档**
- 创建 `REQ-001-user-auth.md`
- 填写需求详情、接受标准、估算

**步骤 3: PM 创建 Linear Issue**
```bash
mcporter call linear.create_issue \
  title="[REQ-001] 用户认证功能" \
  description="需求详情..." \
  label="Feature"
```

**步骤 4: 记录 Linear 信息**
- Linear Issue ID: AUR-123
- Linear Issue URL: https://linear.app/archersado/issue/AUR-123
- 同步状态: 已创建

**步骤 5: 用户需求 → 产品设计 → 开发过程...**

**步骤 6: 开发完成，状态更新**
- 更新任务文档：状态 → "已完成"
- 同步到 Linear：
  ```bash
  mcporter call linear.update_issue \
    issue_id="AUR-123" \
    state_id="Done"
  ```
- 更新同步时间

---

## 📞 支持

**Linear MCP 工具参考：**

- `mcporter list linear --schema` - 查看所有可用工具
- `mcporter call linear.get_issue issue_id="AUR-XXX"` - 获取 Issue 详情
- `mcporter call linear.list_issues` - 列出 Issues

**文档：**
- [MCP_CONFIG_GUIDE.md](../MCP_CONFIG_GUIDE.md) - MCP 配置完整指南
- [MCP_LINEAR_FIX.md](../MCP_LINEAR_FIX.md) - Linear MCP 问题修复
- [MCP_DAEMON_FIX.md](../MCP_DAEMON_FIX.md) - mcporter daemon 修复

---

**更新时间：** 2025-02-02
**集成状态：** ✅ Linear 项目 "auraforce" 已创建并启用同步
