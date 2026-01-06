/**
 * MessageBubble Component
 *
 * Renders an individual message bubble with markdown support and syntax highlighting.
 * Supports user and assistant messages with different styling.
 */

'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { type Message } from '@/lib/store/claude-store';

interface MessageBubbleProps {
  message: Message;
}

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

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
          max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3
          ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
              : isAssistant
              ? 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
              : 'bg-gray-800 text-gray-300 rounded-md text-xs'
          }
        `}
        role="article"
        aria-label={`${message.role} message`}
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
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Code blocks with syntax highlighting
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;

                return !isInline && match ? (
                  <div className="my-2 rounded-lg overflow-hidden bg-gray-900">
                    <SyntaxHighlighter
                      language={match[1]}
                      style={vscDarkPlus as React.CSSProperties}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className={`
                      ${className || ''}
                      ${
                        isUser
                          ? 'bg-purple-500/30 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }
                      px-1 py-0.5 rounded text-sm font-mono
                    `}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Paragraphs
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">{children}</p>
              ),
              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2">{children}</ol>
              ),
              // Links
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isUser ? 'text-purple-200' : 'text-blue-600 underline'}
                >
                  {children}
                </a>
              ),
              // Blockquotes
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-400 pl-4 italic my-2">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Streaming indicator */}
        {message.isStreaming && (
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ▊
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
