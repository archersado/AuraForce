# Cherry Markdown 迁移安装指南

## 📦 依赖分析

### 需要移除的 Tiptap 依赖（共 13 个包）

```bash
# 所有 @tiptap/* 相关依赖
@tiptap/core
@tiptap/extension-image
@tiptap/extension-link
@tiptap/extension-placeholder
@tiptap/extension-table
@tiptap/extension-table-cell
@tiptap/extension-table-header
@tiptap/extension-table-row
@tiptap/extension-task-item
@tiptap/extension-task-list
@tiptap/markdown
@tiptap/react
@tiptap/starter-kit
```

### 当前已存在的相关依赖（保留）

以下依赖 Cherry Markdown 可以直接使用，无需额外安装：
- ✅ `markdown-it` ^13.0.2 - Markdown 解析
- ✅ `katex` ^0.16.27 - 数学公式
- ✅ `rehype-katex` ^7.0.1 - KaTeX 渲染
- ✅ `remark-gfm` ^4.0.1 - GitHub 风格 Markdown
- ✅ `remark-math` ^6.0.0 - 数学语法
- ✅ `react-markdown` ^10.1.0 - React Markdown 渲染
- ✅ `react-syntax-highlighter` ^16.1.0 - 代码高亮
- ✅ `prismjs` ^1.29.0 - 代码高亮引擎

## 🚀 安装方案

### 方案 1: 完整版（推荐用于生产环境）

包含所有功能：UI 编辑器 + Mermaid 流程图 + CodeMirror 代码编辑

```bash
npm install cherry-markdown --save
```

**包大小**: ~600 KB (未压缩)
**功能**: 完整的所见即所得编辑器，内置 Mermaid 和 CodeMirror

---

### 方案 2: Core 版（轻量级，不包含 Mermaid）

适合不需要流程图功能的场景

```bash
npm install cherry-markdown --save
# 使用时导入 core 版本
import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
```

**包大小**: ~400 KB (未压缩)
**功能**: 完整编辑器，不包括 Mermaid 依赖

---

### 方案 3: Stream 版（适合 AI 聊天场景）

轻量级，支持按需加载

```bash
npm install cherry-markdown --save
# 使用时导入 stream 版本
import Cherry from 'cherry-markdown/dist/cherry-markdown.stream';
```

**包大小**: ~200 KB (未压缩)
**特性**:
- 不包含 Mermaid
- 不包含 CodeMirror
- 支持按需加载插件
- 优化流式输出性能

---

## 🔧 可选依赖

### Mermaid 流程图（如果使用 Core/Stream 版）

```bash
npm install mermaid --save
```

### ECharts 图表（用于表格转图表）

```bash
npm install echarts --save
```

### KaTeX（已安装，确认版本）

```bash
# 项目已安装 katex@^0.16.27，版本兼容
# 无需额外安装
```

---

## 📋 完整安装命令集

### 步骤 1: 卸载 Tiptap 依赖

```bash
npm uninstall \
  @tiptap/core \
  @tiptap/extension-image \
  @tiptap/extension-link \
  @tiptap/extension-placeholder \
  @tiptap/extension-table \
  @tiptap/extension-table-cell \
  @tiptap/extension-table-header \
  @tiptap/extension-table-row \
  @tiptap/extension-task-item \
  @tiptap/extension-task-list \
  @tiptap/markdown \
  @tiptap/react \
  @tiptap/starter-kit
```

---

### 步骤 2: 安装 Cherry Markdown

```bash
# 安装主包
npm install cherry-markdown --save

# 可选：安装 Mermaid（如果使用 core/stream 版本）
npm install mermaid --save --optional

# 可选：安装 ECharts（需要表格转图表功能）
npm install echarts --save --optional
```

---

### 步骤 3: 清理（可选）

```bash
# 清理 node_modules 和 lock 文件（推荐）
rm -rf node_modules package-lock.json

# 重新安装所有依赖
npm install
```

---

## 📊 包大小对比

### Tiptap 依赖（当前）

```
@tiptap/* 总计: ~500 KB (gzipped ~150 KB)
- 核心包: ~300 KB
- 扩展包: ~200 KB
```

### Cherry Markdown

```
完整版: ~600 KB → ~200 KB (gzipped)
Core 版: ~400 KB → ~140 KB (gzipped)
Stream 版: ~200 KB → ~70 KB (gzipped)
```

