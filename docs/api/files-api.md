# Files API Documentation

## Overview

The Files API provides comprehensive file and directory management capabilities for the Workspace Editor. All endpoints secure with authentication and path traversal protection.

---

## Base Endpoint

```
/api/files
```

---

## Authentication

All endpoints require authentication via custom session system. Request must include a valid session cookie.

---

## Endpoints

### 1. Create File

**Endpoint:** `POST /api/files/create`

Creates a new empty file (or file with initial content).

**Request Body:**
```json
{
  "path": "src/new-file.ts",
  "content": "// Initial content (optional)",
  "root": "/path/to/workspace/root" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "File created successfully",
  "metadata": {
    "path": "src/new-file.ts",
    "size": 20,
    "lastModified": "2025-02-02T10:00:00.000Z",
    "filename": "new-file.ts"
  }
}
```

**Features:**
- Creates new files with optional initial content
- Validates filename (no special characters, reserved names)
- Prevents path traversal attacks
- Returns file metadata after creation

**Errors:**
- `400` - Invalid filename, empty path, or parent directory doesn't exist
- `401` - Unauthorized
- `409` - File already exists
- `500` - Internal server error

---

### 2. Read File

**Endpoint:** `GET /api/files/read?path=src/file.ts&root=/path/to/root`

Reads file content with metadata.

**Query Parameters:**
- `path` (required) - Relative file path
- `root` (optional) - Workspace root directory

**Response:**
```json
{
  "content": "file content here...",
  "metadata": {
    "path": "src/file.ts",
    "size": 1024,
    "lastModified": "2025-02-02T10:00:00.000Z",
    "mimeType": "text/typescript",
    "filename": "file.ts"
  },
  "isLarge": false,
  "warning": null
}
```

**Features:**
- Returns file content and metadata
- Detects and warns about large files
- Detects binary files
- Max read size: 5MB

**Errors:**
- `400` - Invalid path or path is a directory
- `401` - Unauthorized
- `403` - Path traversal attempt or permission denied
- `404` - File not found
- `413` - File too large

---

### 3. Update File

**Endpoint:** `PUT /api/files/write`

Updates/overwrites file content.

**Request Body:**
```json
{
  "path": "src/file.ts",
  "content": "updated content",
  "root": "/path/to/workspace/root", // optional
  "createIfMissing": true // create parent directories if needed
}
```

**Response:**
```json
{
  "success": true,
  "message": "File saved successfully",
  "metadata": {
    "path": "src/file.ts",
    "size": 2048,
    "lastModified": "2025-02-02T11:00:00.000Z",
    "filename": "file.ts"
  }
}
```

**Features:**
- Overwrites existing file content
- Creates parent directories if requested
- Max write size: 2MB
- Returns updated metadata

**Errors:**
- `400` - Invalid parameters or content too large
- `401` - Unauthorized
- `403` - Path traversal attempt
- `500` - Internal server error

---

### 4. Delete File

**Endpoint:** `DELETE /api/files/delete?path=src/file.ts&confirmed=true`

Deletes a single file.

**Query Parameters:**
- `path` (required) - Relative file path
- `confirmed` (optional) - Set to `true` to confirm deletion

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "deletedPath": "src/file.ts"
}
```

**Features:**
- Safe deletion with confirmation requirement
- Protects critical files (package.json, etc.)
- Cannot delete directories (use batch delete)

**Errors:**
- `400` - Invalid path or path is a directory
- `401` - Unauthorized
- `403` - Path traversal, permission denied, or protected file
- `404` - File not found
- `500` - Internal server error

---

### 5. Rename File

**Endpoint:** `POST /api/files/rename`

Renames a file or directory.

**Request Body:**
```json
{
  "currentPath": "src/old-name.ts",
  "newName": "new-name.ts",
  "workspaceRoot": "/path/to/workspace"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully renamed to \"new-name.ts\"",
  "oldPath": "src/old-name.ts",
  "newPath": "src/new-name.ts",
  "filename": "new-name.ts"
}
```

**Features:**
- Validates new name (no invalid characters)
- Prevents name conflicts
- Works for both files and directories

**Errors:**
- `400` - Invalid parameters or new name
- `401` - Unauthorized
- `404` - Source doesn't exist
- `409` - Destination already exists
- `500` - Internal server error

---

### 6. Move File

**Endpoint:** `POST /api/files/move`

Moves a file or directory to a new location.

**Request Body:**
```json
{
  "sourcePath": "src/file.ts",
  "destinationPath": "components/file.ts",
  "workspaceRoot": "/path/to/workspace"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully moved to \"components/file.ts\"",
  "oldPath": "src/file.ts",
  "newPath": "components/file.ts",
  "filename": "file.ts"
}
```

**Features:**
- Moves files and directories
- Creates destination directory if needed
- Prevents conflicts

**Errors:**
- `400` - Invalid parameters or paths are the same
- `401` - Unauthorized
- `404` - Source doesn't exist
- `409` - Destination already exists
- `500` - Internal server error

---

### 7. Upload File

**Endpoint:** `POST /api/files/upload`

Uploads one or multiple files.

**Request Type:** `multipart/form-data`

**Form Fields:**
- `files` - File objects (can be multiple)
- `path` - Target directory path (default: `/`)

**Response (Regular Upload):**
```json
{
  "success": true,
  "uploaded": 2,
  "results": [
    {
      "name": "file.txt",
      "path": "/uploads/file-abc123.txt",
      "size": 1024,
      "type": "text/plain",
      "uploadedAt": "2025-02-02T12:00:00.000Z",
      "success": true
    }
  ],
  "errors": [],
  "targetPath": "/uploads"
}
```

**Response (Chunked Upload - Last Chunk):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "name": "large-file.zip",
    "path": "/uploads/large-file.zip",
    "size": 524288000,
    "type": "application/zip",
    "uploaded": true
  },
  "totalSize": 524288000,
  "totalChunks": 105,
  "chunksReceived": 105
}
```

