---
# Story 4-X: Workspace File Editor

**Epic**: Epic 4: Agent SDK工作流引擎
**Status**: ready-for-dev
**Priority**: High
**Story Points**: 5
**Estimated Duration**: 1-2 days

## Overview

Provide a rich text editor interface for viewing and modifying workspace files directly within the web UI. This enables users to browse directory structures and edit files without leaving the Claude Code interface.

## User Story

As a Claude Code user,
I want to browse my workspace directory and edit files through the web interface,
So that I can make quick code changes without leaving the browser.

## Background & Context

Currently, users must use the chat interface to read and write files. This story adds a dedicated file editor panel that provides:
- Directory tree navigation
- File content viewing with syntax highlighting
- In-place file editing
- Save/fork operations

This enhances the workflow engine experience by allowing users to:
1. Review and modify workflow specs directly
2. Quickly adjust code files during workflow execution monitoring
3. Manage workspace resources without CLI commands

## Acceptance Criteria

### AC1: Directory Browser
- [ ] Display collapsible directory tree for workspace root
- [ ] Expand/collapse folders on click
- [ ] Show file icons based on file type (.ts, .tsx, .json, .md, etc.)
- [ ] Support navigation to nested directories
- [ ] Highlight currently selected file

### AC2: File Content Viewer
- [ ] Display file content with syntax highlighting
- [ ] Support for TypeScript, JavaScript, JSON, Markdown files
- [ ] Show file metadata (path, size, last modified)
- [ ] Read-only mode for non-text files
- [ ] Handle large files (>1MB) with warning

### AC3: Rich Text Editor
- [ ] Editable textarea/code editor for text files
- [ ] Line numbers for code navigation
- [ ] Search and replace functionality
- [ ] Auto-indent based on file type
- [ ] Tab key inserts tabs/spaces (configurable)

### AC4: File Operations
- [ ] Save changes to file with confirmation
- [ ] Create new files from template
- [ ] Delete files with confirmation dialog
- [ ] Copy file path to clipboard
- [ ] Download file content

### AC5: API Integration
- [ ] GET `/api/workspaces/files/list` - List directory contents
- [ ] GET `/api/workspaces/files/read` - Read file content
- [ ] PUT `/api/workspaces/files/write` - Write file content
- [ ] DELETE `/api/workspaces/files/delete` - Delete file
- [ ] All endpoints require authentication

### AC6: UI Layout
- [ ] Sidebar panel (~300px) for directory tree
- [ ] Main content area for file editor
- [ ] Resizable split view (sidebar/editor)
- [ ] Responsive design (collapsible sidebar on mobile)
- [ ] Keyboard shortcuts (Ctrl+S save, Ctrl+F search)

## Technical Implementation Plan

### Phase 1: API Endpoints (Backend)

Create `/src/app/api/workspaces/files/` directory structure:

#### `src/app/api/workflows/files/list/route.ts`
```typescript
export async function GET(request: NextRequest) {
  // Query params: path (default: workspace root)
  // Returns: { files: FileInfo[] }
}
```

#### `src/app/api/workflows/files/read/route.ts`
```typescript
export async function GET(request: NextRequest) {
  // Query params: path
  // Returns: { content: string, metadata: FileMetadata }
}
```

#### `src/app/api/workflows/files/write/route.ts`
```typescript
export async function PUT(request: NextRequest) {
  // Body: { path, content }
  // Returns: { success: true }
}
```

#### `src/app/api/workflows/files/delete/route.ts`
```typescript
export async function DELETE(request: NextRequest) {
  // Query params: path
  // Returns: { success: true }
}
```

### Phase 2: Frontend Components

Create `/src/components/workspaces/` directory:

#### `src/components/workspaces/FileBrowser.tsx`
- Directory tree component with recursive rendering
- File type icons and folder expansion state
- Selection highlighting

#### `src/components/workspaces/FileEditor.tsx`
- Code editor with syntax highlighting (Monaco Editor or CodeMirror)
- Line numbers and search functionality
- Save/fork operations

