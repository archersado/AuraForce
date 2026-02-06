/**
 * Session Control Buttons Component
 *
 * Simplified version - only shows terminate button when session is active.
 */

'use client';

import { motion } from 'framer-motion';
import { Square } from 'lucide-react';

type SessionControlState = 'idle' | 'streaming' | 'paused' | 'terminated';

interface SessionControlButtonsProps {
  controlState: SessionControlState;
  isStreaming: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onTerminate: () => void;
  disabled?: boolean;
}

/**
 * Determines if terminate button should be enabled
 */
function canTerminate(state: SessionControlState, isStreaming: boolean): boolean {
  return state !== 'terminated' && state !== 'idle';
}

export function SessionControlButtons({
  controlState,
  isStreaming,
  onTerminate,
  disabled = false,
}: SessionControlButtonsProps) {
  const showTerminateButton = canTerminate(controlState, isStreaming);

  // Don't render anything if no controls are needed
  if (!showTerminateButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Terminate Button - only button remaining */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTerminate}
        disabled={disabled}
        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Stop session"
        title="Stop current session"
      >
        <Square className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
