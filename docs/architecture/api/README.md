# API Documentation - API 文档

本目录包含 AuraForce 项目 的 API 设计和文档。

## 📋 API 规范

### RESTful API 原则
- 使用 HTTP 方法 (GET, POST, PUT, DELETE)
- 资源导向的 URL 设计
- 使用标准的 HTTP 状态码
- 统一的响应格式

### API 版本管理
- URL 版本：`/api/v1/...`
- Header 版本：`API-Version: v1`
- 向后兼容策略

---

## 📝 API 文档模板

```markdown
# [API 名称]

## 基本信息
- **路径**: /api/v1/[路径]
- **方法**: GET/POST/PUT/DELETE
- **认证**: 需要/不需要
- **权限**: [权限要求]

## 描述
[API 的功能描述]

## 请求参数

### 路径参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| id | string | 是 | 资源 ID |

### 查询参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| page | number | 否 | 页码 (默认 1) |
| limit | number | 否 | 每页数 (默认 20) |

### 请求体
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

## 响应

### 成功响应
```json
{
  "success": true,
  "data": {
    "id": "123",
    "field1": "value1"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 状态码
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

## 示例

### 请求
```bash
 curl -X GET /api/v1/resource/123 \
  -H "Authorization: Bearer <token>"
```

### 响应
```json
{
  "id": "123",
  "field1": "value1"
}
```

## 相关资源
- 关联 API: [API 名称](./xxx.md)
- 相关需求: [Story ID]
```

---

## 📚 API 列表

### 用户认证
| API | 路径 | 方法 | 状态 |
|-----|------|------|------|
| - | - | - | - |

### 用户管理
| API | 路径 | 方法 | 状态 |
|-----|------|------|------|
| - | - | - | - |

### 内容管理
| API | 路径 | 方法 | 状态 |
|-----|------|------|------|
| - | - | - | - |

---

## 🔐 认证方式

### JWT Token
```
Authorization: Bearer <token>
```

### OAuth 2.0
支持 Google, GitHub 等 OAuth 提供商

---

## ⚠️ 常见错误码

| Code | 描述 | HTTP Status |
|------|------|-------------|
| INVALID_TOKEN | Token 无效 | 401 |
| EXPIRED_TOKEN | Token 过期 | 401 |
| INSUFFICIENT_PERMISSIONS | 权限不足 | 403 |
| RESOURCE_NOT_FOUND | 资源未找到 | 404 |
| INTERNAL_SERVER_ERROR | 服务器错误 | 500 |

---

## 📊 API 性能

- 平均响应时间: < 200ms
- P95 响应时间: < 500ms
- P99 响应时间: < 1000ms
- QPS: > 1000

---

## 🔗 相关链接

- [系统设计](../design/README.md) - 系统架构设计
- [数据库设计](../database/README.md) - 数据库 schema

---

**最后更新：** 2025-02-02
