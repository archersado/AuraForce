/**
 * Dependency Resolution System
 *
 * Resolves workflow dependencies to physical CC directory paths,
 * performs transitive dependency analysis, and handles conflicts.
 */

import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import type { WorkflowDependency, ParsedWorkflow } from './graph-model';
import { CCPathValidator } from './cc-path-validator';

export interface ResolvedDependency {
  id: string;
  type: 'agent' | 'workflow' | 'resource';
  name: string;
  logicalReference: string;
  physicalPath: string;
  resolved: boolean;
  error?: string;
  metadata?: {
    exists?: boolean;
    accessible?: boolean;
    version?: string;
  };
}

export interface DependencyResolutionResult {
  workflowId: string;
  workflowName: string;
  dependencies: ResolvedDependency[];
  transitiveDependencies: Map<string, ResolvedDependency[]>;
  conflicts: Array<{
    dependency: ResolvedDependency;
    conflictType: string;
    details: string;
  }>;
  missingDependencies: string[];
  recommendations: string[];
}

export interface ConflictResolution {
  dependencyId: string;
  resolution: 'use-existing' | 'create-placeholder' | 'skip' | 'replace';
  newVersion?: string;
  replacementPath?: string;
}

/**
 * Dependency Mapper
 */
export class DependencyMapper {
  private readonly ccValidator: CCPathValidator;
  private readonly resolvedCache = new Map<string, ResolvedDependency>();

  constructor(ccBasePath?: string) {
    this.ccValidator = new CCPathValidator(ccBasePath);
  }

  /**
   * Map logical dependency references to physical CC paths
   */
  async mapDependencyToPath(
    type: 'agent' | 'workflow' | 'resource',
    name: string,
    customPath?: string
  ): Promise<ResolvedDependency> {
    const cacheKey = `${type}:${name}`;

    if (this.resolvedCache.has(cacheKey)) {
      return this.resolvedCache.get(cacheKey)!;
    }

    let physicalPath = '';
    let resolved = true;
    let error: string | undefined;

    if (customPath) {
      physicalPath = customPath;
    } else {
      const basePath = this.ccValidator.getBasePath();

      switch (type) {
        case 'agent':
          physicalPath = join(basePath, 'extensions', 'agents', `${name}.md`);
          break;
        case 'workflow':
          physicalPath = join(basePath, 'extensions', 'workflows', name, 'README.md');
          break;
        case 'resource':
          physicalPath = join(basePath, 'extensions', 'workflows', name);
          break;
      }
    }

    // Check if path exists and is accessible
    try {
      const validation = await this.ccValidator.validatePath(
        physicalPath.replace(this.ccValidator.getBasePath(), '')
      );
      resolved = validation.exists && validation.accessible;
      error = !validation.exists ? 'Path not found' :
               !validation.accessible ? 'Path not accessible' : undefined;
    } catch {
      resolved = false;
      error = 'Validation failed';
    }

    const dependency: ResolvedDependency = {
      id: cacheKey,
      type,
      name,
      logicalReference: `${type}:${name}`,
      physicalPath,
      resolved,
      error,
      metadata: {
        exists: resolved,
        accessible: resolved,
      },
    };

    this.resolvedCache.set(cacheKey, dependency);
    return dependency;
  }

  /**
   * Resolve all dependencies for a workflow
   */
  async resolveWorkflowDependencies(
    workflow: ParsedWorkflow,
    workflowId: string
  ): Promise<DependencyResolutionResult> {
    const dependencies: ResolvedDependency[] = [];

    for (const dep of workflow.dependencies) {
      const resolved = await this.mapDependencyToPath(
        dep.type,
        dep.name,
        dep.path
      );
      dependencies.push(resolved);
    }

    // Detect conflicts
    const conflicts = this.detectConflicts(dependencies);

    // Perform transitive dependency analysis
    const transitiveDependencies = await this.analyzeTransitiveDependencies(dependencies);

    // Identify missing dependencies
    const missingDependencies = dependencies
      .filter(d => !d.resolved)
      .map(d => d.logicalReference);

    // Generate recommendations
    const recommendations = this.generateResolutionRecommendations(
      dependencies,
      conflicts,
      missingDependencies
    );

    return {
      workflowId,
      workflowName: workflow.name,
      dependencies,
      transitiveDependencies,
      conflicts,
      missingDependencies,
      recommendations,
    };
  }

