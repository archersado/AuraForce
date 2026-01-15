'use client';

import { useState } from 'react';
import { Trash2, MessageSquare, Clock } from 'lucide-react';
import type { SessionDTO } from '@/types/session';

interface SessionListItemProps {
  session: SessionDTO;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SessionListItem({
  session,
  isActive,
  onClick,
  onDelete,
}: SessionListItemProps) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    if (showDeleteDialog) {
      setShowDeleteDialog(false);
      onDelete();
    } else {
      setShowDeleteDialog(true);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 60000) {
      return 'Just now';
    } else if (diffMs < 3600000) {
      return `${Math.floor(diffMs / 60000)}m ago`;
    } else if (diffMs < 86400000) {
      return `${Math.floor(diffMs / 3600000)}h ago`;
    } else if (diffMs < 604800000) {
      return `${Math.floor(diffMs / 86400000)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <div
        className={`group relative p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${
          isActive ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
        onClick={onClick}
        onMouseEnter={() => setShowDeleteButton(true)}
        onMouseLeave={() => setShowDeleteButton(false)}
      >
        <div className="flex items-start gap-3">
          {/* Status indicator */}
          <div
            className={`mt-1 w-2 h-2 rounded-full ${
              session.status === 'active'
                ? 'bg-green-500'
                : session.status === 'completed'
                ? 'bg-gray-400'
                : 'bg-gray-300'
            }`}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 truncate">{session.title || 'Untitled'}</h4>
              {isActive && (
                <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                  Active
                </span>
              )}
            </div>

            {/* Message Preview (Story 3.6) */}
            {session.lastMessagePreview && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {session.lastMessagePreview}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {session.messageCount || 0} msg
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(session.updatedAt)}
              </span>
            </div>
          </div>

          {/* Delete button - only show on hover for inactive sessions */}
          {!isActive && showDeleteButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick();
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Session?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to delete &ldquo;{session.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}