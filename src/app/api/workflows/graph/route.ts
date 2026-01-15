/**
 * Workflow Graph Generation API
 *
 * Generates and validates workflow graphs with CC path verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import {
  WorkflowGraphBuilder,
  createWorkflowParser,
  type WorkflowGraph,
} from '@/lib/workflows/graph-model';
import { GraphAnalyzer } from '@/lib/workflows/graph-analyzer';
import { createCCValidator } from '@/lib/workflows/cc-path-validator';
import { createDependencyMapper } from '@/lib/workflows/dependency-resolver';

/**
 * GET /api/workflows/graph/[id] - Generate and validate workflow graph
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    if (workflow.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Read workflow content
    const readmePath = `${workflow.ccPath}/README.md`;
    const content = await readFile(readmePath, 'utf-8');

    // Parse workflow
    const parser = createWorkflowParser();
    const parsed = parser.parse(content, 'markdown');

    // Build graph
    const builder = new WorkflowGraphBuilder();
    const graph = builder.buildFromParsed(parsed, workflow.id);

    // Validate graph against CC paths
    const validator = createCCValidator();
    const validation = await GraphAnalyzer.validateGraph(graph);

    // Update graph metadata
    graph.metadata.validationStatus = validation.status;
    graph.metadata.lastValidated = new Date();

    // Resolve dependencies
    const dependencyMapper = createDependencyMapper();
    const dependencyResult = await dependencyMapper.resolveWorkflowDependencies(
      parsed,
      workflow.id
    );

    // Update node validation states with dependency results
    for (const dep of dependencyResult.dependencies) {
      const node = graph.nodes.find(
        n => n.name === dep.name && n.type === dep.type
      );
      if (node) {
        node.ccPath = dep.physicalPath;
        node.validated = dep.resolved;
        node.validationErrors = dep.error ? [{
          code: 'DEPENDENCY_ERROR',
          message: dep.error,
          severity: 'error',
        }] : [];
      }
    }

    // Generate analysis report
    const report = GraphAnalyzer.generateAnalysisReport(graph, validation);

    return NextResponse.json({
      success: true,
      graph,
      validation,
      dependencies: dependencyResult,
      report,
    });
  } catch (error) {
    console.error('[Workflow Graph] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows/graph/[id] - Export graph or trigger analysis
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, format, validatedOnly } = body;

    // Fetch workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    if (workflow.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Read workflow content and generate graph
    const readmePath = `${workflow.ccPath}/README.md`;
    const content = await readFile(readmePath, 'utf-8');

    const parser = createWorkflowParser();
    const parsed = parser.parse(content, 'markdown');

    const builder = new WorkflowGraphBuilder();
    const graph = builder.buildFromParsed(parsed, workflow.id);

    const validator = createCCValidator();
    const validation = await GraphAnalyzer.validateGraph(graph);

    graph.metadata.validationStatus = validation.status;
    graph.metadata.lastValidated = new Date();

    switch (action) {
      case 'export':
        // Export graph in specified format
        return NextResponse.json({
          success: true,
          format,
          data: GraphAnalyzer.exportGraph(graph, {
            format: format || 'json',
            pretty: true,
          }),
        });

      case 'analyze':
        // Generate analysis report
        const report = GraphAnalyzer.generateAnalysisReport(graph, validation);
        return NextResponse.json({
          success: true,
          report,
        });

      case 'validate':
        // Re-validate graph
        return NextResponse.json({
          success: true,
          validation,
          graph: validatedOnly ? {
            id: graph.id,
            nodes: graph.nodes.map(n => ({
              id: n.id,
              type: n.type,
              name: n.name,
              validated: n.validated,
              validationErrors: n.validationErrors,
            })),
            edges: graph.edges.map(e => ({
              id: e.id,
              source: e.source,
              target: e.target,
              validated: e.validated,
            })),
          } : undefined,
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Workflow Graph Action] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workflows/graph - Batch graph generation
 */
export async function generateWorkflowGraphAction(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',');

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: 'No workflow IDs provided' },
        { status: 400 }
      );
    }

    // Fetch workflows
    const workflows = await prisma.workflowSpec.findMany({
      where: {
        id: { in: ids },
        userId: session.userId,
      },
    });

    if (workflows.length !== ids.length) {
      return NextResponse.json(
        { error: 'Some workflows not found or access denied' },
        { status: 403 }
      );
    }

    const results = [];

    for (const workflow of workflows) {
      try {
        const readmePath = `${workflow.ccPath}/README.md`;
        const content = await readFile(readmePath, 'utf-8');

        const parser = createWorkflowParser();
        const parsed = parser.parse(content, 'markdown');

        const builder = new WorkflowGraphBuilder();
        const graph = builder.buildFromParsed(parsed, workflow.id);

        const validator = createCCValidator();
        const validation = await GraphAnalyzer.validateGraph(graph);

        graph.metadata.validationStatus = validation.status;
        graph.metadata.lastValidated = new Date();

        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          graph,
          validation,
        });
      } catch (error) {
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          graph: null,
          validation: null,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('[Batch Workflow Graphs] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