  /**
   * Detect conflicts between dependencies
   */
  private detectConflicts(dependencies: ResolvedDependency[]): Array<{
    dependency: ResolvedDependency;
    conflictType: string;
    details: string;
  }> {
    const conflicts: Array<{
      dependency: ResolvedDependency;
      conflictType: string;
      details: string;
    }> = [];

    // Check for version conflicts (same name, different paths)
    const pathMap = new Map<string, ResolvedDependency[]>();
    for (const dep of dependencies) {
      const key = `${dep.type}:${dep.name}`;
      if (!pathMap.has(key)) {
        pathMap.set(key, []);
      }
      pathMap.get(key)!.push(dep);
    }

    for (const [key, deps] of pathMap.entries()) {
      if (deps.length > 1) {
        // Multiple paths for the same dependency
        const uniquePaths = new Set(deps.map(d => d.physicalPath));
        if (uniquePaths.size > 1) {
          for (const dep of deps) {
            conflicts.push({
              dependency: dep,
              conflictType: 'path-conflict',
              details: `Multiple paths defined for ${key}: ${Array.from(uniquePaths).join(', ')}`,
            });
          }
        }
      }
    }

    // Check for circular references
    const circularRefs = this.findCircularReferences(dependencies);
    for (const ref of circularRefs) {
      const dep = dependencies.find(d =>
        d.logicalReference === ref[0]
      );
      if (dep) {
        conflicts.push({
          dependency: dep,
          conflictType: 'circular-reference',
          details: `Circular dependency detected: ${ref.join(' -> ')}`,
        });
      }
    }

    return conflicts;
  }

  /**
   * Find circular dependencies
   */
  private findCircularReferences(dependencies: ResolvedDependency[]): string[][] {
    // This is a simplified circular dependency detection
    // Full implementation would need to load each dependent workflow's dependencies
    const circularRefs: string[][] = [];

    // Check for self-references
    for (const dep of dependencies) {
      if (dep.type === 'workflow') {
        // A workflow depends on itself - direct circular reference
        // This would require the workflow name to match
        const dependentWorkflowName = dep.logicalReference.split(':')[1];
        // TODO: Compare with current workflow name
      }
    }

    return circularRefs;
  }

  /**
   * Perform transitive dependency analysis
   */
  private async analyzeTransitiveDependencies(
    directDependencies: ResolvedDependency[]
  ): Promise<Map<string, ResolvedDependency[]>> {
    const transitiveMap = new Map<string, ResolvedDependency[]>();

    for (const dep of directDependencies) {
      if (dep.type === 'workflow' && dep.resolved) {
        try {
          // Load the workflow file and extract its dependencies
          const content = await readFile(dep.physicalPath, 'utf-8');
          const { createWorkflowParser } = require('./graph-model');

          const parser = createWorkflowParser();
          const parsed = parser.parse(content, 'markdown');

          // Resolve the nested workflow's dependencies
          const nestedDeps: ResolvedDependency[] = [];
          for (const nestedDep of parsed.dependencies) {
            const resolved = await this.mapDependencyToPath(
              nestedDep.type,
              nestedDep.name,
              nestedDep.path
            );
            nestedDeps.push(resolved);
          }

          transitiveMap.set(dep.logicalReference, nestedDeps);
        } catch {
          // Failed to read or parse the workflow
          transitiveMap.set(dep.logicalReference, []);
        }
      }
    }

    return transitiveMap;
  }

