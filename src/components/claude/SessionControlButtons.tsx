/**
 * Session Control Buttons Component
 *
 * Provides Pause/Resume/Terminate controls for Claude Code sessions.
 * Button states automatically adjust based on current session control state.
 */

'use client';

import { motion } from 'framer-motion';
import { Pause, Play, Square, Loader2 } from 'lucide-react';

type SessionControlState = 'idle' | 'streaming' | 'paused' | 'terminated';

interface SessionControlButtonsProps {
  controlState: SessionControlState;
  isStreaming: boolean;
  onPause: () => void;
  onResume: () => void;
  onTerminate: () => void;
  disabled?: boolean;
}

/**
 * Determines if pause button should be enabled
 */
function canPause(state: SessionControlState, isStreaming: boolean): boolean {
  return (state === 'streaming' || state === 'idle') && isStreaming;
}

/**
 * Determines if resume button should be enabled
 */
function canResume(state: SessionControlState): boolean {
  return state === 'paused';
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
  onPause,
  onResume,
  onTerminate,
  disabled = false,
}: SessionControlButtonsProps) {
  const showPauseButton = canPause(controlState, isStreaming);
  const showResumeButton = canResume(controlState);
  const showTerminateButton = canTerminate(controlState, isStreaming);

  // Don't render anything if session is idle or no controls are available
  if (controlState === 'idle' && !isStreaming) {
    return null;
  }

  // Visual indicator for paused state
  const isPaused = controlState === 'paused';

  return (
    <div className="flex items-center gap-2">
      {/* Pause Button */}
      {showPauseButton && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPause}
          disabled={disabled}
          className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Pause session"
          title="Pause streaming response"
        >
          <Pause className="w-4 h-4" />
        </motion.button>
      )}

      {/* Resume Button */}
      {showResumeButton && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResume}
          disabled={disabled}
          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Resume session"
          title="Resume streaming response"
        >
          <Play className="w-4 h-4 ml-0.5" />
        </motion.button>
      )}

      {/* Terminate Button */}
      {showTerminateButton && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTerminate}
          disabled={disabled}
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Terminate session"
          title="Stop and close session"
        >
          <Square className="w-4 h-4" />
        </motion.button>
      )}

      {/* Loading state */}
      {disabled && controlState === 'streaming' && (
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" aria-label="Processing" />
      )}
    </div>
  );
}
