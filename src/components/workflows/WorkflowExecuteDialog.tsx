/**
 * Workflow Execute Dialog Component
 *
 * Dialog for executing a workflow with optional parameters.
 * Displays execution results with SSE streaming support.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, X, Loader2, CheckCircle, XCircle, Terminal } from 'lucide-react';

interface WorkflowInput {
  name: string;
  label?: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: string | number | boolean | string[];
  options?: string[];
  placeholder?: string;
}

interface WorkflowSpec {
  id: string;
  name: string;
  description?: string | null;
  ccPath: string;
  status: string;
  metadata?: {
    inputs?: WorkflowInput[];
  };
}

interface WorkflowExecuteDialogProps {
  workflow: WorkflowSpec;
  open: boolean;
  onClose: () => void;
}

export default function WorkflowExecuteDialog({
  workflow,
  open,
  onClose,
}: WorkflowExecuteDialogProps) {
  const [params, setParams] = useState<Record<string, string | number | boolean>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionOutput]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setExecutionState('idle');
      setExecutionOutput('');
      setError(null);
      setSessionId(null);
      // Initialize params with defaults
      const defaultParams: Record<string, string | number | boolean> = {};
      workflow.metadata?.inputs?.forEach(input => {
        if (input.default !== undefined) {
          defaultParams[input.name] = input.default;
        }
      });
      setParams(defaultParams);
    }
  }, [open, workflow]);

  const handleParamChange = (name: string, value: string | number | boolean) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionState('running');
    setExecutionOutput('');
    setError(null);
    setSessionId(null);

    try {
      const response = await fetch(`/api/workflows/${workflow.id}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to start workflow execution');
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      setExecutionOutput('> Starting workflow execution...\n\n');

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case 'status':
                  setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${data.message}\n`);
                  break;

                case 'session-created':
                  setSessionId(data.sessionId);
                  setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Session created: ${data.sessionId}\n`);
                  break;

                case 'claude-response':
                  // Extract message content from SDK response
                  const messageData = data.data;
                  if (messageData.type === 'assistant' && messageData.message?.content) {
                    const content = messageData.message.content
                      .filter((c: any) => c.type === 'text')
                      .map((c: any) => c.text)
                      .join('');
                    setExecutionOutput(prev => prev + content);
                  } else if (messageData.type === 'result') {
                    if (messageData.subtype === 'success') {
                      const result = messageData.result ? JSON.stringify(messageData.result, null, 2) : 'Success';
                      setExecutionOutput(prev => prev + `\n\n${'═'.repeat(50)}\n\nExecution Result:\n\n${result}\n`);
                    } else if (messageData.is_error) {
                      const errorMsg = messageData.result || 'Unknown error';
                      setExecutionOutput(prev => prev + `\n\n${'═'.repeat(50)}\n\nError: ${errorMsg}\n`);
                    }
                  }
                  break;

                case 'claude-complete':
                  setExecutionState('completed');
                  setExecutionOutput(prev => prev + `\n\n[${new Date().toLocaleTimeString()}] ✓ Execution completed\n`);
                  break;

                case 'claude-error':
                  setExecutionState('error');
                  setError(data.error || 'Unknown error occurred');
                  setExecutionOutput(prev => prev + `\n\n[${new Date().toLocaleTimeString()}] ✗ Error: ${data.error}\n`);
                  break;
              }
            } catch (e) {
              console.error('[Execute Dialog] Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setExecutionState('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
      setExecutionOutput(prev => prev + `\n\n[${new Date().toLocaleTimeString()}] ✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}\n`);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!open) return null;

  const inputs = workflow.metadata?.inputs || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                执行工作流
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {workflow.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Parameters Form */}
          {executionState === 'idle' && inputs.length > 0 && (
            <div className="mb-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                工作流参数
              </h3>
              {inputs.map((input) => (
                <div key={input.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {input.label || input.name}
                    {input.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {input.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {input.description}
                    </p>
                  )}
                  {input.type === 'select' && input.options ? (
                    <select
                      value={String(params[input.name] ?? input.default ?? '')}
                      onChange={(e) => handleParamChange(input.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">请选择...</option>
                      {input.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : input.type === 'boolean' ? (
                    <select
                      value={String(params[input.name] ?? input.default ?? 'false')}
                      onChange={(e) => handleParamChange(input.name, e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="false">否</option>
                      <option value="true">是</option>
                    </select>
                  ) : (
                    <input
                      type={input.type === 'number' ? 'number' : 'text'}
                      value={String(params[input.name] ?? input.default ?? '')}
                      onChange={(e) => {
                        const value = input.type === 'number'
                          ? parseFloat(e.target.value) || 0
                          : e.target.value;
                        handleParamChange(input.name, value);
                      }}
                      placeholder={input.placeholder}
                      required={input.required}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Execution Output */}
          {executionState !== 'idle' && (
            <div className="space-y-3">
              {/* State Indicator */}
              <div className="flex items-center gap-2">
                {executionState === 'running' && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">正在执行...</span>
                  </div>
                )}
                {executionState === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">执行完成</span>
                  </div>
                )}
                {executionState === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">执行失败</span>
                  </div>
                )}
                {sessionId && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                  Session: {sessionId}
                  </span>
                )}
              </div>

              {/* Output Terminal */}
              <div
                ref={outputRef}
                className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px] whitespace-pre-wrap leading-relaxed"
              >
                {executionOutput || '< No output >'}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          {executionState === 'idle' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    执行中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    执行
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {executionState === 'running' && (
                <button
                  onClick={onClose}
                  disabled={isExecuting}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg disabled:opacity-50"
                >
                  停止执行
                </button>
              )}
              {executionState !== 'running' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  关闭
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
