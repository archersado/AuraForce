# Story 4.5: Real-time Execution Monitoring with CC Output Streaming

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to monitor my workflow executions in real-time with live streaming output from Claude Code,
so that I can track execution progress, debug issues immediately, and observe workflow behavior during execution.

## Acceptance Criteria

1. **Real-time Execution Status Streaming**
   - Stream execution status updates via WebSocket connection
   - Provide live progress indicators for workflow steps
   - Display current step execution with timing information
   - Show step completion status with success/failure indicators
   - Support multiple concurrent workflow monitoring sessions

2. **Claude Code Output Streaming**
   - Stream Claude Code CLI output in real-time during execution
   - Capture and display stdout, stderr, and debug messages
   - Support colored output and formatting preservation
   - Buffer output streams for late-joining monitoring sessions
   - Handle large output volumes with streaming backpressure

3. **Interactive Execution Dashboard**
   - Real-time execution dashboard with step-by-step progress visualization
   - Live workflow graph with highlighted current execution path
   - Execution timeline with step durations and timestamps
   - Resource usage monitoring (CPU, memory, execution time)
   - Support for pausing, resuming, and cancelling executions

4. **Execution Log Management**
   - Comprehensive execution logging with multiple severity levels
   - Real-time log streaming with filtering and search capabilities
   - Log persistence with rotation and archival
   - Structured logging with metadata and context
   - Export logs for external analysis and debugging

5. **Alert and Notification System**
   - Real-time alerts for execution failures and warnings
   - Customizable notification rules based on execution events
   - Integration with browser notifications for background monitoring
   - Email notifications for critical execution failures
   - Webhook support for external monitoring system integration

## Tasks / Subtasks

- [ ] Task 1: Implement Real-time Status Streaming (AC: 1)
  - [ ] Subtask 1.1: Extend WebSocket server for execution status events
  - [ ] Subtask 1.2: Create execution status event types and data structures
  - [ ] Subtask 1.3: Implement status broadcasting to subscribed clients
  - [ ] Subtask 1.4: Add execution step progress tracking and reporting
- [ ] Task 2: Build Claude Code Output Streaming (AC: 2)
  - [ ] Subtask 2.1: Capture Claude Code process output streams
  - [ ] Subtask 2.2: Implement real-time output streaming via WebSocket
  - [ ] Subtask 2.3: Add output buffering and late-join support
  - [ ] Subtask 2.4: Handle output formatting and ANSI color preservation
- [ ] Task 3: Create Interactive Execution Dashboard (AC: 3)
  - [ ] Subtask 3.1: Build real-time execution dashboard component
  - [ ] Subtask 3.2: Add live workflow graph with execution highlighting
  - [ ] Subtask 3.3: Implement execution timeline with step details
  - [ ] Subtask 3.4: Add execution control buttons (pause/resume/cancel)
- [ ] Task 4: Implement Execution Log Management (AC: 4)
  - [ ] Subtask 4.1: Create structured logging system for executions
  - [ ] Subtask 4.2: Add real-time log streaming with filtering
  - [ ] Subtask 4.3: Implement log persistence and rotation
  - [ ] Subtask 4.4: Build log export and analysis tools
- [ ] Task 5: Build Alert and Notification System (AC: 5)
  - [ ] Subtask 5.1: Create execution event alert system
  - [ ] Subtask 5.2: Add customizable notification rules engine
  - [ ] Subtask 5.3: Implement browser and email notifications
  - [ ] Subtask 5.4: Add webhook integration for external systems

## Dev Notes

### Enhanced WebSocket Event System

The developer MUST extend the existing WebSocket infrastructure for workflow monitoring:

```typescript
// src/lib/workflows/execution-monitor.ts

export interface ExecutionEvent {
  type: 'execution_started' | 'execution_completed' | 'execution_failed' | 'execution_cancelled'
      | 'step_started' | 'step_completed' | 'step_failed' | 'step_skipped'
      | 'output_stream' | 'log_entry' | 'resource_update' | 'alert_triggered';
  executionId: string;
  timestamp: Date;
  data: any;
  sessionId?: string;
}

export interface ExecutionProgressData {
  executionId: string;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  progress: number; // 0-100
  startTime: Date;
  estimatedCompletion?: Date;
  currentStepStartTime: Date;
  averageStepDuration: number;
}

export interface ExecutionStepEvent {
  stepId: string;
  stepName: string;
  stepType: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  metadata?: any;
}

export interface OutputStreamEvent {
  executionId: string;
  stepId?: string;
  stream: 'stdout' | 'stderr' | 'debug' | 'system';
  content: string;
  timestamp: Date;
  formatting?: {
    color?: string;
    bold?: boolean;
    italic?: boolean;
    background?: string;
  };
}

export class ExecutionMonitor {
  private wsServer: WebSocketServer;
  private subscribers = new Map<string, Set<WebSocket>>();
  private executionBuffers = new Map<string, OutputStreamEvent[]>();
  private readonly MAX_BUFFER_SIZE = 10000; // Maximum buffered events per execution

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  subscribeToExecution(executionId: string, ws: WebSocket): void {
    if (!this.subscribers.has(executionId)) {
      this.subscribers.set(executionId, new Set());
    }

    this.subscribers.get(executionId)!.add(ws);

    // Send buffered output to new subscriber
    const buffer = this.executionBuffers.get(executionId);
    if (buffer) {
      for (const event of buffer) {
        this.sendToClient(ws, {
          type: 'output_stream',
          executionId,
          timestamp: event.timestamp,
          data: event
        });
      }
    }

    // Handle client disconnect
    ws.on('close', () => {
      this.unsubscribeFromExecution(executionId, ws);
    });
  }

  unsubscribeFromExecution(executionId: string, ws: WebSocket): void {
    const subscribers = this.subscribers.get(executionId);
    if (subscribers) {
      subscribers.delete(ws);
      if (subscribers.size === 0) {
        this.subscribers.delete(executionId);
        // Optionally clean up buffer if no more subscribers
        // this.executionBuffers.delete(executionId);
      }
    }
  }

  broadcastExecutionEvent(event: ExecutionEvent): void {
    const subscribers = this.subscribers.get(event.executionId);
    if (!subscribers || subscribers.size === 0) return;

    // Buffer output stream events for late joiners
    if (event.type === 'output_stream') {
      this.bufferOutputEvent(event.executionId, event.data as OutputStreamEvent);
    }

    // Broadcast to all subscribers
    subscribers.forEach(ws => {
      this.sendToClient(ws, event);
    });
  }

  private bufferOutputEvent(executionId: string, outputEvent: OutputStreamEvent): void {
    let buffer = this.executionBuffers.get(executionId);
    if (!buffer) {
      buffer = [];
      this.executionBuffers.set(executionId, buffer);
    }

    buffer.push(outputEvent);

    // Limit buffer size
    if (buffer.length > this.MAX_BUFFER_SIZE) {
      buffer.splice(0, buffer.length - this.MAX_BUFFER_SIZE);
    }
  }

  private sendToClient(ws: WebSocket, event: ExecutionEvent): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(event));
      } catch (error) {
        console.error('Failed to send event to client:', error);
      }
    }
  }

  cleanupExecution(executionId: string): void {
    // Remove subscribers
    this.subscribers.delete(executionId);

    // Clean up buffer after a delay to allow late joiners
    setTimeout(() => {
      this.executionBuffers.delete(executionId);
    }, 30000); // 30 seconds delay
  }
}
```

### Enhanced Workflow Execution Engine with Streaming

The developer MUST modify the execution engine from Story 4.4 to support real-time monitoring:

