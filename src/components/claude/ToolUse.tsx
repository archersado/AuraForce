/**
 * ToolUse Component
 *
 * Renders a tool use message with collapsable details showing tool name,
 * input parameters, and optional result/execution status.
 * Supports error display and status indicators.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
} from 'lucide-react';

export interface ToolUseData {
  toolName: string;
  toolId: string;
  toolInput: string;
  toolResult?: {
    content: string;
    isError: boolean;
    timestamp: Date;
  };
  status?: 'pending' | 'running' | 'success' | 'error';
}

interface ToolUseProps {
  data: ToolUseData;
  minimal?: boolean; // Show minimal version (no expandable input)
}

const statusStyles = {
  pending: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    icon: <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />,
    label: 'Pending',
  },
  running: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    label: 'Running',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    label: 'Success',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    label: 'Error',
  },
};

export function ToolUse({ data, minimal = false }: ToolUseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const status = data.status || (data.toolResult ? (data.toolResult.isError ? 'error' : 'success') : 'pending');
  const style = statusStyles[status];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.toolInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (minimal) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${style.bg} ${style.border} border`}>
        <Wrench className="w-3.5 h-3.5 text-gray-600" />
        <span className="font-medium text-gray-700">{data.toolName}</span>
      </div>
    );
  }

  return (
    <div className={`my-3 rounded-lg border ${style.border} ${style.bg} overflow-hidden`}>
      {/* Header - always visible */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Wrench className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900 text-sm">{data.toolName}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} border ${style.border}`}>
            {style.label}
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.div>
      </div>

      {/* Collapsible content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-white"
          >
            {/* Input section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Input</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 rounded-md p-3 overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">{data.toolInput}</pre>
              </div>
            </div>

            {/* Result section (if available) */}
            {data.toolResult && (
              <div className={`px-4 py-3 ${data.toolResult.isError ? 'bg-red-50' : 'bg-gray-50'}`}>
                <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                  Result {data.toolResult.isError && '(Error)'}
                </span>
                <div className={`rounded-md p-3 overflow-x-auto ${
                  data.toolResult.isError ? 'bg-red-100 text-red-900' : 'bg-white border border-gray-200'
                }`}>
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {data.toolResult.content}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ToolUseInline - Compact inline version for message content
 */
export function ToolUseInline({ data }: { data: ToolUseData }) {
  return (
    <div className="inline-flex items-start gap-2 my-2">
      <Wrench className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{data.toolName}</span>
          {data.status === 'running' && (
            <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
          )}
          {data.status === 'success' && (
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          )}
          {data.status === 'error' && (
            <XCircle className="w-3 h-3 text-red-600" />
          )}
        </div>
        {data.toolResult && data.toolResult.content && (
          <div className={`mt-1 text-xs font-mono p-2 rounded ${
            data.toolResult.isError ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {data.toolResult.isError ? data.toolResult.content : data.toolResult.content}
          </div>
        )}
      </div>
    </div>
  );
}
