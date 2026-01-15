/**
 * Tool Call Component
 *
 * Displays tool execution status and interactive components for tool calls.
 * Supports displaying pending, running, completed, and error states.
 *
 * Examples of tools:
 * - ReadFile, WriteFile, Bash (displayed with status)
 * - AskUserQuestions (interactive - renders selection component)
 * - Todo (interactive - renders todo list)
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Tool execution status
 */
export type ToolStatus = 'pending' | 'running' | 'completed' | 'error' | 'cancelled';

/**
 * Tool execution result
 */
export interface ToolExecution {
  toolId: string;
  toolName: string;
  startTime: Date;
  endTime?: Date;
  status: ToolStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  exitCode?: number;
  // For interactive tools
  interactiveData?: {
    type: 'AskUserQuestions' | 'Todo' | 'Confirm';
    data: unknown;
  };
  // User response to interactive tool (after submission)
  userResponse?: unknown;
}

interface ToolCallProps {
  execution: ToolExecution;
  onToolResponse?: (toolId: string, response: unknown) => void;
}

const statusIcons: Record<ToolStatus, string> = {
  pending: '⏳',
  running: '🔄',
  completed: '✅',
  error: '❌',
  cancelled: '🚫',
};

const statusColors: Record<ToolStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  running: 'text-blue-600 bg-blue-50 border-blue-200',
  completed: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  cancelled: 'text-gray-600 bg-gray-50 border-gray-200',
};

/**
 * Format tool name for display (e.g., "Bash" -> "bash", "ReadFile" -> "Read File")
 */
function formatToolName(toolName: string): string {
  return toolName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
}

/**
 * Format duration for display
 */
function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date();
  const duration = end.getTime() - startTime.getTime();
  if (duration < 1000) {
    return `${duration}ms`;
  }
  return `${(duration / 1000).toFixed(2)}s`;
}

/**
 * Display tool call execution with status
 */
