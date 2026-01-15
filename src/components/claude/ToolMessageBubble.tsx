/**
 * Tool Message Bubble Component
 *
 * Renders a system message bubble for tool execution.
 * Each tool call gets its own independent message bubble.
 */

'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Play, CheckCircle2, XCircle, Loader2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToolUseData } from '@/types/tool-use';

interface ToolMessageBubbleProps {
  toolUseData: ToolUseData;
}

export function ToolMessageBubble({ toolUseData }: ToolMessageBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(toolUseData.isInteractive);

  const statusIcons = {
    pending: <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />,
    running: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
  };

  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    running: 'border-blue-300 bg-blue-50',
    completed: 'border-green-300 bg-green-50',
    error: 'border-red-300 bg-red-50',
  };

  const statusText = {
    pending: 'Pending',
    running: 'Running...',
    completed: 'Completed',
    error: 'Error',
  };

  const formatInput = (input: Record<string, unknown>): string => {
    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return String(input);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg border ${statusColors[toolUseData.status]} transition-colors`}
    >
      {/* Tool header */}
      <div
        className="flex items-center justify-between gap-2 cursor-pointer select-none hover:bg-white/50 rounded-md p-1 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-sm text-gray-700">{toolUseData.toolName}</span>
            {statusIcons[toolUseData.status]}
          </div>
          <span className="text-xs text-gray-500">{statusText[toolUseData.status]}</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>

      {/* Tool details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
              {/* Input */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Input
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {formatInput(toolUseData.input)}
                </pre>
              </div>

              {/* Result (if any) */}
              {toolUseData.result && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Result
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                    {toolUseData.result}
                  </pre>
                </div>
              )}

              {/* Error (if any) */}
              {toolUseData.error && (
                <div>
                  <div className="text-xs font-semibold text-red-600 mb-1.5 uppercase tracking-wide">
                    Error
                  </div>
                  <pre className="text-xs bg-red-50 p-2 rounded border border-red-200 text-red-700 overflow-x-auto">
                    {toolUseData.error}
                  </pre>
                </div>
              )}

              {/* Timestamp */}
              {toolUseData.startTime && (
                <div className="mt-2 text-xs text-gray-400">
                  {toolUseData.startTime.toLocaleTimeString()}
                  {toolUseData.endTime && ` - ${toolUseData.endTime.toLocaleTimeString()}`}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
