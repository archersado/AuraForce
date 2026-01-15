/**
 * Enhanced Metadata Management System
 *
 * Provides advanced metadata extraction, dependency tracking, and automated tagging.
 */

import type { SpecMetadata } from './spec-validator';

export interface ParsedDependencies {
  agents: Array<{ name: string; path: string; type: string }>;
  workflows: Array<{ name: string; path: string; type: string }>;
  resources: Array<{ path: string; description?: string }>;
}

export interface EnrichedMetadata extends SpecMetadata {
  extractAt: string;
  language?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  estimatedDuration?: string;
  tags?: string[];
  keywords?: string[];
}

export interface DependencyGraph {
  nodes: Array<{ id: string; name: string; type: 'workflow' | 'agent' }>;
  edges: Array<{ from: string; to: string; type: string }>;
}

/**
 * Enhanced Metadata Parser and Analyzer
 */
export class MetadataAnalyzer {
  /**
   * Extract rich metadata from workflow spec content
   */
  static extractEnhancedMetadata(
    content: string,
    baseMetadata: SpecMetadata
  ): EnrichedMetadata {
    // Calculate complexity based on content length and structure
    const complexity = this.calculateComplexity(content, baseMetadata);

    // Extract keywords from content
    const keywords = this.extractKeywords(content);

    // Generate tags if not provided
    const tags = baseMetadata.tags || this.generateTags(content, baseMetadata);

    // Detect language
    const language = this.detectLanguage(content);

    // Estimate duration based on workflow config
    const estimatedDuration = this.estimateDuration(baseMetadata.workflowConfig);

    return {
      ...baseMetadata,
      extractAt: new Date().toISOString(),
      complexity,
      keywords,
      tags,
      language,
      estimatedDuration,
    };
  }

  /**
   * Calculate workflow complexity
   */
  private static calculateComplexity(
    content: string,
    metadata: SpecMetadata
  ): 'simple' | 'medium' | 'complex' {
    const lines = content.split('\n').length;
    const agentCount = metadata.agents?.length || 0;
    const workflowCount = metadata.subWorkflows?.length || 0;

    if (lines < 50 && agentCount === 0 && workflowCount === 0) {
      return 'simple';
    }

    if (lines < 200 && agentCount <= 3 && workflowCount <= 3) {
      return 'medium';
    }

    return 'complex';
  }

  /**
   * Extract keywords from content using simple frequency analysis
   */
  private static extractKeywords(content: string): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const frequency = new Map<string, number>();
    const stopWords = new Set([
      'this', 'that', 'with', 'from', 'have', 'will', 'should', 'would',
      'could', 'each', 'their', 'which', 'about', 'after', 'before', 'being',
      'doing', 'going', 'your', 'them', 'then', 'when', 'just', 'into', 'through',
      'some', 'time', 'very', 'like', 'more', 'most', 'such', 'only', 'also',
    ]);

    for (const word of words) {
      if (!stopWords.has(word)) {
        frequency.set(word, (frequency.get(word) || 0) + 1);
      }
    }

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Generate tags based on content and metadata
   */
  private static generateTags(content: string, metadata: SpecMetadata): string[] {
    const tags = new Set<string>();

    // Add complexity-based tags
    const lines = content.split('\n').length;
    if (lines < 50) tags.add('quick');
    if (lines > 500) tags.add('comprehensive');

    // Add dependency-based tags
    if (metadata.agents && metadata.agents.length > 0) {
      tags.add('multi-agent');
    }
    if (metadata.subWorkflows && metadata.subWorkflows.length > 0) {
      tags.add('nested-workflow');
    }
    if (metadata.requires && metadata.requires.length > 0) {
      tags.add('has-dependencies');
    }

    // Add content pattern tags
    if (content.includes('test') || content.includes('spec')) tags.add('testing');
    if (content.includes('deploy') || content.includes('build')) tags.add('deployment');
    if (content.includes('api') || content.includes('http')) tags.add('api');
    if (content.includes('database') || content.includes('db')) tags.add('database');
    if (content.includes('file') || content.includes('fs')) tags.add('file-operations');
    if (content.includes('email') || content.includes('mail')) tags.add('email');
    if (content.includes('cron') || content.includes('schedule')) tags.add('scheduled');

    return Array.from(tags);
  }

  /**
   * Detect programming language from content
   */
  private static detectLanguage(content: string): string | undefined {
    const patterns: Record<string, RegExp> = {
      typescript: /\b(types|interface|class|interface)\s+\w+/,
      javascript: /\b(const|let|var)\s+\w+.*=.*=>/,
      python: /\b(import|def|class)\s+\w+/,
      yaml: /^\s*[\w-]+:\s*$/m,
      markdown: /^#{1,6}\s+/m,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        return lang;
      }
    }

