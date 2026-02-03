# Cherry Markdown 快速参考卡

> 🍒 Tiptap → Cherry Markdown 迁移速查表

---

## 🚀 常用命令

### 安装
```bash
# 一键安装（使用项目提供的脚本）
./migrate-to-cherry.sh

# 手动安装
npm uninstall @tiptap/core @tiptap/react @tiptap/starter-kit @tiptap/markdown @tiptap/extension-*
npm install cherry-markdown
```

### 验证
```bash
# 检查版本
npm list cherry-markdown

# 检查 Tiptap 是否移除
npm list @tiptap/react  # 应该返回 UNMET DEPENDENCY

# 清理缓存
rm -rf .next node_modules package-lock.json
npm install
```

---

## 📦 包导入

### 完整版（含 UI）
```typescript
import Cherry from 'cherry-markdown';
import 'cherry-markdown/dist/cherry-markdown.css';
```

### Core 版（不含 Mermaid）
```typescript
import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
import 'cherry-markdown/dist/cherry-markdown.css';
```

### Stream 版（轻量级）
```typescript
import Cherry from 'cherry-markdown/dist/cherry-markdown.stream';
import 'cherry-markdown/dist/cherry-markdown.css';
```

---

## ⚙️ 基础配置

### 最小配置
```typescript
const cherry = new Cherry({
  id: 'my-editor',
  value: '# Hello World',
  callback: {
    afterChange: (markdown) => onChange(markdown)
  }
});
```

### 完整配置模板
```typescript
const cherry = new Cherry({
  // 基础配置
  id: 'editor',
  value: '# Content',

  // 编辑器配置
  editor: {
    theme: 'light',           // light | dark
    defaultModel: 'edit&Preview',  // editOnly | edit&Preview | previewOnly
    minHeight: '500px',
    height: '100%',
    readOnly: false,
    autoSave: true,
  },

  // 工具栏配置
  toolbars: {
    theme: 'light',
    toolbar: [
      ['bold', 'italic', 'code', 'link'],
      ['h1', 'h2', 'h3'],
      ['list', 'ordered-list', 'check'],
      ['upload', 'table']
    ],
    bubble: true,   // 选中文本时的浮动工具栏
    float: true,    // 悬浮工具栏
  },

  // 预览器配置
  previewer: {
    theme: 'light',            // light | dark | darkBlue
    showCodeRowNumber: true,   // 显示代码行号
    codeBlockStyle: 'codeium', // codeium | prism | hljs
  },

  // 回调函数
  callback: {
    afterChange: (markdown, html, context) => {},
    afterInit: () => {},
    afterPaste: (e) => {},
    afterAddImage: (src, alt, href) => {},
  },

  // 文件上传
  fileUpload: (file, insertIMG) => {
    // 自定义上传逻辑
    const url = uploadToServer(file);
    insertIMG(url);
  },
});
```

---

## 🔌 常用 API

### 获取内容
```typescript
const markdown = cherry.getValue();   // 获取 Markdown
const html = cherry.getHtml();        // 获取 HTML
```

### 设置内容
```typescript
cherry.setValue('# New Content');     // 设置 Markdown
```

### 插入内容
```typescript
cherry.insertValue('**插入的文本**'); // 插入到光标位置
```

### 焦点控制
```typescript
cherry.focus();   // 获取焦点
cherry.blur();    // 失去焦点
```

### 销毁
```typescript
cherry.destroy(); // 清理实例
```

---

## 🎨 工具栏按钮列表

### 文本格式
- `bold` - 粗体
- `italic` - 斜体
- `strikeThrough` - 删除线
- `sub` - 下标
- `sup` - 上标
- `code` - 行内代码

### 标题
- `h1` - 标题 1
- `h2` - 标题 2
- `h3` - 标题 3
- `h4` - 标题 4
- `h5` - 标题 5
- `h6` - 标题 6

### 列表
- `list` - 无序列表
- `orderedList` - 有序列表
- `check` - 任务列表
- `noList` - 取消列表

### 插入
- `link` - 链接
- `image` - 图片
- `table` - 表格
- `codeBlock` - 代码块
- `quote` - 引用
- `audio` - 音频
- `video` - 视频
- `formula` - 公式

### 功能
- `upload` - 上传图片
- `record` - 录音
- `reverseRTL` - RTL 切换
- `fullScreen` - 全屏
- `previewerOnly` - 只看预览
- `syncScrolling` - 同步滚动

