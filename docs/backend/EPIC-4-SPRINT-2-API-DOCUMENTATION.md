# Epic 4 Sprint 2 - Backend API Documentation

**Version:** 1.0
**Last Updated:** 2025-02-03
**Status:** ✅ Completed

---

## Overview

本文档描述了 Epic 4 Sprint 2 中新增的后端 API 端点，包括热门工作流、加载工作流和统计信息集成。

---

## Authentication

所有 API 端点需要通过 NextAuth 认证，使用以下方式获取用户会话：

```typescript
import { getSession } from '@/lib/auth/session';

const session = await getSession();
if (!session?.userId || !session.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## API Endpoints

### 1. Popular Workflows API

**Endpoint:** `GET /api/workflows/popular`

**Description:** 获取热门工作流列表，按统计信息排序

**Authentication:** 可选（公开数据）

---

#### Request

**Query Parameters:**

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| `period`  | string | No       | `all`   | 时间范围：`7d`, `30d`, `all` |
| `limit`   | number | No       | `20`    | 返回数量（最大 100） |
| `page`    | number | No       | `1`     | 页码 |

**Example Request:**

```bash
# 获取全部热门工作流
GET /api/workflows/popular

# 获取最近 7 天的热门工作流
GET /api/workflows/popular?period=7d

# 获取最近 30 天的热门工作流，第 2 页
GET /api/workflows/popular?period=30d&page=2&limit=10
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/workflows/popular?period=7d&limit=10" \
  -H "Cookie: next-auth.session-token=xxx"
```

---

#### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Example Workflow",
      "description": "Workflow description",
      "version": "1.0.0",
      "author": "John Doe",
      "ccPath": "/path/to/workflow.zip",
      "status": "deployed",
      "visibility": "public",
      "deployedAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z",
      "metadata": {
        "tags": ["development", "automation"]
      },
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "stats": {
        "totalLoads": 1234,
        "weekLoads": 567,
        "monthLoads": 890,
        "favoriteCount": 45,
        "rating": 4.5,
        "ratingCount": 42,
        "popularityScore": 1324
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid period. Must be one of: 7d, 30d, all"
}
```

---

#### Technical Details

**Sorting Logic:**

- `period=all`: 按 `stats.totalLoads` 降序排序
- `period=7d`: 按 `stats.weekLoads` 降序排序
- `period=30d`: 按 `stats.monthLoads` 降序排序

**Popularity Score Calculation:**

```typescript
popularityScore = totalLoads * 1 + favoriteCount * 2
```

---

#### Usage Example (React Query)

```typescript
import { useQuery } from '@tanstack/react-query';

function usePopularWorkflows(period: string = 'all', page: number = 1) {
  return useQuery({
    queryKey: ['workflows', 'popular', { period, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        period,
        page: page.toString(),
      });

      const response = await fetch(`/api/workflows/popular?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch popular workflows');
      }

      return data;
    },
  });
}

// 使用示例
const { data, isLoading, error } = usePopularWorkflows('7d', 1);
```

---

### 2. Load Workflow API

**Endpoint:** `POST /api/workflows/[id]/load`

**Description:** 加载工作流并返回配置文件内容

**Authentication:** 必需

---

#### Request

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | 工作流 ID |

**Request Body:** 无

**Example Request:**

```bash
POST /api/workflows/123e4567-e89b-12d3-a456-426614174000/load
```

**cURL Example:**

```bash
curl -X POST "http://localhost:3000/api/workflows/123e4567-e89b-12d3-a456-426614174000/load" \
  -H "Cookie: next-auth.session-token=xxx"