    return undefined;
  }

  /**
   * Estimate workflow duration based on configuration
   */
  private static estimateDuration(config?: Record<string, unknown>): string | undefined {
    if (!config) return undefined;

    const steps = (config as any).steps;
    if (!Array.isArray(steps) || steps.length === 0) return undefined;

    const stepCount = steps.length;
    if (stepCount <= 3) return '<1 min';
    if (stepCount <= 10) return '1-5 min';
    if (stepCount <= 30) return '5-15 min';
    return '15+ min';
  }

  /**
   * Parse dependencies from metadata
   */
  static parseDependencies(metadata: SpecMetadata): ParsedDependencies {
    return {
      agents: (metadata.agents || []).map(agent => ({
        ...agent,
        type: 'agent',
      })),
      workflows: (metadata.subWorkflows || []).map(wf => ({
        ...wf,
        type: 'workflow',
      })),
      resources: metadata.resources || [],
    };
  }

  /**
   * Build dependency graph for workflows
   */
  static buildDependencyGraph(
    workflowId: string,
    workflowName: string,
    metadata: SpecMetadata
  ): DependencyGraph {
    const nodes: Array<{ id: string; name: string; type: 'workflow' | 'agent' }> = [
      { id: workflowId, name: workflowName, type: 'workflow' },
    ];

    const edges: Array<{ from: string; to: string; type: string }> = [];

    // Add agent dependencies
    if (metadata.agents) {
      for (const agent of metadata.agents) {
        nodes.push({ id: agent.path, name: agent.name, type: 'agent' });
        edges.push({ from: workflowId, to: agent.path, type: 'uses' });
      }
    }

    // Add workflow dependencies
    if (metadata.subWorkflows) {
      for (const wf of metadata.subWorkflows) {
        nodes.push({ id: wf.path, name: wf.name, type: 'workflow' });
        edges.push({ from: workflowId, to: wf.path, type: 'includes' });
      }
    }

    // Add resource dependencies
    if (metadata.requires) {
      for (const req of metadata.requires) {
        const targetId = req.split(':').pop() || req;
        nodes.push({ id: req, name: targetId, type: 'workflow' });
        edges.push({ from: workflowId, to: req, type: 'requires' });
      }
    }

    return { nodes, edges };
  }

  /**
   * Find circular dependencies in workflow graph
   */
  static findCircularDependencies(
    graph: DependencyGraph
  ): Array<string[]> {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: Array<string[]> = [];

    const dfs = (nodeId: string, path: string[]) => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoing = graph.edges.filter(e => e.from === nodeId);

      for (const edge of outgoing) {
        if (recursionStack.has(edge.to)) {
          const cyclePath = [...path, edge.to];
          cycles.push(cyclePath);
        } else if (!visited.has(edge.to)) {
          dfs(edge.to, [...path, nodeId]);
        }
      }

      recursionStack.delete(nodeId);
    };

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, [node.id]);
      }
    }

    return cycles;
  }

  /**
   * Get workflow dependencies for a workflow
   */
  static getWorkflowDependencies(metadata: SpecMetadata): {
    direct: string[];
    transitive: string[];
  } {
    const direct: string[] = [];

    if (metadata.agents) {
      direct.push(...metadata.agents.map(a => `agent:${a.name}`));
    }

    if (metadata.subWorkflows) {
      direct.push(...metadata.subWorkflows.map(w => `workflow:${w.name}`));
    }

    if (metadata.requires) {
      direct.push(...metadata.requires);
    }

    // TODO: Compute transitive dependencies by recursively loading dependent workflows
    const transitive: string[] = [];

    return { direct, transitive };
  }

  /**
   * Validate dependency references exist
   */
  static async validateDependencies(
    metadata: SpecMetadata,
    availableWorkflows: string[]
  ): Promise<{
    valid: boolean;
    missing: string[];
  }> {
    const missing: string[] = [];

    if (metadata.requires) {
      for (const req of metadata.requires) {
        const target = req.split(':').pop() || req;

        if (
          req.startsWith('agent:') &&
          !metadata.agents?.some(a => a.name === target)
        ) {
          missing.push(req);
        } else if (
          req.startsWith('workflow:') &&
          !availableWorkflows.includes(target)
        ) {
          missing.push(req);
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Generate upgrade suggestions for workflow version
   */
  static generateUpgradeSuggestions(
    currentVersion: string,
    metadata: SpecMetadata
  ): {
    nextVersion: string;
    reason: string;
    changes?: string[];
  } {
    const parts = currentVersion.split('.').map(Number);
    const [major, minor, patch] = parts;

    if (!metadata.workflowConfig) {
      return {
        nextVersion: currentVersion,
        reason: 'No changes detected',
      };
    }

    const changes: string[] = [];

    // Check for new dependencies
    if (metadata.requires && metadata.requires.length > 0) {
      changes.push('Dependencies added');
    }

    // Check for multiple agents (breaking change indicator)
    if (metadata.agents && metadata.agents.length > 1) {
      changes.push('Multi-agent architecture');
    }

    if (changes.length === 0) {
      return {
        nextVersion: `${major}.${minor}.${patch + 1}`,
        reason: 'Patch update - minor improvements',
      };
    }

    if (changes.some(c => c.includes('breaking') || c.includes('architecture'))) {
      return {
        nextVersion: `${major + 1}.0.0`,
        reason: 'Major update - architectural changes',
        changes,
      };
    }

    return {
      nextVersion: `${major}.${minor + 1}.0`,
      reason: 'Minor update - new features added',
      changes,
    };
  }
}

/**
 * Utility function to analyze workflow metadata
 */
export function analyzeWorkflowMetadata(
  content: string,
  baseMetadata: SpecMetadata
): EnrichedMetadata {
  return MetadataAnalyzer.extractEnhancedMetadata(content, baseMetadata);
}

/**
 * Utility function to parse dependencies
 */
export function parseWorkflowDependencies(
  metadata: SpecMetadata
): ParsedDependencies {
  return MetadataAnalyzer.parseDependencies(metadata);
}

/**
 * Utility function to generate upgrade suggestions
 */
export function getUpgradeSuggestions(
  currentVersion: string,
  metadata: SpecMetadata
) {
  return MetadataAnalyzer.generateUpgradeSuggestions(currentVersion, metadata);
}
