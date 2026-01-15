/**
 * Workflow Deployment Service
 *
 * Handles deployment of workflow specification files to the Claude Code directory structure
 */

import { mkdir, writeFile, rm, access } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import YAML from 'js-yaml';
import matter from 'gray-matter';
import type { SpecMetadata } from './spec-validator';
import { sanitizeName } from './spec-validator';

export interface DeployResult {
  success: boolean;
  ccPath: string;
  error?: string;
  createdFiles: string[];
}

export interface RemoveResult {
  success: boolean;
  error?: string;
}

/**
 * Default Claude Code directory
 */
export const CC_EXTENSIONS_DIR = join(homedir(), '.claude', 'extensions', 'workflows');

/**
 * Deploy a workflow specification to Claude Code directory
 */
export async function deployWorkflow(
  content: string,
  workflowName: string,
  metadata: SpecMetadata
): Promise<DeployResult> {
  const createdFiles: string[] = [];
  const sanitizedName = sanitizeName(workflowName);
  const workflowDir = join(CC_EXTENSIONS_DIR, sanitizedName);

  try {
    // Ensure the workflows directory exists
    try {
      await mkdir(CC_EXTENSIONS_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create workflows directory:', error);
    }

    // Create workflow directory
    await mkdir(workflowDir, { recursive: true });
    createdFiles.push(workflowDir);

    // Write README.md (the main workflow spec)
    const readmePath = join(workflowDir, 'README.md');
    await writeFile(readmePath, content, 'utf-8');
    createdFiles.push(readmePath);

    // Handle agents subdirectory if specified
    if (metadata.agents && metadata.agents.length > 0) {
      const agentsDir = join(workflowDir, 'agents');
      await mkdir(agentsDir, { recursive: true });
      createdFiles.push(agentsDir);

      for (const agent of metadata.agents) {
        const agentPath = join(agentsDir, agent.path);
        try {
          await access(agentPath);
          // File exists, copy it
          const agentContent = readFileSync(agentPath, 'utf-8');
          await writeFile(join(agentsDir, `${sanitizeName(agent.name)}.md`), agentContent, 'utf-8');
          createdFiles.push(join(agentsDir, `${sanitizeName(agent.name)}.md`));
        } catch {
          // File doesn't exist, create placeholder
          const placeholder = `# Agent: ${agent.name}\n\nAgent definition for ${workflowName}.\n`;
          await writeFile(join(agentsDir, `${sanitizeName(agent.name)}.md`), placeholder, 'utf-8');
          createdFiles.push(join(agentsDir, `${sanitizeName(agent.name)}.md`));
        }
      }
    }

    // Handle sub-workflows directory if specified
    if (metadata.subWorkflows && metadata.subWorkflows.length > 0) {
      const workflowsDir = join(workflowDir, 'workflows');
      await mkdir(workflowsDir, { recursive: true });
      createdFiles.push(workflowsDir);

      for (const wf of metadata.subWorkflows) {
        const wfPath = join(workflowDir, wf.path);
        try {
          await access(wfPath);
          // File exists, copy it
          const wfContent = readFileSync(wfPath, 'utf-8');
          await writeFile(join(workflowsDir, `${sanitizeName(wf.name)}.md`), wfContent, 'utf-8');
          createdFiles.push(join(workflowsDir, `${sanitizeName(wf.name)}.md`));
        } catch {
          // File doesn't exist, create placeholder
          const placeholder = `# Sub-Workflow: ${wf.name}\n\nSub-workflow for ${workflowName}.\n`;
          await writeFile(join(workflowsDir, `${sanitizeName(wf.name)}.md`), placeholder, 'utf-8');
          createdFiles.push(join(workflowsDir, `${sanitizeName(wf.name)}.md`));
        }
      }
    }

    // Handle resources directory if specified
    if (metadata.resources && metadata.resources.length > 0) {
      const resourcesDir = join(workflowDir, 'resources');
      await mkdir(resourcesDir, { recursive: true });
      createdFiles.push(resourcesDir);

      for (const resource of metadata.resources) {
        const resourcePath = join(workflowDir, resource.path);
        try {
          await access(resourcePath);
          // File exists, copy it
          const resourceContent = readFileSync(resourcePath, 'utf-8');
          const fileName = resource.path.split(/[\\/]/).pop() || sanitizeName(resource.description || 'resource');
          await writeFile(join(resourcesDir, fileName), resourceContent, 'utf-8');
          createdFiles.push(join(resourcesDir, fileName));
        } catch {
          // File doesn't exist, skip or create placeholder
          const placeholder = `# Resource: ${resource.description || resource.path}\n\nResource file for ${workflowName}.\n`;
          const fileName = resource.path.split(/[\\/]/).pop() || sanitizeName(resource.description || 'resource');
          await writeFile(join(resourcesDir, `${fileName}.md`), placeholder, 'utf-8');
          createdFiles.push(join(resourcesDir, `${fileName}.md`));
        }
      }
    }

    // Create workflow-config.yaml if workflow_config is specified
    if (metadata.workflowConfig) {
      const configPath = join(workflowDir, 'workflow-config.yaml');
      const yamlContent = YAML.dump(metadata.workflowConfig);
      await writeFile(configPath, yamlContent, 'utf-8');
      createdFiles.push(configPath);
    }

    return {
      success: true,
      ccPath: workflowDir,
      createdFiles,
    };
  } catch (error) {
    // Clean up created files in case of error
    for (const file of createdFiles) {
      try {
        await rm(file, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }

    return {
      success: false,
      ccPath: workflowDir,
      error: error instanceof Error ? error.message : String(error),
      createdFiles: [],
    };
  }
}

/**
 * Remove a deployed workflow from Claude Code directory
 */
export async function removeWorkflow(workflowName: string): Promise<RemoveResult> {
  const sanitizedName = sanitizeName(workflowName);
  const workflowDir = join(CC_EXTENSIONS_DIR, sanitizedName);

  try {
    await access(workflowDir);
    await rm(workflowDir, { recursive: true, force: true });
    return { success: true };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Directory doesn't exist, that's fine
      return { success: true };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the Claude Code path for a workflow
 */
export function getWorkflowCCPath(workflowName: string): string {
  return join(CC_EXTENSIONS_DIR, sanitizeName(workflowName));
}

/**
 * Check if a workflow is deployed
 */
export async function isWorkflowDeployed(workflowName: string): Promise<boolean> {
  const workflowPath = getWorkflowCCPath(workflowName);
  try {
    await access(workflowPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse workflow spec content to extract metadata
 */
export async function parseWorkflowSpec(content: string): Promise<SpecMetadata> {
  const hasFrontmatter = content.trim().startsWith('---');

  if (hasFrontmatter) {
    // Parse markdown with frontmatter
    const parsed = matter(content);
    return extractMetadata(parsed.data);
  } else {
    // Try to parse as YAML
    const parsed = YAML.load(content) as Record<string, unknown>;
    return extractMetadata(parsed);
  }
}

/**
 * Extract metadata from parsed data
 */
function extractMetadata(data: Record<string, unknown>): SpecMetadata {
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
 * Ensure value is a string array
 */
function ensureStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.map((item) => String(item));
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
