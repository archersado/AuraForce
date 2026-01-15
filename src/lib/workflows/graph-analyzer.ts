/**
 * Graph Analysis and Validation Tools
 *
 * Provides comprehensive workflow analysis, validation reports,
 * complexity metrics, and graph export functionality.
 */

import type {
  WorkflowGraph,
  WorkflowNode,
  WorkflowEdge,
  GraphAnalysisReport,
  ValidationResult,
} from './graph-model';
import { CCPathValidator } from './cc-path-validator';

export interface GraphExportOptions {
  format: 'json' | 'dot' | 'svg' | 'mermaid';
  includeMetadata?: boolean;
  pretty?: boolean;
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  nestingDepth: number;
  fanIn: number;
  fanOut: number;
  overallComplexity: number;
  complexityLevel: 'simple' | 'moderate' | 'complex' | 'very-complex';
}

export interface ExecutionPath {
  id: string;
  nodes: string[];
  steps: number;
  estimatedDuration?: number;
}

/**
 * Graph Analyzer
 */
export class GraphAnalyzer {
  /**
   * Validate a workflow graph against CC paths
   */
  static async validateGraph(
    graph: WorkflowGraph,
    ccBasePath?: string
  ): Promise<ValidationResult> {
    const validator = new CCPathValidator(ccBasePath);
    const errors: { code: string; message: string; severity: 'error' | 'warning' | 'info'; path?: string }[] = [];
    const warnings: { code: string; message: string; severity: 'error' | 'warning' | 'info'; path?: string }[] = [];

    // Validate each node with a CC path
    for (const node of graph.nodes) {
      if (node.ccPath) {
        const validation = await validator.validatePath(
          node.ccPath.replace(validator.getBasePath(), '')
        );

        if (!validation.exists) {
          node.validated = false;
          node.validationErrors.push({
            code: 'PATH_NOT_FOUND',
            message: `Path does not exist: ${node.ccPath}`,
            severity: 'error',
            path: node.ccPath,
          });
          errors.push(node.validationErrors[node.validationErrors.length - 1]);
        } else if (!validation.accessible) {
          node.validated = false;
          node.validationErrors.push({
            code: 'PATH_NOT_ACCESSIBLE',
            message: `Path not accessible: ${node.ccPath}`,
            severity: 'error',
            path: node.ccPath,
          });
          errors.push(node.validationErrors[node.validationErrors.length - 1]);
        } else {
          node.validated = true;
        }
      } else if (node.type === 'agent' || node.type === 'workflow' || node.type === 'resource') {
        node.validated = false;
        node.validationErrors.push({
          code: 'MISSING_CC_PATH',
          message: `${node.type} node has no CC path defined`,
          severity: 'warning',
        });
        warnings.push(node.validationErrors[0]);
      } else {
        node.validated = true;
      }
    }

    // Validate edges
    for (const edge of graph.edges) {
      const sourceExists = graph.nodes.find(n => n.id === edge.source);
      const targetExists = graph.nodes.find(n => n.id === edge.target);

      if (!sourceExists) {
        edge.validated = false;
      } else if (!targetExists) {
        edge.validated = false;
      } else {
        edge.validated = true;
      }
    }

    // Check for circular dependencies
    if (graph.metadata.circularDependencies.length > 0) {
      graph.metadata.circularDependencies.forEach(cycle => {
        warnings.push({
          code: 'CIRCULAR_DEPENDENCY',
          message: `Circular dependency detected: ${cycle.join(' -> ')}`,
          severity: 'warning',
        });
      });
    }

    const status: 'valid' | 'invalid' | 'warning' =
      errors.length > 0 ? 'invalid' :
      warnings.length > 0 ? 'warning' :
      'valid';

    return {
      valid: status !== 'invalid',
      status,
      errors,
      warnings,
      validatedAt: new Date(),
    };
  }

