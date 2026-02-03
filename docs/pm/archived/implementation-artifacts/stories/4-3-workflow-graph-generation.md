# Story 4.3: Workflow Graph Generation with CC Path Validation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to visualize my deployed workflow specifications as interactive graphs with validated CC path relationships,
so that I can understand workflow dependencies, validate deployment integrity, and troubleshoot execution paths before running workflows.

## Acceptance Criteria

1. **Workflow Graph Parsing and Analysis**
   - Parse BMAD workflow specs to extract step sequences and dependencies
   - Identify agent references, sub-workflows, and resource dependencies
   - Build directed graph representation of workflow execution paths
   - Detect circular dependencies and invalid references
   - Support both markdown and YAML workflow format parsing

2. **CC Path Validation and Verification**
   - Validate all workflow references point to existing CC directory files
   - Check agent file existence and accessibility in CC structure
   - Verify resource file availability and permissions
   - Cross-reference workflow dependencies with actual deployment status
   - Report missing or corrupted workflow components with detailed diagnostics

3. **Interactive Graph Visualization**
   - Render workflow graphs using modern graph visualization library
   - Support zoom, pan, and interactive node exploration
   - Display workflow steps as nodes with execution flow connections
   - Show dependency types (agent, workflow, resource) with distinct styling
   - Provide node details on hover/click with CC path information

4. **Dependency Resolution Engine**
   - Automatically resolve workflow dependencies across CC directory structure
   - Map logical dependencies to physical file system paths
   - Support transitive dependency analysis for complex workflows
   - Generate dependency installation recommendations for missing components
   - Provide dependency conflict detection and resolution suggestions

5. **Graph Analysis and Validation Reports**
   - Generate comprehensive workflow validation reports
   - Identify execution path bottlenecks and optimization opportunities
   - Provide workflow complexity metrics and analysis
   - Export graph data for external tools and documentation
   - Support batch validation for multiple workflows

## Tasks / Subtasks

- [ ] Task 1: Create Workflow Graph Parser (AC: 1)
  - [ ] Subtask 1.1: Build markdown workflow spec parser for BMAD format
  - [ ] Subtask 1.2: Create YAML workflow spec parser with schema validation
  - [ ] Subtask 1.3: Implement dependency extraction from workflow content
  - [ ] Subtask 1.4: Build directed graph data structure for workflow representation
- [ ] Task 2: Implement CC Path Validation Engine (AC: 2)
  - [ ] Subtask 2.1: Create file system validator for CC directory structure
  - [ ] Subtask 2.2: Build reference checker for agent and workflow dependencies
  - [ ] Subtask 2.3: Implement resource availability verification with permissions
  - [ ] Subtask 2.4: Create validation report generator with detailed diagnostics
- [ ] Task 3: Build Interactive Graph Visualization (AC: 3)
  - [ ] Subtask 3.1: Integrate D3.js or Cytoscape.js for graph rendering
  - [ ] Subtask 3.2: Create responsive workflow graph component with zoom/pan
  - [ ] Subtask 3.3: Implement node styling system for different dependency types
  - [ ] Subtask 3.4: Add interactive tooltips and detail panels
- [ ] Task 4: Create Dependency Resolution System (AC: 4)
  - [ ] Subtask 4.1: Build dependency mapper for CC path resolution
  - [ ] Subtask 4.2: Implement transitive dependency analysis
  - [ ] Subtask 4.3: Create conflict detection algorithms
  - [ ] Subtask 4.4: Build resolution recommendation engine
- [ ] Task 5: Implement Graph Analysis Tools (AC: 5)
  - [ ] Subtask 5.1: Create workflow validation report generator
  - [ ] Subtask 5.2: Build complexity metrics calculator
  - [ ] Subtask 5.3: Implement graph export functionality (JSON, DOT, SVG)
  - [ ] Subtask 5.4: Add batch processing for multiple workflow validation

## Dev Notes

### Workflow Graph Data Model

The developer MUST implement a robust graph data structure that supports complex workflow analysis:

