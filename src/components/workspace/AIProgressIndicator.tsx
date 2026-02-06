/**
 * AI Progress Indicator Component
 *
 * Displays AI operation progress with visual feedback.
 * Features:
 * - Animated progress bar
 * - Stage indicators
 * - Operation status messages
 * - Loading spinner with progress
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Loader2, Bot, Zap, FileCode, Sparkles as SparklesIcon } from 'lucide-react';

export interface AIProgressState {
  operation: 'idle' | 'analyzing' | 'generating' | 'applying' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  steps?: AIProgressStep[];
  currentStep?: number;
}

export interface AIProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}

interface AIProgressIndicatorProps {
  state: AIProgressState;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function AIProgressIndicator({ state, onComplete, onCancel }: AIProgressIndicatorProps) {
  const { operation, progress, message, steps, currentStep } = state;

  // Auto-complete animation when operation is complete
  useEffect(() => {
    if (operation === 'complete' && onComplete) {
      const timeoutId = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [operation, onComplete]);

  if (operation === 'idle') {
    return null;
  }

  // Default steps if not provided
  const defaultSteps: AIProgressStep[] = steps || [
    { id: 'analyze', label: 'Analyzing code', status: currentStep === 0 ? 'active' : (progress > 30 ? 'completed' : 'pending') },
    { id: 'generate', label: 'Generating improvements', status: currentStep === 1 ? 'active' : (progress > 66 ? 'completed' : 'pending') },
    { id: 'apply', label: 'Applying changes', status: currentStep === 2 ? 'active' : (progress >= 100 ? 'completed' : 'pending') },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      {/* Header with Operation Icon and Message */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
          {operation === 'error' ? (
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Circle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          ) : operation === 'complete' ? (
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              {operation === 'generating' ? (
                <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              ) : (
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {operation === 'analyzing' && 'AI is analyzing...'}
              {operation === 'generating' && 'AI is generating...'}
              {operation === 'applying' && 'AI is applying changes...'}
              {operation === 'complete' && 'AI operation complete'}
              {operation === 'error' && 'AI operation failed'}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {message || 'Processing your request...'}
          </p>
        </div>

        {/* Cancel Button */}
        {operation !== 'complete' && operation !== 'error' && onCancel && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Cancel operation"
          >
            <Circle className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {operation === 'complete' ? 'Complete' : `${progress}%`}
          </span>
          {operation !== 'complete' && operation !== 'error' && (
            <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
          )}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-2 rounded-full relative ${
              operation === 'complete'
                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                : operation === 'error'
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated shimmer effect */}
            {operation !== 'complete' && operation !== 'error' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-2">
        {displaySteps.map((step, index) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isError = step.status === 'error';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 text-sm ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
              } ${isError ? 'text-red-600 dark:text-red-400' : ''} ${
                isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : isError
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : isActive
                  ? 'bg-blue-100 dark:bg-blue-900/20'
                  : 'bg-gray-100 dark:bg-gray-700/50'
              }`}>
                {isCompleted ? (
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : isError ? (
                  <Circle className="w-3 h-3 text-red-600 dark:text-red-400" />
                ) : isActive ? (
                  <Loader2 className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-400 dark:text-gray-600" fill="none" />
                )}
              </div>

              {/* Step Label */}
              <span className="truncate">{step.label}</span>

              {/* Step Duration (if provided) */}
              {isActive && step.duration && (
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                  ~{step.duration}s
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {operation === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
          >
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">AI operation completed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {operation === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                  AI operation failed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {message || 'An error occurred during AI operation. Please try again.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact AI Progress Indicator (for in-line use)
 */
interface AIProgressIndicatorCompactProps {
  state: AIProgressState;
}

export function AIProgressIndicatorCompact({ state }: AIProgressIndicatorCompactProps) {
  const { operation, progress, message } = state;

  if (operation === 'idle') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
      <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
      <span className="text-xs text-blue-900 dark:text-blue-100 truncate max-w-[200px]">
        {message || 'AI processing...'} ({progress}%)
      </span>
    </div>
  );
}