#### `src/components/workspaces/WorkspacePanel.tsx`
- Container component managing browser/editor split view
- State management for current path and selected file

### Phase 3: Integration

Add workspace file editor to existing pages:
- `src/app/(protected)/workflows/page.tsx` - Add panels button
- `src/app/(protected)/workspace/page.tsx` - Dedicated workspace page

## Dependencies

### External Packages
- `monaco-editor` or `@codemirror/react` - Code editor with syntax highlighting
- `@monaco-editor/react` (if using Monaco) - React wrapper
- `lucide-react` - File icons

### Internal Components
- Reuse existing auth middleware
- Integrate with workspace context from `lib/store/workspace-store.ts`

## API Endpoint Specifications

### GET `/api/workspaces/files/list`

**Request:**
```typescript
{
  query: {
    path?: string  // Default: workspace root
  }
}
```

**Response:**
```typescript
{
  files: Array<{
    name: string
    path: string
    type: 'file' | 'directory'
    size?: number
    lastModified?: Date
  }>
}
```

### GET `/api/workspaces/files/read`

**Request:**
```typescript
{
  query: {
    path: string  // Absolute file path
  }
}
```

**Response:**
```typescript
{
  content: string
  metadata: {
    path: string
    size: number
    lastModified: Date
    mimeType: string
  }
}
```

### PUT `/api/workspaces/files/write`

**Request:**
```typescript
{
  body: {
    path: string
    content: string
  }
}
```

**Response:**
```typescript
{
  success: true
  message: 'File saved successfully'
}
```

### DELETE `/api/workspaces/files/delete`

**Request:**
```typescript
{
  query: {
    path: string
  }
}
```

**Response:**
```typescript
{
  success: true
  message: 'File deleted'
}
```

## UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Workflows                                      [Files] [+] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                                               │
│  │ 📁 src/  │  File: src/app/page.tsx                       │
│  │   📁 app │  Size: 2.4 KB                                │
│  │   📄 page.tsx├────────────────────────────────────────┤
│  │   📄 layout.tsx│ import { Inter } from 'next/font'      │
│  │   📁 lib/ │                                                │
│  │     📄 ...│ export default function RootLayout() {       │
│  │   📁 comp │   return (                                   │
│  │     📄 ...│     <html>                                  │
│  │          │       <body>                                │
│  │ 📁 prisma│         {children}                         │
│  │   📄 ...│       </body>                                │
│  │          │     </html>                                 │
│  │ 📁 docs/ │   )                                         │
│  │   📄 ...│ }                                          │
│  │          │          ──────────────────────────────────│
│  │ 📄 README│  Line: 12  Column: 8  UTF-8                │
│  │ 📄 package│  [Ctrl+S Save] [Ctrl+F Search]             │
│  └──────────┘                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Non-Functional Requirements

- **Performance**: File loading < 500ms for files < 100KB
- **Security**: Path traversal validation (cannot read outside workspace)
- **Error Handling**: Graceful handling of file read/write errors
- **Accessibility**: Keyboard navigation and ARIA labels

## Test Cases

1. **Directory Navigation**
   - Expand folder shows children
   - Collapse folder hides children
   - Click file selects and displays content

2. **File Viewing**
   - Syntax highlighting applied correctly
   - Large files (>1MB) show warning
   - Non-text files show "preview not available"

3. **File Editing**
   - Changes reflected in editor immediately
   - Save updates file on disk
   - Undo/redo works correctly

4. **Edge Cases**
   - File not found returns 404
   - Permission denied returns 403
   - Path traversal attempt blocked

## Definition of Done

- [ ] All acceptance criteria met
- [ ] API endpoints functional with auth validation
- [ ] Frontend components implemented and tested
- [ ] Integration testing completed
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Related Stories

- **Story 4.1**: Workflow Spec Upload - Reuses file upload patterns
- **Story 4.3**: Workflow Graph Generation - May use file editor for spec editing
- **Story 3.7**: WebSocket Connection Management - May integrate for live updates

---

**Created**: 2026-01-15
**Status**: ready-for-dev
