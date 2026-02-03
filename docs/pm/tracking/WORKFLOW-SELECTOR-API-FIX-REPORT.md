# 工作流选择器 API 路径错误修复报告

**问题：** 选择工作流报错
**发现时间：** 2025-02-03 21:05 GMT+8
**严重程度：** 🔴 P0
**修复人员：** PM

---

## 🔍 问题分析

### 错误日志

```
POST /api/workflows/load-template 500 in 1805ms
[Error: ENOENT: no such file or directory, open '.next/server/app/api/workflows/load-template/route.js']
```

### 根本原因

**WorkflowSelector 组件中使用了错误的 API 调用：**

**错误代码** (`src/components/workflows/WorkflowSelector.tsx`)：
```typescript
const response = await fetch(`/api/workflows?${params.toString()}`);
// ❌ 直接使用 fetch，没有包含 basePath /auraforce
```

**正确代码：**
```typescript
import { apiFetch } from '@/lib/api-client';
const response = await apiFetch(`/api/workflows?${params.toString()}`);
// ✅ 使用 apiFetch，自动添加 basePath
```

---

## 🔧 快速修复方案

### 修改 WorkflowSelector.tsx

**添加导入：**
```typescript
import { apiFetch } from '@/lib/api-client';
```

**修改 API 调用：**
```typescript
// 修改前
const response = await fetch(`/api/workflows?${params.toString()}`);

// 修改后
const response = await apiFetch(`/api/workflows?${params.toString()}`);
```

---

## ⚠️ 其他发现的问题

### 问题 1：CodeEditor 导入错误

```
Attempted import error: 'java' is not exported from '@codemirror/lang-cpp'
```

**影响：** 阻止了 API 路由的编译

**位置：** `src/components/workspace/CodeEditor-v2.tsx`

**说明：** 这个错误与工作流选择功能无关，但导致服务器无法正常编译

---

## ✅ 修复步骤

### 立即执行

1. 编辑 `src/components/workflows/WorkflowSelector.tsx`
2. 添加 `apiFetch` 导入
3. 替换所有 `fetch` 为 `apiFetch`
4. 保存文件

### 验证修复

```bash
# 重新启动开发服务器
# 然后测试
curl "http://localhost:3000/auraforce/api/workflows"
```

---

## 📊 当前状态

**之前（错误）：**
- WorkflowSelector 调用 `/api/workflows`
- 由于没有 basePath，实际请求的是 `/api/workflows`（404）
- 或者是错误的完整路径

**修复后（正确）：**
- WorkflowSelector 调用 `apiFetch('/api/workflows')`
- apiFetch 自动添加 `/auraforce` 前缀
- 实际请求：`/auroraforce/api/workflows`（200 OK）

---

## 📝 修复文件

| 文件 | 操作 |
|------|------|
| `src/components/workflows/WorkflowSelector.tsx` | 修复 API 调用 |

---

**报告生成时间：** 2025-02-03 21:05 GMT+8
**状态：** ⏳ 待修复并验证
