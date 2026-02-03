# AI Markdown Editor 组件分析

## AIMarkdownEditor.tsx
**技术栈**: Tiptap
**代码行数**: 497 行

### Props 接口
```typescript
interface AIMarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  showPreviewToggles?: boolean;
}
```

### 核心功能
1. ✅ WYSIWYG 编辑（Tiptap）
2. ✅ 实时 Markdown 渲染
3. ✅ 预览/编辑模式切换
4. ✅ 工具栏（粗体、斜体、代码、标题、列表、引用、链接、图片、水平线）
5. ✅ 撤销/重做
6. ✅ 表格支持
7. ✅ 任务列表（Todo）
8. ✅ 图片上传
9. ✅ 自动保存检测（显示 Unsaved 状态）
10. ✅ 字符统计（字符数、行数、词数）
11. ✅ 只读模式

### 技术依赖
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/markdown
- @tiptap/extension-table
- @tiptap/extension-link
- @tiptap/extension-image
- @tiptap/extension-placeholder
- 多个 table-related 扩展
- 多个 task-list 相关扩展

---

## MarkdownPreviewEditor.tsx
**技术栈**: 自定义 contenteditable + 正则表达式
**代码行数**: 约 500+ 行

### Props 接口
```typescript
interface MarkdownPreviewEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
  showViewToggle?: boolean;
  placeholder?: string;
  className?: string;
}
```

### 核心功能
1. ✅ WYSIWYG 预览编辑（contenteditable）
2. ✅ 实时 Markdown 渲染
3. ✅ 预览/源码模式切换
4. ✅ 浮动工具栏（选择文本后显示）
5. ✅ 内联格式化（粗体、斜体、代码、链接、标题、列表、引用、分割线）
6. ✅ Markdown ↔ HTML 双向转换
7. ✅ 自动保存支持
8. ✅ 字符统计
9. ✅ 只读模式

### 技术实现
- 使用 contenteditable 实现所见即所得
- 正则表达式解析 Markdown
- DOMParser 进行 HTML ↔ Markdown 转换
- document.execCommand 应用格式（已废弃 API）

---

## 迁移建议

### Cherry Markdown 优势
1. 🎨 开箱即用的完整功能
2. 📚 完整的 Markdown 语法支持
3. 🔌 丰富的内置插件
4. 🚀 更好的性能
5. 🇨🇳 中文原生支持
6. 📱 移动端友好

### 迁移策略
1. 保持 props 接口不变（确保兼容性）
2. 使用 Cherry Markdown 的 React 组件
3. 配置 Cherry Markdown 以匹配现有功能
4. 保留预览/编辑模式切换逻辑
5. 保留工具栏配置

### 功能映射
| 现有功能 | Cherry Markdown 对应功能 |
|---------|------------------------|
| WYSIWYG 编辑 | ✅ 内置 |
| 预览/编辑切换 | ✅ 内置支持 |
| 表格 | ✅ 内置支持 |
| 任务列表 | ✅ 内置支持 |
| 链接/图片 | ✅ 内置支持 |
| 撤销/重做 | ✅ 内置支持 |
| 字符统计 | ✅ 内置支持 |
| 只读模式 | ✅ 配置支持 |

---

Created: 2025-02-02
Status: ✅ Analysis Complete