**Chunked Upload Flow:**

For files > 200MB, use chunked upload:

1. **Split file** into 5MB chunks
2. **Upload each chunk** with these form fields:
   - `files` - Chunk data
   - `path` - Target directory
   - `chunkIndex` - Current chunk index (0-based)
   - `totalChunks` - Total number of chunks
   - `fileId` - Unique identifier for this upload
   - `originalName` - Original filename
   - `totalSize` - Total file size

3. **Last chunk response** contains the assembled file

**Features:**
- Multiple file upload in single request
- Supports files up to 200MB (without chunking)
- ChunkED upload support for very large files (>200MB)
- 5MB chunk size for chunked uploads
- Automatic directory creation

**Errors:**
- `400` - Invalid parameters or no files provided
- `413` - File too large for regular upload (use chunked upload)
- `500` - Internal server error

---

### 8. Download File

**Endpoint:** `GET /api/files/download?path=src/file.txt&name=custom-name.txt`

Downloads a file.

**Query Parameters:**
- `path` (required) - Relative file path
- `name` (optional) - Custom filename for download
- `root` (optional) - Workspace root directory

**Response:**
- Content-Type: Determined by file extension
- Content-Disposition: `attachment; filename="filename.ext"`
- Content-Length: File size

**Features:**
- Binary and text file support
- Custom download filename
- Range-ready (supports resuming downloads)
- Max download size: 100MB

**Errors:**
- `400` - Invalid path or path is a directory
- `401` - Unauthorized
- `403` - Path traversal attempt
- `404` - File not found
- `413` - File too large

---

### 9. Batch Delete

**Endpoint:** `DELETE /api/files/batch-delete`

Deletes multiple files in a single request.

**Request Body:**
```json
{
  "paths": [
    "src/file1.ts",
    "src/file2.ts",
    "components/deprecated.ts"
  ],
  "root": "/path/to/workspace/root", // optional
  "confirmed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Processed deletion of 3 file(s)",
  "results": {
    "successful": ["src/file1.ts", "src/file2.ts"],
    "failed": [],
    "skipped": []
  },
  "summary": {
    "total": 3,
    "successful": 2,
    "failed": 0,
    "skipped": 1
  }
}
```

**Features:**
- Delete up to 100 files per request
- Requires confirmation for safety
- Skips protected files
- Returns detailed results for each file

**Errors:**
- `400` - Invalid parameters
- `401` - Unauthorized
- `413` - Too many files (>100)
- `500` - Internal server error

---

### 10. List Directory

**Endpoint:** `GET /api/files/list?path=/src&root=/path/to/root`

Lists directory contents.

**Query Parameters:**
- `path` (optional) - Directory path (default: workspace root)
- `root` (optional) - Workspace root directory

**Response:**
```json
{
  "root": "/path/to/workspace/root",
  "path": "/src",
  "isRoot": false,
  "files": [
    {
      "name": "components",
      "path": "src/components",
      "type": "directory",
      "lastModified": "2025-02-02T10:00:00.000Z",
      "icon": "📁"
    },
    {
      "name": "app.tsx",
      "path": "src/app.tsx",
      "type": "file",
      "size": 2048,
      "lastModified": "2025-02-02T11:00:00.000Z",
      "icon": "📘"
    }
  ]
}
```

**Features:**
- Lists files and directories
- Shows file type, size, and last modified time
- File icons based on extension
- Excludes .dotfiles and common exclusions (node_modules, etc.)

**Errors:**
- `401` - Unauthorized
- `403` - Path traversal attempt
- `404` - Directory not found
- `500` - Internal server error

---

### 11. Create Directory

**Endpoint:** `POST /api/files/mkdir`

Creates a new directory.

**Request Body:**
```json
{
  "targetPath": "/src",
  "directoryName": "new-folder"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Directory \"new-folder\" created successfully",
  "path": "/src/new-folder",
  "fullPath": "/path/to/workspace/src/new-folder"
}
```

