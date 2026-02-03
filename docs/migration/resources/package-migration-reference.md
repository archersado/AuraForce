# Package.json 迁移参考
# 这是一个 package.json 的差异参考，用于 Tiptap → Cherry Markdown 迁移

## 📦 需要从 dependencies 移除的包

### Tiptap 核心（3个包）
```json
"@tiptap/core": "^3.15.3",
"@tiptap/react": "^3.15.3",
"@tiptap/starter-kit": "^3.15.3",
```

### Tiptap 扩展（10个包）
```json
"@tiptap/extension-image": "^3.15.3",
"@tiptap/extension-link": "^3.15.3",
"@tiptap/extension-placeholder": "^3.15.3",
"@tiptap/extension-table": "^3.15.3",
"@tiptap/extension-table-cell": "^3.15.3",
"@tiptap/extension-table-header": "^3.15.3",
"@tiptap/extension-table-row": "^3.15.3",
"@tiptap/extension-task-item": "^3.15.3",
"@tiptap/extension-task-list": "^3.15.3",
"@tiptap/markdown": "^3.15.3",
```

---

## ➕ 需要添加到 dependencies 的包

### 核心包（必须）
```json
"cherry-markdown": "^latest",  // 会自动安装最新稳定版
```

### 可选依赖

#### Mermaid（流程图支持）
```json
"mermaid": "^10.0.0",  // 如果使用 core 或 stream 版本需要
```

#### ECharts（表格转图表）
```json
"echarts": "^5.4.0",  // 如果需要表格转图表功能
```

---

## 📝 package.json 变更示例

### 迁移前（当前）
```json
{
  "dependencies": {
    "@tiptap/core": "^3.15.3",
    "@tiptap/extension-image": "^3.15.3",
    "@tiptap/extension-link": "^3.15.3",
    "@tiptap/extension-placeholder": "^3.15.3",
    "@tiptap/extension-table": "^3.15.3",
    "@tiptap/extension-table-cell": "^3.15.3",
    "@tiptap/extension-table-header": "^3.15.3",
    "@tiptap/extension-table-row": "^3.15.3",
    "@tiptap/extension-task-item": "^3.15.3",
    "@tiptap/extension-task-list": "^3.15.3",
    "@tiptap/markdown": "^3.15.3",
    "@tiptap/react": "^3.15.3",
    "@tiptap/starter-kit": "^3.15.3",
    "markdown-it": "^13.0.2",
    "katex": "^0.16.27",
    "rehype-katex": "^7.0.1",
    "remark-gfm": "^4.0.1",
    "remark-math": "^6.0.0",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.0",
    "prismjs": "^1.29.0"
  }
}
```

### 迁移后（建议）
```json
{
  "dependencies": {
    "cherry-markdown": "^latest",
    "mermaid": "^10.0.0",
    "echarts": "^5.4.0",
    "markdown-it": "^13.0.2",
    "katex": "^0.16.27",
    "rehype-katex": "^7.0.1",
    "remark-gfm": "^4.0.1",
    "remark-math": "^6.0.0",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.0",
    "prismjs": "^1.29.0"
  }
}
```

**说明**:
- 保留了所有 Markdown 相关依赖（Cherry 可以直接使用）
- 添加了 cherry-markdown 主包
- 可选添加了 mermaid 和 echarts

---

## 📊 包大小对比

### 迁移前（Tiptap）

| 包名 | 未压缩 | Gzip |
|------|--------|------|
| @tiptap/core | ~150 KB | ~45 KB |
| @tiptap/react | ~30 KB | ~10 KB |
| @tiptap/starter-kit | ~100 KB | ~30 KB |
| @tiptap/markdown | ~20 KB | ~7 KB |
| @tiptap/extension-* (10个) | ~200 KB | ~60 KB |
| **总计** | **~500 KB** | **~152 KB** |

### 迁移后（Cherry + 可选）

| 包名 | 未压缩 | Gzip |
|------|--------|------|
| cherry-markdown (full) | ~600 KB | ~200 KB |
| cherry-markdown (core) | ~400 KB | ~140 KB |
| cherry-markdown (stream) | ~200 KB | ~70 KB |
| mermaid | ~300 KB | ~90 KB |
| echarts | ~900 KB | ~300 KB |

**最轻量方案** (Cherry stream + 不安装 mermaid/echarts):
- **未压缩**: ~200 KB
- **Gzip**: ~70 KB
- **减少**: ~60%

---

## 🔧 手动编辑 package.json

### 步骤 1: 打开 package.json
```bash
vim package.json  # 或使用你喜欢的编辑器
```

### 步骤 2: 删除以下行
在 `dependencies` 对象中删除:

```json
"@tiptap/core": "^3.15.3",
"@tiptap/extension-image": "^3.15.3",
"@tiptap/extension-link": "^3.15.3",
"@tiptap/extension-placeholder": "^3.15.3",
"@tiptap/extension-table": "^3.15.3",
"@tiptap/extension-table-cell": "^3.15.3",
"@tiptap/extension-table-header": "^3.15.3",
"@tiptap/extension-table-row": "^3.15.3",
"@tiptap/extension-task-item": "^3.15.3",
"@tiptap/extension-task-list": "^3.15.3",
"@tiptap/markdown": "^3.15.3",
"@tiptap/react": "^3.15.3",
"@tiptap/starter-kit": "^3.15.3"
```

### 步骤 3: 添加 Cherry Markdown
在 `dependencies` 对象中添加:

```json
"cherry-markdown": "^latest"
```

### 步骤 4: （可选）添加 Mermaid
```json
"mermaid": "^10.0.0"
```

### 步骤 5: （可选）添加 ECharts
```json
"echarts": "^5.4.0"
```

### 步骤 6: 保存并重新安装
```bash
npm install
```

---

## ✅ 验证安装

### 检查 Tiptap 是否已移除
```bash
npm list @tiptap/react
# 应该返回：UNMET DEPENDENCY @tiptap/react@*
```

### 检查 Cherry 是否已安装
```bash
npm list cherry-markdown
# 应该返回：cherry-markdown@x.x.x
```

### 检查包大小
```bash
npm ls | grep -E "@tiptap|cherry-markdown"
```

---

## 🚨 常见问题

### Q1: 安装后报错 "Cannot find module 'cherry-markdown'"
**A**: 清理缓存后重新安装
```bash
rm -rf node_modules package-lock.json .next
npm install
```

### Q2: Next.js 构建失败
**A**: 检查 next.config.js，添加 webpack 配置（见安装指南）

### Q3: TypeScript 类型错误
**A**: 确保创建了 `src/types/cherry-markdown.d.ts` 类型定义文件

### Q4: 样式未加载
**A**: 确保在 `globals.css` 中导入了 `'cherry-markdown/dist/cherry-markdown.css'`

---

## 📁 生成的备份文件

运行迁移脚本后，会生成以下备份:
- `package.json.backup.YYYYMMDD_HHMMSS` - 原始 package.json 备份

如需回滚:
```bash
cp package.json.backup.YYYYMMDD_HHMMSS package.json
npm install
```

---

**最后更新**: 2025-02-01
**相关文档**:
- [完整安装指南](./cherry-markdown-installation.md)
- [技术分析报告](./migration-technical-analysis.md)
