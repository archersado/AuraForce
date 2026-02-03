# Story 4.4: Trigger Workflow Execution via Claude Code in CC Directory

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to trigger execution of my deployed BMAD workflow specifications through Claude Code in their CC directory locations,
so that I can run validated workflows with proper parameter passing, session management, and execution context control.

## Acceptance Criteria

1. **Claude Agent SDK Integration for Workflow Execution**
   - Integrate @anthropic-ai/claude-agent-sdk for workflow command execution
   - Support workflow triggering via CC directory path resolution
   - Handle workflow parameter passing and environment variable injection
   - Manage execution context and session persistence during workflow runs
   - Support both synchronous and asynchronous workflow execution modes

2. **Workflow Execution Engine**
   - Parse BMAD workflow specifications to extract execution commands
   - Generate proper Claude Code CLI commands for workflow invocation
   - Support agent chaining and sub-workflow execution
   - Handle workflow input/output data passing between steps
   - Implement execution queue management for concurrent workflows

3. **CC Directory-Based Execution Context**
   - Execute workflows from their deployed CC directory locations
   - Resolve relative paths for agents, sub-workflows, and resources
   - Maintain working directory context throughout execution
   - Handle CC path environment setup and configuration
   - Support workflow execution with proper file system permissions

4. **Session Management and Control**
   - Create isolated execution sessions for each workflow run
   - Support workflow execution cancellation and termination
   - Implement session persistence for long-running workflows
   - Handle session recovery and cleanup on failures
   - Provide session status tracking and lifecycle management

5. **Parameter and Configuration Management**
   - Support workflow parameter input via web interface
   - Parse workflow configuration from BMAD spec frontmatter
   - Inject environment variables and execution context
   - Handle secure parameter passing for sensitive data
   - Support workflow customization and override parameters

## Tasks / Subtasks

- [ ] Task 1: Implement Claude Agent SDK Integration (AC: 1)
  - [ ] Subtask 1.1: Install and configure @anthropic-ai/claude-agent-sdk
  - [ ] Subtask 1.2: Create workflow execution client with session management
  - [ ] Subtask 1.3: Implement CC directory path resolution for execution context
  - [ ] Subtask 1.4: Add parameter passing and environment variable injection
- [ ] Task 2: Build Workflow Execution Engine (AC: 2)
  - [ ] Subtask 2.1: Create BMAD spec parser for execution command extraction
  - [ ] Subtask 2.2: Implement Claude Code CLI command generation
  - [ ] Subtask 2.3: Build agent chaining and sub-workflow execution system
  - [ ] Subtask 2.4: Add execution queue management with concurrency control
- [ ] Task 3: Implement CC Directory Execution Context (AC: 3)
  - [ ] Subtask 3.1: Create working directory context manager
  - [ ] Subtask 3.2: Build relative path resolution for workflow components
  - [ ] Subtask 3.3: Add file system permissions validation
  - [ ] Subtask 3.4: Implement CC environment setup and configuration
- [ ] Task 4: Create Session Management System (AC: 4)
  - [ ] Subtask 4.1: Build isolated execution session containers
  - [ ] Subtask 4.2: Implement session cancellation and cleanup
  - [ ] Subtask 4.3: Add session persistence for long-running workflows
  - [ ] Subtask 4.4: Create session recovery and error handling
- [ ] Task 5: Build Parameter Management Interface (AC: 5)
  - [ ] Subtask 5.1: Create workflow parameter input UI component
  - [ ] Subtask 5.2: Implement configuration parsing from workflow specs
  - [ ] Subtask 5.3: Add secure parameter handling and encryption
  - [ ] Subtask 5.4: Build parameter validation and override system

## Dev Notes

### Enhanced Prisma Schema for Execution Tracking

The developer MUST extend the database model to track workflow executions:

