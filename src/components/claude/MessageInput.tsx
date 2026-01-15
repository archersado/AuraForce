/**
 * MessageInput Component
 *
 * Handles user message input with auto-expanding textarea.
 * Supports Enter to send, Shift+Enter for new line, and / for slash commands.
 */

'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { SlashCommandPalette } from './SlashCommandPalette';
import { parseSlashCommand, type SlashCommand } from '@/types/slash-commands';

interface MessageInputProps {
  onSend: (message: string) => void;
  onSlashCommand?: (command: SlashCommand, args: Record<string, string>) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  savingIndicator?: boolean; // Story 3.4 - Session saving status
}

export function MessageInput({
  onSend,
  onSlashCommand,
  disabled,
  isStreaming = false,
  savingIndicator = false,
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Show command palette when user types /
  useEffect(() => {
    if (content.trim().startsWith('/') && content.trim() !== '/') {
      setShowCommandPalette(true);
    } else if (showCommandPalette && !content.trim().startsWith('/')) {
      setShowCommandPalette(false);
    }
  }, [content, showCommandPalette]);

  // Handle slash command selection
  const handleSlashCommand = (command: SlashCommand, args: Record<string, string>) => {
    setShowCommandPalette(false);
    onSlashCommand?.(command, args);
    setContent('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-resize textarea based on content
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Submit message
  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled || isStreaming || savingIndicator) {
      return;
    }

    // Check if it's a slash command
    const parsedCommand = parseSlashCommand(trimmed);
    if (parsedCommand) {
      handleSlashCommand(parsedCommand.command, parsedCommand.args);
      setContent('');
      return;
    }

    // Regular message
    onSend(trimmed);
    setContent('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Slash Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-4xl mx-auto mb-4"
          >
            <SlashCommandPalette
              onClose={() => setShowCommandPalette(false)}
              onSelectCommand={handleSlashCommand}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isStreaming || savingIndicator}
            placeholder={
              savingIndicator
                ? 'Saving session...'
                : isStreaming
                ? 'Receiving response...'
                : 'Type your message...'
            }
            rows={1}
            style={{
              height: '52px',
              minHeight: '52px',
              maxHeight: '200px',
              resize: 'none',
              boxSizing: 'border-box',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
            className="w-full px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
            aria-label="Message input"
          />
          {/* Streaming indicator */}
          {isStreaming && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-purple-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-blue-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-purple-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || disabled || isStreaming || savingIndicator}
          className="h-[52px] w-[52px] flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}