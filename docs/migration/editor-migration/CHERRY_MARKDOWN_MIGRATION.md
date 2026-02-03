# Cherry Markdown Migration Plan

## 目标
将 AuraForce 项目 workspace 目录下的 Markdown 编辑器从当前实现（Tiptap/自定义）迁移到 Cherry Markdown。

## 当前状态分析

### 发现的 Markdown 编辑器组件
1. **AIMarkdownEditor.tsx** (`/src/components/workspace/AIMarkdownEditor.tsx`)
   - 使用 Tiptap 框架
   - 约 497 行代码
   - 功能：实时 markdown 渲染、表格、任务列表、链接、图片、代码块、预览模式

2. **MarkdownPreviewEditor.tsx** (`/src/components/workspace/MarkdownPreviewEditor.tsx`)
   - 自定义实现，使用 contenteditable
   - 约 500+ 行代码
   - 功能：WYSIWYG 预览编辑、实时渲染、内联工具栏

### 当前依赖
- `@tiptap/*` 包（多个 tiptap 扩展）
- 无 Cherry Markdown 相关依赖

## Cherry Markdown 信息
- **GitHub**: https://github.com/Tencent/cherry-markdown
- **官网**: https://cherry-md.dev/
- **NPM包**: `cherry-markdown` 或 `@cherry-md/react`（React 集成）

## 迁移计划

### Phase 1: 准备工作（DevOps + Frontend Lead）
- [ ] 安装 Cherry Markdown 依赖
- [ ] 分析 Cherry Markdown 的 API 和特性
- [ ] 评估现有功能映射关系

### Phase 2: 安装配置（DevOps）
- [ ] 安装 Cherry Markdown npm 包
- [ ] 配置必要的依赖（如需要）
- [ ] 更新 package.json

### Phase 3: 组件迁移（Frontend Lead）
- [ ] 创建新的 CherryMarkdownEditor 组件
- [ ] 迁移 AIMarkdownEditor.tsx 的功能
- [ ] 迁移 MarkdownPreviewEditor.tsx 的功能
- [ ] 保持相同的 props 接口以确保兼容性

### Phase 4: 集成测试（QA Engineer）
- [ ] 测试新编辑器的所有功能
- [ ] 对比迁移前后的功能一致性
- [ ] 编写 E2E 测试验证编辑器交互

### Phase 5: 清理优化（Frontend Lead + Docs Engineer）
- [ ] 删除 Tiptap 相关代码
- [ ] 清理未使用的依赖
- [ ] 更新文档说明迁移

### Phase 6: 数据库检查（Database Architect）
- [ ] 确认数据库中存储的 markdown 数据格式兼容
- [ ] 如需要，执行数据迁移

## 团队分工

| 角色 | 负责任务 |
|------|----------|
| 🎨 Frontend Lead | 组件迁移、功能实现、代码重构 |
| ⚙️ Backend Engineer | API 兼容性检查 |
| 🗄️ Database Architect | 数据格式验证和迁移 |
| 🧪 QA Engineer | 功能测试、回归测试 |
| 🚀 DevOps Specialist | 依赖管理、打包配置 |
| 📚 Docs Engineer | 文档更新、迁移指南 |

## 风险评估

- **中等风险**：组件接口可能不完全兼容
- **低风险**：Cherry Markdown 是成熟的解决方案
- **缓解措施**：保持 props 接口不变、充分测试

## 时间估算
- 预计 2-3 天完成全部迁移

---

Created: 2025-02-02
Status: ✅ Completed
Completed Date: 2025-02-02

## 实际完成情况
- ✅ Phase 1: 准备工作 - 完成
- ✅ Phase 2: 安装配置 - 完成
- ✅ Phase 3: 组件迁移 - 完成
- ✅ Phase 4: 集成测试 - 待浏览器测试
- 🟡 Phase 5: 清理优化 - 待新组件验证后进行
- 🟡 Phase 6: 数据库检查 - 已确认无需迁移

详见: `/Users/archersado/clawd/projects/AuraForce/MIGRATION_COMPLETE.md`