```typescript
// src/lib/workflows/graph-model.ts

export interface WorkflowNode {
  id: string;
  type: 'step' | 'agent' | 'workflow' | 'resource' | 'condition';
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
  };
}

export class WorkflowGraphBuilder {
  async buildFromSpec(spec: WorkflowSpec): Promise<WorkflowGraph> {
    const content = await this.loadSpecContent(spec.ccPath);
    const parser = spec.name.endsWith('.yaml') ?
      new YAMLWorkflowParser() : new MarkdownWorkflowParser();

    const parsedWorkflow = parser.parse(content);
    const graph = this.createGraphFromParsed(parsedWorkflow);

    // Validate all nodes and edges
    await this.validateGraph(graph, spec.ccPath);

    return graph;
  }

  private async validateGraph(graph: WorkflowGraph, basePath: string): Promise<void> {
    const validator = new CCPathValidator(basePath);

    for (const node of graph.nodes) {
      if (node.ccPath) {
        const validation = await validator.validatePath(node.ccPath);
        node.validated = validation.valid;
        node.validationErrors = validation.errors;
      }
    }

    for (const edge of graph.edges) {
      // Validate edge references exist
      const sourceExists = graph.nodes.find(n => n.id === edge.source);
      const targetExists = graph.nodes.find(n => n.id === edge.target);
      edge.validated = !!(sourceExists && targetExists);
    }
  }
}
```

### Advanced BMAD Spec Parser

**CRITICAL:** The developer MUST handle both markdown and YAML BMAD formats with robust error handling:

```typescript
// src/lib/workflows/spec-parser.ts

export interface ParsedWorkflowStep {
  id: string;
  name: string;
  type: string;
  action?: string;
  agent?: string;
  workflow?: string;
  resources?: string[];
  conditions?: string[];
  next?: string | string[];
}

export class MarkdownWorkflowParser {
  parse(content: string): ParsedWorkflow {
    try {
      // Extract frontmatter
      const frontmatter = this.extractFrontmatter(content);

      // Parse workflow steps from markdown content
      const steps = this.parseWorkflowSteps(content);

      // Extract dependencies from agent/workflow references
      const dependencies = this.extractDependencies(content, frontmatter);

      return {
        name: frontmatter.name,
        description: frontmatter.description,
        steps,
        dependencies,
        metadata: frontmatter
      };

    } catch (error) {
      throw new WorkflowParseError(`Failed to parse markdown workflow: ${error.message}`);
    }
  }

  private parseWorkflowSteps(content: string): ParsedWorkflowStep[] {
    const steps: ParsedWorkflowStep[] = [];

    // Look for ## Steps section or numbered step patterns
    const stepsMatch = content.match(/## Steps?\n([\s\S]*?)(?=\n## |\n---|\nEOF|$)/i);
    if (!stepsMatch) return steps;

    const stepsContent = stepsMatch[1];

    // Parse numbered steps: 1. Step name
    const stepMatches = stepsContent.matchAll(/^(\d+)\.\s+(.+?)(?=\n\d+\.|\n\n|$)/gm);

    for (const match of stepMatches) {
      const [, stepNumber, stepDescription] = match;

      const step: ParsedWorkflowStep = {
        id: `step-${stepNumber}`,
        name: stepDescription.trim(),
        type: 'step'
      };

      // Extract agent references: use agent:agent-name
      const agentMatch = stepDescription.match(/use agent:([a-zA-Z0-9-_]+)/);
      if (agentMatch) {
        step.agent = agentMatch[1];
        step.type = 'agent';
      }

      // Extract workflow references: run workflow:workflow-name
      const workflowMatch = stepDescription.match(/run workflow:([a-zA-Z0-9-_]+)/);
      if (workflowMatch) {
        step.workflow = workflowMatch[1];
        step.type = 'workflow';
      }

      // Extract resource references: using resource:file.txt
      const resourceMatches = stepDescription.matchAll(/using resource:([a-zA-Z0-9-_.]+)/g);
      step.resources = Array.from(resourceMatches, match => match[1]);

      steps.push(step);
    }

    return steps;
  }

  private extractDependencies(content: string, frontmatter: any): WorkflowDependency[] {
    const dependencies: WorkflowDependency[] = [];

    // From frontmatter requires field
    if (frontmatter.requires && Array.isArray(frontmatter.requires)) {
      for (const req of frontmatter.requires) {
        const [type, name] = req.split(':');
        dependencies.push({
          type: type as 'agent' | 'workflow' | 'resource',
          name,
          required: true
        });
      }
    }

    // From content agent/workflow references
    const agentRefs = content.matchAll(/agent:([a-zA-Z0-9-_]+)/g);
    for (const match of agentRefs) {
      dependencies.push({
        type: 'agent',
        name: match[1],
        required: true
      });
    }

    const workflowRefs = content.matchAll(/workflow:([a-zA-Z0-9-_]+)/g);
    for (const match of workflowRefs) {
      dependencies.push({
        type: 'workflow',
        name: match[1],
        required: true
      });
    }

    return this.deduplicateDependencies(dependencies);
  }
}

export class YAMLWorkflowParser {
  parse(content: string): ParsedWorkflow {
    try {
      const yamlData = yaml.parse(content);

      const steps = this.parseYAMLSteps(yamlData.workflow_config?.steps || []);
      const dependencies = this.extractYAMLDependencies(yamlData);

      return {
        name: yamlData.name,
        description: yamlData.description,
        steps,
        dependencies,
        metadata: yamlData
      };

    } catch (error) {
      throw new WorkflowParseError(`Failed to parse YAML workflow: ${error.message}`);
    }
  }

  private parseYAMLSteps(stepsData: any[]): ParsedWorkflowStep[] {
    return stepsData.map((step, index) => ({
      id: step.id || `step-${index + 1}`,
      name: step.name,
      type: step.type || 'step',
      action: step.action,
      agent: step.agent,
      workflow: step.workflow,
      resources: step.resources || [],
      conditions: step.conditions || [],
      next: step.next
    }));
  }
}
```

