/**
 * ChatHeader Component
 *
 * Displays session information and action buttons.
 * Shows session status and provides controls for managing the session.
 */

'use client';

import { useClaudeStore, type Session } from '@/lib/store/claude-store';
import { Plus, Settings, Clock, Play, Pause, Square } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onSettings?: () => void;
}

const statusConfig: Record<Session['status'], { icon: typeof Play; label: string; color: string }> = {
  active: { icon: Play, label: 'Active', color: 'text-green-600' },
  paused: { icon: Pause, label: 'Paused', color: 'text-yellow-600' },
  terminated: { icon: Square, label: 'Terminated', color: 'text-red-600' },
};

export function ChatHeader({ onNewChat, onSettings }: ChatHeaderProps) {
  const currentSession = useClaudeStore((state) => state.currentSession);
  const messages = useClaudeStore((state) => state.messages);

  const session = currentSession;
  const title = session?.title || 'New Chat';
  const messageCount = messages.length;
  const timeString = session?.updatedAt
    ? new Date(session.updatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const statusConfigData = session
    ? statusConfig[session.status]
    : statusConfig.active;
  const StatusIcon = statusConfigData.icon;

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Session info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>

          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            {/* Session status */}
            {session && (
              <div className={`flex items-center gap-1 ${statusConfigData.color}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusConfigData.label}</span>
              </div>
            )}

            {/* Message count */}
            {messageCount > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {messageCount} message{messageCount !== 1 ? 's' : ''} •{' '}
                  {timeString}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            type="button"
            onClick={onNewChat}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="New chat"
            title="New chat"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onSettings}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}