```

---

#### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Workflow \"Example Workflow\" loaded successfully",
  "data": {
    "workflow": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Example Workflow",
      "description": "Workflow description",
      "version": "1.0.0",
      "author": "John Doe",
      "ccPath": "/path/to/workflow.zip",
      "status": "deployed",
      "visibility": "public",
      "deployedAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z",
      "metadata": {
        "tags": ["development", "automation"]
      },
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "stats": {
        "totalLoads": 1235,
        "todayLoads": 42,
        "weekLoads": 568,
        "monthLoads": 891,
        "favoriteCount": 45,
        "rating": 4.5,
        "ratingCount": 42
      }
    },
    "configFiles": {
      ".claude/project.md": {
        "exists": true,
        "content": "# Project Configuration\n\nProject description..."
      },
      ".claude/agents.md": {
        "exists": true,
        "content": "# Agents\n\nAgent definitions..."
      },
      ".claude/workspace.md": {
        "exists": false
      },
      ".claude/instructions.md": {
        "exists": false
      },
      ".claude/tools.md": {
        "exists": false
      }
    }
  }
}
```

**Error Responses:**

**401 Unauthorized:**

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**403 Forbidden:**

```json
{
  "error": "FORBIDDEN",
  "message": "Cannot load private workflows owned by others"
}
```

**404 Not Found:**

```json
{
  "error": "NOT_FOUND",
  "message": "Workflow not found"
}
```

---

#### Technical Details

**Config Files Read:**

- `.claude/project.md`
- `.claude/agents.md`
- `.claude/workspace.md`
- `.claude/instructions.md`
- `.claude/tools.md`

**Stats Update:**

当工作流被加载时，以下统计字段会自动递增：

- `totalLoads` (+1)
- `todayLoads` (+1)
- `weekLoads` (+1)
- `monthLoads` (+1)
- `lastUsedAt` (更新为当前时间)

---

#### Usage Example (React Query)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useLoadWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await fetch(`/api/workflows/${workflowId}/load`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load workflow');
      }

      return data;
    },
    onSuccess: (data, workflowId) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['workflows', 'detail', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'popular'] });

      // 处理工作流数据
      console.log('Workflow loaded:', data.data);
    },
  });
}

// 使用示例
const loadWorkflow = useLoadWorkflow();

const handleLoad = (workflowId: string) => {
  loadWorkflow.mutate(workflowId);
};
```

---

### 3. Favorite Workflow API

**Endpoints:**

- `POST /api/workflows/[id]/favorite` - 收藏/取消收藏
- `GET /api/workflows/[id]/favorite` - 查询收藏状态
- `DELETE /api/workflows/[id]/favorite` - 取消收藏（显式）
- `GET /api/workflows/favorites` - 获取收藏列表

**Authentication:** 必需

---

#### 3.1 POST Favorite Workflow

**Endpoint:** `POST /api/workflows/[id]/favorite`

**Description:** 收藏或取消收藏工作流（切换状态）

---

##### Request

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | 工作流 ID |

**Request Body:**

```json
{
  "isFavorited": true
}
```

| Field       | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `isFavorited` | boolean | Yes      | `true`=收藏, `false`=取消收藏 |

**Example Request:**

```bash
POST /api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite

Body:
{
  "isFavorited": true
}
```

**cURL Example:**

```bash
curl -X POST "http://localhost:3000/api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=xxx" \
  -d '{"isFavorited": true}'
```

---

##### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "isFavorited": true,
  "message": "Workflow \"Example Workflow\" has been added to favorites"
}
```

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "VALIDATION_ERROR",
  "message": "isFavorited must be a boolean"
}
```

**403 Forbidden:**

```json
{
  "error": "FORBIDDEN",
  "message": "Cannot favorite private workflows owned by others"
}
```

---

##### Technical Details

**Stats Update:**

- 收藏时：`favoriteCount` (+1)
- 取消收藏时：`favoriteCount` (-1)

**Idempotency:**

重复收藏不会报错（数据库唯一约束）。

---

#### 3.2 GET Favorite Status

**Endpoint:** `GET /api/workflows/[id]/favorite`

**Description:** 查询工作流的收藏状态

---

##### Request

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | 工作流 ID |

**Example Request:**

```bash
GET /api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite" \
  -H "Cookie: next-auth.session-token=xxx"
```

---

##### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "isFavorited": true
}
```

---

#### 3.3 DELETE Favorite Workflow

