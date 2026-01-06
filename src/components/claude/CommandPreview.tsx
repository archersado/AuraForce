/**
 * CommandPreview Component
 *
 * Displays the translated command and allows user to confirm or modify it.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Command } from '@/lib/claude/types';

interface CommandPreviewProps {
  command: Command | null;
  confidence: number;
  alternatives?: Command[];
  suggestions?: string[];
  onConfirm: (command: Command) => void;
  onCancel: () => void;
}

const previewVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function CommandPreview({
  command,
  confidence,
  alternatives,
  suggestions,
  onConfirm,
  onCancel,
}: CommandPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);

  if (!command) return null;

  const displayCommand = selectedAlternative !== null && alternatives
    ? alternatives[selectedAlternative]
    : command;
  const displayConfidence = selectedAlternative !== null ? 1.0 : confidence;

  // Get confidence color
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.5) return 'Medium';
    return 'Low';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4"
        variants={previewVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-900 mb-1">
              Command Interpretation
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${getConfidenceColor(displayConfidence)}`}>
                {getConfidenceLabel(displayConfidence)} Confidence
              </span>
              <span className="text-xs text-gray-500">
                ({Math.round(displayConfidence * 100)}%)
              </span>
            </div>
          </div>

          {/* Expand/Collapse button */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={expanded ? 'Show less' : 'Show more'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Command details */}
        <div className="bg-white rounded-md p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono uppercase">
              {displayCommand.type}
            </span>
            <span className="text-xs font-mono text-gray-600">
              {displayCommand.action}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-2">
            {displayCommand.description}
          </p>

          {/* Parameters */}
          <AnimatePresence>
            {expanded && Object.keys(displayCommand.parameters).length > 0 && (
              <motion.div
                className="border-t border-gray-200 pt-2 mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Parameters:</h4>
                <div className="space-y-1">
                  {Object.entries(displayCommand.parameters).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-600">{key}:</span>
                      <span className="text-xs text-gray-700">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && expanded && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4 className="text-xs font-semibold text-yellow-800 mb-1">Suggestions:</h4>
            <ul className="space-y-0.5">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-yellow-700">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Alternatives */}
        {alternatives && alternatives.length > 0 && expanded && (
          <motion.div
            className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Alternatives:</h4>
            <div className="space-y-1">
              {alternatives.map((alt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAlternative(selectedAlternative === index ? null : index)}
                  className={`
                    w-full text-left p-2 rounded border transition-all
                    ${selectedAlternative === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{alt.description}</span>
                    <span className="text-xs text-xs bg-gray-200 px-2 py-0.5 rounded">
                      {alt.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm(displayCommand)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Check className="w-4 h-4" />
            Confirm Command
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