### Interactive Graph Visualization Component

**CRITICAL:** The developer MUST create a responsive, performant graph visualization that handles large workflows:

```typescript
// src/components/workflow/WorkflowGraphVisualization.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WorkflowGraphVisualizationProps {
  graph: WorkflowGraph;
  onNodeClick?: (node: WorkflowNode) => void;
  onValidationRequested?: () => void;
  className?: string;
}

export function WorkflowGraphVisualization({
  graph,
  onNodeClick,
  onValidationRequested,
  className = ''
}: WorkflowGraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

  useEffect(() => {
    if (!svgRef.current || !graph) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.clientWidth || 800;
    const height = svg.node()?.clientHeight || 600;

    // Clear previous render
    svg.selectAll('*').remove();

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        const { transform } = event;
        setZoomTransform(transform);
        g.attr('transform', transform);
      });

    svg.call(zoom);

    // Create main group for all elements
    const g = svg.append('g');

    // Setup force simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.edges)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create arrow markers for edges
    svg.append('defs').selectAll('marker')
      .data(['agent', 'workflow', 'sequence', 'dependency'])
      .enter()
      .append('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', d => `arrow-${d}`)
      .style('fill', d => this.getEdgeColor(d));

    // Render edges
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('stroke', d => this.getEdgeColor(d.type))
      .attr('stroke-width', d => d.validated ? 2 : 1)
      .attr('stroke-dasharray', d => d.validated ? 'none' : '5,5')
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Render nodes
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, WorkflowNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add node circles
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', d => d.validated ? '#4ade80' : '#ef4444')
      .attr('stroke-width', 3)
      .on('click', (event, d) => {
        setSelectedNode(d);
        onNodeClick?.(d);
      });

    // Add node labels
    nodes.append('text')
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Add validation status indicators
    nodes.filter(d => !d.validated)
      .append('circle')
      .attr('r', 8)
      .attr('cx', 15)
      .attr('cy', -15)
      .attr('fill', '#ef4444')
      .append('title')
      .text(d => `Validation errors: ${d.validationErrors.map(e => e.message).join(', ')}`);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graph]);

  const getNodeColor = (node: WorkflowNode): string => {
    const colors = {
      step: '#3b82f6',      // Blue
      agent: '#8b5cf6',     // Purple
      workflow: '#06b6d4',  // Cyan
      resource: '#10b981',  // Emerald
      condition: '#f59e0b'  // Amber
    };
    return colors[node.type] || '#6b7280';
  };

  const getEdgeColor = (type: string): string => {
    const colors = {
      sequence: '#6b7280',    // Gray
      dependency: '#8b5cf6',  // Purple
      condition: '#f59e0b',   // Amber
      data_flow: '#10b981'    // Emerald
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className={`workflow-graph-container ${className}`}>
      {/* Graph Controls */}
      <div className="graph-controls mb-4 flex gap-2">
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current);
            svg.transition().duration(750).call(
              d3.zoom<SVGSVGElement, unknown>().transform,
              d3.zoomIdentity
            );
          }}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reset View
        </button>
        <button
          onClick={onValidationRequested}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Validate Paths
        </button>
        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">Validated</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm">Invalid</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="graph-svg-container border rounded-lg" style={{ height: '600px' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="workflow-graph-svg"
        />
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="node-details-panel mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
          <p className="text-gray-600">{selectedNode.description}</p>

          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <strong>Type:</strong> {selectedNode.type}
            </div>
            <div>
              <strong>Validated:</strong>
              <span className={selectedNode.validated ? 'text-green-600' : 'text-red-600'}>
                {selectedNode.validated ? ' ✓' : ' ✗'}
              </span>
            </div>
            {selectedNode.ccPath && (
              <div className="col-span-2">
                <strong>CC Path:</strong>
                <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm">
                  {selectedNode.ccPath}
                </code>
              </div>
            )}
          </div>

          {selectedNode.validationErrors.length > 0 && (
            <div className="mt-4">
              <strong className="text-red-600">Validation Errors:</strong>
              <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                {selectedNode.validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### CC Path Validation Engine

**CRITICAL:** The developer MUST implement comprehensive validation that prevents runtime errors:

```typescript
// src/lib/workflows/cc-path-validator.ts

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  checkedPaths: string[];
}