```prisma
model WorkflowExecution {
  id              String   @id @default(uuid())
  workflowSpecId  String   @map("workflow_spec_id")
  userId          String   @map("user_id")
  sessionId       String?  @unique @map("session_id") // Claude Agent SDK session ID
  status          String   @default("pending") // pending, running, completed, failed, cancelled
  executionMode   String   @default("async") @map("execution_mode") // sync, async, background
  parameters      Json?    // Input parameters as JSON
  configuration   Json?    // Execution configuration
  ccWorkingDir    String?  @map("cc_working_dir") // CC directory context
  startedAt       DateTime? @map("started_at")
  completedAt     DateTime? @map("completed_at")
  duration        Int?     // Execution duration in milliseconds
  exitCode        Int?     @map("exit_code")
  errorMessage    String?  @map("error_message")
  output          Json?    // Execution output/results
  metadata        Json?    // Additional execution metadata
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  workflowSpec WorkflowSpec @relation(fields: [workflowSpecId], references: [id], onDelete: Cascade)
  logs         WorkflowExecutionLog[]
  steps        WorkflowExecutionStep[]

  @@index([workflowSpecId])
  @@index([userId])
  @@index([status])
  @@index([sessionId])
  @@map("workflow_executions")
}

model WorkflowExecutionStep {
  id            String   @id @default(uuid())
  executionId   String   @map("execution_id")
  stepName      String   @map("step_name")
  stepType      String   @map("step_type") // step, agent, workflow, condition
  status        String   @default("pending") // pending, running, completed, failed, skipped
  startedAt     DateTime? @map("started_at")
  completedAt   DateTime? @map("completed_at")
  duration      Int?     // Step duration in milliseconds
  input         Json?    // Step input data
  output        Json?    // Step output data
  errorMessage  String?  @map("error_message")
  agentPath     String?  @map("agent_path") // Path to agent if step type is agent
  workflowPath  String?  @map("workflow_path") // Path to sub-workflow
  metadata      Json?    // Step-specific metadata
  createdAt     DateTime @default(now()) @map("created_at")

  execution WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  @@index([executionId])
  @@index([status])
  @@map("workflow_execution_steps")
}

model WorkflowExecutionLog {
  id          String   @id @default(uuid())
  executionId String   @map("execution_id")
  level       String   // info, warning, error, debug
  message     String
  timestamp   DateTime @default(now())
  source      String?  // Agent, workflow, system
  stepName    String?  @map("step_name")
  metadata    Json?

  execution WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)

  @@index([executionId])
  @@index([timestamp])
  @@map("workflow_execution_logs")
}

// Add relation to WorkflowSpec
model WorkflowSpec {
  // ... existing fields ...
  executions WorkflowExecution[]
}
```

### Claude Agent SDK Workflow Executor

**CRITICAL:** The developer MUST implement robust Claude Agent SDK integration with proper error handling:

```typescript
// src/lib/workflows/execution-engine.ts

import { query } from '@anthropic-ai/claude-agent-sdk';

export interface WorkflowExecutionConfig {
  workflowSpecId: string;
  parameters?: Record<string, any>;
  executionMode: 'sync' | 'async' | 'background';
  timeout?: number;
  environment?: Record<string, string>;
  ccWorkingDir: string;
}

export interface WorkflowExecutionResult {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  sessionId?: string;
  output?: any;
  error?: string;
  duration?: number;
  steps: WorkflowExecutionStep[];
}

export class WorkflowExecutionEngine {
  private activeExecutions = new Map<string, any>();

  async executeWorkflow(config: WorkflowExecutionConfig): Promise<WorkflowExecutionResult> {
    const executionId = this.generateExecutionId();

    try {
      // Create execution record
      const execution = await this.createExecutionRecord(executionId, config);

      // Parse workflow specification
      const workflowSpec = await this.loadWorkflowSpec(config.workflowSpecId);
      const parsedWorkflow = await this.parseWorkflowForExecution(workflowSpec, config.ccWorkingDir);

      // Setup Claude Agent SDK session
      const claudeSession = await this.createClaudeSession(config);

      // Store active execution
      this.activeExecutions.set(executionId, {
        session: claudeSession,
        config,
        startTime: Date.now()
      });

      // Execute workflow based on mode
      if (config.executionMode === 'sync') {
        return await this.executeSynchronous(executionId, parsedWorkflow, claudeSession);
      } else {
        // Start async execution
        this.executeAsynchronous(executionId, parsedWorkflow, claudeSession);
        return {
          executionId,
          status: 'running',
          sessionId: claudeSession.id,
          output: null,
          steps: []
        };
      }

    } catch (error) {
      console.error(`Workflow execution failed for ${executionId}:`, error);

      await this.updateExecutionStatus(executionId, 'failed', {
        errorMessage: error.message,
        completedAt: new Date()
      });

      return {
        executionId,
        status: 'failed',
        error: error.message,
        steps: []
      };
    }
  }

  private async createClaudeSession(config: WorkflowExecutionConfig): Promise<any> {
    const sessionConfig = {
      cwd: config.ccWorkingDir,
      environment: {
        ...process.env,
        ...config.environment,
        WORKFLOW_EXECUTION_ID: config.workflowSpecId,
        WORKFLOW_MODE: config.executionMode
      },
      timeout: config.timeout || 300000, // 5 minutes default
    };

    // Use Claude Agent SDK to create session
    const claudeQuery = query({
      prompt: 'Initialize workflow execution session',
      options: {
        model: 'sonnet',
        cwd: config.ccWorkingDir,
        persistSession: true,
        plugins: [
          {
            type: 'local',
            path: config.ccWorkingDir
          }
        ]
      }
    });

    return claudeQuery;
  }

  private async executeSynchronous(
    executionId: string,
    workflow: ParsedWorkflow,
    claudeSession: any
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    let currentStatus: 'running' | 'completed' | 'failed' = 'running';
    const executedSteps: WorkflowExecutionStep[] = [];
    let finalOutput: any = null;
    let errorMessage: string | undefined;

    try {
      await this.updateExecutionStatus(executionId, 'running', {
        startedAt: new Date()
      });

      // Execute workflow steps sequentially
      for (const step of workflow.steps) {
        const stepStartTime = Date.now();

        try {
          const stepResult = await this.executeWorkflowStep(step, claudeSession, executionId);

          executedSteps.push({
            stepName: step.name,
            stepType: step.type,
            status: 'completed',
            duration: Date.now() - stepStartTime,
            input: step.input,
            output: stepResult.output,
            startedAt: new Date(stepStartTime),
            completedAt: new Date()
          });

          // Chain output to next step if needed
          if (step.outputMapping && executedSteps.length > 0) {
            this.applyOutputMapping(step.outputMapping, stepResult.output, workflow.steps);
          }

        } catch (stepError) {
          console.error(`Step ${step.name} failed:`, stepError);

          executedSteps.push({
            stepName: step.name,
            stepType: step.type,
            status: 'failed',
            duration: Date.now() - stepStartTime,
            input: step.input,
            output: null,
            errorMessage: stepError.message,
            startedAt: new Date(stepStartTime),
            completedAt: new Date()
          });

          // Stop execution on step failure unless configured to continue
          if (!step.continueOnFailure) {
            throw new Error(`Workflow step '${step.name}' failed: ${stepError.message}`);
          }
        }
      }

      currentStatus = 'completed';
      finalOutput = this.buildWorkflowOutput(executedSteps);

    } catch (error) {
      console.error(`Workflow execution failed:`, error);
      currentStatus = 'failed';
      errorMessage = error.message;
    }

    const duration = Date.now() - startTime;

    // Update execution record
    await this.updateExecutionStatus(executionId, currentStatus, {
      completedAt: new Date(),
      duration,
      output: finalOutput,
      errorMessage
    });

    // Save executed steps to database
    await this.saveExecutionSteps(executionId, executedSteps);

    // Cleanup session
    this.activeExecutions.delete(executionId);

    return {
      executionId,
      status: currentStatus,
      output: finalOutput,
      error: errorMessage,
      duration,
      steps: executedSteps
    };
  }

  private async executeWorkflowStep(
    step: ParsedWorkflowStep,
    claudeSession: any,
    executionId: string
  ): Promise<{ output: any }> {

    await this.logExecution(executionId, 'info', `Executing step: ${step.name}`, step.name);

    switch (step.type) {
      case 'agent':
        return await this.executeAgentStep(step, claudeSession);

      case 'workflow':
        return await this.executeSubWorkflowStep(step, claudeSession);

      case 'command':
        return await this.executeCommandStep(step, claudeSession);

      case 'condition':
        return await this.executeConditionStep(step, claudeSession);

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeAgentStep(
    step: ParsedWorkflowStep,
    claudeSession: any
  ): Promise<{ output: any }> {

    if (!step.agent) {
      throw new Error(`Agent step '${step.name}' missing agent specification`);
    }

    // Construct agent command
    const agentCommand = this.buildAgentCommand(step);

    // Execute via Claude Agent SDK
    const result = await claudeSession.run(agentCommand);

    return {
      output: {
        type: 'agent_result',
        agentName: step.agent,
        result: result.output,
        exitCode: result.exitCode || 0,
        stdout: result.stdout,
        stderr: result.stderr
      }
    };
  }

  private async executeSubWorkflowStep(
    step: ParsedWorkflowStep,
    claudeSession: any
  ): Promise<{ output: any }> {

    if (!step.workflow) {
      throw new Error(`Workflow step '${step.name}' missing workflow specification`);
    }

    // Load sub-workflow
    const subWorkflowPath = path.resolve(claudeSession.cwd, 'workflows', `${step.workflow}.md`);

    // Execute sub-workflow recursively
    const subConfig: WorkflowExecutionConfig = {
      workflowSpecId: step.workflow,
      parameters: step.input || {},
      executionMode: 'sync', // Sub-workflows run synchronously
      ccWorkingDir: claudeSession.cwd
    };

    const subResult = await this.executeWorkflow(subConfig);

    return {
      output: {
        type: 'workflow_result',
        workflowName: step.workflow,
        result: subResult.output,
        status: subResult.status,
        duration: subResult.duration
      }
    };
  }

  private async executeCommandStep(
    step: ParsedWorkflowStep,
    claudeSession: any
  ): Promise<{ output: any }> {

    if (!step.command) {
      throw new Error(`Command step '${step.name}' missing command specification`);
    }

    // Execute command via Claude Agent SDK
    const result = await claudeSession.run(step.command);

    return {
      output: {
        type: 'command_result',
        command: step.command,
        exitCode: result.exitCode || 0,
        stdout: result.stdout,
        stderr: result.stderr
      }
    };
  }

  private buildAgentCommand(step: ParsedWorkflowStep): string {
    let command = `/claude-agent ${step.agent}`;

    // Add parameters if provided
    if (step.input && Object.keys(step.input).length > 0) {
      const params = Object.entries(step.input)
        .map(([key, value]) => `--${key}="${value}"`)
        .join(' ');
      command += ` ${params}`;
    }

    return command;
  }

  async cancelWorkflowExecution(executionId: string): Promise<boolean> {
    const activeExecution = this.activeExecutions.get(executionId);

    if (!activeExecution) {
      throw new Error(`No active execution found for ID: ${executionId}`);
    }

    try {
      // Cancel Claude session
      if (activeExecution.session && activeExecution.session.cancel) {
        await activeExecution.session.cancel();
      }

      // Update execution status
      await this.updateExecutionStatus(executionId, 'cancelled', {
        completedAt: new Date(),
        duration: Date.now() - activeExecution.startTime
      });

      // Cleanup
      this.activeExecutions.delete(executionId);

      await this.logExecution(executionId, 'info', 'Workflow execution cancelled');

      return true;

    } catch (error) {
      console.error(`Failed to cancel execution ${executionId}:`, error);
      await this.logExecution(executionId, 'error', `Failed to cancel execution: ${error.message}`);
      return false;
    }
  }

  async getExecutionStatus(executionId: string): Promise<WorkflowExecutionResult | null> {
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: {
        steps: true,
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 100
        }
      }
    });

    if (!execution) return null;

    return {
      executionId: execution.id,
      status: execution.status as any,
      sessionId: execution.sessionId,
      output: execution.output,
      error: execution.errorMessage,
      duration: execution.duration,
      steps: execution.steps.map(step => ({
        stepName: step.stepName,
        stepType: step.stepType,
        status: step.status as any,
        duration: step.duration,
        input: step.input,
        output: step.output,
        errorMessage: step.errorMessage,
        startedAt: step.startedAt,
        completedAt: step.completedAt
      }))
    };
  }

  private async createExecutionRecord(
    executionId: string,
    config: WorkflowExecutionConfig
  ): Promise<any> {
    return await prisma.workflowExecution.create({
      data: {
        id: executionId,
        workflowSpecId: config.workflowSpecId,
        userId: config.userId, // Should be passed in config
        status: 'pending',
        executionMode: config.executionMode,
        parameters: config.parameters || {},
        configuration: {
          timeout: config.timeout,
          environment: config.environment,
          ccWorkingDir: config.ccWorkingDir
        },
        ccWorkingDir: config.ccWorkingDir
      }
    });
  }

  private async updateExecutionStatus(
    executionId: string,
    status: string,
    updates: Partial<any> = {}
  ): Promise<void> {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status,
        ...updates
      }
    });
  }

  private async logExecution(
    executionId: string,
    level: string,
    message: string,
    stepName?: string,
    metadata?: any
  ): Promise<void> {
    await prisma.workflowExecutionLog.create({
      data: {
        executionId,
        level,
        message,
        stepName,
        metadata
      }
    });
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
```

