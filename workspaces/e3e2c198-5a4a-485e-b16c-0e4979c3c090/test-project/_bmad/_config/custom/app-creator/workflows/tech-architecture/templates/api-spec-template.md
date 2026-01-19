# API Specification Template

Standard API specification format for documentation.

## REST API Specification

### Endpoint Format

```yaml
[METHOD] /api/[resource]/[id]
  Description: [Brief description]
  Auth Required: Yes/No
  Request Body: [Request schema]
  Query Params: [Query parameters]
  Response: [Response schema]
  Status Codes: [Possible status codes]
  Examples: [Request/response examples]
```

### Response Format Standard

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful (optional)",
  "meta": {
    "timestamp": "2024-01-07T10:00:00Z"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2024-01-07T10:00:00Z"
  }
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 204 | No Content | Successful with no content |
| 400 | Bad Request | Invalid request |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |
| 503 | Unavailable | Service down |

### Common Query Parameters

```yaml
# Pagination
page: integer (default: 1)
limit: integer (default: 20, max: 100)

# Sorting
sort: string (format: field:asc|field:desc)

# Filtering
[field]: string/number/boolean

# Search
search: string (search across relevant fields)

# Fields selection
fields: comma-separated field names
```

### Authentication

```http
Header: Authorization: Bearer <jwt_token>

Token Format:
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Rate Limiting

```http
Response Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641523200
Retry-After: 60
```
