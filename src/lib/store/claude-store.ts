/**
 * Claude Chat Store - Zustand State Management
 *
 * Manages chat interface state including messages, sessions, streaming status,
 * WebSocket connection, and session persistence to database (Story 3.4).
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Command } from '@/lib/claude/types';
import type { ConnectionState, StreamError as StreamErrorType } from '@/lib/claude/types';
import type { SessionDTO, SessionDetailDTO, StoredMessage, ApiError, SessionControlState, SessionStatus, MessageRole } from '@/types/session';
import type { InteractiveMessage } from '@/types/interactive-message';
import type { ToolUseData } from '@/types/tool-use';
import { SessionStorage } from '@/lib/session-storage';
import type { ToolExecution, ToolStatus } from '@/components/claude/ToolCall';
import type { ConnectionStats } from '@/lib/claude/websocket-client';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  streamBuffer?: string;
  streamStartTime?: Date;
  lastChunkTime?: Date;
  command?: Command; // Associated command from translation
  interactive?: InteractiveMessage | null; // Interactive component (e.g., askuserquestions)
  toolExecutions?: ToolExecution[]; // Tool calls associated with this message (legacy, deprecated in favor of toolUseData)
  toolUseData?: ToolUseData; // Tool use data for system messages (new approach)
}

interface Session {
  id: string;
  title: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ClaudeState {
  // State
  messages: Message[];
  currentSession: Session | null;
  isStreaming: boolean;

  // Project context for session isolation
  projectId: string | null;
  projectName: string | null;
  projectPath: string | null;

  // Multi-session management (Story 3.6)
  activeSessionId: string | null;

  // Session control state (Story 3.5)
  sessionControlState: SessionControlState;

  // Session persistence state (Story 3.4)
  sessionsList: SessionDTO[];
  isLoadingSession: boolean;
  isSavingSession: boolean;
  saveError: string | null;
  loadSessionsError: string | null;
  autoSaveTimer: ReturnType<typeof setTimeout> | null;

  // New: Track if current session is persisted to database
  isSessionPersisted: boolean;

  // Claude SDK session ID for multi-turn conversations resumption
  claudeSessionId: string | null;

  // Command-related state
  pendingCommand: Command | null;
  showCommandPreview: boolean;
  commandHistory: Command[];

  // Streaming-connection related state (Story 3.3)
  connectionState: ConnectionState;
  activeStreamId: string | null;
  streamError: StreamErrorType | null;

  // WebSocket state (Story 3.7)
  webSocketLatency: number;
  webSocketReconnectAttempts: number;
  webSocketMaxReconnectAttempts: number;
  webSocketConnectionStats: ConnectionStats | null;
  useWebSocket: boolean; // Toggle between WebSocket and SSE

  // File operation notification state - for workspace auto-navigation
  fileOperation: {
    type: 'create' | 'update' | 'delete' | null;
    filePath: string | null;
    operationId: string | null;
    timestamp: number | null;
  };

  // Actions
  addMessage: (message: Omit<Message, 'timestamp' | 'id'> & Pick<Partial<Message>, 'id'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  updateMessageStreaming: (messageId: string, content: string, isStreaming: boolean) => void;

  // Session actions
  createSession: () => void;
  updateSessionStatus: (status: Session['status']) => void;
  setSession: (session: Session) => void;

  // Session persistence actions (Story 3.4)
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  loadSessionsList: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Auto-save trigger (Story 3.4)
  triggerAutoSave: () => Promise<void>;

  // Session control actions (Story 3.5)
  pauseSession: () => void;
  resumeSession: () => void;
  terminateSession: (reason?: 'user' | 'error' | 'timeout') => Promise<void>;
  setSessionControlState: (state: SessionControlState) => void;

  // Multi-session actions (Story 3.6)
  setActiveSessionId: (sessionId: string | null) => void;
  createNewSession: () => Promise<void>;
  switchToSession: (sessionId: string) => Promise<void>;

  // Command actions
  setPendingCommand: (command: Command | null) => void;
  setShowCommandPreview: (show: boolean) => void;
  confirmCommand: (command: Command) => void;
  cancelCommand: () => void;
  addToCommandHistory: (command: Command) => void;

  // Streaming-connection actions (Story 3.3)
  setConnectionState: (state: ConnectionState) => void;
  setActiveStreamId: (streamId: string | null) => void;
  setStreamError: (error: StreamErrorType | null) => void;
  clearStreamError: () => void;

  // WebSocket actions (Story 3.7)
  setWebSocketLatency: (latency: number) => void;
  setWebSocketReconnectAttempts: (attempts: number) => void;
  setWebSocketConnectionStats: (stats: ConnectionStats | null) => void;
  setUseWebSocket: (useWebSocket: boolean) => void;

  // Project context actions
  setProjectContext: (projectId: string | null, projectName: string | null, projectPath: string | null) => void;

  // Claude SDK session actions
  setClaudeSessionId: (sessionId: string | null) => void;

  // Interactive message actions
  setInteractiveMessage: (messageId: string, interactive: InteractiveMessage) => void;
  resolveInteractiveMessage: (messageId: string, response: unknown) => void;
  clearInteractiveMessage: (messageId: string) => void;

  // Tool execution actions
  createToolExecution: (messageId: string, toolName: string, input?: Record<string, unknown>) => void;
  updateToolExecution: (toolId: string, updates: Partial<ToolExecution>) => void;
  respondToTool: (toolId: string, response: unknown) => void;

  // Clear state
  setStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;

  // File operation actions
  setFileOperation: (operation: 'create' | 'update' | 'delete' | null, filePath: string | null) => void;
  clearFileOperation: () => void;
}

/**
 * Helper function to convert StoredMessage to Message
 *
 * Maps StoredMessage role field to Message type field
 * Note: 'error' type is new, not mapped from storage
 */
