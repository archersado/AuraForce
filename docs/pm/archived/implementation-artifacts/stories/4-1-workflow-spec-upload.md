# Story 4.1: BMAD Workflow Spec Upload and CC Directory Deployment

Status: ready-for-dev

**Epic 4: Agent SDK Workflow Engine**

Epic Value: Enable users to upload BMAD workflow specification files and deploy them to their Claude Code (CC) directory structure, laying the foundation for workflow execution and management.

---

## Story

As a user,
I want to upload my BMAD workflow specification file and have it automatically deployed to my Claude Code directory structure,
so that I can execute the workflow directly from within Claude Code with proper file organization.

---

## Acceptance Criteria

1. **Workflow Spec Upload**
   - User can upload a single or multiple BMAD workflow spec files (.md or .yaml)
   - Upload supports drag-and-drop and file browser selection
   - File validation ensures proper BMAD workflow spec format
   - Maximum file size limit: 5MB per file, 50MB total per upload
   - Upload progress indicator with file-by-file status

2. **Spec Format Validation**
   - Validation checks for required BMAD spec structure
   - Detects and reports missing required fields (name, description, workflow_config)
   - Validates agent/workflow references within the spec
   - Provides clear error messages for invalid specs

3. **Directory Structure Deployment**
   - Specs are deployed to user's CC directory under `.claude/extensions/workflows/`
   - Each workflow gets its own named subdirectory based on spec name
   - File organization follows BMAD directory standards:
     - `README.md` - Main workflow file
     - `agents/` - Subagents if specified
     - `workflows/` - Sub-workflows if specified
     - `resources/` - Resource files if specified
   - Sanitizes filenames for filesystem compatibility

4. **Metadata Extraction and Storage**
   - Extracts metadata from spec: name, description, version, author
   - Stores metadata in database (Prisma `WorkflowSpec` model)
   - Stores CC path mapping for deployment tracking
   - Supports spec versioning for history tracking

5. **Upload History and Management**
   - User can view list of all deployed workflow specs
   - Shows deployment status (deployed, error, pending)
   - Allows viewing spec details before deployment
   - Supports deletion of deployed workflow specs

---

## Tasks / Subtasks

### Task 1: Design Workflow Spec Database Model (AC: 4)
- [ ] Add `WorkflowSpec` Prisma model to schema
- [ ] Define fields: id, name, description, version, author, ccPath, userId, status, metadata JSON
- [ ] Add indexes for userId and ccPath
- [ ] Create migration for new model

### Task 2: Create File Upload API Endpoint (AC: 1)
- [ ] Create `src/app/api/workflows/upload/route.ts`
- [ ] Handle multipart/form-data for file uploads
- [ ] Implement file size validation
- [ ] Support multiple file uploads in single request
- [ ] Return upload status and file details

### Task 3: Implement Spec Validation (AC: 2)
- [ ] Create `src/lib/workflows/spec-validator.ts`
- [ ] Parse .md and .yaml spec formats
- [ ] Validate required fields presence
- [ ] Validate agent/workflow references
- [ ] Return detailed validation errors

### Task 4: Create Directory Deployment Service (AC: 3)
- [ ] Create `src/lib/workflows/deployer.ts`
- [ ] Create directory structure in CC path
- [ ] Parse spec and extract agents/workflows
- [ ] Write README.md to workflow directory
- [ ] Deploy subagents to agents/ subdirectory
- [ ] Deploy sub-workflows to workflows/ subdirectory

### Task 5: Implement Metadata Extraction (AC: 4)
- [ ] Create `src/lib/workflows/metadata-extractor.ts`
- [ ] Parse frontmatter from .md specs
- [ ] Extract name, description, version, author
- [ ] Handle YAML format metadata
- [ ] Return structured metadata object

### Task 6: Create Workflow Specs List API (AC: 5)
- [ ] Create `src/app/api/workflows/route.ts` for GET
- [ ] Return all workflow specs for authenticated user
- [ ] Support pagination and filtering
- [ ] Include deployment status and CC path

### Task 7: Create Workflow Spec Delete API (AC: 5)
- [ ] Create `src/app/api/workflows/[id]/route.ts` for DELETE
- [ ] Remove spec from database
- [ ] Remove deployed files from CC directory
- [ ] Handle cleanup errors gracefully

### Task 8: Create Upload UI Component (AC: 1, 5)
- [ ] Create `src/components/workflows/WorkflowSpecUpload.tsx`
- [ ] Implement drag-and-drop file upload zone
- [ ] Show upload progress per file
- [ ] Display validation errors inline
- [ ] Show success confirmation after deployment

### Task 9: Create Workflow Specs List UI (AC: 5)
- [ ] Create `src/components/workflows/WorkflowSpecList.tsx`
- [ ] Display deployed specs in table/grid format
- [ ] Show deployment status indicators
- [ ] Add delete button for each spec
- [ ] Implement pagination for large lists