### 撤销重做
- `undo` - 撤销
- `redo` - 重做

---

## 🔄 事件回调对比

| 事件 | Tiptap | Cherry |
|------|--------|--------|
| 内容变化 | `onUpdate: ({ editor }) => {}` | `callback.afterChange: (md, html) => {}` |
| 初始化 | `onCreate: ({ editor }) => {}` | `callback.afterInit: () => {}` |
| 粘贴 | 需要 `onPaste` 扩展 | `callback.afterPaste: (e) => {}` |
| 添加图片 | `Transaction.observe` | `callback.afterAddImage: (src, alt, href) => {}` |
| 聚焦 | `onSelectionUpdate` | 需要监听 DOM 事件 |

---

## 🎯 快速迁移模板

### React Hook
```typescript
import { useEffect, useRef } from 'react';
import Cherry from 'cherry-markdown';

export function useCherryMarkdown({ value, onChange }) {
  const ref = useRef<HTMLDivElement>(null);
  const cherryRef = useRef<Cherry | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cherry = new Cherry({
      id: ref.current.id,
      value,
      callback: {
        afterChange: (md) => onChange(md)
      }
    });

    cherryRef.current = cherry;
    return () => cherry.destroy();
  }, []);

  useEffect(() => {
    if (cherryRef.current?.getValue() !== value) {
      cherryRef.current?.setValue(value);
    }
  }, [value]);

  return { ref };
}
```

### React 组件
```typescript
'use client';

import { useCherryMarkdown } from './useCherryMarkdown';

export function MarkdownEditor({ value, onChange }) {
  const { ref } = useCherryMarkdown({ value, onChange });

  return (
    <div
      id="cherry-editor"
      ref={ref}
      style={{ height: '500px' }}
    />
  );
}
```

---

## 🐛 常见问题

### Q1: 样式未加载
```css
/* 在 globals.css 中添加 */
@import 'cherry-markdown/dist/cherry-markdown.css';
```

### Q2: 构建失败
```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'cherry-markdown$': 'cherry-markdown/dist/cherry-markdown.esm.js',
    };
    return config;
  },
};
```

### Q3: TypeScript 报错
```typescript
// 创建 src/types/cherry-markdown.d.ts
declare module 'cherry-markdown';
```

### Q4: 只读模式无效
```typescript
editor: {
  readOnly: true,  // 初始化时配置
}
```

### Q5: 图片上传失败
```typescript
fileUpload: (file, insertIMG) => {
  const formData = new FormData();
  formData.append('file', file);
  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => insertIMG(data.url));
}
```

---

## 📊 功能对比

| 功能 | Tiptap | Cherry |
|------|--------|--------|
| WYSIWYG | ✅ | ✅ |
| 实时预览 | ⚠️ 需配置 | ✅ 原生支持 |
| 源码模式 | ❌ | ✅ |
| 表格编辑 | ✅ | ✅ |
| 代码高亮 | ✅ | ✅ |
| 数学公式 | ❌ | ✅ (KaTeX) |
| 流程图 | ❌ | ✅ (Mermaid) |
| 快捷键 | ✅ | ✅ |
| 拖拽上传 | ⚠️ 需扩展 | ✅ |
| 导出 PDF | ❌ | ✅ |
| 包大小 | ~500KB | ~600KB (full) / ~200KB (stream) |

---

## 🔗 快速链接

- 📦 [NPM 包](https://www.npmjs.com/package/cherry-markdown)
- 📖 [官方文档](https://tencent.github.io/cherry-markdown/examples/)
- 🛠️ [配置全解](https://github.com/Tencent/cherry-markdown/wiki/%E9%85%8D%E7%BD%AE%E9%A1%B9%E5%85%A8%E8%A7%A3)
- 💻 [Demo 示例](https://tencent.github.io/cherry-markdown/examples/index.html)
- 🐙 [GitHub](https://github.com/Tencent/cherry-markdown)

---

## 📝 相关文档

- [完整安装指南](./cherry-markdown-installation.md)
- [技术分析报告](./migration-technical-analysis.md)
- [包迁移参考](./package-migration-reference.md)
- [迁移检查清单](./migration-checklist.md)

---

**版本**: v1.0
**更新**: 2025-02-01

💡 **提示**: 打印此卡片放在键盘旁边，迁移时随时查阅！
