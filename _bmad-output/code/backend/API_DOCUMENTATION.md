/**
 * Backend API Documentation
 *
 * This document describes all API endpoints for:
 * - Epic 14: Workspace Editor & File Management
 * - Epic 5: Success Case Experience Center
 */

---

## API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/auraforce/api`

### Authentication
- All endpoints (except public ones) require authentication
- Use session cookies for authentication
- Authenticated users have session cookie `auraforce-session-token`

### Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

---

## Workspace API

### Workspace Files

#### GET /workspace/files
**Description:** Get file tree for user's workspace

**Authentication:** Required

**Query Parameters:**
- None

**Response:**
```json
{
  "success": true,
  "tree": [
    {
      "id": "string",
      "name": "string",
      "path": "/path/to/file",
      "type": "file|folder",
      "size": 1234,
      "modifiedAt": "2024-01-01T00:00:00.000Z",
      "children": []
    }
  ]
}
```

#### POST /workspace/files
**Description:** Create new file or folder

**Authentication:** Required

**Request Body:**
```json
{
  "path": "/src/newfile.ts",
  "type": "file",
  "content": "// code here"
}
```

**Parameters:**
- `path` (required, string): Path for the new file/folder
- `type` (required, string): "file" or "folder"
- `content` (optional, string): Initial content for files

**Response:**
```json
{
  "success": true,
  "message": "File created successfully",
  "path": "/src/newfile.ts"
}
```

#### PUT /workspace/files
**Description:** Update file content

**Authentication:** Required

**Request Body:**
```json
{
  "path": "/src/file.ts",
  "content": "// updated code"
}
```

**Parameters:**
- `path` (required, string): Path of the file to update
- `content` (required, string): New file content

**Response:**
```json
{
  "success": true,
  "message": "File saved successfully"
}
```

#### DELETE /workspace/files
**Description:** Delete file or folder

**Authentication:** Required

**Query Parameters:**
- `path` (required, string): Path of the file/folder to delete

**Response:**
```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

### Workspace Read

#### GET /workspace/read
**Description:** Read file content

**Authentication:** Required

**Query Parameters:**
- `path` (required, string): Path of the file to read

**Response:**
```json
{
  "success": true,
  "path": "/src/file.ts",
  "content": "file content here",
  "size": 1234,
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### Workspace Upload

#### POST /workspace/upload
**Description:** Upload file(s) to workspace

**Authentication:** Required

**Request:** `multipart/form-data`
- `files` (required): One or more files
- `path` (optional, string): Target directory path (default: "/")

**Response:**
```json
{
  "success": true,
  "message": "2 file(s) uploaded successfully",
  "files": [
    {
      "name": "file.txt",
      "originalName": "file.txt",
      "path": "/uploads/file.txt",
      "size": 1234,
      "type": "text/plain"
    }
  ]
}
```

### Workspace Search

#### GET /workspace/search
**Description:** Search files in workspace

**Authentication:** Required

**Query Parameters:**
- `q` (required, string): Search query
- `type` (optional, string): Filter by file type (code, markdown, image, pdf, ppt, other)
- `content` (optional, boolean): Search in file contents (default: false)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "name": "file.ts",
      "path": "/src/file.ts",
      "type": "code",
      "size": 1234,
      "modifiedAt": "2024-01-01T00:00:00.000Z",
      "matches": 5,
      "preview": "matching line..."
    }
  ],
  "count": 1,
  "query": "search term"
}
```

---

## Experience API

### Industries & Cases

#### GET /experience/industries
**Description:** Get list of available industries

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "industries": [
    {
      "id": "ecommerce",
      "name": "E-commerce",
      "icon": "🛒",
      "description": "Online retail success stories"
    }
  ]
}
```

#### GET /experience/cases
**Description:** Get success cases for an industry

**Authentication:** Required

**Query Parameters:**
- `industry` (required, string): Industry ID

**Response:**
```json
{
  "success": true,
  "cases": [
    {
      "id": "ecommerce-1",
      "title": "Platform Launch Challenge",
      "industry": "ecommerce",
      "description": "Experience the journey...",
      "duration": 30,
      "difficulty": "beginner",
      "category": "Growth",
      "image": "/images/cases/ecommerce-1.jpg",
      "tags": ["startup", "growth", "marketing"],
      "outcomes": ["Customer acquisition", "Product-market fit"]
    }
  ],
  "industry": "ecommerce"
}
```

### Experience Session

#### POST /experience/start
**Description:** Start a new experience session

**Authentication:** Required

**Request Body:**
```json
{
  "caseId": "ecommerce-1",
  "profile": { },
  "industry": "ecommerce"
}
```

**Parameters:**
- `caseId` (required, string): Case ID to start
- `profile` (optional, object): User profile data
- `industry` (optional, string): Industry ID

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "clx...",
    "userId": "user-id",
    "caseId": "ecommerce-1",
    "industry": "ecommerce",
    "startedAt": "2024-01-01T00:00:00.000Z",
    "status": "in_progress"
  },
  "case": { }
}
```

#### POST /experience/ask
**Description:** Ask AI assistant during experience

**Authentication:** Required

**Request Body:**
```json
{
  "sessionId": "session-id",
  "question": "What should I do here?",
  "context": { }
}
```

**Parameters:**
- `sessionId` (required, string): Session ID
- `question` (required, string): User's question
- `context` (optional, object): Additional context

**Response:**
```json
{
  "success": true,
  "response": {
    "role": "assistant",
    "content": "Based on your question...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /experience/complete
**Description:** Complete an experience session

**Authentication:** Required

**Request Body:**
```json
{
  "sessionId": "session-id",
  "duration": 1800,
  "score": 85,
  "decisions": [
    {
      "step": 1,
      "decision": "decided to invest",
      "outcome": "good result"
    }
  ]
}
```

**Parameters:**
- `sessionId` (required, string): Session ID
- `duration` (optional, number): Time spent in seconds
- `score` (optional, number): Final score (0-100)
- `decisions` (optional, array): List of decisions made

**Response:**
```json
{
  "success": true,
  "session": { },
  "history": {
    "id": "history-id",
    "caseId": "ecommerce-1",
    "caseTitle": "Platform Launch Challenge",
    "industry": "ecommerce",
    "completedAt": "2024-01-01T00:00:00.000Z",
    "duration": 1800,
    "score": 85,
    "strategy": "balanced"
  },
  "score": 85
}
```

### Experience History

#### GET /experience/history
**Description:** Get user's experience history

**Authentication:** Required

**Query Parameters:**
- `limit` (optional, number): Number of records to return (default: 50)
- `offset` (optional, number): Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "history-id",
      "caseId": "ecommerce-1",
      "caseTitle": "Platform Launch Challenge",
      "industry": "ecommerce",
      "completedAt": "2024-01-01T00:00:00.000Z",
      "duration": 1800,
      "score": 85,
      "strategy": "balanced"
    }
  ],
  "count": 1
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input or missing parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limits

- Standard endpoints: 60 requests per minute
- Upload endpoints: 10 requests per minute
- Search endpoints: 30 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until limit resets (when limited)
