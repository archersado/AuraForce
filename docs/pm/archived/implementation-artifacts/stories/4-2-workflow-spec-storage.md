# Story 4.2: Workflow Spec Storage with CC Path Mapping

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want an enhanced storage system that maintains accurate CC path mapping and provides efficient retrieval of my workflow specifications,
so that I can quickly access, organize and manage my deployed workflow specs with reliable file system synchronization.

## Acceptance Criteria

1. **Enhanced Database Storage Model**
   - Extend WorkflowSpec model with CC path versioning and sync status
   - Support hierarchical CC directory structure mapping
   - Track file system sync status (synced, out-of-sync, missing)
   - Maintain metadata integrity between database and file system
   - Support atomic transactions for database + file system operations

2. **CC Path Resolution & Validation**
   - Automatically resolve and validate CC directory paths across OS platforms
   - Support custom CC path configuration for development/production environments
   - Validate path accessibility and permissions before deployment
   - Handle path conflicts and provide resolution suggestions
   - Maintain CC path history for migration scenarios

3. **Intelligent Spec Retrieval System**
   - Fast spec lookup by ID, name, and CC path with proper indexing
   - Support filtered queries by deployment status, version, and metadata
   - Implement spec content caching for frequently accessed workflows
   - Provide spec diff functionality between versions
   - Support bulk operations for multiple specs

4. **File System Sync Management**
   - Background sync verification between database and file system
   - Auto-recovery for missing or corrupted spec files
   - Conflict resolution when file system and database are out of sync
   - Sync status reporting with detailed diagnostics
   - Support manual sync triggers for troubleshooting

5. **Advanced Metadata Management**
   - Rich metadata extraction from spec content and frontmatter
   - Support for workflow dependency tracking and resolution
   - Automated tagging based on spec content analysis
   - Version comparison and upgrade path suggestions
   - Metadata search with full-text indexing

## Tasks / Subtasks

- [ ] Task 1: Enhance WorkflowSpec Database Model (AC: 1)
  - [ ] Subtask 1.1: Add ccPathVersion, syncStatus, pathHistory fields to model
  - [ ] Subtask 1.2: Create compound indexes for optimized queries
  - [ ] Subtask 1.3: Add JSON metadata fields for rich spec information
  - [ ] Subtask 1.4: Create database migration with data preservation
- [ ] Task 2: Implement CC Path Resolution Service (AC: 2)
  - [ ] Subtask 2.1: Create cross-platform path resolution with OS detection
  - [ ] Subtask 2.2: Add CC path validation with permission checks
  - [ ] Subtask 2.3: Implement path conflict detection and resolution
  - [ ] Subtask 2.4: Add CC path configuration management with environment support
- [ ] Task 3: Build Intelligent Spec Retrieval APIs (AC: 3)
  - [ ] Subtask 3.1: Create optimized query endpoints with caching
  - [ ] Subtask 3.2: Implement spec filtering with advanced search capabilities
  - [ ] Subtask 3.3: Add version diff functionality with content comparison
  - [ ] Subtask 3.4: Create bulk operations API for mass management
- [ ] Task 4: Create File System Sync Service (AC: 4)
  - [ ] Subtask 4.1: Implement background sync verification with scheduled jobs
  - [ ] Subtask 4.2: Add auto-recovery mechanisms for file system issues
  - [ ] Subtask 4.3: Build conflict resolution with user notification system
  - [ ] Subtask 4.4: Create sync diagnostics and manual trigger endpoints
- [ ] Task 5: Enhance Metadata Management System (AC: 5)
  - [ ] Subtask 5.1: Create advanced metadata extraction with AI-powered analysis
  - [ ] Subtask 5.2: Implement dependency tracking with workflow graph analysis
  - [ ] Subtask 5.3: Add automated tagging based on content patterns
  - [ ] Subtask 5.4: Build metadata search with full-text indexing capabilities

## Dev Notes

### Enhanced Prisma Schema

The developer MUST follow the exact database naming convention with Prisma @@map() directives as defined in the Architecture document:

```prisma
model WorkflowSpec {
  id              String   @id @default(uuid())
  name            String   // Spec name from frontmatter
  description     String?  // Spec description
  version         String   @default("1.0.0")
  author          String?
  ccPath          String   @unique @map("cc_path") // Unique CC deployment path
  ccPathVersion   Int      @default(1) @map("cc_path_version") // Path versioning
  userId          String   @map("user_id")
  status          String   @default("deployed") // deployed, error, syncing, out-of-sync
  syncStatus      String   @default("synced") @map("sync_status") // synced, out-of-sync, missing, conflicted
  metadata        Json?    // Rich metadata as JSON
  contentHash     String?  @map("content_hash") // File content hash for sync verification
  pathHistory     Json?    @map("path_history") // Previous paths for migration
  lastSyncAt      DateTime @default(now()) @map("last_sync_at") // Last sync timestamp
  deployedAt      DateTime @default(now()) @map("deployed_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations for dependency tracking
  dependencies WorkflowDependency[] @relation("SourceWorkflow")
  dependents   WorkflowDependency[] @relation("TargetWorkflow")

  @@index([userId])
  @@index([ccPath])
  @@index([syncStatus])
  @@index([status, userId])
  @@index([contentHash])
  @@map("workflow_specs")
}

model WorkflowDependency {
  id               String       @id @default(uuid())
  sourceWorkflowId String       @map("source_workflow_id")
  targetWorkflowId String       @map("target_workflow_id")
  dependencyType   String       @map("dependency_type") // agent, workflow, resource
  createdAt        DateTime     @default(now()) @map("created_at")

  sourceWorkflow WorkflowSpec @relation("SourceWorkflow", fields: [sourceWorkflowId], references: [id], onDelete: Cascade)
  targetWorkflow WorkflowSpec @relation("TargetWorkflow", fields: [targetWorkflowId], references: [id], onDelete: Cascade)

  @@unique([sourceWorkflowId, targetWorkflowId, dependencyType])
  @@map("workflow_dependencies")
}
```

