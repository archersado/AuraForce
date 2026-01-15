/**
 * RunningToolIndicator Component
 *
 * Displays a temporary, animated indicator for the currently running tool.
 * Disappears with an exit animation after the tool completes.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Loader2, CheckCircle2 } from 'lucide-react';

interface RunningToolIndicatorProps {
  toolName: string;
  status: 'running' | 'completed';
}

export function RunningToolIndicator({ toolName, status }: RunningToolIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`tool-${status}`}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-start mb-3"
      >
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
            ${status === 'running'
              ? 'bg-blue-50 border border-blue-200 text-blue-700'
              : 'bg-green-50 border border-green-200 text-green-700'
            }
          `}
        >
          <Terminal className="w-4 h-4" />
          <span>{toolName}</span>
          {status === 'running' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