### Workflow Parameter Management Interface

**CRITICAL:** The developer MUST create a user-friendly parameter input system:

```typescript
// src/components/workflow/WorkflowExecutionPanel.tsx

import React, { useState, useEffect } from 'react';
import { WorkflowSpec } from '@/types/workflow';

interface WorkflowExecutionPanelProps {
  workflowSpec: WorkflowSpec;
  onExecute: (config: WorkflowExecutionConfig) => void;
  isExecuting?: boolean;
}

export function WorkflowExecutionPanel({
  workflowSpec,
  onExecute,
  isExecuting = false
}: WorkflowExecutionPanelProps) {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [executionMode, setExecutionMode] = useState<'sync' | 'async' | 'background'>('async');
  const [environment, setEnvironment] = useState<Record<string, string>>({});
  const [timeout, setTimeout] = useState<number>(300000); // 5 minutes default
  const [parameterSchema, setParameterSchema] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Extract parameter schema from workflow spec metadata
    if (workflowSpec.metadata?.parameters) {
      setParameterSchema(workflowSpec.metadata.parameters);

      // Set default values
      const defaults: Record<string, any> = {};
      Object.entries(workflowSpec.metadata.parameters).forEach(([key, param]: [string, any]) => {
        if (param.default !== undefined) {
          defaults[key] = param.default;
        }
      });
      setParameters(defaults);
    }
  }, [workflowSpec]);

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));

    // Clear validation error for this parameter
    if (validationErrors[paramName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[paramName];
        return newErrors;
      });
    }
  };

  const validateParameters = (): boolean => {
    const errors: Record<string, string> = {};

    if (parameterSchema) {
      Object.entries(parameterSchema).forEach(([paramName, paramConfig]: [string, any]) => {
        const value = parameters[paramName];

        // Check required parameters
        if (paramConfig.required && (value === undefined || value === '')) {
          errors[paramName] = `Parameter '${paramName}' is required`;
        }

        // Type validation
        if (value !== undefined && paramConfig.type) {
          if (paramConfig.type === 'number' && isNaN(Number(value))) {
            errors[paramName] = `Parameter '${paramName}' must be a number`;
          }

          if (paramConfig.type === 'boolean' && typeof value !== 'boolean') {
            errors[paramName] = `Parameter '${paramName}' must be true or false`;
          }
        }

        // Pattern validation
        if (value && paramConfig.pattern) {
          const regex = new RegExp(paramConfig.pattern);
          if (!regex.test(value)) {
            errors[paramName] = `Parameter '${paramName}' does not match required pattern`;
          }
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExecute = () => {
    if (!validateParameters()) {
      return;
    }

    const config: WorkflowExecutionConfig = {
      workflowSpecId: workflowSpec.id,
      parameters,
      executionMode,
      timeout,
      environment,
      ccWorkingDir: workflowSpec.ccPath
    };

    onExecute(config);
  };

  const addEnvironmentVariable = () => {
    const key = prompt('Environment variable name:');
    const value = prompt('Environment variable value:');

    if (key && value) {
      setEnvironment(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return (
    <div className="workflow-execution-panel bg-white border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Execute Workflow: {workflowSpec.name}
        </h3>
        <p className="text-gray-600">{workflowSpec.description}</p>
      </div>

      {/* Parameters Section */}
      {parameterSchema && Object.keys(parameterSchema).length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Parameters</h4>
          <div className="space-y-4">
            {Object.entries(parameterSchema).map(([paramName, paramConfig]: [string, any]) => (
              <div key={paramName} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {paramConfig.label || paramName}
                  {paramConfig.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {paramConfig.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={parameters[paramName] || false}
                    onChange={(e) => handleParameterChange(paramName, e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                ) : paramConfig.type === 'select' ? (
                  <select
                    value={parameters[paramName] || ''}
                    onChange={(e) => handleParameterChange(paramName, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    {paramConfig.options?.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={paramConfig.type === 'number' ? 'number' : 'text'}
                    value={parameters[paramName] || ''}
                    onChange={(e) => handleParameterChange(paramName, e.target.value)}
                    placeholder={paramConfig.placeholder}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                )}

                {paramConfig.description && (
                  <p className="text-xs text-gray-500 mt-1">{paramConfig.description}</p>
                )}

                {validationErrors[paramName] && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors[paramName]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Configuration */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Execution Configuration</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Execution Mode
            </label>
            <select
              value={executionMode}
              onChange={(e) => setExecutionMode(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="async">Async (Recommended)</option>
              <option value="sync">Synchronous</option>
              <option value="background">Background</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={timeout / 1000}
              onChange={(e) => setTimeout(parseInt(e.target.value) * 1000)}
              min="60"
              max="3600"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              CC Working Directory
            </label>
            <input
              type="text"
              value={workflowSpec.ccPath}
              readOnly
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-900">Environment Variables</h4>
          <button
            onClick={addEnvironmentVariable}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Variable
          </button>
        </div>

        {Object.keys(environment).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(environment).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                  {key}={value}
                </code>
                <button
                  onClick={() => setEnvironment(prev => {
                    const newEnv = { ...prev };
                    delete newEnv[key];
                    return newEnv;
                  })}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No environment variables configured</p>
        )}
      </div>

      {/* Execute Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExecute}
          disabled={isExecuting || Object.keys(validationErrors).length > 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            isExecuting || Object.keys(validationErrors).length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isExecuting ? 'Executing...' : 'Execute Workflow'}
        </button>
      </div>

      {/* Execution Mode Help */}
      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Sync:</strong> Wait for completion before returning results</p>
        <p><strong>Async:</strong> Start execution and monitor progress separately</p>
        <p><strong>Background:</strong> Run without monitoring (fire-and-forget)</p>
      </div>
    </div>
  );
}
```

