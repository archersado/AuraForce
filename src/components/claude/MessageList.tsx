/**
 * MessageList Component
 *
 * Displays the list of all messages in the chat.
 * Auto-scrolls to bottom when new messages arrive.
 */

'use client';

import { useEffect, useRef } from 'react';
import { useClaudeStore } from '@/lib/store/claude-store';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export function MessageList() {
  const messages = useClaudeStore((state) => state.messages);
  const isStreaming = useClaudeStore((state) => state.isStreaming);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Start a new conversation</h3>
          <p className="text-sm max-w-md">
            Ask Claude anything! I can help you write code, analyze text, debug issues, and much more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Show typing indicator when streaming */}
        {isStreaming && <TypingIndicator />}
      </div>
    </div>
  );
}