### Cross-Platform CC Path Resolution

**CRITICAL:** The developer MUST implement robust cross-platform path resolution to prevent deployment failures:

```typescript
// src/lib/workflows/cc-path-resolver.ts

export class CCPathResolver {
  private static readonly DEFAULT_CC_PATHS = {
    win32: path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.claude'),
    darwin: path.join(process.env.HOME || '/Users/Default', '.claude'),
    linux: path.join(process.env.HOME || '/home/default', '.claude')
  };

  static async resolveBasePath(customPath?: string): Promise<string> {
    if (customPath) {
      await this.validatePath(customPath);
      return customPath;
    }

    const platform = process.platform;
    const defaultPath = this.DEFAULT_CC_PATHS[platform] || this.DEFAULT_CC_PATHS.linux;

    await this.validatePath(defaultPath);
    return defaultPath;
  }

  static async validatePath(ccPath: string): Promise<void> {
    try {
      const stats = await fs.stat(ccPath);
      if (!stats.isDirectory()) {
        throw new Error(`CC path is not a directory: ${ccPath}`);
      }

      // Test write permissions
      const testFile = path.join(ccPath, '.write-test');
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
    } catch (error) {
      throw new Error(`CC path validation failed: ${error.message}`);
    }
  }

  static generateWorkflowPath(basePath: string, workflowName: string): string {
    const sanitized = workflowName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return path.join(basePath, 'extensions', 'workflows', sanitized);
  }
}
```

### Intelligent Spec Retrieval Service

The developer MUST implement efficient caching and query optimization to prevent performance issues with large spec collections:

```typescript
// src/lib/workflows/spec-retrieval.ts

export class SpecRetrievalService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getSpecById(id: string, useCache = true): Promise<WorkflowSpec | null> {
    const cacheKey = `spec:${id}`;

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() < cached.expiry) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    const spec = await prisma.workflowSpec.findUnique({
      where: { id },
      include: {
        dependencies: {
          include: { targetWorkflow: true }
        },
        dependents: {
          include: { sourceWorkflow: true }
        }
      }
    });

    if (spec && useCache) {
      this.cache.set(cacheKey, {
        data: spec,
        expiry: Date.now() + this.CACHE_TTL
      });
    }

    return spec;
  }

  async searchSpecs(filters: SpecSearchFilters): Promise<SpecSearchResult> {
    const { query, status, syncStatus, userId, tags, page = 1, limit = 20 } = filters;

    const where: Prisma.WorkflowSpecWhereInput = {
      userId,
      ...(status && { status }),
      ...(syncStatus && { syncStatus }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { metadata: { path: ['tags'], array_contains: query } }
        ]
      }),
      ...(tags && { metadata: { path: ['tags'], array_contains: tags } })
    };

    const [specs, total] = await Promise.all([
      prisma.workflowSpec.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          dependencies: { include: { targetWorkflow: true } }
        }
      }),
      prisma.workflowSpec.count({ where })
    ]);

    return {
      specs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async compareVersions(spec1Id: string, spec2Id: string): Promise<SpecDiff> {
    const [spec1, spec2] = await Promise.all([
      this.getSpecWithContent(spec1Id),
      this.getSpecWithContent(spec2Id)
    ]);

    if (!spec1 || !spec2) {
      throw new Error('One or both specs not found');
    }

    return {
      metadata: this.diffMetadata(spec1, spec2),
      content: this.diffContent(spec1.content, spec2.content),
      dependencies: this.diffDependencies(spec1.dependencies, spec2.dependencies)
    };
  }
}
```

### File System Sync Management

**CRITICAL:** The developer MUST implement robust sync management to prevent data loss and ensure consistency:

```typescript
// src/lib/workflows/sync-manager.ts

export class SyncManager {
  async verifySync(specId: string): Promise<SyncStatus> {
    const spec = await prisma.workflowSpec.findUnique({
      where: { id: specId }
    });

    if (!spec) {
      throw new Error(`Spec not found: ${specId}`);
    }

    try {
      // Check if file exists
      const filePath = path.join(spec.ccPath, 'README.md');
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      if (!fileExists) {
        await this.updateSyncStatus(specId, 'missing');
        return { status: 'missing', details: 'Spec file not found in file system' };
      }

      // Verify content hash
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const currentHash = this.generateContentHash(fileContent);

      if (spec.contentHash && spec.contentHash !== currentHash) {
        await this.updateSyncStatus(specId, 'out-of-sync');
        return {
          status: 'out-of-sync',
          details: 'File content differs from database record',
          expectedHash: spec.contentHash,
          actualHash: currentHash
        };
      }

      await this.updateSyncStatus(specId, 'synced');
      return { status: 'synced', details: 'Spec is synchronized' };

    } catch (error) {
      await this.updateSyncStatus(specId, 'error');
      return {
        status: 'error',
        details: `Sync verification failed: ${error.message}`
      };
    }
  }

  async recoverMissingSpec(specId: string): Promise<boolean> {
    const spec = await prisma.workflowSpec.findUnique({
      where: { id: specId }
    });

    if (!spec || !spec.metadata || !spec.metadata.originalContent) {
      return false;
    }

    try {
      // Recreate directory structure
      await fs.mkdir(spec.ccPath, { recursive: true });

      // Restore main spec file
      const filePath = path.join(spec.ccPath, 'README.md');
      await fs.writeFile(filePath, spec.metadata.originalContent);

      // Update content hash
      const newHash = this.generateContentHash(spec.metadata.originalContent);
      await prisma.workflowSpec.update({
        where: { id: specId },
        data: {
          contentHash: newHash,
          syncStatus: 'synced',
          lastSyncAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error(`Failed to recover spec ${specId}:`, error);
      return false;
    }
  }

  async scheduleBackgroundSync(): Promise<void> {
    // Get all specs that need sync verification
    const specs = await prisma.workflowSpec.findMany({
      where: {
        OR: [
          { syncStatus: 'out-of-sync' },
          { syncStatus: 'missing' },
          { lastSyncAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Older than 24h
        ]
      },
      select: { id: true }
    });

    for (const spec of specs) {
      try {
        await this.verifySync(spec.id);
        // Add small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Sync verification failed for spec ${spec.id}:`, error);
      }
    }
  }

  private generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private async updateSyncStatus(specId: string, status: string): Promise<void> {
    await prisma.workflowSpec.update({
      where: { id: specId },
      data: {
        syncStatus: status,
        lastSyncAt: new Date()
      }
    });
  }
}
```

### Enhanced API Implementation

The developer MUST use the standardized API response wrapper format for all endpoints:

```typescript
// src/app/api/workflows/storage/route.ts

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: {
          type: 'AUTH_ERROR',
          message: 'Authentication required'
        },
        success: false
      }, { status: 401 });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const status = url.searchParams.get('status');
    const syncStatus = url.searchParams.get('syncStatus');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const retrievalService = new SpecRetrievalService();
    const result = await retrievalService.searchSpecs({
      query,
      status,
      syncStatus,
      userId: session.user.id,
      page,
      limit
    });

    return NextResponse.json({
      data: result,
      success: true,
      message: `Found ${result.specs.length} workflow specs`
    });

  } catch (error) {
    console.error('Workflow storage API error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve workflow specs',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: {
          type: 'AUTH_ERROR',
          message: 'Authentication required'
        },
        success: false
      }, { status: 401 });
    }

    const { action, specIds } = await request.json();

    if (action === 'sync') {
      const syncManager = new SyncManager();
      const results = await Promise.all(
        specIds.map(id => syncManager.verifySync(id))
      );

      return NextResponse.json({
        data: { syncResults: results },
        success: true,
        message: `Sync verification completed for ${specIds.length} specs`
      });
    }

    if (action === 'recover') {
      const syncManager = new SyncManager();
      const results = await Promise.all(
        specIds.map(id => syncManager.recoverMissingSpec(id))
      );

      const recovered = results.filter(Boolean).length;
      return NextResponse.json({
        data: { recovered, total: specIds.length },
        success: true,
        message: `Recovered ${recovered} of ${specIds.length} specs`
      });
    }

    return NextResponse.json({
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Invalid action specified'
      },
      success: false
    }, { status: 400 });

  } catch (error) {
    console.error('Workflow storage operation error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Operation failed',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}
```

### Project Structure Notes

**CRITICAL:** The developer MUST follow the exact project structure defined in the Architecture document:

- All Claude SDK integration code in `src/lib/claude/` directory
- Workflow services in `src/lib/workflows/` directory
- API routes following REST conventions with camelCase query parameters
- Database models using snake_case with Prisma @@map() directives
- Component organization by domain (workflow components in `src/components/workflow/`)

### References

- **Architecture Decisions**: [Source: _bmad-output/architecture.md#Core Architectural Decisions]
- **Database Patterns**: [Source: _bmad-output/architecture.md#Implementation Patterns & Consistency Rules]
- **API Standards**: [Source: _bmad-output/architecture.md#Communication Patterns]
- **Previous Story Context**: [Source: _bmad-output/implementation-artifacts/stories/4-1-workflow-spec-upload.md]
- **Project Requirements**: [Source: _bmad-output/prd.md#Workflow Engine Core Requirements]

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

### Completion Notes List

### File List