```typescript
// src/lib/workflows/execution-engine-enhanced.ts

import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export class StreamingWorkflowExecutionEngine extends WorkflowExecutionEngine {
  private monitor: ExecutionMonitor;
  private eventEmitter: EventEmitter;

  constructor(monitor: ExecutionMonitor) {
    super();
    this.monitor = monitor;
    this.eventEmitter = new EventEmitter();
  }

  async executeWorkflowWithStreaming(config: WorkflowExecutionConfig): Promise<WorkflowExecutionResult> {
    const executionId = this.generateExecutionId();

    try {
      // Create execution record
      const execution = await this.createExecutionRecord(executionId, config);

      // Broadcast execution started
      this.broadcastEvent(executionId, {
        type: 'execution_started',
        executionId,
        timestamp: new Date(),
        data: {
          workflowName: config.workflowSpecId,
          executionMode: config.executionMode,
          parameters: config.parameters
        }
      });

      // Parse workflow and setup Claude session
      const workflowSpec = await this.loadWorkflowSpec(config.workflowSpecId);
      const parsedWorkflow = await this.parseWorkflowForExecution(workflowSpec, config.ccWorkingDir);
      const claudeSession = await this.createClaudeSessionWithStreaming(config, executionId);

      // Execute with real-time monitoring
      return await this.executeWithLiveMonitoring(executionId, parsedWorkflow, claudeSession, config);

    } catch (error) {
      console.error(`Streaming workflow execution failed:`, error);

      // Broadcast failure event
      this.broadcastEvent(executionId, {
        type: 'execution_failed',
        executionId,
        timestamp: new Date(),
        data: {
          error: error.message,
          duration: Date.now() - Date.now()
        }
      });

      throw error;
    }
  }

  private async createClaudeSessionWithStreaming(
    config: WorkflowExecutionConfig,
    executionId: string
  ): Promise<any> {
    const sessionConfig = {
      cwd: config.ccWorkingDir,
      environment: {
        ...process.env,
        ...config.environment,
        WORKFLOW_EXECUTION_ID: executionId
      },
      timeout: config.timeout || 300000,
      streaming: true // Enable streaming output
    };

    // Create Claude process with streaming
    const claudeProcess = spawn('claude', ['code', '--interactive'], {
      cwd: config.ccWorkingDir,
      env: sessionConfig.environment,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Setup output streaming
    this.setupOutputStreaming(executionId, claudeProcess);

    return {
      id: executionId,
      process: claudeProcess,
      cwd: config.ccWorkingDir,
      run: this.createStreamingRunFunction(claudeProcess, executionId)
    };
  }

  private setupOutputStreaming(executionId: string, process: any): void {
    // Stream stdout
    process.stdout.on('data', (data: Buffer) => {
      const content = data.toString();
      this.broadcastOutputEvent(executionId, {
        executionId,
        stream: 'stdout',
        content,
        timestamp: new Date()
      });
    });

    // Stream stderr
    process.stderr.on('data', (data: Buffer) => {
      const content = data.toString();
      this.broadcastOutputEvent(executionId, {
        executionId,
        stream: 'stderr',
        content,
        timestamp: new Date(),
        formatting: { color: '#ef4444' } // Red color for errors
      });
    });

    // Handle process events
    process.on('exit', (code: number) => {
      this.broadcastOutputEvent(executionId, {
        executionId,
        stream: 'system',
        content: `Process exited with code ${code}\n`,
        timestamp: new Date(),
        formatting: { color: code === 0 ? '#10b981' : '#ef4444' }
      });
    });
  }

  private createStreamingRunFunction(process: any, executionId: string) {
    return async (command: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        // Log command execution
        this.broadcastOutputEvent(executionId, {
          executionId,
          stream: 'system',
          content: `$ ${command}\n`,
          timestamp: new Date(),
          formatting: { color: '#6b7280', bold: true }
        });

        // Send command to process
        process.stdin.write(command + '\n');

        // Set up output collection
        const stdoutHandler = (data: Buffer) => {
          stdout += data.toString();
        };

        const stderrHandler = (data: Buffer) => {
          stderr += data.toString();
        };

        process.stdout.on('data', stdoutHandler);
        process.stderr.on('data', stderrHandler);

        // Wait for command completion (simplified - in real implementation, need better command delimiting)
        setTimeout(() => {
          process.stdout.removeListener('data', stdoutHandler);
          process.stderr.removeListener('data', stderrHandler);

          resolve({
            stdout,
            stderr,
            exitCode: 0 // Simplified - need proper exit code detection
          });
        }, 5000); // 5 second timeout for demo
      });
    };
  }

  private async executeWithLiveMonitoring(
    executionId: string,
    workflow: ParsedWorkflow,
    claudeSession: any,
    config: WorkflowExecutionConfig
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const executedSteps: WorkflowExecutionStep[] = [];
    let currentStatus: 'running' | 'completed' | 'failed' = 'running';

    try {
      await this.updateExecutionStatus(executionId, 'running', { startedAt: new Date() });

      // Broadcast progress updates
      const totalSteps = workflow.steps.length;
      let completedSteps = 0;

      for (const [index, step] of workflow.steps.entries()) {
        const stepStartTime = Date.now();

        // Broadcast step started
        this.broadcastEvent(executionId, {
          type: 'step_started',
          executionId,
          timestamp: new Date(),
          data: {
            stepId: step.id,
            stepName: step.name,
            stepType: step.type,
            stepIndex: index,
            totalSteps,
            progress: Math.round((completedSteps / totalSteps) * 100)
          }
        });

        try {
          // Execute step with monitoring
          const stepResult = await this.executeWorkflowStepWithMonitoring(step, claudeSession, executionId);

          completedSteps++;
          const stepDuration = Date.now() - stepStartTime;

          executedSteps.push({
            stepName: step.name,
            stepType: step.type,
            status: 'completed',
            duration: stepDuration,
            input: step.input,
            output: stepResult.output,
            startedAt: new Date(stepStartTime),
            completedAt: new Date()
          });

          // Broadcast step completed
          this.broadcastEvent(executionId, {
            type: 'step_completed',
            executionId,
            timestamp: new Date(),
            data: {
              stepId: step.id,
              stepName: step.name,
              duration: stepDuration,
              output: stepResult.output,
              progress: Math.round((completedSteps / totalSteps) * 100)
            }
          });

        } catch (stepError) {
          const stepDuration = Date.now() - stepStartTime;

          executedSteps.push({
            stepName: step.name,
            stepType: step.type,
            status: 'failed',
            duration: stepDuration,
            input: step.input,
            output: null,
            errorMessage: stepError.message,
            startedAt: new Date(stepStartTime),
            completedAt: new Date()
          });

          // Broadcast step failed
          this.broadcastEvent(executionId, {
            type: 'step_failed',
            executionId,
            timestamp: new Date(),
            data: {
              stepId: step.id,
              stepName: step.name,
              error: stepError.message,
              duration: stepDuration
            }
          });

          if (!step.continueOnFailure) {
            throw stepError;
          }
        }
      }

      currentStatus = 'completed';
      const finalOutput = this.buildWorkflowOutput(executedSteps);

      // Broadcast execution completed
      this.broadcastEvent(executionId, {
        type: 'execution_completed',
        executionId,
        timestamp: new Date(),
        data: {
          duration: Date.now() - startTime,
          output: finalOutput,
          stepsCompleted: completedSteps,
          totalSteps
        }
      });

      return {
        executionId,
        status: currentStatus,
        output: finalOutput,
        duration: Date.now() - startTime,
        steps: executedSteps
      };

    } catch (error) {
      currentStatus = 'failed';

      this.broadcastEvent(executionId, {
        type: 'execution_failed',
        executionId,
        timestamp: new Date(),
        data: {
          error: error.message,
          duration: Date.now() - startTime,
          stepsCompleted: executedSteps.length,
          totalSteps: workflow.steps.length
        }
      });

      throw error;
    } finally {
      // Update final status
      await this.updateExecutionStatus(executionId, currentStatus, {
        completedAt: new Date(),
        duration: Date.now() - startTime
      });

      // Save steps to database
      await this.saveExecutionSteps(executionId, executedSteps);

      // Cleanup after delay
      setTimeout(() => {
        this.monitor.cleanupExecution(executionId);
      }, 30000);
    }
  }

  private broadcastEvent(executionId: string, event: Omit<ExecutionEvent, 'executionId'>): void {
    this.monitor.broadcastExecutionEvent({
      ...event,
      executionId
    });
  }

  private broadcastOutputEvent(executionId: string, outputEvent: OutputStreamEvent): void {
    this.monitor.broadcastExecutionEvent({
      type: 'output_stream',
      executionId,
      timestamp: outputEvent.timestamp,
      data: outputEvent
    });
  }
}
```

