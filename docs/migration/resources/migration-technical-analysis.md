# Workspace Markdown 编辑器迁移至 Cherry Markdown - 技术分析报告

## 文档信息
**项目**: AuraForce
**任务**: 将 workspace 下的 Markdown 编辑器从 Tiptap/自定义实现迁移到 Cherry Markdown
**创建日期**: 2025-01-02
**负责人**: Frontend Lead
**分析目标**: 全面分析现有组件功能，为迁移提供技术依据

---

## 📋 目录

1. [现有组件详细分析](#现有组件详细分析)
2. [功能对比矩阵](#功能对比矩阵)
3. [Cherry Markdown 特性分析](#cherry-markdown-特性分析)
4. [迁移风险评估](#迁移风险评估)
5. [技术方案设计](#技术方案设计)
6. [Props 接口映射表](#props-接口映射表)
7. [实现计划](#实现计划)

---

## 一、现有组件详细分析

### 1.1 AIMarkdownEditor.tsx

**文件路径**: `src/components/workspace/AIMarkdownEditor.tsx`
**代码行数**: 约 497 行
**基于框架**: Tiptap v3.15.3
**核心依赖**:
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-*` (多个扩展包)
- `lucide-react` (图标)

#### Props 接口定义

```typescript
interface AIMarkdownEditorProps {
  content: string;              // 编辑器内容（Markdown 格式）
  onChange: (content: string) => void;  // 内容变化的回调函数
  onSave?: () => void;          // 保存回调（可选）
  readOnly?: boolean;           // 是否只读模式（默认 false）
  placeholder?: string;         // placeholder 文本
  className?: string;           // 自定义 CSS 类名
  showPreviewToggles?: boolean; // 是否显示预览切换按钮（默认 true）
}
```

#### 核心功能清单

**1. 编辑功能**
- ✅ WYSIWYG 富文本编辑
- ✅ 支持 H1, H2, H3 标题
- ✅ 粗体、斜体、代码格式
- ✅ 无序列表、有序列表、任务列表
- ✅ 引用块
- ✅ 链接、图片
- ✅ 代码块（带语言高亮类）
- ✅ 表格（可调整大小）
- ✅ 水平线

**2. 预览功能**
- ✅ 双模式切换（编辑/预览）
- ✅ 实时 Markdown 渲染
- ✅ 使用 Tiptap Markdown 扩展

**3. 工具栏**
- ✅ 完整工具栏（撤销/重做、格式化按钮）
- ✅ 按钮状态高亮
- ✅ 工具提示

**4. 状态栏**
- ✅ 字符数、行数、单词数统计
- ✅ 模式指示（Edit/Preview）
- ✅ 编辑器信息

**5. 保存功能**
- ✅ 保存按钮
- ✅ 未保存提示（"Unsaved" 徽章）

#### 已识别的问题

1. **性能问题**:
   - `MarkdownPreview` 使用大量正则替换
   - 每次变化都重新解析整个 DOM
   - 缺少节流机制

2. **安全问题**:
   - 使用 `dangerouslySetInnerHTML`
   - 存在 XSS 风险

3. **功能限制**:
   - 不支持表格内编辑
   - 不支持拖拽上传图片
   - 不支持快捷键

---

### 1.2 MarkdownPreviewEditor.tsx

**文件路径**: `src/components/workspace/MarkdownPreviewEditor.tsx`
**代码行数**: 约 500+ 行
**基于框架**: 自定义实现 (contenteditable)
**核心依赖**: 无外部 Markdown 库

#### Props 接口定义

```typescript
interface MarkdownPreviewEditorProps {
  content: string;              // 编辑器内容（Markdown 格式）
  onChange: (content: string) => void;  // 内容变化的回调函数
  onSave?: () => void;          // 保存回调（可选）
  readOnly?: boolean;           // 是否只读模式（默认 false）
  showViewToggle?: boolean;     // 是否显示视图切换按钮（默认 true）
  placeholder?: string;         // placeholder 文本
  className?: string;           // 自定义 CSS 类名
}
```

#### 核心功能清单

**1. 双模式编辑**
- ✅ 预览模式（contenteditable，可编辑）
- ✅ 源码模式（textarea 纯文本）
- ✅ 模式切换按钮

**2. 预览模式功能**
- ✅ 实时 Markdown → HTML 转换
- ✅ 实时 HTML → Markdown 转换
- ✅ 支持以下语法:
  - 标题 H1-H6
  - 粗体、斜体、代码
  - 代码块（带语言）
  - 引用
  - 无序列表、有序列表
  - 链接、图片
  - 水平线
  - 段落

**3. 浮动工具栏**
- ✅ 选中文本时显示
- ✅ 自动位置计算
- ✅ 格式化按钮（粗体、斜体、代码、链接、标题、列表、引用、分隔线）

**4. 状态栏**
- ✅ 模式指示（Preview/Source）
- ✅ 字符数统计

**5. 头部工具栏**
- ✅ 视图切换按钮
- ✅ 保存按钮

#### 已识别的问题

1. **性能问题**:
   - 大量正则替换，性能较差
   - DOMParser 开销大
   - 无节流/防抖

2. **功能缺失**:
   - 不支持表格
   - 不支持任务列表
   - 不支持数学公式
   - 不支持代码高亮

3. **数据丢失风险**:
   - HTML ↔ Markdown 转换不完全双向
   - 特殊字符处理不完善

4. **兼容性问题**:
   - `document.execCommand` 已废弃
   - 浏览器兼容性问题

5. **UX 问题**:
   - Undo/Redo 缺失
   - 选区检测不精确

---

## 二、功能对比矩阵

| 功能特性 | AIMarkdownEditor | MarkdownPreviewEditor | Cherry Markdown |
|---------|------------------|----------------------|-----------------|
| **编辑模式** |
| WYSIWYG | ✅ | ✅ (Preview) | ✅ |
| 实时预览 | ✅ | ✅ | ✅ |
| 源码模式 | ❌ | ✅ | ✅ |
| **富文本格式** |
| H1-H6 | ✅ (H1-H3) | ✅ (H1-H6) | ✅ |
| 粗体/斜体/代码 | ✅ | ✅ | ✅ |
| 删除线 | ✅ | ❌ | ✅ |
| **列表** |
| 无序列表 | ✅ | ✅ | ✅ |
| 有序列表 | ✅ | ❌ | ✅ |
| 任务列表 | ✅ | ❌ | ✅ |
| **嵌入元素** |
| 图片 | ✅ | ✅ | ✅ + 拖拽上传 |
| 链接 | ✅ | ✅ | ✅ |
| 代码块 | ✅ (类) | ✅ (类) | ✅ + 高亮 |
| 表格 | ✅ 可编辑 | ❌ | ✅ 可编辑 |
| **其他** |
| 引用 | ✅ | ✅ | ✅ |
| 水平线 | ✅ | ✅ | ✅ |
| **高级功能** |
| 数学公式 | ❌ | ❌ | ✅ (KaTeX) |
| 流程图 | ❌ | ❌ | ✅ (Mermaid) |
| Emoji | ❌ | ❌ | ✅ |
| 快捷键 | ❌ | ❌ | ✅ |
| 导出 PDF/HTML | ❌ | ❌ | ✅ |
| **工具栏** |
| 固定工具栏 | ✅ | ✅ | ✅ |
| 浮动工具栏 | ❌ | ✅ | ✅ (更先进) |
| **性能** |
| 虚拟滚动 | ❌ | ❌ | ✅ |
| 代码高亮 | ⚠️ | ❌ | ✅ |

---

## 三、Cherry Markdown 特性分析

### 3.1 核心功能

**基础功能**:
- ✅ 三种模式：编辑、预览、源码
- ✅ 实时渲染预览
- ✅ 完整 CommonMark 标准

**支持语法**:
- ✅ Standard Markdown + GFM
- ✅ Headers, Lists (ordered/unordered/task)
- ✅ Tables (可编辑)
- ✅ Code Blocks (语法高亮)
- ✅ Math (KaTeX)
- ✅ Mermaid 流程图
- ✅ Emoji 快捷输入
- ✅ Footnotes, Definition Lists

**高级功能**:
- ✅ 拖拽/粘贴上传图片
- ✅ 快捷键支持 (Ctrl+B, Ctrl+I, etc.)
- ✅ 搜索替换
- ✅ 全屏模式
- ✅ 导出 PDF/HTML
- ✅ 主题切换（Light/Dark）
- ✅ 插件系统

### 3.2 React 集成方式

**方案 1**: 直接使用 Vanilla Cherry
```typescript
import Cherry from 'cherry-markdown';

const cherry = new Cherry({
  id: 'editor',
  value: '# Hello',
  callback: {
    afterChange: (markdown) => onChange(markdown)
  }
});
```

**方案 2**: React Hook 封装
```typescript
import { useEffect, useRef } from 'react';
import Cherry from 'cherry-markdown';

function useCherryMarkdown({ value, onChange, options }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cherryRef = useRef<Cherry | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cherry = new Cherry({
      id: containerRef.current.id,
      value,
      ...options,
      callback: {
        afterChange: (markdown) => onChange(markdown)
      }
    });

    cherryRef.current = cherry;
    return () => cherry.destroy();
  }, []);

  useEffect(() => {
    if (cherryRef.current && cherryRef.current.getValue() !== value) {
      cherryRef.current.setValue(value);
    }
  }, [value]);

  return { containerRef, cherryRef };
}
```

**配置选项**:
```typescript
{
  // 编辑器
  editor: {
    height: '100%',
    minHeight: '300px',
  },
  // 工具栏
  toolbars: {
    theme: 'light',
    toolbar: [
      ['bold', 'italic', 'code', 'link'],
      ['h1', 'h2', 'h3'],
      ['list', 'ordered-list', 'check'],
      ['upload', 'table']
    ],
    bubble: true,  // 浮动工具栏
    float: true,   // 悬浮工具栏
  },
  // 预览
  previewer: {
    theme: 'light',
    showCodeRowNumber: true,
    codeBlockStyle: 'codeium',  // 代码高亮引擎
  },
  // 回调
  callback: {
    afterChange: (markdown) => {},
    afterInit: () => {},
  }
}
```

---

## 四、迁移风险评估

### 4.1 风险矩阵

| 风险项 | 严重性 | 可能性 | 缓解措施 |
|--------|--------|--------|----------|
| Props 接口不兼容 | 中 | 中 | 保持接口不变，封装适配层 |
| 功能缺失 | 中 | 低 | 使用插件系统扩展 |
| 行为差异 | 低 | 中 | 编写 E2E 测试 |
| 数据格式不兼容 | 中 | 低 | 验证标准 Markdown 格式 |
| 包体积增加 | 低 | 高 | Cherry 比 Tiptap 轻量 |
| 迁移时间超出 | 中 | 中 | 分阶段迁移 |

### 4.2 详细风险分析

**风险 1: Props 接口不兼容**

**缓解**: 创建包装组件保持原有接口

```typescript
// 保持原接口兼容
export function AIMarkdownEditor(props: AIMarkdownEditorProps) {
  return (
    <CherryMarkdownAdapter
      content={props.content}
      onChange={props.onChange}
      readOnly={props.readOnly}
      // ... 其他 props
    />
  );
}
```

**风险 2: 功能缺失**

**缓解**: Cherry 插件系统扩展，或自定义组件

**风险 3: 数据格式兼容性**

**缓解**: Cherry 使用标准 Markdown，理论上兼容。需要测试。

---

## 五、技术方案设计

### 5.1 组件架构设计

```
src/components/workspace/
├── cherry/                          # Cherry Markdown 相关
│   ├── CherryMarkdownAdapter.tsx   # 适配器组件（保持原有接口）
│   ├── useCherryMarkdown.ts        # React Hook 封装
│   ├── types.ts                    # 类型定义
│   └── config.ts                   # 默认配置
│
├── AIMarkdownEditor.tsx            # 迁移后（使用 Cherry）
├── MarkdownPreviewEditor.tsx       # 迁移后（使用 Cherry）
└── [旧文件备份]
```

### 5.2 迁移策略

**阶段 1**: 安装和配置
```bash
npm install cherry-markdown
```

**阶段 2**: 创建基础封装
- 创建 `useCherryMarkdown` hook
- 创建 `CherryMarkdownAdapter` 公共组件

**阶段 3**: 迁移 AIMarkdownEditor
- 保持原有 props 接口
- 内部使用 Cherry 实现
- 对齐工具栏功能

**阶段 4**: 迁移 MarkdownPreviewEditor
- 保持原有 props 接口
- 实现浮动工具栏
- 实现 Preview/Source 模式切换

**阶段 5**: 测试和清理
- 功能测试
- E2E 测试
- 清理 Tiptap 依赖

### 5.3 核心实现代码框架

**useCherryMarkdown Hook**:
```typescript
import { useEffect, useRef, useCallback } from 'react';
import Cherry from 'cherry-markdown';
import type { CherryOptions } from 'cherry-markdown';

export interface UseCherryMarkdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: Partial<CherryOptions>;
  readOnly?: boolean;
}

export function useCherryMarkdown({
  value,
  onChange,
  options = {},
  readOnly = false
}: UseCherryMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cherryRef = useRef<Cherry | null>(null);
  const editorId = useRef(`cherry-${crypto.randomUUID()}`);

  const handleChange = useCallback((markdown: string, html: string, context: any) => {
    onChange(markdown);
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cherry = new Cherry({
      id: editorId.current,
      value,
      editor: {
        ...options.editor,
        readOnly,
      },
      ...options,
      callback: {
        afterChange: handleChange,
        ...options.callback,
      },
    });

    cherryRef.current = cherry;

    return () => {
      cherryRef.current?.destroy();
      cherryRef.current = null;
    };
  }, []);

  // 同步外部 value 变化
  useEffect(() => {
    if (cherryRef.current && cherryRef.current.getValue() !== value) {
      cherryRef.current.setValue(value);
    }
  }, [value]);

  // 控制只读模式
  useEffect(() => {
    if (cherryRef.current) {
      // Cherry 可能需要特殊 API 切换只读
    }
  }, [readOnly]);

  // API 暴露
  const api = {
    getValue: () => cherryRef.current?.getValue() || '',
    setValue: (val: string) => cherryRef.current?.setValue(val),
    getHtml: () => cherryRef.current?.getHtml() || '',
    insertText: (text: string) => cherryRef.current?.insertValue(text),
    focus: () => cherryRef.current?.focus(),
    blur: () => cherryRef.current?.blur(),
    getInstance: () => cherryRef.current,
  };

  return { containerRef, api };
}
```

**CherryMarkdownAdapter 组件**:
```typescript
import { forwardRef, useImperativeHandle } from 'react';
import { useCherryMarkdown, UseCherryMarkdownProps } from './useCherryMarkdown';

export interface CherryMarkdownAdapterProps extends UseCherryMarkdownProps {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  minHeight?: string;
}

export interface CherryMarkdownAdapterRef {
  getValue: () => string;
  setValue: (value: string) => void;
  getHtml: () => string;
  insertText: (text: string) => void;
  focus: () => void;
  blur: () => void;
}

export const CherryMarkdownAdapter = forwardRef<
  CherryMarkdownAdapterRef,
  CherryMarkdownAdapterProps
>((props, ref) => {
  const { containerRef, api } = useCherryMarkdown({
    value: props.value,
    onChange: props.onChange,
    options: {
      ...props.options,
      editor: {
        ...props.options?.editor,
        minHeight: props.minHeight || '300px',
      },
    },
    readOnly: props.readOnly,
  });

  // 暴露 ref API
  useImperativeHandle(ref, () => ({
    getValue: api.getValue,
    setValue: api.setValue,
    getHtml: api.getHtml,
    insertText: api.insertText,
    focus: api.focus,
    blur: api.blur,
  }));

  return (
    <div
      id={containerRef.current?.id || 'cherry-container'}
      ref={containerRef}
      className={props.className}
      style={props.style}
    />
  );
});

CherryMarkdownAdapter.displayName = 'CherryMarkdownAdapter';
```

---

## 六、Props 接口映射表

### AIMarkdownEditor Props → Cherry 配置

| 原 Props | 类型 | Cherry 配置路径 | 说明 |
|----------|------|----------------|------|
| `content` | `string` | `.value` | 初始内容 |
| `onChange` | `(string) => void` | `callback.afterChange` | 内容变化回调 |
| `onSave` | `() => void` | *自定义* | 添加保存按钮到工具栏 |
| `readOnly` | `boolean` | `editor.readOnly` | 只读模式 |
| `placeholder` | `string` | *自定义* | Cherry 原生不支持，需要扩展 |
| `className` | `string` | 容器的 class | CSS 类 |
| `showPreviewToggles` | `boolean` | *自定义按钮* | 显示/隐藏模式切换 |

### MarkdownPreviewEditor Props → Cherry 配置

| 原 Props | 类型 | Cherry 配置路径 | 说明 |
|----------|------|----------------|------|
| `content` | `string` | `value` | 初始内容 |
| `onChange` | `(string) => void` | `callback.afterChange` | 内容变化回调 |
| `onSave` | `() => void` | *自定义* | 保存按钮 |
| `readOnly` | `boolean` | `editor.readOnly` | 只读模式 |
| `showViewToggle` | `boolean` | *自定义* | 视图切换按钮 |
| `placeholder` | `string` | *自定义* | placeholder（需扩展） |
| `className` | `string` | 容器的 class | CSS 类 |

---

## 七、实现计划

### Week 1: 准备和基础封装

**Day 1-2: 环境准备**
- [ ] 安装 `cherry-markdown` 依赖
- [ ] 阅读 Cherry Markdown 官方文档
- [ ] 创建 `src/components/workspace/cherry/` 目录
- [ ] 备份现有两个编辑器文件

**Day 3-5: 基础封装**
- [ ] 实现 `useCherryMarkdown` hook
- [ ] 实现 `CherryMarkdownAdapter` 组件
- [ ] 创建配置文件 `config.ts`
- [ ] 定义 TypeScript 类型
- [ ] 编写基础单元测试

### Week 2: 组件迁移

**Day 1-2: 迁移 AIMarkdownEditor**
- [ ] 重写 `AIMarkdownEditor.tsx` 使用 Cherry
- [ ] 确保 props 接口完全兼容
- [ ] 对齐工具栏按钮
- [ ] 实现状态栏功能
- [ ] 测试所有功能

**Day 3-4: 迁移 MarkdownPreviewEditor**
- [ ] 重写 `MarkdownPreviewEditor.tsx` 使用 Cherry
- [ ] 实现 Preview/Source 模式切换
- [ ] 实现浮动工具栏（Cherry 原生支持或自定义）
- [ ] 测试所有功能

**Day 5: 集成测试**
- [ ] 端到端测试
- [ ] 对比迁移前后功能一致性
- [ ] 性能测试
- [ ] 修复 bug

### Week 3: 清理和优化

**Day 1-2: 清理和优化**
- [ ] 删除 Tiptap 相关依赖
- [ ] 移除旧组件代码
- [ ] 优化 Cherry 配置
- [ ] 更新文档

**Day 3-5: 上线和监控**
- [ ] 代码审查
- [ ] 合并到主分支
- [ ] 部署到测试环境
- [ ] 监控错误日志
- [ ] 准备回滚方案

---

## 八、后续优化建议

### 8.1 性能优化
- [ ] 配置虚拟滚动（大文档）
- [ ] 配置懒加载
- [ ] 优化初始化加载

### 8.2 功能增强
- [ ] 自定义主题颜色
- [ ] 添加更多工具栏按钮
- [ ] 实现协同编辑（WebSocket）

### 8.3 用户体验
- [ ] 添加快捷键提示
- [ ] 添加格式化提示
- [ ] 优化移动端体验

---

## 附录

### A. 依赖对比

**当前依赖**:
```
@tiptap/react@^3.15.3
@tiptap/starter-kit@^3.15.3
@tiptap/markdown@^3.15.3
@tiptap/extension-table@^3.15.3
@tiptap/extension-link@^3.15.3
@tiptap/extension-image@^3.15.3
@tiptap/extension-placeholder@^3.15.3
@tiptap/extension-task-list@^3.15.3
# ... 更多 Tiptap 包
```

**迁移后依赖**:
```
cherry-markdown@^latest
# 移除所有 @tiptap/* 包
```

**包大小对比**:
- Tiptap 全部包: ~500 KB (gzipped ~150 KB)
- Cherry Markdown: ~200 KB (gzipped ~70 KB)

### B. 测试检查清单

**功能测试**:
- [ ] 所有 Markdown 语法渲染正确
- [ ] 编辑/预览/源码模式切换正常
- [ ] 工具栏按钮功能正常
- [ ] 快捷键功能正常
- [ ] 只读模式正常
- [ ] 保存回调触发正常
- [ ] 内容同步正常

**兼容性测试**:
- [ ] 浏览器兼容（Chrome, Firefox, Safari, Edge）
- [ ] 移动端兼容（iOS Safari, Android Chrome）
- [ ] 现有数据加载测试
- [ ] 数据保存测试

**性能测试**:
- [ ] 大文档编辑流畅性
- [ ] 初始化加载时间
- [ ] 内存使用情况
- [ ] 渲染性能

---

**报告完成日期**: 2025-01-02
**下一步行动**: 实施 Week 1 计划
