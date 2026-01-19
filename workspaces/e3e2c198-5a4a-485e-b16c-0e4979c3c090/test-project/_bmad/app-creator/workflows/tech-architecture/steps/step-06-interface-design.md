---
name: 'step-06-interface-design'
description: 'Define API interfaces and communication protocols'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 6: Interface Design

Define comprehensive API specifications, endpoints, protocols, and data contracts.

## DIALOGUE SECTIONS:

### 1. API Design Overview
"**🔌 API接口设计**

我将设计完整的API接口规范，包括端点定义、请求/响应格式、认证授权和错误处理机制。"

### 2. API Architecture & Style
"**📐 API架构风格**

确认API设计模式："

Define API approach:

#### RESTful API Design (Default for MVP)
-Resource-based: `/users`, `/orders`, `/products`
-HTTP Methods: GET, POST, PUT, PATCH, DELETE
-Status Codes: Appropriate HTTP status codes
-Stateless: No session state on server
-JSON: Standard response format

#### GraphQL (Alternative)
-Single endpoint, flexible queries
-Schema-first design
-Type system
-Real-time with subscriptions

*Recommend RESTful for MVP, GraphQL for complex client needs.*

### 3. API Endpoint Specification
"**📋 API端点规范**

定义所有API端点："

Design comprehensive endpoints:

#### Authentication Endpoints
```yaml
POST   /api/auth/register
  Description: Register new user
  Request Body: {
    email: string,
    password: string,
    first_name?: string,
    last_name?: string
  }
  Response: {
    success: true,
    data: {
      user: User,
      token: string
    }
  }
  Status Codes: 201 Created, 400 Bad Request, 409 Conflict

POST   /api/auth/login
  Description: Login with credentials
  Request Body: {
    email: string,
    password: string
  }
  Response: {
    success: true,
    data: {
      user: User,
      token: string,
      refreshToken: string
    }
  }
  Status Codes: 200 OK, 401 Unauthorized

POST   /api/auth/refresh
  Description: Refresh access token
  Request Body: {
    refreshToken: string
  }
  Response: {
    success: true,
    data: {
      token: string,
      refreshToken: string
    }
  }
  Status Codes: 200 OK, 401 Unauthorized
```

#### User Endpoints
```yaml
GET    /api/users/me
  Description: Get current user info
  Auth Required: Yes
  Response: {
    success: true,
    data: User
  }

PUT    /api/users/me
  Description: Update current user profile
  Auth Required: Yes
  Request Body: Partial<User>
  Response: {
    success: true,
    data: User
  }

GET    /api/users/:id
  Description: Get user by ID (if public profiles)
  Auth Required: Optional
  Response: {
    success: true,
    data: PublicUser
  }
```

#### [Resource] Endpoints
Define CRUD endpoints for each major resource:

```yaml
GET    /api/[resource]
  Description: List [resources]
  Query Params: page, limit, sort, filter
  Response: {
    success: true,
    data: [Resource],
    pagination: { page, limit, total, totalPages }
  }

GET    /api/[resource]/:id
  Description: Get [resource] by ID
  Response: {
    success: true,
    data: Resource
  }

POST   /api/[resource]
  Description: Create new [resource]
  Auth Required: Yes
  Request Body: Create[Resource]Dto
  Response: {
    success: true,
    data: Resource
  }

PUT    /api/[resource]/:id
  Description: Update [resource]
  Auth Required: Yes
  Request Body: Update[Resource]Dto
  Response: {
    success: true,
    data: Resource
  }

DELETE /api/[resource]/:id
  Description: Delete [resource]
  Auth Required: Yes
  Response: {
    success: true,
    message: "[Resource] deleted successfully"
  }
```

### 4. Request/Response Format Standards
"**📦 请求响应格式**

定义统一的JSON格式标准："

#### Standard Response Format
```typescript
// Success Response
{
  "success": true,
  "data": <any>,
  "message": "Operation successful (optional)",
  "meta": {
    "timestamp": "2024-01-07T10:00:00Z"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-07T10:00:00Z"
  }
}

// Paginated Response
{
  "success": true,
  "data": <items[]>,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Request Validation
Define input validation rules:
- Required fields
- Data types
- String formats (email, URL, regex)
- Value ranges
- Custom validation rules

### 5. Authentication & Authorization
"**🔐 认证授权**

定义安全访问机制："

#### Authentication Strategy
```typescript
// JWT-based Authentication
Header: Authorization: Bearer <jwt_token>