---

## Dev Notes

### Prisma Schema Additions

```prisma
// prisma/schema.prisma

model WorkflowSpec {
  id          String   @id @default(uuid())
  name        String   // From spec frontmatter
  description String?  // From spec frontmatter
  version     String?  // From spec frontmatter (default "1.0.0")
  author      String?  // From spec frontmatter (default current user)
  ccPath      String   @map("cc_path") // Path in CC directory
  userId      String   @map("user_id")
  status      String   @default("deployed") // deployed, error, pending
  metadata    Json?    // Additional metadata as JSON
  deployedAt  DateTime @default(now()) @map("deployed_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@index([ccPath])
  @@map("workflow_specs")
}
```

### Workflow Spec Frontmatter Format

```markdown
---
name: "My Workflow"
description: "A sample workflow specification"
version: "1.0.0"
author: "User Name"
tags: ["automation", "productivity"]
requires: ["agent:agent-name", "workflow:workflow-name"]
resources:
  - path: "resources/file.txt"
    description: "Reference file"
---

# Workflow Content

## Steps
1. Step one
2. Step two
```

### YAML Spec Format Alternative

```yaml
name: "My Workflow"
description: "A sample workflow specification"
version: "1.0.0"
author: "User Name"
workflow_config:
  steps:
    - name: "Step one"
      action: "tool:action"
    - name: "Step two"
      action: "tool:action"
agents:
  - name: "subagent-name"
    path: "agents/subagent.md"
```

### Directory Structure Example

After deployment:

```
~/.claude/extensions/workflows/my-workflow/
├── README.md           # Main workflow file (original spec)
├── agents/             # Subagents if specified
│   └── my-subagent.md
├── workflows/          # Sub-workflows if specified
│   └── sub-workflow.md
└── resources/          # Resource files if any
    └── reference.txt
```

### CC Path Resolution

The Claude Code directory is typically:
- Linux/macOS: `~/.claude/extensions/workflows/`
- Windows: `%USERPROFILE%\.claude\extensions\workflows\`

In our web context, we'll simulate this path or allow user configuration.

### Spec Validator Implementation

```typescript
// src/lib/workflows/spec-validator.ts

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'required' | 'format' | 'reference';
}

export class SpecValidator {
  validate(content: string, format: 'md' | 'yaml'): ValidationResult {
    // 1. Parse content based on format
    // 2. Check required fields
    // 3. Validate references
    // 4. Return validation result
  }

  private validateFrontmatter(frontmatter: any): ValidationError[] {
    const required = ['name', 'description'];
    const errors: ValidationError[] = [];

    for (const field of required) {
      if (!frontmatter[field]) {
        errors.push({
          field,
          message: `Required field '${field}' is missing`,
          severity: 'required',
        });
      }
    }

    return errors;
  }
}
```

### Deployment Service Implementation

```typescript
// src/lib/workflows/deployer.ts

import fs from 'fs/promises';
import path from 'path';

export class WorkflowDeployer {
  constructor(private ccBasePath: string) {}

  async deploy(specName: string, specContent: string, subSpecs: SubSpec[]): Promise<string> {
    // 1. Sanitize workflow name for directory
    const dirName = this.sanitizeName(specName);
    const workflowPath = path.join(this.ccBasePath, 'extensions', 'workflows', dirName);

    // 2. Create base directory
    await fs.mkdir(workflowPath, { recursive: true });

    // 3. Write main README.md
    await fs.writeFile(path.join(workflowPath, 'README.md'), specContent);

    // 4. Deploy subagents if any
    const agents = subSpecs.filter(s => s.type === 'agent');
    if (agents.length > 0) {
      await this.deploySubItems(workflowPath, 'agents', agents);
    }

    // 5. Deploy sub-workflows if any
    const workflows = subSpecs.filter(s => s.type === 'workflow');
    if (workflows.length > 0) {
      await this.deploySubItems(workflowPath, 'workflows', workflows);
    }

    return workflowPath;
  }

  private sanitizeName(name: string): string {
    // Remove invalid filesystem characters
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async deploySubItems(basePath: string, subdir: string, items: SubSpec[]): Promise<void> {
    const subPath = path.join(basePath, subdir);
    await fs.mkdir(subPath, { recursive: true });

    for (const item of items) {
      await fs.writeFile(path.join(subPath, item.filename), item.content);
    }
  }
}
```

### Metadata Extractor Implementation

```typescript
// src/lib/workflows/metadata-extractor.ts

export interface WorkflowMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  tags?: string[];
  requires?: string[];
  resources?: ResourceRef[];
}

