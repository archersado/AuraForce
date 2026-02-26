/**
 * AuraForce Frontend Implementation Manifest
 *
 * Project: AuraForce
 * Date: 2026-02-07
 * Epic: EP-14 (Workspace 编辑器), EP-05 (成功案例体验中心)
 *
 * Implementation Summary:
 * This document describes all frontend components and pages implemented
 * for the Workspace Editor and Success Case Experience Center features.
 */

## Component Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── workspace/
│   │       └── page.tsx                    # Workspace 主页面
│   └── (protected)/
│       └── experience-center/
│           └── page.tsx                    # 成功案例体验中心主页
├── components/
│   ├── workspace/
│   │   ├── FileTree.tsx                    # 文件树组件
│   │   ├── FileTreeItem.tsx                # 文件树节点
│   │   ├── TabBar.tsx                      # 标签页栏
│   │   ├── TabItem.tsx                     # 标签页项
│   │   ├── FileEditor.tsx                  # 通用文件编辑器
│   │   ├── CodeEditor.tsx                  # 代码编辑器 (Monaco)
│   │   ├── MarkdownEditor.tsx              # Markdown 编辑器/预览
│   │   ├── ImagePreview.tsx                # 图片预览
│   │   ├── DocumentPreview.tsx             # 文档预览
│   │   ├── PPTPreview.tsx                  # PPT 预览
│   │   ├── FileSearch.tsx                  # 文件搜索
│   │   ├── FileFilter.tsx                  # 文件过滤
│   │   ├── CreateFileDialog.tsx            # 新建文件对话框
│   │   ├── RenameFileDialog.tsx            # 重命名对话框
│   │   ├── DeleteConfirmDialog.tsx         # 删除确认对话框
│   │   ├── UploadDropzone.tsx              # 上传拖放区
│   │   └── FileContextMenu.tsx             # 文件右键菜单
│   └── experience/
│       ├── IndustrySelector.tsx            # 行业选择器
│       ├── CaseCard.tsx                    # 案例卡片
│       └── ExperienceTimer.tsx             # 体验计时器
├── lib/
│   ├── workspace/
│   │   ├── file-operations.ts              # 文件操作工具
│   │   ├── file-types.ts                   # 文件类型判断
│   │   └── shortcuts.ts                    # 快捷键处理
│   └── services/
│       └── workspace-api.ts                # Workspace API 客户端
└── stores/
    ├── workspace-store.ts                  # Workspace 状态管理
    └── experience-store.ts                 # 体验中心状态管理
```

## Stories Implementation Mapping

### Epic 14: Workspace 编辑器

| Story | Component | File Path | Status |
|-------|-----------|-----------|--------|
| 14-2 | CodeEditor | `components/workspace/CodeEditor.tsx` | Implementing |
| 14-3 | MarkdownEditor | `components/workspace/MarkdownEditor.tsx` | Implementing |
| 14-4 | ImagePreview | `components/workspace/ImagePreview.tsx` | Implementing |
| 14-5 | DocumentPreview | `components/workspace/DocumentPreview.tsx` | Implementing |
| 14-6 | PPTPreview | `components/workspace/PPTPreview.tsx` | Implementing |
| 14-7 | FileTree | `components/workspace/FileTree.tsx` | Implementing |
| 14-8 | FileOperations | `components/workspace/*Dialog.tsx` | Implementing |
| 14-9 | TabBar | `components/workspace/TabBar.tsx` | Implementing |
| 14-10 | FileSearch | `components/workspace/FileSearch.tsx` | Implementing |
| 14-11 | ClaudeAgent | `components/workspace/ClaudeAgentPanel.tsx` | Implementing |
| 14-12 | AIInteraction | `components/workspace/ChatInterface.tsx` | Implementing |
| 14-13 | Shortcuts | `lib/workspace/shortcuts.ts` | Implementing |
| 14-14 | DeepSearch | `components/workspace/FileSearch.tsx` | Implementing |

### Epic 5: 成功案例体验中心

| Story | Component | File Path | Status |
|-------|-----------|-----------|--------|
| 05-1 | IndustrySelector | `components/experience/IndustrySelector.tsx` | Planning |
| 05-2 | ExperienceFlow | `app/(protected)/experience-center/page.tsx` | Planning |
| 05-3 | AIAssistance | `components/experience/AIAssistant.tsx` | Planning |
| 05-4 | Personalization | `components/experience/Questionnaire.tsx` | Planning |
| 05-5 | HistoryCompare | `components/experience/HistoryCompare.tsx` | Planning |

## Technology Stack Details

### Code Editor
- **Monaco Editor** - VS Code's editor component
- Features: Syntax highlighting, autocomplete, minimap, multi-cursor
- Supported languages: TypeScript, JavaScript, JSON, YAML, Python, Java, Go, etc.

### Markdown Preview
- **react-markdown** - Markdown to React component
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-highlight** - Code block syntax highlighting

### Image Preview
- **next/image** - Optimized image component
- Support: PNG, JPG, JPEG, GIF, SVG, WebP

### PDF Preview
- **react-pdf** - PDF rendering library
- Features: Page navigation, zoom, fullscreen

### PPT Preview
- **pptx-parser** - PPT/X parsing
- Features: Slide navigation, basic animation support

## State Management (Zustand)

### Workspace Store
```typescript
interface WorkspaceState {
  // File tree
  fileTree: FileNode[];
  selectedFile: string | null;
  expandedFolders: Set<string>;

  // Tabs
  openTabs: Tab[];
  activeTab: string | null;

  // Editor state
  editorContent: Record<string, string>;
  unsavedChanges: Set<string>;

  // UI state
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  panelState: 'default' | 'split' | 'preview-only';
}
```

### Experience Store
```typescript
interface ExperienceState {
  // Current experience
  currentCase: Case | null;
  currentTime: number;
  isPaused: boolean;

  // User profile
  userIndustry: string | null;
  userProfile: UserProfile | null;

  // History
  experienceHistory: ExperienceRecord[];
}
```

## API Integration Points

### Workspace API
- `GET /api/workspace/files` - List files
- `GET /api/workspace/files/*` - Read file content
- `POST /api/workspace/files` - Create file
- `PUT /api/workspace/files/*` - Update file
- `DELETE /api/workspace/files/*` - Delete file
- `GET /api/workspace/search` - Search files
- `POST /api/workspace/upload` - Upload files

### Claude API
- `POST /api/claude/chat` - Send message to Claude
- `POST /api/claude/file` - Ask Claude about file
- `GET /api/claude/sessions` - List sessions
- `GET /api/claude/sessions/:id` - Get session

### Experience API
- `GET /api/experience/industries` - Get industries
- `GET /api/experience/cases` - Get cases for industry
- `POST /api/experience/start` - Start experience
- `POST /api/experience/ask` - Ask AI during experience
- `POST /api/experience/complete` - Complete experience
- `GET /api/experience/history` - Get history

---

**Document Version:** 1.0
**Last Updated:** 2026-02-07
**Implementer:** Frontend Dev (ai-dev-team)