Token payload: {
  sub: "user_id",
  email: "user@example.com",
  role: "user",
  iat: 1234567890,
  exp: 1234571490
}

Access token lifetime: 15 minutes
Refresh token lifetime: 7 days
```

#### Authorization Levels
- **Public**: No auth required (e.g., `/api/products`)
- **User**: Logged-in user only (e.g., `/api/users/me`)
- **Admin**: Admin role only (e.g., `/api/admin/*`)
- **Owner**: Resource owner only (e.g., `/api/users/:id` requires user matches)

#### Middleware Design
```typescript
// Auth middleware
function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'No token' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  req.user = decoded;
  next();
}

// Role-based authorization
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

### 6. Error Handling Standards
"**⚠️ 错误处理标准**

定义全面的错误处理机制："

#### HTTP Status Codes
```yaml
2xx Success:
  200 OK              - Successful request
  201 Created         - Resource created
  204 No Content      - Successful with no content

4xx Client Errors:
  400 Bad Request     - Invalid request body
  401 Unauthorized    - Not authenticated
  403 Forbidden       - Insufficient permissions
  404 Not Found       - Resource not found
  409 Conflict        - Resource conflict
  422 Unprocessable   - Validation errors
  429 Too Many Requests - Rate limit exceeded

5xx Server Errors:
  500 Internal Error  - Unexpected server error
  503 Service Unavailable - Service down
```

#### Error Codes
```typescript
enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',

  // Authorization errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Resource errors (404, 409)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_EXISTS = 'RESOURCE_EXISTS',

  // Server errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}
```

### 7. Rate Limiting & Throttling
"**🚦 速率限制**

防止API滥用："

Define rate limiting strategy:
- **Per IP**: 100 requests per minute
- **Per User**: 1000 requests per hour (authenticated)
- **Per Endpoint**: Custom limits for expensive operations

```typescript
// Rate limit headers
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641523200
```

### 8. API Versioning Strategy
"**🔄 API版本管理**

规划API演进策略：**

Approaches:
1. **URL Versioning**: `/api/v1/users` (Recommended for MVP)
2. **Header Versioning**: Accept: application/vnd.api.v1+json
3. **Query Parameter**: `/api/users?version=1`

*Recommend URL versioning for clarity and simplicity.*

Version lifecycle:
- **Current**: `/api/v1/` - Latest stable
- **Deprecated**: `/api/v2/` - Still supported
- **Retired**: `/api/v3/` - No longer supported

### 9. API Documentation Strategy
"**📚 API文档**

规划API文档方案："

Options:
- **OpenAPI/Swagger**: Industry standard, auto-generated
- **Postman Collections**: Sharing and testing
- **Custom Docs**: Built-in documentation pages

*Recommend OpenAPI with Swagger UI for interactive documentation.*

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 6. 接口设计

### 6.1 API架构风格
[Chosen API style with rationale]

### 6.2 API端点规范

#### 认证端点
[Auth endpoints complete specification]

#### 用户端点
[User endpoints complete specification]

#### [资源]端点
[Resource endpoints]

### 6.3 请求响应格式

#### 标准响应格式
[JSON format examples]

#### 请求验证规则
[Validation rules]

### 6.4 认证授权

#### 认证策略
[JWT token details]

#### 授权级别
[Role-based authorization]

#### 中间件设计
[Auth middleware implementations]

### 6.5 错误处理

#### HTTP状态码
[Status code mappings]

#### 错误代码
[Error code definitions]

### 6.6 速率限制
[Rate limiting strategy]

### 6.7 API版本管理
[Versioning approach]

### 6.8 API文档方案
[Documentation strategy]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6]
lastStep: 'interface-design'
```

## NEXT:

"**✅ 接口设计完成**

我们定义了完整的API接口规范。

**📋 API摘要**:
- 端点总数: `[X] 个`
- 认证策略: `[JWT]`
- 错误代码: `[X] 个`
- 版本管理: `[URL versioning]`

**下一步**: 安全与性能 - 我们将制定安全架构方案和性能优化策略。"

## CRITICAL NOTES:

- Follow RESTful conventions consistently
- Use descriptive resource names (plural nouns)
- Think about pagination and filtering from the start
- Consider caching strategy for GET endpoints
- Document all endpoints thoroughly for developers
- Consider backward compatibility as API evolves
- Use sidecar knowledge for security patterns and best practices