**结论**: 使用 Core 或 Stream 版，总包大小将减少约 20-40%

---

## 🎯 Next.js 集成配置

### 1. CSS 导入

在 `src/app/globals.css` 或 `src/styles/globals.css` 中添加：

```css
@import 'cherry-markdown/dist/cherry-markdown.css';

/* 可选：自定义主题 */
.cherry-markdown {
  --cherry-light-bg: #ffffff;
  --cherry-light-border: #e0e0e0;
  --cherry-light-color: #333333;
  --cherry-light-font-size: 15px;
}
```

---

### 2. TypeScript 类型定义

创建 `src/types/cherry-markdown.d.ts`:

```typescript
declare module 'cherry-markdown' {
  interface CherryOptions {
    id?: string;
    value?: string;
    editor?: {
      theme?: 'light' | 'dark';
      defaultModel?: 'editOnly' | 'edit&Preview' | 'previewOnly';
      minHeight?: string;
      height?: string;
      placeholder?: string;
      autoSave?: boolean;
      readOnly?: boolean;
    };
    toolbars?: {
      theme?: 'light' | 'dark';
      toolbar?: any[][];
      bubble?: boolean;
      float?: boolean;
      customMenu?: any[];
    };
    previewer?: {
      theme?: 'light' | 'dark' | 'darkBlue';
      showCodeRowNumber?: boolean;
      codeBlockStyle?: 'codeium' | 'prism' | 'hljs';
      hljs?: any;
      prismjs?: any;
    };
    engine?: {
      global?: {
        urlProcessor?: (url: string) => string;
        cdn?: string;
      };
      syntax?: {
        table?: {
          enableChart?: boolean;
          chartType?: string;
        };
        codeBlock?: {
          theme?: string;
          lang?: string[];
        };
      };
    };
    callback?: {
      afterChange?: (markdown: string, html: string, context: any) => void;
      afterInit?: () => void;
      afterClickGallery?: (context: any) => void;
      beforeChange?: (markdown: string, html: string, context: any) => void;
      afterAddImage?: (src: string, alt: string, href: string) => void;
      afterPaste?: (event: ClipboardEvent) => void;
    };
    fileUpload?: (file: File, insertIMGFunction: (url: string) => void) => void;
    isPreviewOnly?: boolean;
  }

  export default class Cherry {
    constructor(options: CherryOptions);
    getValue(): string;
    setValue(value: string): void;
    getHtml(): string;
    insertValue(value: string): void;
    focus(): void;
    blur(): void;
    destroy(): void;
  }
}
```

---

### 3. Next.js 配置更新

在 `next.config.js` 中添加（如果遇到打包问题）：

```javascript
const nextConfig = {
  // ... 其他配置
  webpack: (config, { isServer }) => {
    // 如果遇到 Cherry 打包问题，添加这个配置
    config.resolve.alias = {
      ...config.resolve.alias,
      'cherry-markdown$': 'cherry-markdown/dist/cherry-markdown.esm.js',
    };
    return config;
  },
};

module.exports = nextConfig;
```

---

## 🛠️ 基础组件框架

### React Hook 封装

创建 `src/components/workspace/cherry/useCherryMarkdown.ts`:

```typescript
import { useEffect, useRef, useCallback } from 'react';
import Cherry from 'cherry-markdown';

export interface UseCherryMarkdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: any;
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
  const editorId = useRef(`cherry-${Date.now()}-${Math.random()}`);

  const handleChange = useCallback((markdown: string) => {
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
        defaultModel: 'edit&Preview',
      },
      ...options,
      callback: {
        afterChange: handleChange,
        ...options.callback,
      },
    });

    cherryRef.current = cherry;

    return () => {
      if (cherryRef.current) {
        cherryRef.current.destroy();
        cherryRef.current = null;
      }
    };
  }, []);

  // 同步外部 value
  useEffect(() => {
    if (cherryRef.current && cherryRef.current.getValue() !== value) {
      cherryRef.current.setValue(value);
    }
  }, [value]);

  return { containerRef, cherryRef };
}
```

---

### 编辑器组件

创建 `src/components/workspace/cherry/CherryMarkdownAdapter.tsx`:

```typescript
'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useCherryMarkdown, UseCherryMarkdownProps } from './useCherryMarkdown';

export interface CherryMarkdownAdapterProps extends UseCherryMarkdownProps {
  className?: string;
  style?: React.CSSProperties;
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
  const { containerRef, cherryRef } = useCherryMarkdown({
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

  useImperativeHandle(ref, () => ({
    getValue: () => cherryRef.current?.getValue() || '',
    setValue: (val: string) => cherryRef.current?.setValue(val),
    getHtml: () => cherryRef.current?.getHtml() || '',
    insertText: (text: string) => cherryRef.current?.insertValue(text),
    focus: () => cherryRef.current?.focus(),
    blink: () => cherryRef.current?.blur(),
  }));

  return (
    <div
      id={containerRef.current?.id || 'cherry-container'}
      className={props.className}
      style={{
        height: '100%',
        minHeight: props.minHeight || '300px',
        ...props.style,
      }}
    />
  );
});

CherryMarkdownAdapter.displayName = 'CherryMarkdownAdapter';
```

---

## 🔄 迁移步骤清单

### ✅ Phase 1: 依赖管理

- [ ] 备份当前 `package.json`
- [ ] 运行卸载 Tiptap 依赖命令
- [ ] 安装 `cherry-markdown`
- [ ] （可选）安装 `mermaid` 和 `echarts`
- [ ] 清理并重建 node_modules
- [ ] 验证包大小减少

---

### ✅ Phase 2: 配置

- [ ] 更新 `globals.css` 导入 Cherry 样式
- [ ] 创建 TypeScript 类型定义文件
- [ ] 更新 `next.config.js`（如需要）
- [ ] 添加 CSS 自定义主题变量

---

### ✅ Phase 3: 基础组件

- [ ] 创建 `src/components/workspace/cherry/` 目录
- [ ] 实现 `useCherryMarkdown` hook
- [ ] 实现 `CherryMarkdownAdapter` 组件
- [ ] 创建配置文件 `config.ts`
- [ ] 编写基础测试

---

### ✅ Phase 4: 组件迁移

- [ ] 备份 `AIMarkdownEditor.tsx`
- [ ] 重写使用 Cherry 适配器
- [ ] 备份 `MarkdownPreviewEditor.tsx`
- [ ] 重写使用 Cherry 适配器
- [ ] 测试功能完整性

---

### ✅ Phase 5: 清理

- [ ] 删除 Tiptap 残余代码
- [ ] 更新导入路径
- [ ] 删除备份文件
- [ ] 更新项目文档
- [ ] 提交 Git

---

## 📝 注意事项

### SSR 兼容性

Cherry Markdown 是浏览器端库，需要在客户端使用：

```typescript
'use client'; // Next.js 13+ App Router
```

### 样式冲突

Cherry 样式可能与其他组件冲突，建议：

```typescript
// 使用 CSS Modules 或 Tailwind 前缀
className='cherry-markdown-container'
```

### 事件处理

Cherry 的回调参数与 Tiptap 不同：

```typescript
// Tiptap
onUpdate: ({ editor }) => {
  onChange(editor.getHTML());
}

// Cherry
callback: {
  afterChange: (markdown, html, context) => {
    onChange(markdown); // 返回 Markdown, not HTML
  }
}
```

### 只读模式

Cherry 的只读模式配置方式：

```javascript
editor: {
  readOnly: true,
}
```

---

## 🎯 快速开始示例

### 最小可用编辑器

```typescript
'use client';

import Cherry from 'cherry-markdown';

export default function SimpleEditor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cherry = new Cherry({
      id: 'markdown-container',
      value: '# Hello Cherry!',
    });
    return () => cherry.destroy();
  }, []);

  return <div ref={containerRef} id='markdown-container' />;
}
```

---

## 📚 参考资料

- [官方 GitHub](https://github.com/Tencent/cherry-markdown)
- [官方文档](https://tencent.github.io/cherry-markdown/examples/)
- [配置项全解](https://github.com/Tencent/cherry-markdown/wiki/%E9%85%8D%E7%BD%AE%E9%A1%B9%E5%85%A8%E8%A7%A3)
- [API 文档](https://tencent.github.io/cherry-markdown/examples/api.html)

---

**安装完成后，请运行 `npm run dev` 验证无报错。**
