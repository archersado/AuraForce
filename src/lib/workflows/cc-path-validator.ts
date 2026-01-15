/**
 * CC Path Validation Engine
 *
 * Validates Claude Code directory paths, checks file accessibility,
 * and generates comprehensive validation reports.
 */

import { access, stat } from 'fs/promises';
import { join } from 'path';

export interface PathValidationResult {
  path: string;
  exists: boolean;
  accessible: boolean;
  type: 'file' | 'directory' | 'not-found';
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  error?: string;
}

export interface ReferenceValidationResult {
  reference: string;
  type: 'agent' | 'workflow' | 'resource';
  resolvedPath?: string;
  validated: boolean;
  error?: string;
  details?: {
    exists?: boolean;
    accessible?: boolean;
    size?: number;
    modified?: Date;
  };
}

export interface WorkflowValidationReport {
  workflowId: string;
  workflowName: string;
  overallStatus: 'valid' | 'invalid' | 'warning';
  validatedAt: Date;
  summary: {
    totalReferences: number;
    validReferences: number;
    missingReferences: number;
    inaccessibleReferences: number;
  };
  validations: ReferenceValidationResult[];
  recommendations: string[];
}

/**
 * CC Directory Validator
 */
export class CCPathValidator {
  private readonly basePath: string;

  constructor(basePath?: string) {
    // Default to ~/.claude if no custom path provided
    this.basePath = basePath || join(require('os').homedir(), '.claude');
  }

