/**
 * Workflow Graph Data Models
 *
 * Defines the data structures for workflow graph representation, analysis,
 * and validation.
 */

import matter from 'gray-matter';
import YAML from 'js-yaml';

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  path?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'step' | 'agent' | 'workflow' | 'resource' | 'condition' | 'start' | 'end';
  name: string;
  description?: string;
  ccPath?: string;
  validated: boolean;
  validationErrors: ValidationError[];
  metadata: {
    position?: { x: number; y: number };
    category?: string;
    complexity?: number;
    executionTime?: number;
    inputs?: string[];
    outputs?: string[];
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'sequence' | 'dependency' | 'condition' | 'data_flow';
  label?: string;
  condition?: string;
  validated: boolean;
  ccPathResolved?: boolean;
  metadata?: {
    async?: boolean;
    parallel?: boolean;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: string;
  action?: string;
  agent?: string;
  workflow?: string;
  resources?: string[];
  conditions?: string[];
  next?: string | string[];
  metadata?: Record<string, unknown>;
}

export interface WorkflowDependency {
  type: 'agent' | 'workflow' | 'resource';
  name: string;
  path?: string;
  required: boolean;
}

export interface ParsedWorkflow {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  steps: WorkflowStep[];
  dependencies: WorkflowDependency[];
  metadata: Record<string, unknown>;
}

export interface WorkflowGraph {
  id: string;
  workflowSpecId: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    complexity: number;
    totalSteps: number;
    dependencyCount: number;
    validationStatus: 'valid' | 'invalid' | 'warning';
    lastValidated: Date;
    circularDependencies: string[][];
  };
}

export interface ValidationResult {
  valid: boolean;
  status: 'valid' | 'invalid' | 'warning';
  errors: ValidationError[];
  warnings: ValidationError[];
  validatedAt: Date;
}

export interface GraphAnalysisReport {
  workflowId: string;
  workflowName: string;
  validation: ValidationResult;
  metrics: {
    totalNodes: number;
    totalEdges: number;
    avgDegree: number;
    maxPathLength: number;
    cyclomaticComplexity: number;
    bottleneckNodes: string[];
  };
  recommendations: string[];
  issues: ValidationError[];
}

/**
 * Markdown Workflow Parser
 */
export class MarkdownWorkflowParser {
  parse(content: string): ParsedWorkflow {
    const parsed = matter(content);
    const data = parsed.data as Record<string, unknown>;
    const body = parsed.content;

    const steps = this.parseWorkflowSteps(body, data);

    return {
      name: String(data.name || 'Untitled Workflow'),
      description: data.description ? String(data.description) : undefined,
      version: data.version ? String(data.version) : undefined,
      author: data.author ? String(data.author) : undefined,
      steps,
      dependencies: this.extractDependencies(data as any),
      metadata: data,
    };
  }

  private parseWorkflowSteps(content: string, metadata: Record<string, unknown>): WorkflowStep[] {
    const steps: WorkflowStep[] = [];

    // Extract steps from numbered lists or markdown headers
    const lines = content.split('\n');
    let stepId = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Match numbered list items like "1. Step name"
      const numberedMatch = trimmed.match(/^(\d+)\.\s*(.+)$/);
      // Match task list items like "- [ ] Task name"
      const taskMatch = trimmed.match(/^-\s*\[\s\]\s*(.+)$/);
      // Match bullet points with step pattern
      const bulletMatch = trimmed.match(/^[-*+]\s*(.+)$/);

      if (numberedMatch || taskMatch || bulletMatch) {
        const stepName = numberedMatch?.[2] || taskMatch?.[1] || bulletMatch?.[1] || '';

        if (stepName) {
          stepId++;
          steps.push({
            id: `step-${stepId}`,
            name: stepName,
            type: 'action',
          });
        }
      }
    }

    // If no steps found, try to extract from workflow config
    if (steps.length === 0) {
      const workflowConfig = metadata.workflow_config as Record<string, unknown>;
      if (workflowConfig?.steps && Array.isArray(workflowConfig.steps)) {
        for (const step of workflowConfig.steps) {
          stepId++;
          const stepData = step as Record<string, unknown>;
          steps.push({
            id: `step-${stepId}`,
            name: String(stepData.name || stepData.action || `Step ${stepId}`),
            type: String(stepData.type || 'action'),
            action: stepData.action ? String(stepData.action) : undefined,
            agent: stepData.agent ? String(stepData.agent) : undefined,
            workflow: stepData.workflow ? String(stepData.workflow) : undefined,
          });
        }
      }
    }