  /**
   * Generate resolution recommendations
   */
  private generateResolutionRecommendations(
    dependencies: ResolvedDependency[],
    conflicts: Array<{
      dependency: ResolvedDependency;
      conflictType: string;
      details: string;
    }>,
    missingDependencies: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Missing dependencies
    if (missingDependencies.length > 0) {
      recommendations.push(
        `Install ${missingDependencies.length} missing dependencies: ` +
        missingDependencies.join(', ')
      );
    }

    // Path conflicts
    const pathConflicts = conflicts.filter(c => c.conflictType === 'path-conflict');
    if (pathConflicts.length > 0) {
      recommendations.push(
        `Resolve ${pathConflicts.length} path conflicts. ` +
        'Ensure all dependencies reference the same file path.'
      );
    }

    // Circular references
    const circularRefs = conflicts.filter(c => c.conflictType === 'circular-reference');
    if (circularRefs.length > 0) {
      recommendations.push(
        `Refactor ${circularRefs.length} workflows to remove circular dependencies.` +
        'Consider extracting shared logic into a separate workflow.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('All dependencies are resolved without conflicts.');
    }

    return recommendations;
  }

  /**
   * Apply conflict resolution
   */
  async applyResolution(resolution: ConflictResolution): Promise<void> {
    const dependency = this.resolvedCache.get(resolution.dependencyId);

    if (!dependency) {
      throw new Error(`Dependency ${resolution.dependencyId} not found`);
    }

    switch (resolution.resolution) {
      case 'use-existing':
        // Use the existing resolved path - no action needed
        break;

      case 'create-placeholder':
        // Create a placeholder file
        const { mkdir, writeFile } = await import('fs/promises');
        await mkdir(dependency.physicalPath.split(/[\\/]/).slice(0, -1).join('/'), { recursive: true });
        const content =
          `# ${dependency.name}\n\n` +
          `Placeholder ${dependency.type} created by dependency resolution.\n\n` +
          `This ${dependency.type} is used by one or more workflows.\n`;
        await writeFile(dependency.physicalPath, content, 'utf-8');

        // Update cached resolution
        dependency.resolved = true;
        dependency.error = undefined;
        break;

      case 'skip':
        // Mark as skipped by adding a warning
        dependency.error = 'Skipped by user';
        break;

      case 'replace':
        // Use replacement path
        if (resolution.replacementPath) {
          dependency.physicalPath = resolution.replacementPath;
          const validation = await this.ccValidator.validatePath(
            resolution.replacementPath.replace(this.ccValidator.getBasePath(), '')
          );
          dependency.resolved = validation.exists && validation.accessible;
          dependency.error = undefined;
        }
        break;
    }
  }

  /**
   * Clear the resolution cache
   */
  clearCache(): void {
    this.resolvedCache.clear();
  }

  /**
   * Get all available workflows in the CC directory
   */
  async getAvailableWorkflows(): Promise<string[]> {
    const { mkdir } = await import('fs/promises');
    const workflowsPath = join(this.ccValidator.getBasePath(), 'extensions', 'workflows');

    try {
      const entries = await readdir(workflowsPath, { withFileTypes: true });
      return entries
        .filter(e => e.isDirectory())
        .map(e => e.name);
    } catch {
      return [];
    }
  }

  /**
   * Get all available agents in the CC directory
   */
  async getAvailableAgents(): Promise<string[]> {
    const agentsPath = join(this.ccValidator.getBasePath(), 'extensions', 'agents');

    try {
      const entries = await readdir(agentsPath);
      return entries
        .filter(e => e.endsWith('.md'))
        .map(e => e.replace('.md', ''));
    } catch {
      return [];
    }
  }
}

/**
 * Utility function to create a dependency mapper
 */
export function createDependencyMapper(ccBasePath?: string): DependencyMapper {
  return new DependencyMapper(ccBasePath);
}
