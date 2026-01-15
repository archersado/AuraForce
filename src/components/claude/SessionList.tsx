'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, X, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaudeStore } from '@/lib/store/claude-store';
import { SessionListItem } from './SessionListItem';
import type { SessionDTO } from '@/types/session';

interface SessionListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionList({ isOpen, onClose }: SessionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'activity' | 'messages'>('date');
  const [isSwitching, setIsSwitching] = useState(false);

  const {
    sessionsList,
    activeSessionId,
    isLoadingSession,
    loadSessionsList,
    createNewSession,
    switchToSession,
    deleteSession,
  } = useClaudeStore();

  // Load sessions list on first open
  useEffect(() => {
    if (isOpen && sessionsList.length === 0) {
      loadSessionsList();
    }
  }, [isOpen, sessionsList.length, loadSessionsList]);

  const filteredSessions = sessionsList
    .filter((session) => {
      const matchesSearch =
        searchTerm === '' ||
        session.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by created date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'activity') {
        // Sort by updated date (most recent first)
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        // Sort by message count (most messages first)
        return (b.messageCount || 0) - (a.messageCount || 0);
      }
    });

  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === activeSessionId) return;

    // Prevent concurrent session switches
    if (isLoadingSession || isSwitching) {
      console.warn('[SessionList] Session switching in progress, please wait');
      return;
    }

    setIsSwitching(true);
    try {
      await switchToSession(sessionId);
      onClose();
    } catch (error) {
      console.error('[SessionList] Error switching session:', error);
      alert('Failed to load session. Please try again.');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      await createNewSession();
      onClose();
    } catch (error) {
      console.error('[SessionList] Error creating new session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error('[SessionList] Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Session List Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
                </div>
                <button
                  onClick={onClose}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  tabIndex={0}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* New Session Button */}
              <button
                onClick={handleCreateNewSession}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCreateNewSession();
                  }
                }}
              >
                <Plus className="w-5 h-5" />
                <span>New Session</span>
              </button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus={false}
                />
              </div>

              {/* Sort Options */}
              {sessionsList.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="text-blue-600 bg-transparent border-none focus:outline-none cursor-pointer hover:underline font-medium"
                  >
                    <option value="date">Date</option>
                    <option value="activity">Activity</option>
                    <option value="messages">Messages</option>
                  </select>
                </div>
              )}
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8">
                  {sessionsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Folder className="w-12 h-12" />
                      <p className="text-sm">No sessions yet</p>
                      <button
                        onClick={() => {
                          handleCreateNewSession();
                          onClose();
                        }}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium hover:underline"
                      >
                        Start a new conversation
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No matching sessions
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSessions.map((session, index) => (
                    <SessionListItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => handleSelectSession(session.id)}
                      onDelete={() => handleDeleteSession(session.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {sessionsList.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                {sessionsList.length} session{sessionsList.length !== 1 ? 's' : ''} available
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}