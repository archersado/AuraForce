/**
 * Claude Session List Component
 *
 * Displays and manages Claude Code CLI sessions from ~/.claude/projects/
 * Allows users to view and resume previous conversations within a project.
 */

'use client';

import { useState, useEffect } from 'react';
import { History, MessageSquare, Clock, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClaudeSessionDTO {
  id: string;
  summary: string;
  messageCount: number;
  lastActivity: string;
  cwd: string;
  lastUserMessage?: string;
  lastAssistantMessage?: string;
}

interface ClaudeSessionListProps {
  isOpen: boolean;
  onClose: () => void;
  projectPath?: string;
  onResumeSession: (sessionId: string) => void;
}

export function ClaudeSessionList({
  isOpen,
  onClose,
  projectPath,
  onResumeSession,
}: ClaudeSessionListProps) {
  const [sessions, setSessions] = useState<ClaudeSessionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Claude sessions when panel opens or project changes
  useEffect(() => {
    if (isOpen && projectPath) {
      loadSessions();
    }
  }, [isOpen, projectPath]);

  const loadSessions = async () => {
    if (!projectPath) {
      setError('No project path provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/claude/sessions?projectPath=${encodeURIComponent(projectPath)}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }

      const result = await response.json();

      if (result.success && result.data) {
        setSessions(result.data.sessions);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('[ClaudeSessionList] Failed to load sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins === 0 ? 'Just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 24 * 7) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleResumeSession = (sessionId: string) => {
    onResumeSession(sessionId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Claude Sessions
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm">Loading sessions...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={loadSessions}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No Claude sessions found for this project.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Start a conversation to create your first session.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sessions.map((session, index) => (
                    <motion.button
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResumeSession(session.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {session.summary || `Session ${index + 1}`}
                            </h3>
                            {session.messageCount > 0 && (
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <MessageSquare className="w-3 h-3" />
                                {session.messageCount}
                              </span>
                            )}
                          </div>

                          {session.lastUserMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                              {session.lastUserMessage}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(session.lastActivity)}
                            </span>
                            {session.cwd && (
                              <span className="truncate max-w-[150px]">
                                {session.cwd.split('/').pop()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {sessions.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={loadSessions}
                  className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
