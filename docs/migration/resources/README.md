# Migration Resources - 迁移资源

本目录包含迁移过程中的技术分析、资源和参考资料。

## 📚 资源列表

### 技术分析
- [迁移技术分析](migration-technical-analysis.md) - 完整的技术分析报告
- [迁移资源概览](migration-resources-overview.md) - 迁移资源和工具的概览
- [包迁移参考](package-migration-reference.md) - npm 包的迁移参考
- [迁移文档摘要](cherry-documentation-summary.md) - 所有迁移文档的摘要

## 📊 迁移统计数据

### 依赖包变更
**新增（Cherry Markdown）：**
- cherry-markdown
- 相关依赖包（140+）

**待移除（Tiptap）：**
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/extension-image
- @tiptap/extension-code-block-lowlight
- @tiptap/pm
- 以及其他 Tiptap 扩展包（约 30+ 个）

### 文件变更
- **新增:** 1 个组件文件 (CherryMarkdownEditor.tsx)
- **修改:** 1 个组件文件 (FileEditor.tsx)
- **待删除:** 2 个旧组件文件 (AIMarkdownEditor.tsx, MarkdownPreviewEditor.tsx)
- **新增文档:** 14 个迁移相关文档

### 代码行数变化
- CherryMarkdownEditor.tsx: 247 行（新增）
- 移除 Tiptap 组件: ~1000 行（待删除）
- 净变化: -753 行代码

## 🔗 相关链接

- [Editor Migration](../editor-migration/) - 编辑器迁移详细记录
- [Cherry Markdown Guide](../cherry-markdown/) - Cherry Markdown 使用指南

---

*最后更新: 2025-02-02*