### API Implementation for Workflow Execution

The developer MUST use the standardized API response wrapper format:

```typescript
// src/app/api/workflows/[id]/execute/route.ts

export async function POST(
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
    const body = await request.json();
    const { parameters, executionMode = 'async', timeout, environment } = body;

    // Validate workflow spec exists and belongs to user
    const workflowSpec = await prisma.workflowSpec.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!workflowSpec) {
      return NextResponse.json({
        error: {
          type: 'NOT_FOUND',
          message: 'Workflow specification not found'
        },
        success: false
      }, { status: 404 });
    }

    // Validate workflow is in good state
    if (workflowSpec.syncStatus !== 'synced') {
      return NextResponse.json({
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Workflow is not synchronized with CC directory'
        },
        success: false
      }, { status: 400 });
    }

    // Initialize execution engine
    const executionEngine = new WorkflowExecutionEngine();

    // Execute workflow
    const config: WorkflowExecutionConfig = {
      workflowSpecId: id,
      userId: session.user.id,
      parameters,
      executionMode,
      timeout: timeout || 300000,
      environment: environment || {},
      ccWorkingDir: workflowSpec.ccPath
    };

    const result = await executionEngine.executeWorkflow(config);

    return NextResponse.json({
      data: result,
      success: true,
      message: `Workflow execution ${result.status === 'running' ? 'started' : 'completed'}`
    });

  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to execute workflow',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}

// Cancel workflow execution
export async function DELETE(
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

    const url = new URL(request.url);
    const executionId = url.searchParams.get('executionId');

    if (!executionId) {
      return NextResponse.json({
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Execution ID is required'
        },
        success: false
      }, { status: 400 });
    }

    const executionEngine = new WorkflowExecutionEngine();
    const cancelled = await executionEngine.cancelWorkflowExecution(executionId);

    if (cancelled) {
      return NextResponse.json({
        data: { cancelled: true, executionId },
        success: true,
        message: 'Workflow execution cancelled'
      });
    } else {
      return NextResponse.json({
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to cancel workflow execution'
        },
        success: false
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Workflow cancellation error:', error);
    return NextResponse.json({
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to cancel workflow',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      success: false
    }, { status: 500 });
  }
}
```

### Project Structure Notes

**CRITICAL:** The developer MUST follow the exact project structure defined in the Architecture document:

- Claude Agent SDK integration in `src/lib/claude/` directory
- Workflow execution services in `src/lib/workflows/` directory
- Execution UI components in `src/components/workflow/` directory
- Database models following snake_case with Prisma @@map() directives
- API endpoints using standardized response format with proper error handling

### References

- **Architecture Decisions**: [Source: _bmad-output/architecture.md#Core Architectural Decisions]
- **Claude Agent SDK Integration**: [Source: _bmad-output/architecture.md#Claude Code集成架构]
- **Previous Story Foundation**: [Source: _bmad-output/implementation-artifacts/stories/4-3-workflow-graph-generation.md]
- **Database Patterns**: [Source: _bmad-output/architecture.md#Implementation Patterns & Consistency Rules]
- **Project Requirements**: [Source: _bmad-output/prd.md#Workflow Engine Core Requirements]

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

### Completion Notes List

### File List