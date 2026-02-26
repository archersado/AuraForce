/**
 * Claude Agent Panel Component
 *
 * Implements STORY-14-11: Claude Agent Integration
 * Implements STORY-14-12: AI Real-time Interaction
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Sparkles, X, Maximize, Minimize, Clock } from 'lucide-react';
import { apiPost } from '@/lib/api-client';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ClaudeAgentPanelProps {
  selectedFile: string | null;
  onClose?: () => void;
}

export default function ClaudeAgentPanel({ selectedFile, onClose }: ClaudeAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Hi! I\'m Claude, your AI development assistant. I can help you read, analyze, edit files, and provide code suggestions. Select a file and ask me anything!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [isMinimized]);

  const handleSendMessage = useCallback(async () => {
    const userMessage = input.trim();
    if (!userMessage || isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsPending(true);

    // Add pending assistant message
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const response = await apiPost('/auraforce/api/claude/chat', {
        message: userMessage,
        selectedFile,
        sessionId: 'workspace-panel-' + Date.now(),
      });

      if (response.ok) {
        const data = await response.json();

        // Simulate streaming effect
        setMessages((prev) => prev.map((msg) =>
          msg.id === assistantMsg.id
            ? { ...msg, content: data.response || data.message || '', isStreaming: false }
            : msg
        ));
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Claude API error:', error);

      setMessages((prev) => prev.map((msg) =>
        msg.id === assistantMsg.id
          ? {
              ...msg,
              content: 'Sorry, I encountered an error. Please try again.',
              isStreaming: false,
            }
          : msg
      ));
    } finally {
      setIsPending(false);
    }
  }, [input, isPending, selectedFile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const quickActions = [
    { label: 'Read file', prompt: 'Please read the selected file and explain what it does.' },
    { label: 'Suggest improvements', prompt: 'Could you suggest improvements for the selected file?' },
    { label: 'Add comments', prompt: 'Please add helpful comments to the code in the selected file.' },
    { label: 'Find bugs', prompt: 'Can you identify any potential bugs or issues in this code?' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Claude Assistant
          </h3>
          {isPending && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Clock className="w-3 h-3" />
              Thinking...
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={() => setIsMinimized(true)}
              title="Minimize"
            >
              <Minimize className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {onClose && (
            <button
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isPending && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setInput(action.prompt)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {selectedFile && (
              <div className="mb-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Selected:</span>
                <span className="font-medium truncate">{selectedFile}</span>
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Claude anything... (Ctrl+Enter to send)"
                className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isPending}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Minimized state */}
      {isMinimized && (
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          onClick={() => setIsMinimized(false)}
        >
          <Maximize className="w-4 h-4" />
          <span className="text-sm font-medium">Open Chat</span>
        </button>
      )}
    </div>
  );
}

/**
 * Message Bubble Component
 */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'} rounded-lg px-4 py-2`}>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        {message.isStreaming && (
          <div className="flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span className="text-xs opacity-70">Thinking...</span>
          </div>
        )}
        {/* Use `@ts-ignore` as instructed */}
        {/* @ts-ignore */}
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