    return steps;
  }

  private extractDependencies(data: {
    agents?: Array<{ name: string; path: string }>;
    workflows?: Array<{ name: string; path: string }>;
    resources?: Array<{ path: string }>;
    requires?: string[];
  }): WorkflowDependency[] {
    const dependencies: WorkflowDependency[] = [];

    if (data.agents) {
      for (const agent of data.agents) {
        dependencies.push({
          type: 'agent',
          name: agent.name,
          path: agent.path,
          required: true,
        });
      }
    }

    if (data.workflows) {
      for (const wf of data.workflows) {
        dependencies.push({
          type: 'workflow',
          name: wf.name,
          path: wf.path,
          required: true,
        });
      }
    }

    if (data.requires) {
      for (const req of data.requires) {
        const [type, name] = req.split(':');
        dependencies.push({
          type: type as 'agent' | 'workflow' | 'resource',
          name: name || req,
          required: true,
        });
      }
    }

    if (data.resources) {
      for (const res of data.resources) {
        const path = typeof res === 'string' ? res : (res as { path: string }).path;
        dependencies.push({
          type: 'resource',
          name: path.split(/[\\/]/).pop() || path,
          path,
          required: false,
        });
      }
    }

    return dependencies;
  }
}

/**
 * YAML Workflow Parser
 */
export class YAMLWorkflowParser {
  parse(content: string): ParsedWorkflow {
    const data = YAML.load(content) as Record<string, unknown>;

    return {
      name: String(data.name || 'Untitled Workflow'),
      description: data.description ? String(data.description) : undefined,
      version: data.version ? String(data.version) : undefined,
      author: data.author ? String(data.author) : undefined,
      steps: this.parseSteps(data),
      dependencies: this.extractDependencies(data),
      metadata: data,
    };
  }

  private parseSteps(data: Record<string, unknown>): WorkflowStep[] {
    const steps: WorkflowStep[] = [];

    // Check for workflow_config.steps format
    const workflowConfig = data.workflow_config as Record<string, unknown>;
    if (workflowConfig?.steps && Array.isArray(workflowConfig.steps)) {
      let stepId = 0;
      for (const step of workflowConfig.steps) {
        stepId++;
        const stepData = step as Record<string, unknown>;
        steps.push({
          id: `step-${stepId}`,
          name: String(stepData.name || stepData.action || `Step ${stepId}`),
          type: String(stepData.type || 'action'),
          action: stepData.action ? String(stepData.action) : undefined,
          agent: stepData.agent ? String(stepData.agent) : undefined,
          workflow: stepData.workflow ? String(stepData.workflow) : undefined,
          next: stepData.next ? this.parseNext(stepData.next) : undefined,
        });
      }
    }

    // Check for direct steps format
    if (data.steps && Array.isArray(data.steps)) {
      let stepId = 0;
      for (const step of data.steps) {
        stepId++;
        const stepData = step as Record<string, unknown>;
        steps.push({
          id: `step-${stepId}`,
          name: String(stepData.name || stepData.action || `Step ${stepId}`),
          type: String(stepData.type || 'action'),
          action: stepData.action ? String(stepData.action) : undefined,
          agent: stepData.agent ? String(stepData.agent) : undefined,
          workflow: stepData.workflow ? String(stepData.workflow) : undefined,
          next: stepData.next ? this.parseNext(stepData.next) : undefined,
        });
      }
    }

    return steps;
  }

  private parseNext(next: unknown): string | string[] {
    if (Array.isArray(next)) {
      return next.map(n => String(n));
    }
    if (typeof next === 'string') {
      return next;
    }
    if (typeof next === 'object' && next !== null) {
      return Object.keys(next);
    }
    return '';
  }

  private extractDependencies(data: Record<string, unknown>): WorkflowDependency[] {
    const dependencies: WorkflowDependency[] = [];

    if (data.agents && Array.isArray(data.agents)) {
      for (const agent of data.agents) {
        const agentData = agent as Record<string, unknown>;
        dependencies.push({
          type: 'agent',
          name: String(agentData.name),
          path: agentData.path ? String(agentData.path) : undefined,
          required: true,
        });
      }
    }

    if (data.workflows && Array.isArray(data.workflows)) {
      for (const wf of data.workflows) {
        const wfData = wf as Record<string, unknown>;
        dependencies.push({
          type: 'workflow',
          name: String(wfData.name),
          path: wfData.path ? String(wfData.path) : undefined,
          required: true,
        });
      }
    }

    if (data.requires && Array.isArray(data.requires)) {
      for (const req of data.requires) {
        const [type, name] = String(req).split(':');
        dependencies.push({
          type: type as 'agent' | 'workflow' | 'resource',
          name: name || String(req),
          required: true,
        });
      }
    }

    return dependencies;
  }
}

/**
 * Workflow Graph Builder
 */