  /**
   * Validate a specific path in the CC directory structure
   */
  async validatePath(targetPath: string): Promise<PathValidationResult> {
    const normalizedPath = join(this.basePath, targetPath);

    try {
      const fileStat = await stat(normalizedPath);

      // Check read permission
      let read = true, write = false, execute = false;
      try {
        await access(normalizedPath);
        read = true;
        // Write check (Unix permission bit)
        write = !!(fileStat.mode & 0o200);
        // Execute check for directories
        if (fileStat.isDirectory()) {
          execute = !!(fileStat.mode & 0o100);
        }
      } catch {
        read = true; // stat succeeded so read is ok
      }

      return {
        path: normalizedPath,
        exists: true,
        accessible: read,
        type: fileStat.isDirectory() ? 'directory' : 'file',
        permissions: { read, write, execute },
      };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;

      if (code === 'ENOENT') {
        return {
          path: normalizedPath,
          exists: false,
          accessible: false,
          type: 'not-found',
          permissions: { read: false, write: false, execute: false },
          error: 'Path does not exist',
        };
      }

      if (code === 'EACCES') {
        return {
          path: normalizedPath,
          exists: true,
          accessible: false,
          type: 'not-found',
          permissions: { read: false, write: false, execute: false },
          error: 'Permission denied',
        };
      }

      return {
        path: normalizedPath,
        exists: false,
        accessible: false,
        type: 'not-found',
        permissions: { read: false, write: false, execute: false },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Validate an agent reference in the CC directory
   */
  async validateAgentReference(agentName: string, relativePath?: string): Promise<ReferenceValidationResult> {
    // Agent files are typically in .claude/extensions/agents/ or similar
    const agentPath = join('extensions', 'agents', `${agentName}.md`);
    const fullPath = join(this.basePath, agentPath);

    const validation = await this.validatePath(agentPath);

    return {
      reference: `agent:${agentName}`,
      type: 'agent',
      resolvedPath: fullPath,
      validated: validation.exists && validation.accessible,
      error: !validation.exists ? `Agent file not found at ${agentPath}` : undefined,
      details: validation.exists ? {
        exists: validation.exists,
        accessible: validation.accessible,
      } : undefined,
    };
  }

  /**
   * Validate a workflow reference in the CC directory
   */
  async validateWorkflowReference(
    workflowName: string,
    relativePath?: string
  ): Promise<ReferenceValidationResult> {
    // Workflow files are typically in .claude/extensions/workflows/{name}/README.md
    const workflowPath = join('extensions', 'workflows', workflowName, 'README.md');
    const fullPath = join(this.basePath, workflowPath);

    const validation = await this.validatePath(workflowPath);

    return {
      reference: `workflow:${workflowName}`,
      type: 'workflow',
      resolvedPath: fullPath,
      validated: validation.exists && validation.accessible,
      error: !validation.exists ? `Workflow file not found at ${workflowPath}` : undefined,
      details: validation.exists ? {
        exists: validation.exists,
        accessible: validation.accessible,
      } : undefined,
    };
  }

  /**
   * Validate a resource reference in the CC directory
   */
  async validateResourceReference(resourcePath: string): Promise<ReferenceValidationResult> {
    // Resources can be anywhere within the CC directory
    const fullPath = resourcePath.startsWith(this.basePath)
      ? resourcePath
      : join(this.basePath, resourcePath);

    const validation = await this.validatePath(fullPath);

    return {
      reference: `resource:${resourcePath}`,
      type: 'resource',
      resolvedPath: fullPath,
      validated: validation.exists && validation.accessible,
      error: !validation.exists ? `Resource not found at ${resourcePath}` : undefined,
      details: validation.exists ? {
        exists: validation.exists,
        accessible: validation.accessible,
      } : undefined,
    };
  }

  /**
   * Validate all references in a workflow
   */
  async validateWorkflowReferences(references: Array<{
    type: 'agent' | 'workflow' | 'resource';
    name: string;
    path?: string;
  }>): Promise<WorkflowValidationReport> {
    const validations: ReferenceValidationResult[] = [];

    for (const ref of references) {
      switch (ref.type) {
        case 'agent':
          validations.push(await this.validateAgentReference(ref.name, ref.path));
          break;
        case 'workflow':
          validations.push(await this.validateWorkflowReference(ref.name, ref.path));
          break;
        case 'resource':
          validations.push(await this.validateResourceReference(ref.path || ref.name));
          break;
      }
    }

    const validCount = validations.filter(v => v.validated).length;
    const missingCount = validations.filter(v => !v.validated && v.error?.includes('not found')).length;
    const inaccessibleCount = validations.filter(v => !v.validated && v.error?.includes('Permission')).length;

    const overallStatus: 'valid' | 'invalid' | 'warning' =
      missingCount > 0 ? 'invalid' :
      inaccessibleCount > 0 ? 'warning' :
      'valid';

    return {
      workflowId: '',
      workflowName: '',
      overallStatus,
      validatedAt: new Date(),
      summary: {
        totalReferences: references.length,
        validReferences: validCount,
        missingReferences: missingCount,
        inaccessibleReferences: inaccessibleCount,
      },
      validations,
      recommendations: this.generateRecommendations(validations),
    };
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(validations: ReferenceValidationResult[]): string[] {
    const recommendations: string[] = [];

    const missingAgents = validations.filter(
      v => v.type === 'agent' && v.error?.includes('not found')
    );

    const missingWorkflows = validations.filter(
      v => v.type === 'workflow' && v.error?.includes('not found')
    );

    const missingResources = validations.filter(
      v => v.type === 'resource' && v.error?.includes('not found')
    );

    if (missingAgents.length > 0) {
      recommendations.push(
        `Create or import ${missingAgents.length} missing agent(s): ` +
        missingAgents.map(a => a.reference).join(', ')
      );
    }

    if (missingWorkflows.length > 0) {
      recommendations.push(
        `Deploy or import ${missingWorkflows.length} missing workflow(s): ` +
        missingWorkflows.map(w => w.reference).join(', ')
      );
    }

    if (missingResources.length > 0) {
      recommendations.push(
        `Add ${missingResources.length} missing resource(s) to the CC directory: ` +
        missingResources.map(r => r.reference).join(', ')
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('All references are valid and accessible.');
    }

    return recommendations;
  }

  /**
   * Verify the CC directory structure
   */
  async verifyDirectoryStructure(): Promise<{
    valid: boolean;
    basePath: string;
    structure: {
      extensionsExists: boolean;
      workflowsExists: boolean;
      agentsExists: boolean;
    };
    issues: string[];
  }> {
    const issues: string[] = [];

    const extensionsValidation = await this.validatePath('extensions');
    const workflowsValidation = await this.validatePath('extensions/workflows');
    const agentsValidation = await this.validatePath('extensions/agents');

    if (!extensionsValidation.exists) {
      issues.push('Extensions directory does not exist. Please create it.');
    } else if (!extensionsValidation.accessible) {
      issues.push('Extensions directory is not accessible. Please check permissions.');
    }

    if (!workflowsValidation.exists) {
      issues.push('Workflows directory does not exist. Please create it.');
    }

    if (!agentsValidation.exists) {
      issues.push('Agents directory does not exist. Please create it.');
    }

    return {
      valid: issues.length === 0,
      basePath: this.basePath,
      structure: {
        extensionsExists: extensionsValidation.exists,
        workflowsExists: workflowsValidation.exists,
        agentsExists: agentsValidation.exists,
      },
      issues,
    };
  }

  /**
   * Get the base CC path
   */
  getBasePath(): string {
    return this.basePath;
  }
}

/**
 * Utility function to create a validator
 */
export function createCCValidator(basePath?: string): CCPathValidator {
  return new CCPathValidator(basePath);
}
