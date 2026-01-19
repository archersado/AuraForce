/**
 * MessageBubble Component
 *
 * Renders an individual message bubble with markdown support and syntax highlighting.
 * Supports user and assistant messages with different styling.
 * System messages with toolUseData render as independent tool execution bubbles.
 */

'use client';

import { motion } from 'framer-motion';
import { MarkdownRenderer } from '@/components/claude/MarkdownRenderer';
import { InteractiveMessage } from '@/components/claude/InteractiveMessage';
import { ToolMessageBubble } from '@/components/claude/ToolMessageBubble';
import { ToolUse, ToolUseInline } from '@/components/claude/ToolUse';
import { ToolCall } from '@/components/claude/ToolCall';
import { Message } from '@/lib/store/claude-store';

interface MessageBubbleProps {
  message: Message;
  onInteractiveResponse?: (messageId: string, response: unknown) => void;
  onToolResponse?: (toolId: string, response: unknown) => void;
  isStreamingBlocked?: boolean;  // Block interactive responses during streaming
}

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function MessageBubble({ message, onInteractiveResponse, onToolResponse, isStreamingBlocked = false }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';
  const isSystem = message.type === 'system';

  // If this is a system message with tool use data, render as a tool message bubble
  if (isSystem && message.toolUseData) {
    return (
      <motion.div
        className="flex justify-start mb-3"
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <ToolMessageBubble toolUseData={message.toolUseData} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3
          ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
              : isAssistant
              ? 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
              : 'bg-gray-800 text-gray-300 rounded-md text-xs'
          }
        `}
        role="article"
        aria-label={`${message.type} message`}
      >
        {/* Message header with timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold opacity-70">
            {isUser ? 'You' : isAssistant ? 'Claude' : 'System'}
          </span>
          <span className="text-xs opacity-50">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {/* Command badge for user messages with commands */}
          {isUser && message.command && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {message.command.type}
            </span>
          )}
        </div>

        {/* Message content with markdown rendering */}
        <div className="prose prose-sm max-w-none overflow-auto">
          <MarkdownRenderer
            content={message.content}
            isStreaming={message.isStreaming}
            isUserMessage={isUser}
          />
        </div>

        {/* Tool executions */}
        {message.toolExecutions && message.toolExecutions.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.toolExecutions.map((toolExecution) => (
              <ToolCall
                key={toolExecution.toolId}
                execution={toolExecution}
                onToolResponse={onToolResponse}
              />
            ))}
          </div>
        )}

        {/* Interactive message component (askuserquestions, confirm, etc.) */}
        {message.interactive && !message.isStreaming && (
          <div className={`mt-3 ${isUser ? 'self-end' : 'self-start'}`}>
            <InteractiveMessage
              message={message.interactive}
              onResponse={(response) => {
                if (onInteractiveResponse) {
                  onInteractiveResponse(message.id, response);
                }
              }}
              disabled={isStreamingBlocked}
            />
          </div>
        )}

        {/* Streaming indicator and cursor */}
        {message.isStreaming && (
          <div className="flex items-center gap-1">
            <motion.span
              className="inline-block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ▊
            </motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