export class WorkflowGraphBuilder {
  /**
   * Build a workflow graph from parsed workflow data
   */
  buildFromParsed(parsed: ParsedWorkflow, workflowSpecId: string): WorkflowGraph {
    const nodes: WorkflowNode[] = [];
    const edges: WorkflowEdge[] = [];

    // Add start node
    nodes.push({
      id: 'start',
      type: 'start',
      name: 'Start',
      validated: true,
      validationErrors: [],
      metadata: {
        position: { x: 0, y: 0 },
      },
    });

    // Add step nodes
    parsed.steps.forEach((step, index) => {
      nodes.push({
        id: step.id,
        type: 'step',
        name: step.name,
        description: step.description,
        validated: false,
        validationErrors: [],
        metadata: {
          position: { x: (index + 1) * 150, y: 0 },
          inputs: [],
          outputs: [],
          executionTime: parsed.metadata.executionTime as number | undefined,
        },
      });
    });

    // Add end node
    nodes.push({
      id: 'end',
      type: 'end',
      name: 'End',
      validated: true,
      validationErrors: [],
      metadata: {
        position: { x: (parsed.steps.length + 2) * 150, y: 0 },
      },
    });

    // Add edges for sequence
    if (parsed.steps.length > 0) {
      // Start -> first step
      edges.push({
        id: `edge-start-${parsed.steps[0].id}`,
        source: 'start',
        target: parsed.steps[0].id,
        type: 'sequence',
        validated: true,
      });

      // Step -> step connections
      for (let i = 0; i < parsed.steps.length - 1; i++) {
        const currentStep = parsed.steps[i];
        const nextStep = parsed.steps[i + 1];
        edges.push({
          id: `edge-${currentStep.id}-${nextStep.id}`,
          source: currentStep.id,
          target: nextStep.id,
          type: 'sequence',
          validated: true,
        });
      }

      // Last step -> end
      edges.push({
        id: `edge-${parsed.steps[parsed.steps.length - 1].id}-end`,
        source: parsed.steps[parsed.steps.length - 1].id,
        target: 'end',
        type: 'sequence',
        validated: true,
      });
    }

    // Add dependency nodes and edges
    parsed.dependencies.forEach((dep, index) => {
      const depNodeId = `dep-${dep.type}-${index}`;

      nodes.push({
        id: depNodeId,
        type: dep.type,
        name: dep.name,
        ccPath: dep.path,
        validated: false,
        validationErrors: [],
        metadata: {
          position: {
            x: (index + 1) * 150,
            y: (parsed.steps.length > 0 ? parsed.steps.length : 1) * 100 + 50,
          },
          category: dep.type,
        },
      });

      // Find related step and create dependency edge
      const relatedStep = parsed.steps.find(s =>
        s.agent === dep.name ||
        s.workflow === dep.name ||
        s.resources?.includes(dep.name)
      );

      if (relatedStep) {
        edges.push({
          id: `edge-${relatedStep.id}-${depNodeId}`,
          source: relatedStep.id,
          target: depNodeId,
          type: 'dependency',
          validated: false,
          ccPathResolved: false,
        });
      }
    });

    // Calculate complexity
    const complexity = this.calculateComplexity(nodes, edges);

    return {
      id: `graph-${workflowSpecId}`,
      workflowSpecId,
      name: parsed.name,
      nodes,
      edges,
      metadata: {
        complexity,
        totalSteps: parsed.steps.length,
        dependencyCount: parsed.dependencies.length,
        validationStatus: 'invalid', // Will be updated after validation
        lastValidated: new Date(),
        circularDependencies: this.findCircularDependencies(nodes, edges),
      },
    };
  }

  /**
   * Calculate graph complexity
   */
  private calculateComplexity(nodes: WorkflowNode[], edges: WorkflowEdge[]): number {
    const avgDegree = edges.length / Math.max(nodes.length, 1);
    const cyclomaticComplexity = edges.length - nodes.length + 2;

    // Normalize complexity score (0-100)
    return Math.min(100, Math.round(
      (avgDegree * 20) +
      (cyclomaticComplexity * 10) +
      (nodes.filter(n => n.type === 'condition').length * 15)
    ));
  }

  /**
   * Find circular dependencies in the graph
   */
  private findCircularDependencies(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[][] {
    const adjacency = new Map<string, string[]>();

    for (const edge of edges) {
      if (!adjacency.has(edge.source)) {
        adjacency.set(edge.source, []);
      }
      adjacency.get(edge.source)!.push(edge.target);
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (nodeId: string, path: string[]) => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjacency.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (recursionStack.has(neighbor)) {
          cycles.push([...path, neighbor]);
        } else if (!visited.has(neighbor)) {
          dfs(neighbor, [...path, nodeId]);
        }
      }

      recursionStack.delete(nodeId);
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, [node.id]);
      }
    }

    return cycles;
  }
}

/**
 * Factory function to create appropriate parser based on format
 */
export function createWorkflowParser(format: 'markdown' | 'yaml' | 'auto' = 'auto') {
  if (format === 'yaml') return new YAMLWorkflowParser();
  if (format === 'markdown') return new MarkdownWorkflowParser();

  // Auto-detect based on content (to be called with content)
  return {
    parse: (content: string, formatHint?: 'markdown' | 'yaml') => {
      const hasFrontmatter = content.trim().startsWith('---');
      const effectiveFormat = formatHint || (hasFrontmatter ? 'markdown' : 'yaml');

      if (effectiveFormat === 'yaml') {
        return new YAMLWorkflowParser().parse(content);
      }
      return new MarkdownWorkflowParser().parse(content);
    },
  };
}