function storedMessageToMessage(stored: StoredMessage): Message {
  // role → type mapping (default to 'assistant' for unknown values)
  const type: 'user' | 'assistant' | 'system' | 'error' = stored.role === 'user' || stored.role === 'assistant' || stored.role === 'system'
    ? stored.role
    : 'assistant';

  return {
    id: stored.id,
    type,
    content: stored.content,
    timestamp: new Date(stored.timestamp),
    isStreaming: stored.isStreaming || false,
    command: stored.command,
  };
}

/**
 * Helper function to convert Message to StoredMessage
 * Maps Message type field to StoredMessage role field
 */
function messageToStoredMessage(message: Message): StoredMessage {
  // type → role mapping (default to 'assistant' for unknown values)
  const role: MessageRole = message.type === 'user' || message.type === 'assistant' || message.type === 'system'
    ? message.type
    : 'assistant';

  return {
    id: message.id,
    role,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
    isStreaming: message.isStreaming,
    ...(message.command && { command: message.command }),
  };
}

/**
 * Helper function to convert SessionDTO to Session
 */
function sessionDTOToSession(dto: SessionDTO): Session {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status as Session['status'],
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * Claude chat store using Zustand
 * Supports in-memory state and database persistence (Story 3.4)
 */
export const useClaudeStore = create<ClaudeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      messages: [],
      currentSession: null,
      isStreaming: false,

      // Project context for session isolation
      projectId: null,
      projectName: null,
      projectPath: null,

      // Multi-session initial state (Story 3.6)
      activeSessionId: null,

      // Session control initial state (Story 3.5)
      sessionControlState: 'idle',

      // Session persistence initial state (Story 3.4)
      sessionsList: [],
      isLoadingSession: false,
      isSavingSession: false,
      saveError: null,
      loadSessionsError: null,
      autoSaveTimer: null,
      isSessionPersisted: false,

      // Claude SDK session ID for multi-turn conversations resumption
      claudeSessionId: null,

      // Command-related initial state
      pendingCommand: null,
      showCommandPreview: false,
      commandHistory: [],

      // Streaming-connection related initial state (Story 3.3)
      connectionState: 'disconnected',
      activeStreamId: null,
      streamError: null,

      // WebSocket initial state (Story 3.7)
      webSocketLatency: 0,
      webSocketReconnectAttempts: 0,
      webSocketMaxReconnectAttempts: 3,
      webSocketConnectionStats: null,
      useWebSocket: false, // Start with SSE as default, can toggle to WebSocket

      // File operation notification state
      fileOperation: {
        type: null,
        filePath: null,
        operationId: null,
        timestamp: null,
      },

      // Add a new message to the chat
      addMessage: (messageData) =>
        set((state) => {
          // Check if a message with the same ID already exists
          const existingMessageIndex = state.messages.findIndex(msg => msg.id === messageData.id);

          if (existingMessageIndex !== -1) {
            // Message already exists, skip adding to avoid duplicates
            console.log('[ClaudeStore] Message with ID already exists, skipping:', messageData.id);
            return state;
          }

          // Add new message
          console.log('[ClaudeStore] Adding new message:', messageData.id);
          return {
            messages: [
              ...state.messages,
              {
                ...messageData,
                id: messageData.id || crypto.randomUUID(),
                timestamp: new Date(),
              },
            ],
          };
        }),

      // Update a message's content (for streaming)
      updateMessage: (messageId, content) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
        })),

      // Update streaming message with additional metadata
      updateMessageStreaming: (messageId, content, isStreaming) =>
        set((state) => {
          console.log('[ClaudeStore] updateMessageStreaming:', {
            messageId,
            isStreaming,
            totalMessages: state.messages.length,
          });
          return {
            messages: state.messages.map((msg) => {
              if (msg.id === messageId) {
                console.log(
                  '[ClaudeStore] Updating message:',
                  msg.id,
                  `isStreaming: ${msg.isStreaming} -> ${isStreaming}`
                );
                return {
                  ...msg,
                  content,
                  streamBuffer: content,
                  isStreaming,
                  lastChunkTime: new Date(),
                };
              }
              return msg;
            }),
          };
        }),

      // Create a new chat session (in-memory only, use saveSession for persistence)
      createSession: () =>
        set((state) => {
          const sessionId = crypto.randomUUID();
          const newSession: Session = {
            id: sessionId,
            title: 'New Chat',
            status: 'active' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return {
            ...state,
            currentSession: newSession,
            activeSessionId: sessionId, // Set active session ID (Story 3.6)
            messages: [],
            saveError: null,
            isSessionPersisted: false, // New session not yet persisted
            claudeSessionId: null, // Clear Claude SDK session ID for new session
          };
        }),

      // Update session status (active/paused/terminated)
      updateSessionStatus: (status) =>
        set((state) => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, status, updatedAt: new Date() }
            : null,
        })),

      // Set current session directly
      setSession: (session) =>
        set((state) => ({
          currentSession: session,
          activeSessionId: session?.id || null, // Set active session ID (Story 3.6)
          messages: [], // Clear messages when switching sessions
          saveError: null,
          // If session has a valid UUID (v4), it's likely persisted or will be
          isSessionPersisted: false, // Reset persistence flag on manual set
        })),

      // -------- Session Persistence Actions (Story 3.4) --------

      /**
       * Load a session from database by ID
       * Fetches session details and populates the store with messages
       */
      loadSession: async (sessionId: string) => {
        set({ isLoadingSession: true, loadSessionsError: null });

        try {
          const response = await fetch(`/api/sessions/${sessionId}`);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to load session');
          }

          const result = await response.json();

          if (!result.success || !result.data) {
            throw new Error('Invalid response format');
          }

          const sessionDetail = result.data as SessionDetailDTO;

          // Convert and set session data
          set((state) => ({
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  ...sessionDTOToSession(sessionDetail),
                }
              : sessionDTOToSession(sessionDetail),
            messages: sessionDetail.messages.map(storedMessageToMessage),
            isLoadingSession: false,
            loadSessionsError: null,
            isSessionPersisted: true, // Loaded from database, so persisted
            activeSessionId: sessionDetail.id, // Set active session ID (Story 3.6)
            claudeSessionId: sessionDetail.sessionId || null, // Load Claude SDK session ID for resumption
          }));

          console.log('[ClaudeStore] Session loaded:', sessionDetail.id, 'with', sessionDetail.messages.length, 'messages', 'claudeSessionId:', sessionDetail.sessionId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load session';
          console.error('[ClaudeStore] Error loading session:', error);
          set({
            isLoadingSession: false,
            loadSessionsError: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Save current session state to database
       * Creates new session if not persisted, updates existing otherwise
       */
      saveSession: async () => {
        const { currentSession, messages, isSessionPersisted, projectId } = get();

        if (!currentSession) {
          console.warn('[ClaudeStore] No current session to save');
          return;
        }

        set({ isSavingSession: true, saveError: null });

        try {
          const storedMessages = messages.map(messageToStoredMessage);

          let sessionId: string;

          if (isSessionPersisted) {
            // Update existing session - currentSession.id is the database UUID
            const updateResponse = await fetch(`/api/sessions/${currentSession.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: storedMessages,
              }),
            });

            if (!updateResponse.ok) {
              const error = await updateResponse.json();
              throw new Error(error.error?.message || 'Failed to update session');
            }

            sessionId = currentSession.id;
            console.log('[ClaudeStore] Session updated:', sessionId);
          } else {
            // Create new session with messages and project context
            const createResponse = await fetch('/api/sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: currentSession.title,
                messages: storedMessages,
                projectId, // Include project ID for session isolation
              }),
            });

            if (!createResponse.ok) {
              const error = await createResponse.json();
              throw new Error(error.error?.message || 'Failed to create session');
            }

            const createResult = await createResponse.json();
            sessionId = createResult.data.id;
            console.log('[ClaudeStore] Session created:', sessionId, 'with', storedMessages.length, 'messages', 'projectId:', projectId);
          }

          set({
            isSavingSession: false,
            saveError: null,
            isSessionPersisted: true, // Now persisted
            currentSession: {
              ...currentSession,
              id: sessionId, // Update to database UUID
              updatedAt: new Date(),
            },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save session';
          console.error('[ClaudeStore] Error saving session:', error);
          set({
            isSavingSession: false,
            saveError: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Load list of sessions for current user
       * Optionally filtered by project ID for project-specific sessions (Story 3.6)
       */
      loadSessionsList: async () => {
        try {
          const { projectId: currentProjectId } = get();

          // Build query params - filter by project if one is set
          const params = new URLSearchParams({ limit: '50' });
          if (currentProjectId) {
            params.append('projectId', currentProjectId);
          }

          const response = await fetch(`/api/sessions?${params.toString()}`);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to load sessions list');
          }

          const result = await response.json();

          if (!result.success || !result.data) {
            throw new Error('Invalid response format');
          }

          set({
            sessionsList: result.data.sessions,
            loadSessionsError: null,
          });

          console.log('[ClaudeStore] Sessions list loaded:', {
            count: result.data.sessions.length,
            projectId: currentProjectId,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load sessions list';
          console.error('[ClaudeStore] Error loading sessions list:', error);
          set({
            loadSessionsError: errorMessage,
          });
        }
      },

      /**
       * Trigger auto-save after message or status change
       * Direct save without debounce (debouncing is handled by caller)
       */
      triggerAutoSave: async () => {
        const { currentSession, messages } = get();

        if (!currentSession || messages.length === 0) {
          console.warn('[ClaudeStore] triggerAutoSave skipped:', {
            hasSession: !!currentSession,
            messagesCount: messages.length,
          });
          return;
        }

        console.log('[ClaudeStore] triggerAutoSave called:', {
          sessionId: currentSession.id,
          messagesCount: messages.length,
        });

        // Directly call saveSession (no debounce)
        await get().saveSession();
      },

      // -------- Session Control Actions (Story 3.5) --------

      /**
       * Pause the current streaming session
       * Sets control state to 'paused' and updates session metadata
       */
      pauseSession: () => {
        set({ sessionControlState: 'paused' });
        console.log('[ClaudeStore] Session paused');
      },

      /**
       * Resume a paused streaming session
       * Sets control state back to 'streaming' and updates session metadata
       */
      resumeSession: () => {
        set({ sessionControlState: 'streaming' });
        console.log('[ClaudeStore] Session resumed');
      },

      /**
       * Set session control state directly
       */
      setSessionControlState: (state) => {
        set({ sessionControlState: state });
        console.log('[ClaudeStore] Session control state:', state);
      },

      /**
       * Terminate the current session
       * Updates session status to 'terminated' in database and resets state
       */
      terminateSession: async (reason = 'user') => {
        const { currentSession, isSessionPersisted } = get();

        // Reset local state
        set({
          sessionControlState: 'terminated',
          isStreaming: false,
          activeStreamId: null,
          streamError: null,
        });

        // If session is persisted, update status in database
        if (currentSession && isSessionPersisted) {
          try {
            await fetch(`/api/sessions/${currentSession.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'aborted',
                metadata: {
                  controlState: 'terminated',
                  terminatedAt: new Date().toISOString(),
                  terminatedReason: reason,
                },
              }),
            });
            console.log('[ClaudeStore] Session terminated:', currentSession.id, `reason: ${reason}`);
          } catch (error) {
            console.error('[ClaudeStore] Error terminating session:', error);
          }
        }

        // Clear the current session to allow starting a new one
        set({
          currentSession: null,
          messages: [],
          isSessionPersisted: false,
          sessionControlState: 'idle',
        });

        console.log('[ClaudeStore] Session state reset for new session');
      },

      // -------- Multi-Session Actions (Story 3.6) --------

      /**
       * Set the active session ID (used for session switching)
       * Does NOT load the session - only sets the active session marker
       */
      setActiveSessionId: (sessionId: string | null) => {
        set({ activeSessionId: sessionId });
        console.log('[ClaudeStore] Active session ID set:', sessionId);
      },

      /**
       * Create a new session and switch to it
       */
      createNewSession: async () => {
        const { sessionsList } = get();

        // Create a new session
        get().createSession();

        // Save it to database to get a permanent UUID
        await get().saveSession();

        // Persist the active session ID
        const { currentSession } = get();
        if (currentSession) {
          SessionStorage.setActiveSessionId(currentSession.id);
        }

        // Reload the sessions list to include the new session
        await get().loadSessionsList();

        console.log('[ClaudeStore] New session created and activated:', currentSession?.id);
      },

      /**
       * Switch to an existing session
       * Loads the session messages and sets it as active
       */
      switchToSession: async (sessionId: string) => {
        const { activeSessionId, sessionsList } = get();

        // Verify session exists
        const session = sessionsList.find(s => s.id === sessionId);
        if (!session) {
          console.error('[ClaudeStore] Session not found:', sessionId);
          throw new Error('Session not found');
        }

        // Load the session with its messages
        await get().loadSession(sessionId);
      },

      /**
       * Delete a session from the database
       * Cannot delete the currently active session
       */
      deleteSession: async (sessionId: string) => {
        const { activeSessionId, currentSession, sessionsList } = get();

        // Prevent deleting active session
        if (sessionId === activeSessionId) {
          console.warn('[ClaudeStore] Cannot delete active session:', sessionId);
          throw new Error('Cannot delete active session');
        }

        try {
          const response = await fetch(`/api/sessions/${sessionId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.error?.message || 'Failed to delete session');
          }

          console.log('[ClaudeStore] Session deleted:', sessionId);

          // Reload sessions list
          await get().loadSessionsList();

          // If the deleted session was the current session, switch to another
          if (currentSession?.id === sessionId) {
            const fallbackSession = sessionsList.find(s => s.id !== sessionId);
            if (fallbackSession) {
              await get().loadSession(fallbackSession.id);
            } else {
              // No sessions left, create a new one
              await get().createNewSession();
            }
          }
        } catch (error) {
          console.error('[ClaudeStore] Error deleting session:', error);
          throw error;
        }
      },

      // -------- Command Actions --------

      setPendingCommand: (command) => set({ pendingCommand: command }),

      setShowCommandPreview: (show) => set({ showCommandPreview: show }),

      confirmCommand: (command) =>
        set((state) => ({
          pendingCommand: null,
          showCommandPreview: false,
          commandHistory: [...state.commandHistory, command],
        })),

      cancelCommand: () =>
        set({
          pendingCommand: null,
          showCommandPreview: false,
        }),

      addToCommandHistory: (command) =>
        set((state) => ({
          commandHistory: [...state.commandHistory, command],
        })),

      // -------- Streaming Actions (Story 3.3) --------

      setConnectionState: (connectionState) =>
        set(() => ({ connectionState })),

      setActiveStreamId: (activeStreamId) =>
        set(() => ({ activeStreamId })),

      setStreamError: (streamError) =>
        set(() => ({ streamError })),

      clearStreamError: () =>
        set(() => ({ streamError: null })),

      // -------- WebSocket Actions (Story 3.7) --------

      /**
       * Set current WebSocket latency in milliseconds
       */
      setWebSocketLatency: (latency) =>
        set({ webSocketLatency: latency }),

      /**
       * Set current reconnection attempt count
       */
      setWebSocketReconnectAttempts: (attempts) =>
        set({ webSocketReconnectAttempts: attempts }),

      /**
       * Set complete connection statistics
       */
      setWebSocketConnectionStats: (stats) =>
        set({ webSocketConnectionStats: stats }),

      /**
       * Toggle between WebSocket and SSE transport
       */
      setUseWebSocket: (useWebSocket) => {
        console.log('[ClaudeStore] Transport mode:', useWebSocket ? 'WebSocket' : 'SSE');
        set({ useWebSocket });
      },

      // -------- Project Context Actions --------
      /**
       * Set project context for session isolation
       * Called when entering or switching projects
       */
      setProjectContext: (projectId, projectName, projectPath) => {
        console.log('[ClaudeStore] Setting project context:', { projectId, projectName, projectPath });

        // Clear current session and messages when switching projects
        set({
          projectId,
          projectName,
          projectPath,
          messages: [],
          currentSession: null,
          activeSessionId: null,
          isStreaming: false,
        });

        // Optionally load sessions for the new project
        if (projectId) {
          get().loadSessionsList();
        }
      },

      // -------- Claude SDK Session Actions --------
      /**
       * Set Claude SDK session ID for multi-turn conversations
       * This ID is used to resume conversations when sending new messages
       */
      setClaudeSessionId: (sessionId) => {
        console.log('[ClaudeStore] Setting Claude SDK session ID:', sessionId);
        set({ claudeSessionId: sessionId });

        // Also save to database if we have a persisted session
        if (sessionId && get().isSessionPersisted && get().currentSession) {
          const { currentSession } = get();
          fetch(`/api/sessions/${currentSession?.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                console.log('[ClaudeStore] Claude SDK session ID saved to database:', sessionId);
              }
            })
            .catch(err => {
              console.error('[ClaudeStore] Failed to save Claude SDK session ID to database:', err);
            });
        }
      },

      // -------- Interactive Message Actions --------

      /**
       * Set or update interactive message on a message
       */
      setInteractiveMessage: (messageId, interactive) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, interactive } : msg
          ),
        })),

      /**
       * Mark interactive message as resolved with the user's response
       */
      resolveInteractiveMessage: (messageId, response) =>
        set((state) => {
          // First, mark the message as resolved
          const updatedMessages = state.messages.map((msg) =>
            msg.id === messageId && msg.interactive
              ? { ...msg, interactive: { ...msg.interactive, isResolved: true } }
              : msg
          );

          // Then, add the response as a new user message
          const toolId = state.messages.find((m) => m.id === messageId)?.interactive?.toolId;
          const responseMessage: Message = {
            id: crypto.randomUUID(),
            type: 'user',
            content: JSON.stringify(
              {
                toolId,
                response,
              },
              null,
              2
            ),
            timestamp: new Date(),
          };

          return {
            messages: [...updatedMessages, responseMessage],
          };
        }),

      /**
       * Clear interactive message from a message
       */
      clearInteractiveMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, interactive: null } : msg
          ),
        })),

      // -------- Tool Execution Actions --------

      /**
       * Create a new tool execution for a message
       */
      createToolExecution: (messageId, toolName, input) =>
        set((state) => ({
          messages: state.messages.map((msg) => {
            if (msg.id === messageId) {
              const toolExecution: ToolExecution = {
                toolId: crypto.randomUUID(),
                toolName,
                startTime: new Date(),
                status: 'pending',
                input,
              };

              return {
                ...msg,
                toolExecutions: [...(msg.toolExecutions || []), toolExecution],
              };
            }
            return msg;
          }),
        })),

      /**
       * Update tool execution status, output, error, etc.
       */
      updateToolExecution: (toolId, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) => {
            if (!msg.toolExecutions) return msg;

            const updatedExecutions = msg.toolExecutions.map((exec) => {
              if (exec.toolId === toolId) {
                return {
                  ...exec,
                  ...updates,
                };
              }
              return exec;
            });

            return {
              ...msg,
              toolExecutions: updatedExecutions,
            };
          }),
        })),

      /**
       * Respond to an interactive tool (AskUserQuestions, Todo, etc.)
       */
      respondToTool: (toolId, response) =>
        set((state) => {
          return {
            messages: state.messages.map((msg) => {
              if (!msg.toolExecutions) return msg;

              const updatedExecutions = msg.toolExecutions.map((exec): ToolExecution => {
                if (exec.toolId === toolId) {
                  return {
                    ...exec,
                    userResponse: response,
                    status: 'completed' as ToolStatus,
                    endTime: new Date(),
                  };
                }
                return exec as ToolExecution;
              });

              return {
                ...msg,
                toolExecutions: updatedExecutions,
              };
            }),
          };
        }),

      // -------- Common Actions --------

      setStreaming: (isStreaming) => set({ isStreaming }),

      clearMessages: () => set({ messages: [] }),

      // -------- File Operation Actions --------

      /**
       * Set a file operation notification
       * This triggers workspace navigation to show the affected file
       */
      setFileOperation: (operation, filePath) => {
        console.log('[ClaudeStore] File operation:', { operation, filePath });
        set({
          fileOperation: {
            type: operation,
            filePath,
            operationId: operation ? crypto.randomUUID() : null,
            timestamp: operation ? Date.now() : null,
          },
        });

        // Auto-clear after 10 seconds to avoid stale notifications
        if (operation && filePath) {
          setTimeout(() => {
            get().clearFileOperation();
          }, 10000);
        }
      },

      /**
       * Clear the current file operation notification
       */
      clearFileOperation: () => {
        set({
          fileOperation: {
            type: null,
            filePath: null,
            operationId: null,
            timestamp: null,
          },
        });
      },
    }),
    { name: 'ClaudeStore' }
  )
);

// Re-export ToolUseData for backward compatibility
export type { ToolUseData } from '@/types/tool-use';

// Re-export types for convenience
export type { Message, Session };
