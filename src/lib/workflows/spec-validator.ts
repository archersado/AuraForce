/**
 * Workflow Specification Validator
 *
 * Validates BMAD workflow specification files (.md and .yaml formats)
 * following the BMAD workflow specification conventions.
 */

import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import matter from 'gray-matter';

export interface SpecMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  tags?: string[];
  requires?: string[];
  resources?: Array<{
    path: string;
    description?: string;
  }>;
  workflowConfig?: Record<string, unknown>;
  agents?: Array<{
    name: string;
    path: string;
  }>;
  subWorkflows?: Array<{
    name: string;
    path: string;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: SpecMetadata;
}

/**
 * Validates a BMAD workflow specification file
 */
export async function validateWorkflowSpec(filePath: string): Promise<ValidationResult> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return validateWorkflowSpecContent(content);
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to read file: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
}

/**
 * Validates workflow specification content string
 */
export function validateWorkflowSpecContent(content: string): ValidationResult {
  const extension = content.trim().startsWith('---') ? '.md' : '.yaml';

  let metadata: SpecMetadata | null = null;

  if (extension === '.md') {
    // Parse markdown with frontmatter
    const parsed = matter(content);
    metadata = extractMetadataFromFrontmatter(parsed.data);
  } else {
    // Try to parse as YAML
    try {
      const parsed = YAML.load(content) as Record<string, unknown>;
      metadata = extractMetadataFromYaml(parsed);
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`],
        warnings: [],
      };
    }
  }

  // Validate the metadata
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!metadata) {
    return {
      valid: false,
      errors: ['Failed to extract metadata from file'],
      warnings: [],
      metadata: undefined,
    };
  }

  if (!metadata.name || metadata.name.trim() === '') {
    errors.push('Missing required field: name');
  }

  if (metadata.name && !isValidFilename(metadata.name)) {
    errors.push('Invalid workflow name: must contain only alphanumeric characters, hyphens, and underscores');
  }

  if (!metadata.version) {
    warnings.push('Missing recommended field: version (will default to 1.0.0)');
  }

  if (!metadata.description) {
    warnings.push('Missing recommended field: description');
  }

  // Validate requires references if provided
  if (metadata.requires && metadata.requires.length > 0) {
    for (const req of metadata.requires) {
      if (!isValidReference(req)) {
        warnings.push(`Invalid reference format: ${req} (expected: agent:name or workflow:name)`);
      }
    }
  }

  // Validate agent entries if provided
  if (metadata.agents && metadata.agents.length > 0) {
    for (let i = 0; i < metadata.agents.length; i++) {
      const agent = metadata.agents[i];
      if (!agent.name || !agent.path) {
        errors.push(`Invalid agent entry at index ${i}: missing required name or path`);
      }
      if (agent.path && !isValidFilename(agent.path)) {
        warnings.push(`Invalid agent path: ${agent.path}`);
      }
    }
  }

  // Validate sub-workflow entries if provided
  if (metadata.subWorkflows && metadata.subWorkflows.length > 0) {
    for (let i = 0; i < metadata.subWorkflows.length; i++) {
      const wf = metadata.subWorkflows[i];
      if (!wf.name || !wf.path) {
        errors.push(`Invalid workflow entry at index ${i}: missing required name or path`);
      }
      if (wf.path && !isValidFilename(wf.path)) {
        warnings.push(`Invalid workflow path: ${wf.path}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: metadata || undefined,
  };
}

/**
 * Extract metadata from YAML frontmatter
 */
function extractMetadataFromFrontmatter(data: Record<string, unknown>): SpecMetadata | null {
  // Check if this is a YAML-based spec (has workflow_config at top level)
  if (data.workflow_config || (Array.isArray(data.steps) && !data.name)) {
    return extractMetadataFromYaml(data);
  }

  // Otherwise extract as frontmatter metadata
  return {
    name: String(data.name || ''),
    description: data.description ? String(data.description) : undefined,
    version: data.version ? String(data.version) : undefined,
    author: data.author ? String(data.author) : undefined,
    tags: data.tags ? ensureStringArray(data.tags) : undefined,
    requires: data.requires ? ensureStringArray(data.requires) : undefined,
    resources: extractResources(data.resources),
    workflowConfig: data.workflow_config ? (data.workflow_config as Record<string, unknown>) : undefined,
    agents: extractAgents(data.agents),
    subWorkflows: extractWorkflows(data.workflows || data.subWorkflows),
  };
}

/**
 * Extract metadata from YAML document
 */
function extractMetadataFromYaml(data: Record<string, unknown>): SpecMetadata {
  return {
    name: String(data.name || ''),
    description: data.description ? String(data.description) : undefined,
    version: data.version ? String(data.version) : undefined,
    author: data.author ? String(data.author) : undefined,
    tags: data.tags ? ensureStringArray(data.tags) : undefined,
    requires: data.requires ? ensureStringArray(data.requires) : undefined,
    resources: extractResources(data.resources),
    workflowConfig: data.workflow_config ? (data.workflow_config as Record<string, unknown>) : undefined,
    agents: extractAgents(data.agents),
    subWorkflows: extractWorkflows(data.workflows || data.subWorkflows),
  };
}

/**
 * Extract resources from metadata
 */
function extractResources(resources: unknown): Array<{ path: string; description?: string }> | undefined {
  if (!Array.isArray(resources)) {
    return undefined;
  }

  return resources
    .map((r): { path: string; description?: string } | null => {
      if (typeof r === 'string') {
        return { path: r };
      }
      if (typeof r === 'object' && r !== null && 'path' in r) {
        return {
          path: String((r as { path: unknown }).path),
          description: 'description' in r ? String((r as { description: unknown }).description) : undefined,
        };
      }
      return null;
    })
    .filter((r): r is { path: string; description?: string } => r !== null);
}

/**
 * Extract agents from metadata
 */
function extractAgents(agents: unknown): Array<{ name: string; path: string }> | undefined {
  if (!Array.isArray(agents)) {
    return undefined;
  }

  return agents
    .map((a): { name: string; path: string } | null => {
      if (typeof a !== 'object' || a === null) {
        return null;
      }
      const agent = a as { name?: unknown; path?: unknown };
      if (!agent.name || !agent.path) {
        return null;
      }
      return {
        name: String(agent.name),
        path: String(agent.path),
      };
    })
    .filter((a): a is { name: string; path: string } => a !== null);
}

/**
 * Extract workflows from metadata
 */
function extractWorkflows(workflows: unknown): Array<{ name: string; path: string }> | undefined {
  if (!Array.isArray(workflows)) {
    return undefined;
  }

  return workflows
    .map((w): { name: string; path: string } | null => {
      if (typeof w !== 'object' || w === null) {
        return null;
      }
      const workflow = w as { name?: unknown; path?: unknown };
      if (!workflow.name || !workflow.path) {
        return null;
      }
      return {
        name: String(workflow.name),
        path: String(workflow.path),
      };
    })
    .filter((w): w is { name: string; path: string } => w !== null);
}

/**
 * Ensure value is a string array
 */
function ensureStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.map((item) => String(item));
}

/**
 * Validate filename format (alphanumeric, hyphens, underscores)
 */
function isValidFilename(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

/**
 * Validate reference format (agent:name or workflow:name)
 */
function isValidReference(ref: string): boolean {
  return /^(agent|workflow):[a-zA-Z0-9_-]+$/.test(ref);
}

/**
 * Sanitize a name for filesystem compatibility
 */
export function sanitizeName(name: string): string {
  // Remove or replace invalid characters
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generate a Claude Code directory path for a workflow
 */
export function generateCCPath(workflowName: string): string {
  const sanitizedName = sanitizeName(workflowName);
  return `.claude/extensions/workflows/${sanitizedName}`;
}
