# AuraForce 工作流列表 API 回归测试报告

**测试日期**: 2026-02-03
**测试人员**: QA Team
**测试类型**: 回归测试
**优先级**: 高

---

## 📋 测试概览

| 阶段 | 状态 | 通过率 |
|------|------|--------|
| Phase 1: 服务端测试 | ⚠️ 部分通过 | 2/3 (67%) |
| Phase 2: 客户端测试 | ⏭️ 未执行 | N/A |
| Phase 3: 功能回归 | ⚠️ 部分执行 | N/A |
| Phase 4: 集成测试 | ⏭️ 未执行 | N/A |

---

## 🔴 Phase 1: 服务端测试

### 测试 1: API 端点基础测试
**命令**:
```bash
curl -I "http://localhost:3002/auraforce/api/workflows"
```

**结果**: ✅ 通过
**状态码**: HTTP/1.1 200 OK
**返回内容**: JSON 格式

---

### 测试 2: 带参数的 API 端点
**命令**:
```bash
curl "http://localhost:3002/auraforce/api/workflows?page=1&limit=12"
```

**结果**: ✅ 通过
**返回内容**:
```json
{
  "success": true,
  "data": [
    {
      "id": "e52406b3-6704-420c-a1ec-f60caa9c47be",
      "name": "Website Monitoring",
      "description": "Monitor website uptime and performance metrics",
      "version": "1.5.0",
      "author": "Test User",
      "status": "deployed",
      "visibility": "public"
    },
    {
      "id": "864fe964-0f98-401f-898e-7ca10903ba20",
      "name": "Data Processing Pipeline",
      "description": "Process and transform large datasets efficiently",
      "version": "2.1.0",
      "author": "Test User 2",
      "status": "deployed",
      "visibility": "public"
    },
    {
      "id": "2776ba9a-d14f-4b39-b514-e01b0ee86c75",
      "name": "Popular API Automation",
      "description": "Automate API testing workflows with this powerful template",
      "version": "1.0.0",
      "author": "Test User",
      "status": "deployed",
      "visibility": "public"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 3,
    "totalPages": 1
  }
}
```

**验证**:
- ✅ 返回 JSON 数据
- ✅ `success: true`
- ✅ 包含 3 个工作流
- ✅ 分页参数正常传递
- ✅ 返回统计数据（rating, favoriteCount 等）

---

### 测试 3: 热门工作流
**命令**:
```bash
curl "http://localhost:3002/auraforce/api/workflows/popular"
```

**结果**: ✅ 通过
**返回内容**:
```json
{
  "success": true,
  "data": [
    {
      "id": "864fe964-0f98-401f-898e-7ca10903ba20",
      "name": "Data Processing Pipeline",
      "stats": {
        "popularityScore": 846
      }
    },
    {
      "id": "e52406b3-6704-420c-a1ec-f60caa9c47be",
      "name": "Website Monitoring",
      "stats": {
        "popularityScore": 255
      }
    },
    {
      "id": "2776ba9a-d14f-4b39-b514-e01b0ee86c75",
      "name": "Popular API Automation",
      "stats": {
        "popularityScore": 186
      }
    }
  ]
}
```

**验证**:
- ✅ 返回 JSON 数据
- ✅ `success: true`
- ✅ 按流行度排序（popularityScore 降序）

---

## ⚠️ 发现的问题

### 🔴 严重问题 #1: API 路径未完全修复

**问题描述**:
`useWorkflows` hook 中的 API 路径部分修复不完整

**影响范围**:
- `src/hooks/useWorkflows.ts`

**详细分析**:

| Hook 函数 | 当前路径 | 应使用路径 | 状态 |
|-----------|---------|-----------|------|
| `useWorkflows` | `/workflows` → `/auraforce/workflows` ❌ | `/api/workflows` → `/auraforce/api/workflows` ✅ | **未修复** |
| `useWorkflowDetail` | `/workflows/${id}` ❌ | `/api/workflows/${id}` ✅ | **未修复** |
| `useFavoriteWorkflows` | `/workflows/favorites` ❌ | `/api/workflows/favorites` ✅ | **未修复** |
| `usePopularWorkflows` | `/api/workflows/popular` ✅ | `/api/workflows/popular` ✅ | **已修复** |
| `useUpdateWorkflow` | `/workflows/${id}` ❌ | `/api/workflows/${id}` ✅ | **未修复** |

**验证测试**:
```bash
# 当前 hook 请求的路径（页面路由，返回 HTML 404）
curl -s "http://localhost:3002/auraforce/workflows"
# 返回: <!DOCTYPE html> (404 页面)

# 正确的 API 路径
curl -s "http://localhost:3002/auraforce/api/workflows"
# 返回: {"success": true, ...}
```

**根本原因**:
- `apiFetch` 函数会自动添加 `/auraforce` 前缀
- Hook 中使用 `/workflows` → 最终请求 `/auraforce/workflows`（页面路由）
- 应该使用 `/api/workflows` → 最终请求 `/auraforce/api/workflows`（API 路由）