**Features:**
- Creates directories recursively
- Validates directory name
- Prevents duplicates

**Errors:**
- `400` - Invalid parameters or directory already exists
- `404` - Parent directory doesn't exist
- `409` - Directory already exists
- `500` - Internal server error

---

### 12. Get File Metadata

**Endpoint:** `GET /api/files/metadata?path=src/file.txt&includeChildren=true`

Gets detailed file/directory metadata.

**Query Parameters:**
- `path` (required) - File or directory path
- `root` (optional) - Workspace root directory
- `includeChildren` (optional) - Include directory contents (default: false)

**Response:**
```json
{
  "success": true,
  "metadata": {
    "name": "file.txt",
    "path": "/src/file.txt",
    "type": "file",
    "size": 1024,
    "sizeFormatted": "1.00 KB",
    "lastModified": "2025-02-02T10:00:00.000Z",
    "createdAt": "2025-02-01T12:00:00.000Z",
    "mimeType": "text/plain",
    "category": "text",
    "permissions": {
      "mode": 33188,
      "readable": true,
      "writable": true,
      "executable": false
    }
  },
  "root": "/path/to/workspace/root"
}
```

**Features:**
- Detailed metadata including size, timestamps, permissions
- MIME type detection
- File categorization (text, image, audio, video, document, etc.)
- Human-readable file sizes
- Optional inclusion of directory children

**Errors:**
- `401` - Unauthorized
- `403` - Path traversal attempt
- `404` - File or directory not found
- `500` - Internal server error

---

## Security Features

All endpoints include robust security measures:

1. **Authentication**: Custom session system required for all requests
2. **Path Traversal Protection**: All paths validated against workspace root
3. **Excluded Patterns**: Prevents access to sensitive directories (node_modules, .git, etc.)
4. **Protected Files**: Cannot delete critical project files
5. **Size Limits**: Configurable limits on read/write operations
6. **Filename Validation**: Prevents invalid filenames and reserved names

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details" // optional
}
```

Common HTTP status codes:
- `200` - Success
- `202` - Accepted (awaiting confirmation)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized
- `403` - Forbidden (permissions or path traversal)
- `404` - Not Found
- `409` - Conflict (file already exists or name conflict)
- `413` - Payload Too Large (file size exceeded)
- `500` - Internal Server Error

---

## Usage Examples

### Creating and Editing a File

```typescript
// Create new file
const createResponse = await fetch('/api/files/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: 'src/example.ts',
    content: '// New file content'
  })
});

// Read file
const readResponse = await fetch('/api/files/read?path=src/example.ts');

// Update file
const updateResponse = await fetch('/api/files/write', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: 'src/example.ts',
    content: '// Updated content'
  })
});
```

### Uploading Files

```typescript
// Regular upload (single file)
const formData = new FormData();
formData.append('files', fileObject);
formData.append('path', '/uploads');

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
});

// Regular upload (multiple files)
const formData2 = new FormData();
files.forEach(file => formData2.append('files', file));
formData2.append('path', '/uploads');

const response2 = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData2
});
```

### Chunked Upload (Large Files)

```typescript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const fileId = uuidv4();
const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

for (let i = 0; i < totalChunks; i++) {
  const start = i * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);

  const formData = new FormData();
  formData.append('files', chunk);
  formData.append('path', '/uploads');
  formData.append('chunkIndex', i.toString());
  formData.append('totalChunks', totalChunks.toString());
  formData.append('fileId', fileId);
  formData.append('originalName', file.name);
  formData.append('totalSize', file.size.toString());

  await fetch('/api/files/upload', {
    method: 'POST',
    body: formData
  });
}
```

### Deleting Files

```typescript
// Delete single file
await fetch('/api/files/delete?path=src/file.ts&confirmed=true', {
  method: 'DELETE'
});

// Batch delete
await fetch('/api/files/batch-delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paths: ['src/file1.ts', 'src/file2.ts'],
    confirmed: true
  })
});
```

---

## Best Practices

1. **Always use confirmation**: For delete and batch operations, always request user confirmation
2. **Handle large files carefully**: Use chunked upload for files > 200MB
3. **Check file metadata before operations**: Use metadata endpoint to verify file type and size
4. **Handle errors gracefully**: Always check response status and handle errors appropriately
5. **Use relative paths**: Provide paths relative to the workspace root
6. **Validate on client**: Validate filenames and paths before sending to server

---

## Technical Constraints

- **Max read size**: 5MB
- **Max write size**: 2MB
- **Max upload size (without chunking)**: 200MB
- **Max download size**: 100MB
- **Chunk size**: 5MB
- **Max batch delete**: 100 files

---

## Future Enhancements

- [ ] Watch file changes (WebSocket)
- [ ] File versioning/undo
- [ ] File compression/decompression
- [ ] File search API
- [ ] File comparison/diff API
- [ ] Archive management (zip, tar)