**Endpoint:** `DELETE /api/workflows/[id]/favorite`

**Description:** 取消收藏工作流（显式删除）

---

##### Request

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | 工作流 ID |

**Example Request:**

```bash
DELETE /api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite
```

**cURL Example:**

```bash
curl -X DELETE "http://localhost:3000/api/workflows/123e4567-e89b-12d3-a456-426614174000/favorite" \
  -H "Cookie: next-auth.session-token=xxx"
```

---

##### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Workflow has been removed from favorites"
}
```

---

#### 3.4 GET Favorite List

**Endpoint:** `GET /api/workflows/favorites`

**Description:** 获取当前用户的收藏列表

---

##### Request

**Query Parameters:**

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| `page`    | number | No       | `1`     | 页码 |
| `limit`   | number | No       | `20`    | 每页数量（最大 100） |
| `search`  | string | No       | -       | 搜索关键词 |
| `sortBy`  | string | No       | `createdAt` | 排序字段：`createdAt`, `name`, `updatedAt` |
| `sortOrder` | string | No       | `desc`  | 排序方向：`asc`, `desc` |

**Example Request:**

```bash
# 获取收藏列表（第 1 页）
GET /api/workflows/favorites

# 搜索收藏的工作流
GET /api/workflows/favorites?search=api

# 按名称升序排序
GET /api/workflows/favorites?sortBy=name&sortOrder=asc
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/workflows/favorites?page=1&limit=10" \
  -H "Cookie: next-auth.session-token=xxx"
```

---

##### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Example Workflow",
      "description": "Workflow description",
      "version": "1.0.0",
      "author": "John Doe",
      "ccPath": "/path/to/workflow.zip",
      "status": "deployed",
      "visibility": "public",
      "deployedAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "stats": {
        "totalLoads": 1234,
        "favoriteCount": 45,
        "rating": 4.5
      },
      "favoritedAt": "2025-02-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

#### Usage Example (React Query)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 收藏/取消收藏
function useToggleWorkflowFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId, isFavorited }: { workflowId: string; isFavorited: boolean }) => {
      const response = await fetch(`/api/workflows/${workflowId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorited }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle favorite');
      }

      return data;
    },
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['workflows', 'favorites'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'popular'] });
    },
  });
}