**修复建议**:
```diff
// src/hooks/useWorkflows.ts

// useWorkflows hook
- const response = await apiFetch(`/workflows?${searchParams.toString()}`);
+ const response = await apiFetch(`/api/workflows?${searchParams.toString()}`);

// useWorkflowDetail hook
- const response = await apiFetch(`/workflows/${id}`);
+ const response = await apiFetch(`/api/workflows/${id}`);

// useFavoriteWorkflows hook
- const response = await apiFetch('/workflows/favorites');
+ const response = await apiFetch('/api/workflows/favorites');

// useUpdateWorkflow hook
- const response = await apiFetch(`/workflows/${id}`, {
+ const response = await apiFetch(`/api/workflows/${id}`, {
```

---

### 🟠 中等问题 #2: 搜索功能数据库错误

**问题描述**:
搜索功能触发 Prisma 数据库查询错误

**错误详情**:
```
Error: Internal server error
Details: Invalid `prisma.workflowSpec.count()` invocation:
Unknown argument `mode`. Did you mean `lte`? Available options are marked with ?.
```

**触发命令**:
```bash
curl "http://localhost:3002/auraforce/api/workflows?search=API"
```

**影响范围**:
- `src/app/api/workflows/route.ts`
- 搜索功能无法正常工作

**根本原因**:
Prisma 版本不支持 `mode: 'insensitive'` 参数

**修复建议**:
```diff
// src/app/api/workflows/route.ts

if (search) {
  const searchCondition = {
    OR: [
-     { name: { contains: search, mode: 'insensitive' } },
-     { description: { contains: search, mode: 'insensitive' } },
-     { author: { contains: search, mode: 'insensitive' } }
+     { name: { contains: search } },
+     { description: { contains: search } },
+     { author: { contains: search } }
    ]
  };
```

**注意**: 移除 `mode: 'insensitive'` 后，搜索将变为大小写敏感。如果需要不区分大小写，可以：
1. 升级 Prisma 到较新版本（支持 case-insensitive 查询）
2. 或者在应用层处理（将搜索关键词和工作流数据都转换为小写）
3. 或者使用数据库原生函数（如 PostgreSQL 的 `ILIKE`）

---

## ⏭️ Phase 2: 客户端测试

由于浏览器自动化限制，未执行完整的客户端测试。但进行了基础验证：

### 页面加载测试
**URL**: `http://localhost:3002/auraforce/market/workflows`

**结果**: ✅ 页面可访问
- 返回 HTML 页面
- 包含工作流市场 UI（搜索框、分类标签等）
- 显示加载状态（loading spinner）

**注意**: 由于 `useWorkflows` hook 路径错误，浏览器中的实际 API 请求会失败（404）

---

## 🛠️ 修复优先级

| 优先级 | 问题 | 影响 | 预计修复时间 |
|--------|------|------|--------------|
| 🔴 P0 | API 路径未完全修复 | 所有使用 `useWorkflows`、`useWorkflowDetail` 等 hook 的页面无法加载数据 | 15分钟 |
| 🟠 P1 | 搜索功能数据库错误 | 搜索功能完全不可用 | 10分钟 |

---

## 📊 测试总结

### 总体评估
- ✅ API 端点基础功能正常（`/auraforce/api/workflows` 可访问）
- ✅ 数据模型完整性良好（返回完整的工作流信息和统计数据）
- ✅ 分页功能正常工作
- ✅ 热门工作流排序功能正常
- ❌ **Hook 层 API 路径未完全修复**，前端无法正常调用 API
- ❌ 搜索功能存在数据库兼容性问题

### 待执行测试
由于浏览器自动化限制，以下测试需要手动执行：
- [ ] Phase 2: 客户端页面完全测试（浏览器 Network 面板验证）
- [ ] Phase 3: 搜索功能交互测试
- [ ] Phase 3: 分类切换功能测试
- [ ] Phase 4: UI 集成测试（Header 统一、返回按钮等）

---

## 📝 后续建议

1. **立即修复 P0 问题**：
   - 修正 `useWorkflows.ts` 中所有 hook 的 API 路径
   - 确保所有路径都使用 `/api/workflows` 而非 `/workflows`

2. **修复 P1 问题**：
   - 更新 `src/app/api/workflows/route.ts` 中的搜索查询
   - 移除不兼容的 `mode: 'insensitive'` 参数

3. **回归测试**：
   - 修复后重新执行 Phase 1 的所有测试
   - 手动执行 Phase 2-4 的浏览器测试
   - 验证搜索功能正常工作

4. **代码审查**：
   - 检查其他是否也有类似的 API 路径问题
   - 确保所有 hook 都使用正确的 API 前缀

5. **测试自动化**：
   - 添加 API 路径正确性的单元测试
   - 添加 E2E 测试覆盖关键用户流程

---

## 附件

### 测试环境
- **操作系统**: Darwin 22.4.0 (arm64)
- **Node.js**: v24.13.0
- **Next.js**: 开发模式运行
- **端口**: 3002
- ** basePath**: `/auraforce`

### 参考文件
- API 端点: `src/app/api/workflows/route.ts`
- API Hook: `src/hooks/useWorkflows.ts`
- 市场页面: `src/app/market/workflows/page.tsx`
- API Client: `src/lib/api-client.ts`
- Next.js Config: `next.config.js`

---

**报告生成时间**: 2026-02-03
**下次测试**: 修复后重新测试
