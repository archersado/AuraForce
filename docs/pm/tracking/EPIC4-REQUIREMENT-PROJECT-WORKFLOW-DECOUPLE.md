# Epic 4 需求记录 - 项目与工作流解耦（简化版）

**创建日期：** 2025-02-02
**更新日期：** 2025-02-02（v3.0 简化）
**优先级：** P0 (核心需求)
**状态：** 📋 需求记录
**源需求说明：**
1. 进入项目后不应该再修改工作流
2. 用户创建了项目后，工作流的配置是对用户不可见的（隐藏文件）
3. 项目运行阶段是否可修改工作流配置？不需要（用户明确否）

---

## 📋 需求说明（简化版）

### 核心需求：🔒 工作流配置文件对用户不可见

**"用户创建了项目后，工作流的配置是对用户不可见的"**

#### 理解
- 工作流配置文件存储在 `.claude/` 隐藏目录
- 文件对文件系统可见，但**对用户不可见**（在文件探索器中隐藏）
- 用户通过 **UI 界面**查看和修改配置
- 不能通过文件编辑器直接编辑 `.claude/` 下的文件

#### 配置隐藏方式

**目录结构：**
```
project-a/
├── src/
│   ├── main.ts
│   ├── app.ts
│   └── ...
├── .claude/                        # 隐藏目录（对用户不可见）
│   ├── workflow-config.json         # 工作流配置
│   ├── agents/
│   │   ├── agent1.md
│   │   └── agent2.md
│   └── ...
├── .gitignore                      # 忽略隐藏目录（不提交到版本控制）
└── README.md

# .gitignore 配置
.claude/
```

#### 用户视角的文件结构
```
project-a/
├── src/                          # 源代码文件 ✏️ 可见
├── app.ts                        # 源代码文件 ✏️ 可见
├── main.ts                       # 源代码文件 ✏️ 可见
├── README.md                     # 文档文件 ✏️ 可见
└── .claude/                      # 隐藏目录 🚫❌ 用户浏览器/编辑器不可见
    └── workflow-config.json         # 配置文件 🚫❌ 不可见
```

#### 配置查看和修改

**UI 界面：**
```
1. 用户打开工作流配置页面（如项目设置、工作流设置）
2. 显示表单字段（名称、超时、重试次数等）
3. 修改配置
4. 点击 "保存" 调用 API 更新 `.claude/workflow-config.json`
```

#### 数据库 Schema

**无需修改数据库！**

配置文件存储在文件系统，不需要数据库字段。

---

## ✅ 实现建议（简化版）

### 核心：load-template API 增强

**当前代码：**
```
解压 ZIP → 用户 workspace
```

**增强后的逻辑：**
```
1. 解压 ZIP 到用户 workspace
2. 创建 `.claude/` 目录
3. 生成 `.claude/workflow-config.json`
4. 添加 `.gitignore`（忽略 .claude/）
```

**代码实现：**
```typescript
// 解压模板
const zip = new AdmZip(zipPath);
zip.extractAllTo(targetWorkspacePath, true, true);

// 创建 .claude/ 目录
const claudeDir = path.join(targetWorkspacePath, '.claude');
if (!existsSync(claudeDir)) {
  mkdirSync(claudeDir, { recursive: true });
}

// 生成配置文件
const config = {
  projectName,
  workflowTemplateId: templateId,
  createdAt: new Date().toISOString(),
  version: '1.0.0',
};
fs.writeFileSync(
  path.join(claudeDir, 'workflow-config.json'),
  JSON.stringify(config, null, 2)
);

// 创建 .gitignore
const gitignorePath = path.join(targetWorkspacePath, '.gitignore');
if (!existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, '.claude/\n.cclaude-cache/');
}
```

### 前端 UI

**无需修改！**

- 用户界面直接调用 API 修改配置
- 文件对用户自动隐藏（.claude/ 目录）.gitignore 配置）
- 编辑器不会显示隐藏文件

---

## ❌ 明确不需要的功能

### ❌ 运行时锁定机制
**原因：** 删除需求

**原因：** 根据用户反馈，不应该有运行时锁定
- 用户可以随时修改配置
- 如果配置错误，用户自己负责

### ❌ 项目状态机
**原因：** 不需要额外的状态管理

**说明：**
- 用户通过 CLI/IDE 修改文件
- IDE 自动检测文件变化
- 用户自己负责配置的生效和失效

---

## 📄 实现检查清单

### 后端（load-template API 增强）
- [ ] 创建 `.claude/` 隐藏目录
- [ ] 生成 `workflow-config.json` 配置文件
- [ ] 添加 `.gitignore` 忽略 `.claude/`
- [ ] 配置JSON 有合理的结构

### 前端（无需修改）
- [ ] 文件管理器应该已经隐藏 `.claude/` 目录（默认行为）
- [ ] 配置编辑器通过 API 读写配置

### 验证方式
1. 创建项目后，检查 `.claude/` 目录是否存在
2. 检查 `workflow-config.json` 是否正确生成
3. 尝试在浏览器地址栏直接访问配置文件（应该 404）
4. 在 IDE 中打开项目，检查 `.claude/` 是否显示在文件树中

---

## 🛠️ 注意事项

### 文件权限
- `.claude/` 目录权限无需特殊设置
- Git 自动忽略配置文件（防止误提交）
- 确保配置文件可写（通过 API）

### API 设计
- 配置操作通过 API 而不是直接文件操作
- 不应该暴露 `.claude/` 的 API 路径
- 所有操作都要验证用户权限

### 前端集成
- 配置编辑器通过 API（调用 PATCH/GET）
- 不应该提供文件树编辑 `.claude/` 目录的功能
- 用户应该通过配置 UI 进行所有配置

---

## 🔍 当前实现检查

### 检查项
- [ ] 检查现有项目的 `.claude/` 目录
- [ ] 检查 `workflow-config.json` 文件
- [ ] 检查 `.gitignore` 是否包含 `.claude/`
- [ ] 检查前端是否可以正确读取配置

### 测试用例
1. 创建项目后，验证 `.claude/` 目录已创建
2. 验证 `workflow-config.json` 内容正确
3. 验证 `.gitignore` 已添加 `.claude/`
4. 前端配置编辑器能正确读取配置
5. 浏览器/IDE 无法直接访问 `.claude/` 目录

---

**需求记录人：** PM  
**创建日期：** 2025-02-02  
**更新日期：** 2025-02-02（v3.0 简化版）  
**状态：** 📋 需求已记录  
**下一步：** 用户确认是否需要实施修复

---

## 💡 备注

### 简化原因

原设计（v2.0）包含运行时锁定机制：
1. 项目状态机（创建中/运行中/已停止/错误）
2. 配置在运行时不可编辑
3. 需要先停止项目才能修改配置

**用户反馈：不需要**这个机制
- 简化流程
- 用户自己负责配置的正确性
- 避免过度设计

### 最终设计

**只做一件事：配置文件隐藏**

实现：
1. `.claude/` 隐藏目录
2. `workflow-config.json` 配置文件
- `.gitignore` 配置文件

就这么简单 ✅

---

**下一步：** 等待用户确认是否需要实施修复/增强功能