// 查询收藏状态
function useWorkflowFavoriteStatus(workflowId: string) {
  return useQuery({
    queryKey: ['workflows', 'favorite', workflowId],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${workflowId}/favorite`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch favorite status');
      }

      return data;
    },
  });
}

// 查询收藏列表
function useFavoriteWorkflows(page: number = 1) {
  return useQuery({
    queryKey: ['workflows', 'favorites', page],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/favorites?page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch favorite workflows');
      }

      return data;
    },
  });
}
```

---

## Error Handling

所有 API 端点使用统一的错误响应格式：

```json
{
  "error": "ERROR_CODE",
  "message": "User-friendly error message",
  "details": "Detailed error (development only)"
}
```

### Common Error Codes

| Error Code | Status | Description |
|------------|--------|-------------|
| `UNAUTHORIZED` | 401 | 未认证 |
| `FORBIDDEN` | 403 | 无权限 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 请求参数错误 |
| `CONFLICT` | 409 | 资源冲突（如重复创建） |
| `TOO_MANY_REQUESTS` | 429 | 请求过频 |
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 |

---

## Statistics

### WorkflowStats Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalLoads` | number | 总加载次数 |
| `todayLoads` | number | 今日加载次数 |
| `weekLoads` | number | 本周加载次数 |
| `monthLoads` | number | 本月加载次数 |
| `favoriteCount` | number | 收藏数 |
| `rating` | number | 平均评分（0-5） |
| `ratingCount` | number | 评分人数 |
| `lastUsedAt` | DateTime | 最近使用时间 |
| `updatedAt` | DateTime | 更新时间 |

### Stats Update Events

| Event | Fields Updated |
|-------|----------------|
| 加载工作流 | `totalLoads`, `todayLoads`, `weekLoads`, `monthLoads`, `lastUsedAt` |
| 收藏工作流 | `favoriteCount` (+1) |
| 取消收藏 | `favoriteCount` (-1) |

---

## Performance Considerations

### Database Indexes

以下索引已创建以确保查询性能：

```sql
-- WorkflowStats
CREATE INDEX idx_workflow_stats_total_loads ON workflow_stats(total_loads DESC);
CREATE INDEX idx_workflow_stats_week_loads ON workflow_stats(week_loads DESC);
CREATE INDEX idx_workflow_stats_month_loads ON workflow_stats(month_loads DESC);

-- WorkflowFavorite
CREATE UNIQUE INDEX idx_workflow_favorite_user_workflow ON workflow_favorites(user_id, workflow_id);
CREATE INDEX idx_workflow_favorite_user_created ON workflow_favorites(user_id, created_at DESC);
CREATE INDEX idx_workflow_favorite_workflow ON workflow_favorites(workflow_id);
```

### Query Optimization

- 使用 `select` 限制返回字段
- 使用 `include` 预加载关联数据
- 分页查询限制结果集（默认 20，最大 100）
- 使用原子操作（`increment: 1`, `decrement: 1`）避免锁竞争

---

## Security

### Authentication

所有需要认证的端点验证用户会话：

```typescript
const session = await getSession();
if (!session?.userId || !session.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Authorization

- 私有工作流只能被创建者访问
- 公开工作流可以被所有用户访问
- 只能收藏公开工作流或自己的私有工作流

### Input Validation

所有输入参数都经过验证：

```typescript
// 验证 period 参数
const validPeriods = ['7d', '30d', 'all'];
if (!validPeriods.includes(period)) {
  return NextResponse.json(
    { error: 'VALIDATION_ERROR', message: `Invalid period` },
    { status: 400 }
  );
}
```

---

## Testing

### API Endpoints Test Plan

#### Popular Workflows API
- [x] GET /api/workflows/popular without authentication
- [x] GET /api/workflows/popular with authentication
- [x] GET /api/workflows/popular?period=7d
- [x] GET /api/workflows/popular?period=30d
- [x] GET /api/workflows/popular?limit=10
- [x] GET /api/workflows/popular?page=2
- [x] Invalid period parameter (should return 400)

#### Load Workflow API
- [x] POST /api/workflows/[id]/load without authentication (should return 401)
- [x] POST /api/workflows/[id]/load with public workflow
- [x] POST /api/workflows/[id]/load with own private workflow
- [x] POST /api/workflows/[id]/load with other's private workflow (should return 403)
- [x] POST /api/workflows/[non-existent-id]/load (should return 404)
- [x] Stats update (totalLoads incremented)

#### Favorite APIs with Stats
- [x] POST /api/workflows/[id]/favorite - favorite (favoriteCount incremented)
- [x] POST /api/workflows/[id]/favorite - unfavorite (favoriteCount decremented)
- [x] DELETE /api/workflows/[id]/favorite (favoriteCount decremented)
- [x] POST /api/workflows/[id]/favorite twice (idempotent)
- [x] Stats auto-creation when table doesn't exist

### Running Tests

```bash
# 运行 API 测试
npm run test:epic4

# 或直接运行 TypeScript 测试脚本
npx tsx src/lib/test-epic4-api.ts
```

---

## Next Steps

### For Frontend Team

1. 集成热门工作流 API
2. 集成加载工作流 API
3. 验证收藏功能 UI
4. 测试乐观更新（Optimistic Updates）

### For QA Team

1. 手动测试所有 API 端点
2. 负载测试热门 API
3. 安全测试（认证、授权）
4. 性能测试（查询响应时间）

---

## Contact

如有问题，请联系：

- **Backend Engineer:** [Contact Info]
- **Project Repo:** `/Users/archersado/clawd/projects/AuraForce`
- **Progress Report:** `docs/pm/tracking/EPIC-4-SPRINT-2-BACKEND-PROGRESS.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-02-03
**Status:** ✅ **Completed**