### Real-time Execution Dashboard Component

**CRITICAL:** The developer MUST create a comprehensive monitoring dashboard:

```typescript
// src/components/workflow/ExecutionMonitorDashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface ExecutionMonitorDashboardProps {
  executionId: string;
  workflowSpec: WorkflowSpec;
  onClose?: () => void;
}

export function ExecutionMonitorDashboard({
  executionId,
  workflowSpec,
  onClose
}: ExecutionMonitorDashboardProps) {
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'running' | 'completed' | 'failed' | 'cancelled'>('pending');
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [steps, setSteps] = useState<Map<string, ExecutionStepEvent>>(new Map());
  const [output, setOutput] = useState<OutputStreamEvent[]>([]);
  const [logs, setLogs] = useState<ExecutionLogEvent[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [resourceUsage, setResourceUsage] = useState<ResourceUsageData | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [outputFilter, setOutputFilter] = useState<'all' | 'stdout' | 'stderr' | 'system'>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');

  // WebSocket connection for real-time updates
  const { sendMessage, lastMessage, connectionStatus } = useWebSocket(`/api/workflows/${executionId}/monitor`);

  useEffect(() => {
    if (lastMessage) {
      handleExecutionEvent(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  // Subscribe to execution monitoring on mount
  useEffect(() => {
    sendMessage(JSON.stringify({
      type: 'subscribe_execution',
      executionId
    }));

    return () => {
      sendMessage(JSON.stringify({
        type: 'unsubscribe_execution',
        executionId
      }));
    };
  }, [executionId]);

  // Auto-scroll output to bottom
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, autoScroll]);

  // Update duration timer
  useEffect(() => {
    if (executionStatus === 'running' && startTime) {
      const interval = setInterval(() => {
        setDuration(Date.now() - startTime.getTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [executionStatus, startTime]);

  const handleExecutionEvent = (event: ExecutionEvent) => {
    switch (event.type) {
      case 'execution_started':
        setExecutionStatus('running');
        setStartTime(new Date(event.data.startTime || event.timestamp));
        break;

      case 'execution_completed':
        setExecutionStatus('completed');
        setProgress(100);
        setDuration(event.data.duration || 0);
        break;

      case 'execution_failed':
        setExecutionStatus('failed');
        setDuration(event.data.duration || 0);
        break;

      case 'execution_cancelled':
        setExecutionStatus('cancelled');
        setDuration(event.data.duration || 0);
        break;

      case 'step_started':
        setCurrentStep(event.data.stepName);
        setProgress(event.data.progress || 0);
        setSteps(prev => new Map(prev.set(event.data.stepId, {
          ...event.data,
          status: 'running',
          startTime: new Date(event.timestamp)
        })));
        break;

      case 'step_completed':
        setSteps(prev => {
          const updated = new Map(prev);
          const step = updated.get(event.data.stepId);
          if (step) {
            updated.set(event.data.stepId, {
              ...step,
              status: 'completed',
              endTime: new Date(event.timestamp),
              duration: event.data.duration,
              output: event.data.output
            });
          }
          return updated;
        });
        setProgress(event.data.progress || 0);
        break;

      case 'step_failed':
        setSteps(prev => {
          const updated = new Map(prev);
          const step = updated.get(event.data.stepId);
          if (step) {
            updated.set(event.data.stepId, {
              ...step,
              status: 'failed',
              endTime: new Date(event.timestamp),
              duration: event.data.duration,
              error: event.data.error
            });
          }
          return updated;
        });
        break;

      case 'output_stream':
        setOutput(prev => [...prev, event.data]);
        break;

      case 'log_entry':
        setLogs(prev => [...prev, event.data]);
        break;

      case 'resource_update':
        setResourceUsage(event.data);
        break;
    }
  };

  const handleCancelExecution = async () => {
    if (confirm('Are you sure you want to cancel this execution?')) {
      try {
        const response = await fetch(`/api/workflows/${workflowSpec.id}/execute?executionId=${executionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setExecutionStatus('cancelled');
        }
      } catch (error) {
        console.error('Failed to cancel execution:', error);
      }
    }
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const filteredOutput = output.filter(event =>
    outputFilter === 'all' || event.stream === outputFilter
  );

  const filteredLogs = logs.filter(event =>
    logFilter === 'all' || event.level === logFilter
  );

  return (
    <div className="execution-monitor-dashboard h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {workflowSpec.name} Execution
          </h1>
          <p className="text-sm text-gray-600">
            ID: {executionId} • Status: <span className={getStatusColor(executionStatus)}>{executionStatus}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Duration: {formatDuration(duration)}
          </div>

          {executionStatus === 'running' && (
            <button
              onClick={handleCancelExecution}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress}%</span>
          {currentStep && (
            <span className="text-sm text-blue-600">Current: {currentStep}</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              executionStatus === 'failed' ? 'bg-red-500' :
              executionStatus === 'completed' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Steps and Timeline */}
        <div className="w-1/3 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Execution Steps</h3>

            <div className="space-y-3">
              {Array.from(steps.values()).map(step => (
                <div
                  key={step.stepId}
                  className={`p-3 rounded-lg border ${
                    step.status === 'completed' ? 'bg-green-50 border-green-200' :
                    step.status === 'failed' ? 'bg-red-50 border-red-200' :
                    step.status === 'running' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700' :
                      step.status === 'failed' ? 'bg-red-100 text-red-700' :
                      step.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Type: {step.stepType}</p>
                    {step.duration && (
                      <p>Duration: {formatDuration(step.duration)}</p>
                    )}
                    {step.error && (
                      <p className="text-red-600 mt-1">Error: {step.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Output and Logs */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b">
            <div className="flex">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Output
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Logs
              </button>
            </div>

            {/* Output Controls */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-t">
              <select
                value={outputFilter}
                onChange={(e) => setOutputFilter(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Output</option>
                <option value="stdout">stdout</option>
                <option value="stderr">stderr</option>
                <option value="system">system</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
                Auto-scroll
              </label>

              <button
                onClick={() => setOutput([])}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Display */}
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm p-4"
          >
            {filteredOutput.map((outputEvent, index) => (
              <div
                key={index}
                className="whitespace-pre-wrap"
                style={{
                  color: outputEvent.formatting?.color ||
                         (outputEvent.stream === 'stderr' ? '#ef4444' :
                          outputEvent.stream === 'system' ? '#6b7280' : '#10b981'),
                  fontWeight: outputEvent.formatting?.bold ? 'bold' : 'normal',
                  fontStyle: outputEvent.formatting?.italic ? 'italic' : 'normal'
                }}
              >
                <span className="text-gray-500 text-xs mr-2">
                  [{outputEvent.timestamp.toLocaleTimeString()}]
                </span>
                {outputEvent.content}
              </div>
            ))}

            {filteredOutput.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No output available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### WebSocket API Enhancement

The developer MUST extend the existing WebSocket API to support execution monitoring:

```typescript
// src/app/api/workflows/[id]/monitor/route.ts

import { WebSocketServer } from 'ws';
import { ExecutionMonitor } from '@/lib/workflows/execution-monitor';

let wsServer: WebSocketServer | null = null;
let executionMonitor: ExecutionMonitor | null = null;

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (url.searchParams.get('upgrade') !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  // Initialize WebSocket server if not exists
  if (!wsServer) {
    wsServer = new WebSocketServer({ port: 0 });
    executionMonitor = new ExecutionMonitor(wsServer);
  }

  // Handle WebSocket upgrade (simplified - in practice, use proper WebSocket handling)
  return new Response(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    }
  });
}

// Execution monitoring endpoints
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: { type: 'AUTH_ERROR', message: 'Authentication required' },
        success: false
      }, { status: 401 });
    }

    const { action, executionId } = await request.json();

    if (action === 'get_status') {
      const executionEngine = new WorkflowExecutionEngine();
      const status = await executionEngine.getExecutionStatus(executionId);

      return NextResponse.json({
        data: status,
        success: true
      });
    }

    if (action === 'get_logs') {
      const logs = await prisma.workflowExecutionLog.findMany({
        where: { executionId },
        orderBy: { timestamp: 'desc' },
        take: 1000
      });

      return NextResponse.json({
        data: { logs },
        success: true
      });
    }

    return NextResponse.json({
      error: { type: 'VALIDATION_ERROR', message: 'Invalid action' },
      success: false
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      error: { type: 'INTERNAL_ERROR', message: 'Monitoring request failed' },
      success: false
    }, { status: 500 });
  }
}
```

### Project Structure Notes

**CRITICAL:** The developer MUST follow the exact project structure defined in the Architecture document:

- Execution monitoring components in `src/components/workflow/` directory
- WebSocket enhancements in `src/lib/claude/websocket-handler.ts`
- Execution monitoring services in `src/lib/workflows/` directory
- Real-time dashboard following React patterns with proper state management
- All database operations using Prisma with proper error handling

### References

- **WebSocket Infrastructure**: [Source: _bmad-output/implementation-artifacts/stories/3-7-websocket-connection-management.md]
- **Architecture Decisions**: [Source: _bmad-output/architecture.md#Core Architectural Decisions]
- **Previous Story Foundation**: [Source: _bmad-output/implementation-artifacts/stories/4-4-trigger-workflow-execution.md]
- **Real-time Communication Patterns**: [Source: _bmad-output/architecture.md#Communication Patterns]
- **Project Requirements**: [Source: _bmad-output/prd.md#Workflow Engine Core Requirements]

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

### Completion Notes List

### File List