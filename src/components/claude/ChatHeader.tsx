/**
 * ChatHeader Component
 *
 * Displays session information and action buttons.
 * Shows session status and provides controls for managing the session.
 * Includes WebSocket connection status with latency display and manual reconnect (Story 3.7).
 */

'use client';

import { useClaudeStore, type Session } from '@/lib/store/claude-store';
import type { SessionStatus } from '@/types/session';
import { Plus, Settings, Clock, Play, Pause, Square, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { useWebSocketControls } from '@/lib/claude/websocket-manager';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onSettings?: () => void;
  onShowSessions?: () => void; // Story 3.6 - Show session list panel
  sessionTitle?: string; // Story 3.4 - Session title for display
  onReconnect?: () => void; // Story 3.7 - Manual reconnect callback
}

const statusConfig: Record<SessionStatus, { icon: typeof Play; label: string; color: string }> = {
  active: { icon: Play, label: 'Active', color: 'text-green-600' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-gray-500' },
  aborted: { icon: XCircle, label: 'Aborted', color: 'text-red-600' },
};

export function ChatHeader({ onNewChat, onSettings, onShowSessions, sessionTitle, onReconnect }: ChatHeaderProps) {
  const currentSession = useClaudeStore((state) => state.currentSession);
  const messages = useClaudeStore((state) => state.messages);
  const {
    latency,
    reconnectAttempts,
    maxReconnectAttempts,
    reconnect,
  } = useWebSocketControls();

  const session = currentSession;
  const title = sessionTitle || session?.title || 'New Chat';
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

  // Handle manual reconnect
  const handleReconnect = () => {
    reconnect();
    onReconnect?.();
  };

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
          {/* Connection status indicator (Story 3.7 - WebSocket integration) */}
          <ConnectionStatus
            position="header"
            compact
            latency={latency}
            reconnectAttempts={reconnectAttempts}
            maxReconnectAttempts={maxReconnectAttempts}
            onReconnect={handleReconnect}
          />

          {/* Sessions button (Story 3.6 - Multi-session panel) */}
          <button
            type="button"
            onClick={onShowSessions}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Show sessions"
            title="Show sessions (⌘+⇧+S)"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNewChat}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="New chat"
            title="New chat (⌘+N)"
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