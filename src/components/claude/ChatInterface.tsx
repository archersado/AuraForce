/**
 * Chat Interface Component
 *
 * Main container for the Claude Code chat UI.
 * Combines header, message list, input, and command preview components.
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaudeStore } from '@/lib/store/claude-store';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { CommandPreview } from './CommandPreview';
import type { TranslationRequest } from '@/lib/claude/types';

export function ChatInterface() {
  const {
    addMessage,
    createSession,
    messages,
    setStreaming,
    clearMessages,
    setPendingCommand,
    setShowCommandPreview,
    confirmCommand,
    cancelCommand,
    pendingCommand,
    showCommandPreview,
    commandHistory,
  } = useClaudeStore();

  const [translationResult, setTranslationResult] = useState<{
    command: any;
    confidence: number;
    alternatives?: any[];
    suggestions?: string[];
  } | null>(null);

  // Initialize session on mount
  useEffect(() => {
    createSession();
  }, [createSession]);

  // Handle new chat
  const handleNewChat = () => {
    createSession();
    clearMessages();
  };

  // Handle settings (placeholder for future implementation)
  const handleSettings = () => {
    console.log('Settings clicked');
  };

  // Translate message to command
  const translateToCommand = async (content: string) => {
    try {
      const response = await fetch('/api/claude/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context: {
            previousCommands: commandHistory.slice(-5), // Include last 5 commands
          },
        } as TranslationRequest),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setTranslationResult(data.data);
        setPendingCommand(data.data.command);
        setShowCommandPreview(true);
      } else {
        // If translation fails, send as raw message
        sendMessageDirectly(content, null);
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Send as raw message on error
      sendMessageDirectly(content, null);
    }
  };

  // Send message directly without translation
  const sendMessageDirectly = (content: string, command: any) => {
    // Add user message
    addMessage({
      role: 'user',
      content,
      command,
    });

    // Add command to history if available
    if (command) {
      confirmCommand(command);
    }

    // Set streaming state
    setStreaming(true);

    // Simulate Claude response (will be replaced with actual API in Story 3.3)
    setTimeout(() => {
      let responseText = 'This is a demonstration response.';

      if (command) {
        responseText = `I understand you want to ${command.action}. ` +
          (command.description || '') +
          '\n\nIn the next story (Story 3.3), this will be replaced with actual Claude Code API responses that execute the translated command.';
      }

      addMessage({
        role: 'assistant',
        content: responseText,
      });
      setStreaming(false);
    }, 1000);
  };

  // Handle message submission
  const handleSendMessage = async (content: string) => {
    // First, translate the message to a command
    await translateToCommand(content);
  };

  // Handle command confirmation from preview
  const handleConfirmCommand = (command: any) => {
    // Get the original user message from pending command or use a default
    const originalContent = command.parameters?.input || command.description;

    // Send the confirmed command
    sendMessageDirectly(originalContent, command);

    // Clear translation state
    setTranslationResult(null);
  };

  // Handle command cancellation
  const handleCancelCommand = () => {
    cancelCommand();
    setTranslationResult(null);
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <ChatHeader onNewChat={handleNewChat} onSettings={handleSettings} />

      {/* Message List */}
      <AnimatePresence>
        <MessageList />
      </AnimatePresence>

      {/* Command Preview */}
      <AnimatePresence>
        {showCommandPreview && pendingCommand && translationResult && (
          <div className="px-4 max-w-4xl mx-auto w-full pb-2">
            <CommandPreview
              command={pendingCommand}
              confidence={translationResult.confidence}
              alternatives={translationResult.alternatives}
              suggestions={translationResult.suggestions}
              onConfirm={handleConfirmCommand}
              onCancel={handleCancelCommand}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Input */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={showCommandPreview || false}
      />
    </motion.div>
  );
}
