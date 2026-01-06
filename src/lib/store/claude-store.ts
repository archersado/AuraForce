/**
 * Claude Chat Store - Zustand State Management
 *
 * Manages chat interface state including messages, sessions, and streaming status.
 * This prepares the foundation for websocket integration in later stories.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Command } from '@/lib/claude/types';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  command?: Command; // Associated command from translation
}

interface Session {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

interface ClaudeState {
  // State
  messages: Message[];
  currentSession: Session | null;
  isStreaming: boolean;

  // Command-related state
  pendingCommand: Command | null;
  showCommandPreview: boolean;
  commandHistory: Command[];

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  createSession: () => void;
  updateSessionStatus: (status: Session['status']) => void;
  setStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;

  // Command actions
  setPendingCommand: (command: Command | null) => void;
  setShowCommandPreview: (show: boolean) => void;
  confirmCommand: (command: Command) => void;
  cancelCommand: () => void;
  addToCommandHistory: (command: Command) => void;
}

/**
 * Claude chat store using Zustand
 * Stores all chat state in memory for now, will persist to database in future stories
 */
export const useClaudeStore = create<ClaudeState>()(
  devtools(
    (set) => ({
      // Initial state
      messages: [],
      currentSession: null,
      isStreaming: false,

      // Command-related initial state
      pendingCommand: null,
      showCommandPreview: false,
      commandHistory: [],

      // Add a new message to the chat
      addMessage: (messageData) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...messageData,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),

      // Update a message's content (for streaming)
      updateMessage: (messageId, content) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
        })),

      // Create a new chat session
      createSession: () =>
        set(() => ({
          currentSession: {
            id: crypto.randomUUID(),
            title: 'New Chat',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          messages: [],
        })),

      // Update session status (active/paused/terminated)
      updateSessionStatus: (status) =>
        set((state) => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, status, updatedAt: new Date() }
            : null,
        })),

      // Set streaming state
      setStreaming: (isStreaming) => set({ isStreaming }),

      // Clear all messages
      clearMessages: () => set({ messages: [] }),

      // Set pending command for preview
      setPendingCommand: (command) => set({ pendingCommand: command }),

      // Show/hide command preview
      setShowCommandPreview: (show) => set({ showCommandPreview: show }),

      // Confirm and send command
      confirmCommand: (command) =>
        set((state) => ({
          pendingCommand: null,
          showCommandPreview: false,
          commandHistory: [...state.commandHistory, command],
        })),

      // Cancel command preview
      cancelCommand: () =>
        set({
          pendingCommand: null,
          showCommandPreview: false,
        }),

      // Add command to history
      addToCommandHistory: (command) =>
        set((state) => ({
          commandHistory: [...state.commandHistory, command],
        })),
    }),
    { name: 'ClaudeStore' }
  )
);

// Re-export types for convenience
export type { Message, Session };