export function ToolCall({ execution, onToolResponse }: ToolCallProps) {
  const [expanded, setExpanded] = useState(false);

  // Auto-expand when tool completes with error
  useEffect(() => {
    if (execution.status === 'error') {
      setExpanded(true);
    }
  }, [execution.status]);

  const icon = statusIcons[execution.status];
  const colorClass = statusColors[execution.status];
  const toolName = formatToolName(execution.toolName);

  // Render interactive component if applicable
  const renderInteractiveComponent = () => {
    console.log('[ToolCall.renderInteractiveComponent] execution:', {
      hasInteractiveData: !!execution.interactiveData,
      hasUserResponse: !!execution.userResponse,
      interactiveData: execution.interactiveData,
      userResponse: execution.userResponse,
    });

    if (!execution.interactiveData || execution.userResponse) {
      console.log('[ToolCall.renderInteractiveComponent] Returning null because:', {
        noInteractiveData: !execution.interactiveData,
        hasUserResponse: !!execution.userResponse
      });
      return null;
    }

    const { type, data } = execution.interactiveData;

    console.log('[ToolCall.renderInteractiveComponent] Rendering interactive component:', type, data);

    if (type === 'AskUserQuestions') {
      return (
        <AskUserQuestions
          data={data as any}
          onResponse={(response) => {
            console.log('[ToolCall] AskUserQuestions response:', response);
            onToolResponse?.(execution.toolId, response);
          }}
        />
      );
    }

    if (type === 'Todo') {
      return (
        <TodoList
          data={data as any}
          onResponse={(response) => {
            console.log('[ToolCall] TodoList response:', response);
            onToolResponse?.(execution.toolId, response);
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-2">
      {/* Tool header with status */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${colorClass}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{toolName}</span>
        {execution.exitCode !== undefined && execution.exitCode !== 0 && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
            exit: {execution.exitCode}
          </span>
        )}
        <span className="text-xs opacity-60 ml-auto">
          {formatDuration(execution.startTime, execution.endTime)}
        </span>
        <span className="text-xs opacity-60">
          {expanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-2"
        >
          {/* User response (for interactive tools after submission) */}
          {!!execution.userResponse && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-500 mb-2">YOUR RESPONSE</div>
              <pre className="text-xs text-blue-700 overflow-x-auto">
                {JSON.stringify(execution.userResponse, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}

      {/* Interactive component (AskUserQuestions, Todo) */}
      {renderInteractiveComponent()}
    </div>
  );
}

/**
 * AskUserQuestions Interactive Component
 *
 * Renders a selection component based on the protocol.
 * Supports single-select and multi-select.
 * Allows users to manually input custom options.
 */
interface AskUserQuestionsProps {
  data: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      allowMultiple?: boolean;
      allowCustomInput?: boolean;
    }>;
  };
  onResponse: (response: Record<string, string | string[]>) => void;
}

function AskUserQuestions({ data, onResponse }: AskUserQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  console.log('[AskUserQuestions] Rendered with data:', data);

  const handleSelectOption = (questionId: string, option: string, allowMultiple: boolean) => {
    console.log('[AskUserQuestions] handleSelectOption:', { questionId, option, allowMultiple });
    setAnswers((prev) => {
      if (allowMultiple) {
        const current = (prev[questionId] as string[]) || [];
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter((o) => o !== option) };
        }
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: option };
      }
    });
  };

  const handleCustomInput = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [`custom_${questionId}`]: value }));
  };

  const handleSubmit = () => {
    console.log('[AskUserQuestions] handleSubmit called with answers:', answers);
    // Combine preset answers and custom inputs
    const response: Record<string, string | string[]> = { ...answers };

    data.questions.forEach((q) => {
      const customKey = `custom_${q.id}`;
      if (customKey in answers && (answers[customKey] as string).trim()) {
        const customValue = (answers[customKey] as string).trim();
        if (q.allowMultiple) {
          response[q.id] = [...((response[q.id] as string[]) || []), customValue];
        } else {
          response[q.id] = customValue;
        }
        delete response[customKey];
      }
    });

    console.log('[AskUserQuestions] Sending response:', response);
    onResponse(response);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 relative z-10">
      <div className="text-sm font-semibold text-blue-700 mb-3">Please answer:</div>
      {data.questions.map((q) => (
        <div key={q.id} className="mb-4">
          <div className="text-sm text-blue-900 mb-2">{q.question}</div>
          <div className="space-y-2">
            {q.options.map((option) => {
              const isSelected = q.allowMultiple
                ? (answers[q.id] as string[])?.includes(option)
                : answers[q.id] === option;

              return (
                <button
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(q.id, option, q.allowMultiple || false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {q.allowMultiple && (
                    <span className="mr-2">{isSelected ? '☑' : '☐'}</span>
                  )}
                  {!q.allowMultiple && (
                    <span className="mr-2">{isSelected ? '⦿' : '○'}</span>
                  )}
                  {option}
                </button>
              );
            })}
          </div>
          {q.allowCustomInput && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or type your own option..."
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                onChange={(e) => handleCustomInput(q.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyPress={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSubmit();
        }}
        disabled={Object.keys(answers).length === 0}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}

/**
 * Todo List Interactive Component
 *
 * Renders a checkbox-based todo list that users can check off.
 */
interface TodoListProps {
  data: {
    items: Array<{
      id: string;
      text: string;
      completed?: boolean;
    }>;
  };
  onResponse: (response: { completed: string[]; uncompleted: string[] }) => void;
}

function TodoList({ data, onResponse }: TodoListProps) {
  const [items, setItems] = useState(
    data.items.map((item) => ({ ...item, completed: item.completed || false }))
  );

  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);
  };

  const handleSubmit = () => {
    const completed = items.filter((i) => i.completed).map((i) => i.id);
    const uncompleted = items.filter((i) => !i.completed).map((i) => i.id);
    onResponse({ completed, uncompleted });
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-2">
      <div className="text-sm font-semibold text-purple-700 mb-3">Todo List</div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-2 cursor-pointer hover:bg-purple-100 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item.id)}
              className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-purple-900'}`}>
              {item.text}
            </span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}