export class MetadataExtractor {
  extract(content: string, format: 'md' | 'yaml'): WorkflowMetadata {
    if (format === 'md') {
      return this.extractFromMarkdown(content);
    }
    return this.extractFromYAML(content);
  }

  private extractFromMarkdown(content: string): WorkflowMetadata {
    // Parse frontmatter between --- markers
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error('No frontmatter found in markdown spec');
    }

    const frontmatter = parseYAML(frontmatterMatch[1]);
    return {
      name: frontmatter.name || 'Untitled',
      description: frontmatter.description || '',
      version: frontmatter.version || '1.0.0',
      author: frontmatter.author || 'Unknown',
      tags: frontmatter.tags || [],
      requires: frontmatter.requires || [],
      resources: frontmatter.resources || [],
    };
  }
}
```

### Upload Component UI

```typescript
// src/components/workflows/WorkflowSpecUpload.tsx

export function WorkflowSpecUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndSetFiles(selectedFiles);
    }
  };

  const validateAndSetFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validExtensions = ['.md', '.yaml', '.yml'];
      const extension = path.extname(file.name).toLowerCase();

      if (!validExtensions.includes(extension)) {
        setErrors(prev => ({
          ...prev,
          [file.name]: `Invalid file extension. Expected: ${validExtensions.join(', ')}`,
        }));
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [file.name]: `File too large. Maximum size: 5MB`,
        }));
        return false;
      }

      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    setUploading(true);

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/workflows/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Handle success
        setFiles([]);
      } else {
        // Handle error
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center"
         onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <input type="file" multiple accept=".md,.yaml,.yml"
             onChange={handleFileSelect} className="hidden" />
      <Button onClick={() => document.querySelector('input[type="file"]')?.click()}>
        Select Files
      </Button>
      {/* Display files, errors, progress */}
    </div>
  );
}
```

### API Response Format

**Upload Response:**
```json
{
  "success": true,
  "data": {
    "deployed": [
      {
        "name": "My Workflow",
        "id": "uuid",
        "ccPath": "~/.claude/extensions/workflows/my-workflow",
        "status": "deployed"
      }
    ],
    "errors": [
      {
        "fileName": "invalid-spec.md",
        "error": "Missing required field: description"
      }
    ]
  }
}
```

**List Response:**
```json
{
  "success": true,
  "data": {
    "specs": [
      {
        "id": "uuid",
        "name": "My Workflow",
        "description": "A sample workflow",
        "version": "1.0.0",
        "ccPath": "~/.claude/extensions/workflows/my-workflow",
        "status": "deployed",
        "deployedAt": "2024-01-12T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
}
```

---

## Technical References

### BMAD Workflow Spec Format
- **Source**: BMAD Core documentation
- Reference existing workflow.md and agent.md formats from `_bmad/` directory

### File System Operations
- Use Node.js `fs/promises` for async file operations
- Use `path` module for cross-platform path handling

### Database Schema
- **Source**: `prisma/schema.prisma` - Existing models for reference

### Authentication
- Use existing `getSession()` from `@/lib/auth/session`
- All API endpoints must be protected

---

## Dependencies

### Prerequisites
- [x] Epic 1: Project Foundation (Prisma configured)
- [x] Epic 2: User Account & Authentication (Auth.js v5 working)
- [x] Epic 3: Claude Code GUI (Base infrastructure ready)

### Required for this Story
- File system access for CC directory operations
- Frontend library for file upload (can use native File API)
- YAML parser for .yaml/.yml spec parsing

---

## Success Criteria Checklist

- [ ] WorkflowSpec Prisma model created and migrated
- [ ] File upload API endpoint working with drag-and-drop
- [ ] Spec validation detects missing required fields
- [ ] Directory structure deployed to CC path correctly
- [ ] Metadata extracted and stored in database
- [ ] Workflow specs list API returns user's specs
- [ ] Delete API removes specs from database and filesystem
- [ ] Upload UI component with progress indicator
- [ ] Specs list UI with deployment status
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no warnings

---

**Ready for Development:** ✅

This story establishes the foundation for the entire Epic 4 workflow engine, enabling users to bring their own BMAD workflow specs into the system.

---

## Next Steps After This Story

1. **Story 4.2** - Workflow Spec Storage with CC Path Mapping (enhance storage and retrieval)
2. **Story 4.3** - Workflow Graph Generation (visualize deployed workflows)

---

## Known Decisions

### CC Path Strategy
For MVP, we'll use a simulated CC path structure since actual Claude Code installation directory may not be accessible from the web application. Users can configure their actual CC path in settings later.

### File Format Support
Support both Markdown (.md) and YAML (.yaml/.yml) formats for BMAD specs to match the flexible nature of BMAD conventions.

### Subspec Deployment
Extract and deploy subagents and sub-workflows as separate files to maintain modularity and enable proper resolution when executed by the Agent SDK.