export interface ValidationError {
  path: string;
  type: 'missing' | 'permission' | 'invalid_format' | 'circular_dependency';
  message: string;
  severity: 'error' | 'warning';
}

export class CCPathValidator {
  constructor(private baseCCPath: string) {}

  async validateWorkflowGraph(graph: WorkflowGraph): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      checkedPaths: []
    };

    // Validate each node's CC path
    for (const node of graph.nodes) {
      if (node.ccPath) {
        const nodeValidation = await this.validateNodePath(node);
        result.errors.push(...nodeValidation.errors);
        result.warnings.push(...nodeValidation.warnings);
        result.checkedPaths.push(...nodeValidation.checkedPaths);
      }
    }

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(graph);
    if (circularDeps.length > 0) {
      result.errors.push({
        path: 'workflow-graph',
        type: 'circular_dependency',
        message: `Circular dependencies detected: ${circularDeps.join(' -> ')}`,
        severity: 'error'
      });
    }

    // Validate agent references
    for (const node of graph.nodes.filter(n => n.type === 'agent')) {
      const agentValidation = await this.validateAgentReference(node);
      result.errors.push(...agentValidation.errors);
      result.warnings.push(...agentValidation.warnings);
    }

    // Validate workflow references
    for (const node of graph.nodes.filter(n => n.type === 'workflow')) {
      const workflowValidation = await this.validateWorkflowReference(node);
      result.errors.push(...workflowValidation.errors);
      result.warnings.push(...workflowValidation.warnings);
    }

    result.valid = result.errors.filter(e => e.severity === 'error').length === 0;
    return result;
  }

  private async validateNodePath(node: WorkflowNode): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      checkedPaths: []
    };

    if (!node.ccPath) return result;

    const fullPath = path.resolve(this.baseCCPath, node.ccPath);
    result.checkedPaths.push(fullPath);

    try {
      // Check if path exists
      const stats = await fs.stat(fullPath);

      if (!stats.isFile()) {
        result.errors.push({
          path: fullPath,
          type: 'invalid_format',
          message: `Path is not a file: ${fullPath}`,
          severity: 'error'
        });
        result.valid = false;
        return result;
      }

      // Check read permissions
      await fs.access(fullPath, fs.constants.R_OK);

      // Validate file format based on node type
      if (node.type === 'agent' && !fullPath.endsWith('.md')) {
        result.warnings.push({
          path: fullPath,
          type: 'invalid_format',
          message: `Agent file should have .md extension: ${fullPath}`,
          severity: 'warning'
        });
      }

      // Check file content validity
      const content = await fs.readFile(fullPath, 'utf-8');
      const contentValidation = this.validateFileContent(content, node.type);
      result.errors.push(...contentValidation.errors);
      result.warnings.push(...contentValidation.warnings);

    } catch (error) {
      if (error.code === 'ENOENT') {
        result.errors.push({
          path: fullPath,
          type: 'missing',
          message: `File not found: ${fullPath}`,
          severity: 'error'
        });
      } else if (error.code === 'EACCES') {
        result.errors.push({
          path: fullPath,
          type: 'permission',
          message: `Permission denied: ${fullPath}`,
          severity: 'error'
        });
      } else {
        result.errors.push({
          path: fullPath,
          type: 'invalid_format',
          message: `File access error: ${error.message}`,
          severity: 'error'
        });
      }
      result.valid = false;
    }

    return result;
  }

  private detectCircularDependencies(graph: WorkflowGraph): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[] = [];

    const dfs = (nodeId: string, path: string[]): void => {
      if (recursionStack.has(nodeId)) {
        // Found a cycle
        const cycleStart = path.indexOf(nodeId);
        cycles.push(path.slice(cycleStart).concat(nodeId).join(' -> '));
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      // Get outgoing edges from this node
      const outgoingEdges = graph.edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        dfs(edge.target, [...path, nodeId]);
      }

      recursionStack.delete(nodeId);
    };

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return cycles;
  }

  private validateFileContent(content: string, nodeType: string): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      checkedPaths: []
    };

    if (nodeType === 'agent') {
      // Validate agent file has proper BMAD agent structure
      if (!content.includes('# ') && !content.includes('## ')) {
        result.warnings.push({
          path: 'content',
          type: 'invalid_format',
          message: 'Agent file should contain markdown headers',
          severity: 'warning'
        });
      }
    }

    if (nodeType === 'workflow') {
      // Validate workflow file has proper structure
      if (!content.includes('## Steps') && !content.includes('workflow_config:')) {
        result.warnings.push({
          path: 'content',
          type: 'invalid_format',
          message: 'Workflow file should contain Steps section or workflow_config',
          severity: 'warning'
        });
      }
    }

    return result;
  }

  async validateAgentReference(node: WorkflowNode): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      checkedPaths: []
    };

    if (!node.name) return result;

    // Construct expected agent path
    const agentPath = path.join(this.baseCCPath, 'extensions', 'agents', `${node.name}.md`);
    const alternativePath = path.join(this.baseCCPath, 'agents', `${node.name}.md`);

    result.checkedPaths.push(agentPath, alternativePath);

    const pathExists1 = await fs.access(agentPath).then(() => true).catch(() => false);
    const pathExists2 = await fs.access(alternativePath).then(() => true).catch(() => false);

    if (!pathExists1 && !pathExists2) {
      result.errors.push({
        path: agentPath,
        type: 'missing',
        message: `Agent file not found. Checked: ${agentPath}, ${alternativePath}`,
        severity: 'error'
      });
      result.valid = false;
    }

    return result;
  }

  async validateWorkflowReference(node: WorkflowNode): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      checkedPaths: []
    };

    if (!node.name) return result;

    // Construct expected workflow paths
    const workflowPath1 = path.join(this.baseCCPath, 'extensions', 'workflows', node.name, 'README.md');
    const workflowPath2 = path.join(this.baseCCPath, 'workflows', `${node.name}.md`);

    result.checkedPaths.push(workflowPath1, workflowPath2);

    const pathExists1 = await fs.access(workflowPath1).then(() => true).catch(() => false);
    const pathExists2 = await fs.access(workflowPath2).then(() => true).catch(() => false);

    if (!pathExists1 && !pathExists2) {
      result.errors.push({
        path: workflowPath1,
        type: 'missing',
        message: `Workflow file not found. Checked: ${workflowPath1}, ${workflowPath2}`,
        severity: 'error'
      });
      result.valid = false;
    }

    return result;
  }
}
```

### API Implementation

The developer MUST use the standardized API response wrapper format:

```typescript
// src/app/api/workflows/[id]/graph/route.ts

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Get workflow spec
    const spec = await prisma.workflowSpec.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!spec) {
      return NextResponse.json({
        error: {
          type: 'NOT_FOUND',
          message: 'Workflow spec not found'
        },
        success: false
      }, { status: 404 });
    }

    // Build workflow graph
    const graphBuilder = new WorkflowGraphBuilder();
    const graph = await graphBuilder.buildFromSpec(spec);

    // Validate graph
    const validator = new CCPathValidator(await CCPathResolver.resolveBasePath());
    const validation = await validator.validateWorkflowGraph(graph);

    return NextResponse.json({
      data: {
        graph,
        validation
      },
      success: true,
      message: `Workflow graph generated with ${validation.errors.length} validation issues`
    });

  } catch (error) {
    console.error('Workflow graph generation error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to generate workflow graph',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}

// Batch validation endpoint
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

    const { workflowIds, action } = await request.json();

    if (action === 'validate') {
      const results = [];
      const graphBuilder = new WorkflowGraphBuilder();
      const validator = new CCPathValidator(await CCPathResolver.resolveBasePath());

      for (const workflowId of workflowIds) {
        try {
          const spec = await prisma.workflowSpec.findUnique({
            where: { id: workflowId, userId: session.user.id }
          });

          if (spec) {
            const graph = await graphBuilder.buildFromSpec(spec);
            const validation = await validator.validateWorkflowGraph(graph);

            results.push({
              workflowId,
              name: spec.name,
              validation,
              success: true
            });
          } else {
            results.push({
              workflowId,
              validation: null,
              success: false,
              error: 'Workflow not found'
            });
          }
        } catch (error) {
          results.push({
            workflowId,
            validation: null,
            success: false,
            error: error.message
          });
        }
      }

      return NextResponse.json({
        data: { results },
        success: true,
        message: `Validated ${results.length} workflows`
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
    console.error('Workflow batch operation error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Batch operation failed',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}
```

### Project Structure Notes

**CRITICAL:** The developer MUST follow the exact project structure defined in the Architecture document:

- Graph components in `src/components/workflow/` directory
- Workflow services in `src/lib/workflows/` directory
- D3.js visualizations using proper TypeScript types
- All CC path operations through `CCPathResolver` service
- Database operations following Prisma patterns with proper error handling

### References

- **Architecture Decisions**: [Source: _bmad-output/architecture.md#Core Architectural Decisions]
- **Previous Story Context**: [Source: _bmad-output/implementation-artifacts/stories/4-1-workflow-spec-upload.md]
- **Enhanced Storage**: [Source: _bmad-output/implementation-artifacts/stories/4-2-workflow-spec-storage.md]
- **Database Patterns**: [Source: _bmad-output/architecture.md#Implementation Patterns & Consistency Rules]
- **Workflow Engine Requirements**: [Source: _bmad-output/prd.md#Workflow Engine Core Requirements]

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

### Completion Notes List

### File List