  /**
   * Generate a comprehensive graph analysis report
   */
  static generateAnalysisReport(graph: WorkflowGraph, validation: ValidationResult): GraphAnalysisReport {
    const metrics = this.calculateMetrics(graph);

    return {
      workflowId: graph.workflowSpecId,
      workflowName: graph.name,
      validation,
      metrics,
      recommendations: this.generateRecommendations(graph, validation, metrics),
      issues: [...validation.errors, ...validation.warnings],
    };
  }

  /**
   * Calculate graph metrics
   */
  static calculateMetrics(graph: WorkflowGraph): GraphAnalysisReport['metrics'] {
    const { nodes, edges } = graph;

    // Average degree (average connections per node)
    const degreeSum = edges.length * 2; // Each edge connects 2 nodes
    const avgDegree = nodes.length > 0 ? degreeSum / nodes.length : 0;

    // Maximum path length (longest path through the graph)
    const maxPathLength = this.calculateMaxPathLength(graph);

    // Cyclomatic complexity = E - N + 2 (E = edges, N = nodes)
    const cyclomaticComplexity = edges.length - nodes.length + 2;

    // Find bottleneck nodes (nodes with high degree)
    const nodeDegrees = new Map<string, number>();
    edges.forEach(e => {
      nodeDegrees.set(e.source, (nodeDegrees.get(e.source) || 0) + 1);
      nodeDegrees.set(e.target, (nodeDegrees.get(e.target) || 0) + 1);
    });

    const avgDegreeValue = Array.from(nodeDegrees.values()).reduce((a, b) => a + b, 0) / nodeDegrees.size;
    const bottleneckNodes = Array.from(nodeDegrees.entries())
      .filter(([_, deg]) => deg > avgDegreeValue)
      .map(([id]) => id);

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      avgDegree: Math.round(avgDegree * 100) / 100,
      maxPathLength,
      cyclomaticComplexity: Math.max(0, cyclomaticComplexity),
      bottleneckNodes,
    };
  }

  /**
   * Calculate maximum path length in the graph
   */
  private static calculateMaxPathLength(graph: WorkflowGraph): number {
    const { nodes, edges } = graph;
    if (nodes.length === 0) return 0;

    // Build adjacency list
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => adj.get(e.source)!.push(e.target));

    // Find all source nodes (nodes with no incoming edges)
    const inDegree = new Map<string, number>();
    nodes.forEach(n => inDegree.set(n.id, 0));
    edges.forEach(e => inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1));

    const sources = nodes.filter(n => (inDegree.get(n.id) || 0) === 0).map(n => n.id);
    const sourcesToUse = sources.length > 0 ? sources : [nodes[0].id];

    // BFS from each source to find longest path
    let maxPath = 0;

    for (const start of sourcesToUse) {
      const visited = new Set<string>();
      const distance = new Map<string, number>();
      distance.set(start, 0);
      const queue = [start];

      while (queue.length > 0) {
        const current = queue.shift()!;
        visited.add(current);

        const neighbors = adj.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            distance.set(neighbor, (distance.get(current) || 0) + 1);
            queue.push(neighbor);
            maxPath = Math.max(maxPath, distance.get(neighbor) || 0);
          }
        }
      }
    }

    return maxPath;
  }

  /**
   * Calculate detailed complexity metrics
   */
  static calculateComplexity(graph: WorkflowGraph): ComplexityMetrics {
    const cyclomatic = Math.max(1, graph.edges.length - graph.nodes.length + 2);

    // Calculate nesting depth (based on workflow steps)
    let nestingDepth = 1;
    const stepNodes = graph.nodes.filter(n => n.type === 'step');
    if (stepNodes.length > 0) {
      nestingDepth = Math.ceil(Math.log2(stepNodes.length + 1));
    }

    // Fan-in (incoming edges)
    const fanIn = Math.max(0, graph.edges.reduce((sum, e) => {
      if (e.target === 'end') return sum + 1;
      return sum;
    }, 0));

    // Fan-out (outgoing edges from start)
    const fanOut = graph.edges.filter(e => e.source === 'start').length;

    // Overall complexity score (normalized to 0-100)
    const overall = Math.min(100, Math.round(
      (cyclomatic * 10) +
      (nestingDepth * 15) +
      (fanIn * 5) +
      (fanOut * 5)
    ));

    // Complexity level
    let level: ComplexityMetrics['complexityLevel'];
    if (overall < 25) level = 'simple';
    else if (overall < 50) level = 'moderate';
    else if (overall < 75) level = 'complex';
    else level = 'very-complex';

    return {
      cyclomaticComplexity: cyclomatic,
      nestingDepth,
      fanIn,
      fanOut,
      overallComplexity: overall,
      complexityLevel: level,
    };
  }

  /**
   * Find all execution paths in the graph
   */
  static findExecutionPaths(graph: WorkflowGraph): ExecutionPath[] {
    const paths: ExecutionPath[] = [];
    const { nodes, edges } = graph;

    // Build adjacency list
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => adj.get(e.source)!.push(e.target));

    // Find start and end nodes
    const startNode = nodes.find(n => n.type === 'start')?.id || nodes[0]?.id;
    const endNode = nodes.find(n => n.type === 'end')?.id || nodes[nodes.length - 1]?.id;

    if (!startNode || !endNode) return [];

    // DFS to find all paths
    const dfs = (current: string, visited: Set<string>, currentPath: string[]) => {
      visited.add(current);
      currentPath.push(current);

      if (current === endNode) {
        paths.push({
          id: `path-${paths.length}`,
          nodes: [...currentPath],
          steps: currentPath.filter(n => {
            const node = graph.nodes.find(node => node.id === n);
            return node?.type === 'step';
          }).length,
        });
      } else {
        const neighbors = adj.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor, new Set(visited), currentPath);
          }
        }
      }
    };

    dfs(startNode, new Set(), []);

    return paths;
  }

  /**
   * Generate recommendations based on analysis
   */
  private static generateRecommendations(
    graph: WorkflowGraph,
    validation: ValidationResult,
    metrics: GraphAnalysisReport['metrics']
  ): string[] {
    const recommendations: string[] = [];

    // Validation-based recommendations
    if (validation.errors.length > 0) {
      recommendations.push(
        `Fix ${validation.errors.length} critical errors before executing the workflow.`
      );
    }

    if (validation.warnings.length > 0) {
      recommendations.push(
        `Review ${validation.warnings.length} warnings that may affect workflow execution.`
      );
    }

    // Complexity-based recommendations
    if (metrics.cyclomaticComplexity > 10) {
      recommendations.push(
        'Consider refactoring the workflow to reduce cyclomatic complexity. ' +
        'Extract sub-workflows for complex logic.'
      );
    }

    if (metrics.bottleneckNodes.length > 2) {
      recommendations.push(
        'The workflow has multiple bottleneck nodes. ' +
        'Consider adding parallel execution paths to improve performance.'
      );
    }

    if (graph.metadata.circularDependencies.length > 0) {
      recommendations.push(
        'Resolve circular dependencies to prevent infinite loops during execution.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Workflow is well-structured and ready for execution.');
    }

    return recommendations;
  }

  /**
   * Export graph in specified format
   */
  static exportGraph(graph: WorkflowGraph, options: GraphExportOptions): string {
    switch (options.format) {
      case 'json':
        return this.exportAsJSON(graph, options.pretty);

      case 'dot':
        return this.exportAsDOT(graph);

      case 'mermaid':
        return this.exportAsMermaid(graph);

      case 'svg':
        return this.exportAsSVG(graph);

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export graph as JSON
   */
  private static exportAsJSON(graph: WorkflowGraph, pretty = true): string {
    const data = options.includeMetadata ? graph : {
      nodes: graph.nodes,
      edges: graph.edges,
    };

    return JSON.stringify(data, null, pretty ? 2 : 0);
  }

  /**
   * Export graph as DOT (GraphViz format)
   */
  private static exportAsDOT(graph: WorkflowGraph): string {
    let dot = 'digraph workflow {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box];\n\n';

    // Add nodes
    for (const node of graph.nodes) {
      const label = node.name.replace(/"/g, '\\"');
      const color = this.getNodeColor(node.type, node.validated);
      dot += `  "${node.id}" [label="${label}", fillcolor="${color}", style="filled"];\n`;
    }

    dot += '\n';

    // Add edges
    for (const edge of graph.edges) {
      const style = edge.validated ? '' : ', style=dashed, color=red';
      dot += `  "${edge.source}" -> "${edge.target}"${style};\n`;
    }

    dot += '}\n';
    return dot;
  }

  /**
   * Export graph as Mermaid diagram
   */
  private static exportAsMermaid(graph: WorkflowGraph): string {
    let mermaid = 'graph LR\n';

    // Add nodes
    for (const node of graph.nodes) {
      const shape = this.getMermaidShape(node.type);
      mermaid += `  ${node.id}${shape}[${node.name}]\n`;
    }

    mermaid += '\n';

    // Add edges
    for (const edge of graph.edges) {
      const style = edge.validated ? '' : ' -.-> ';
      const label = edge.label ? `|${edge.label}|` : '';
      mermaid += `  ${edge.source}${style}${edge.target}${label}\n`;
    }

    return mermaid;
  }

  /**
   * Export graph as SVG placeholder
   * (Actual SVG generation would require a graph visualization library)
   */
  private static exportAsSVG(graph: WorkflowGraph): string {
    // Simple SVG placeholder - in production, use D3.js or similar
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">\n`;
    svg += '  <rect width="800" height="600" fill="#ffffff"/>\n';
    svg += '  <text x="400" y="300" text-anchor="middle" font-size="20">\n';
    svg += `    Workflow Graph: ${graph.name}\n`;
    svg += '  </text>\n';
    svg += '  <text x="400" y="340" text-anchor="middle" font-size="14" fill="#666">\n';
    svg += `    ${graph.nodes.length} nodes, ${graph.edges.length} edges\n`;
    svg += '  </text>\n';
    svg += '</svg>';

    return svg;
  }

  /**
   * Get HTML color for node based on type and validation status
   */
  private static getNodeColor(type: string, validated: boolean): string {
    if (!validated) return '#ffebee'; // Red for invalid

    const colors: Record<string, string> = {
      start: '#4caf50', // Green
      end: '#f44336', // Red
      step: '#2196f3', // Blue
      agent: '#ff9800', // Orange
      workflow: '#9c27b0', // Purple
      resource: '#607d8b', // Gray
      condition: '#ffeb3b', // Yellow
    };

    return colors[type] || '#2196f3';
  }

  /**
   * Get Mermaid shape for node type
   */
  private static getMermaidShape(type: string): string {
    const shapes: Record<string, string> = {
      start: '([', // Rounded
      end: '([', // Rounded
      step: '([', // Rounded
      condition: '{', // Diamond
      agent: '[(', // Stadium
      workflow: '[[', // Rectangle with rounded corners
      resource: '[(', // Stadium
    };

    return shapes[type] || '([';
  }
}

/**
 * Utility function to analyze a workflow graph
 */
export function analyzeWorkflowGraph(
  graph: WorkflowGraph,
  validation: ValidationResult
): GraphAnalysisReport {
  return GraphAnalyzer.generateAnalysisReport(graph, validation);
}

/**
 * Utility function to calculate complexity metrics
 */
export function calculateWorkflowComplexity(graph: WorkflowGraph): ComplexityMetrics {
  return GraphAnalyzer.calculateComplexity(graph);
}

/**
 * Utility function to export a graph
 */
export function exportWorkflowGraph(
  graph: WorkflowGraph,
  format: GraphExportOptions['format'],
  pretty = true
): string {
  return GraphAnalyzer.exportGraph(graph, { format, pretty });
}
