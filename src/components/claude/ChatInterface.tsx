/**
 * Chat Interface Component
 *
 * Main container for the Claude Code chat UI.
 * Combines header, message list, input, command preview, and streaming components.
 * Supports session persistence (Story 3.4).
 *
 * Uses WebSocket for streaming responses with SSE fallback when WebSocket is unavailable (Story 3.7).
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useClaudeStore } from '@/lib/store/claude-store';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ConnectionStatus, ConnectionWarning } from './ConnectionStatus';
import { StreamErrorNotification } from './StreamError';
import { SessionControlButtons } from './SessionControlButtons';
import { TerminateDialog } from './TerminateDialog';
import { SessionList } from './SessionList';
import { RunningToolIndicator } from './RunningToolIndicator';
import { useWebSocketManager, useWebSocketControls } from '@/lib/claude/websocket-manager';
import type { StreamChunk, StreamStart, StreamEnd, StreamError as StreamErrorType } from '@/lib/claude/types';
import { createStreamManager } from '@/lib/claude/stream-manager';
import { SessionStorage } from '@/lib/session-storage';
import type { SlashCommand } from '@/types/slash-commands';
import type { ToastProps } from '@/components/ui/Toast';

interface ChatInterfaceProps {
  projectPath?: string;
  projectId?: string;
  projectName?: string;
}

export function ChatInterface({ projectPath, projectId, projectName }: ChatInterfaceProps) {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get('session');

  const {
    addMessage,
    updateMessageStreaming,
    createSession,
    messages,
    isStreaming,
    setStreaming,
    clearMessages,
    setConnectionState,
    activeStreamId,
    setActiveStreamId,
    setStreamError,
    clearStreamError,
    // Session persistence (Story 3.4)
    currentSession,
    loadSession,
    isLoadingSession,
    isSavingSession,
    saveError,
    triggerAutoSave,
    isSessionPersisted,
    // Interactive messages
    setInteractiveMessage,
    resolveInteractiveMessage,
    // Session control (Story 3.5)
    sessionControlState,
    pauseSession,
    resumeSession,
    terminateSession,
    setSessionControlState,
    // Multi-session (Story 3.6)
    createNewSession,
    // Tool execution (new)
    createToolExecution,
    updateToolExecution,
    // WebSocket state (Story 3.7)
    useWebSocket,
    // Project context
    setProjectContext,
  } = useClaudeStore();

  const [toasts, setToasts] = useState<Array<{ id: string } & ToastProps>>([]);

  const showToast = useCallback((type: ToastProps['type'], message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  // Terminate dialog state (Story 3.5)
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);

  // Session list panel state (Story 3.6 - Multi-session)
  const [showSessionList, setShowSessionList] = useState(false);

  // Track active tool execution for handling tool_use events
  const [currentToolMap] = useState<Map<string, { toolName: string; input: any; toolId: string; message_id?: string }>>(new Map());

  // Current running tool for UI display (temporary state that disappears on completion)
  const [currentRunningTool, setCurrentRunningTool] = useState<{ toolName: string; status: 'running' | 'completed' } | null>(null);

  // Store Claude SDK session ID for multi-turn conversations
  const claudeSessionIdRef = useRef<string | null>(null);

  // WebSocket manager integration (Story 3.7)
  const { sendChatRequest: sendWebSocketRequest, isWebSocketEnabled, resetClaudeSession: resetWebSocketClaudeSession } = useWebSocketManager({
    projectPath,
    projectId,
    projectName,
    onStreamStart: (start) => {
      streamManagerRef.current?.handleStreamStart(start);
    },
    onStreamChunk: (chunk) => {
      streamManagerRef.current?.handleStreamChunk(chunk, activeStreamId || undefined);
    },
    onStreamEnd: (end) => {
      streamManagerRef.current?.handleStreamEnd(end);
    },
    onStreamError: (error) => {
      setStreamError(error);
      setStreaming(false);
      setActiveStreamId(null);
      setConnectionState('error');
    },
    onFallbackToSSE: () => {
      // Auto-fallback to SSE when WebSocket fails
      console.log('[ChatInterface] Falling back to SSE');
    },
  });

  const { latency, reconnectAttempts, maxReconnectAttempts, reconnect } = useWebSocketControls();

  // Handle pause (Story 3.5)
  const handlePause = useCallback(() => {
    pauseSession();
    streamManagerRef.current?.pauseStream();
    showToast('info', 'Session paused');
  }, [pauseSession, showToast]);

  // Handle resume (Story 3.5)
  const handleResume = useCallback(() => {
    resumeSession();
    streamManagerRef.current?.resumeStream();
    showToast('info', 'Session resumed');
  }, [resumeSession, showToast]);

  // Handle terminate (Story 3.5)
  const handleTerminate = useCallback(async () => {
    setShowTerminateDialog(false);
    await terminateSession('user');
    showToast('info', 'Session terminated');
    // Reset Claude SDK session ID and start a new session
    claudeSessionIdRef.current = null;
    resetWebSocketClaudeSession?.();
    createSession();
    clearMessages();
  }, [terminateSession, showToast, createSession, clearMessages, resetWebSocketClaudeSession]);

  const streamManagerRef = useRef<ReturnType<typeof createStreamManager> | null>(null);

  // Initialize stream manager
  useEffect(() => {
    streamManagerRef.current = createStreamManager({
      onMessageUpdate: (message) => {
        updateMessageStreaming(message.id, message.content, message.isStreaming || false);
      },
      onStreamError: (error) => {
        setStreamError(error);
        setStreaming(false);
        setActiveStreamId(null);
      },
      onConnectionStateChange: (state) => {
        setConnectionState(state);
      },
      onStreamStateChange: (state, previousState) => {
        // Sync stream state with store
        if (state === 'active') {
          setSessionControlState('streaming');
        } else if (state === 'paused') {
          setSessionControlState('paused');
        } else if (state === 'completed' || state === 'error') {
          setSessionControlState('idle');
          setStreaming(false);
          setActiveStreamId(null);
          console.log('[ChatInterface] Stream completed, cleared activeStreamId');
        }
      },
    });

    return () => {
      streamManagerRef.current?.destroy();
    };
  }, [updateMessageStreaming, setStreaming, setConnectionState, setStreamError, setSessionControlState, setActiveStreamId]);

  // Initialize session on mount or when URL changes (Story 3.4)
  // Also handles auto-restoring project sessions when entering a workspace
  useEffect(() => {
    async function initializeSession() {
      // Priority order:
      // 1. URL param session
      // 2. Latest project session (if projectId is set)
      // 3. localStorage active session
      // 4. Create new session

      const targetSessionId = sessionIdParam || SessionStorage.getActiveSessionId();

      // If we have a URL session explicitly set, use that
      if (sessionIdParam) {
        try {
          await loadSession(sessionIdParam);
          SessionStorage.setActiveSessionId(sessionIdParam);
          console.log('[ChatInterface] Loaded session from URL param:', sessionIdParam);
        } catch (error) {
          console.error('[ChatInterface] Failed to load URL session:', error);
          SessionStorage.clearActiveSessionId();
          createSession();
        }
        return;
      }

      // If we have a projectId, try to load the latest session for that project
      if (projectId) {
        try {
          const response = await fetch(`/api/sessions/project/${projectId}/latest`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              await loadSession(data.data.id);
              SessionStorage.setActiveSessionId(data.data.id);
              console.log('[ChatInterface] Loaded latest session for project:', projectId, 'session:', data.data.id);
              return;
            }
          }
        } catch (error) {
          console.error('[ChatInterface] Failed to load project session:', error);
        }
        // If no project session exists or loading fails, fall through to create new session
      }

      // Otherwise, use localStorage or create new
      if (targetSessionId) {
        try {
          await loadSession(targetSessionId);
          console.log('[ChatInterface] Loaded session from localStorage:', targetSessionId);
        } catch (error) {
          console.error('[ChatInterface] Failed to load localStorage session:', error);
          SessionStorage.clearActiveSessionId();
          createSession();
        }
      } else {
        createSession();
      }
    }

    initializeSession();
  }, [sessionIdParam, projectId, loadSession, createSession]);

  // Update project context when project changes
  useEffect(() => {
    setProjectContext(projectId || null, projectName || null, projectPath || null);
  }, [projectId, projectName, projectPath, setProjectContext]);

  // Auto-save session after messages change (Story 3.4)
  useEffect(() => {
    if (messages.length > 0 && !activeStreamId) {
      // Trigger auto-save when streaming is complete and we have messages
      console.log('[ChatInterface] Triggering auto-save:', {
        messagesCount: messages.length,
        activeStreamId,
        currentSessionId: currentSession?.id,
        isSessionPersisted,
      });

      const timeoutId = setTimeout(async () => {
        try {
          console.log('[ChatInterface] Executing saveSession...');
          const currentMessages = useClaudeStore.getState().messages;
          console.log('[ChatInterface] Messages to save:', currentMessages.length);
          await triggerAutoSave();
          console.log('[ChatInterface] Session auto-saved successfully');
        } catch (error) {
          console.error('[ChatInterface] Auto-save failed:', error);
          // Don't show toast for auto-save errors to avoid annoying user
        }
      }, 1000); // Debounce 1 second after message is added

      return () => clearTimeout(timeoutId);
    } else {
      console.log('[ChatInterface] Auto-save skipped:', {
        messagesCount: messages.length,
        activeStreamId,
        reason: messages.length === 0 ? 'no messages' : 'stream still active',
      });
    }
  }, [messages, activeStreamId, triggerAutoSave, currentSession?.id, isSessionPersisted]);

  // Show save error toast (Story 3.4)
  useEffect(() => {
    if (saveError) {
      showToast('error', saveError);
    }
  }, [saveError, showToast]);

  // Handle connection retry (Story 3.7 - WebSocket reconnection)
  const handleRetryConnection = useCallback(() => {
    console.log('[ChatInterface] Retry connection requested');
    clearStreamError();

    // Try WebSocket reconnection first
    if (useWebSocket) {
      reconnect();
    } else {
      // For SSE fallback, just reset connection state
      setConnectionState('connecting');
    }
  }, [setConnectionState, clearStreamError, reconnect, useWebSocket]);

  // Handle new chat
  const handleNewChat = () => {
    createSession();
    clearMessages();
    // Reset Claude SDK session ID to start fresh
    claudeSessionIdRef.current = null;
    resetWebSocketClaudeSession?.();
  };

  // Handle show session list panel (Story 3.6)
  const handleShowSessions = () => {
    setShowSessionList(true);
  };

  // Keyboard shortcuts (Story 3.6 - Multi-session)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + S: Toggle session list panel
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        setShowSessionList((prev) => !prev);
      }
      // Cmd/Ctrl + N: New session
      else if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      // Escape: Close session list panel
      else if (e.key === 'Escape' && showSessionList) {
        setShowSessionList(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSessionList, handleNewChat]);

  // Handle settings (placeholder for future implementation)
  const handleSettings = () => {
    console.log('Settings clicked');
  };

  // Stream message from SSE endpoint
  const streamMessage = async (content: string, assistantMessageId: string): Promise<void> => {
    setStreaming(true);
    setActiveStreamId(assistantMessageId);
    setConnectionState('connecting');

    try {
      // Get the current Claude SDK session ID for multi-turn conversation
      const claudeSessionId = claudeSessionIdRef.current;

      const response = await fetch('/api/claude/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          model: 'sonnet',
          permissionMode: 'bypassPermissions',
          sessionId: claudeSessionId, // Pass Claude session ID for multi-turn conversation context
          projectPath,
          projectId,
          projectName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setConnectionState('connected');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No body reader available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data:')) continue;

          try {
            const jsonData = JSON.parse(line.slice(6));

            // Handle status message
            if (jsonData.type === 'status') {
              setConnectionState('connected');
              streamManagerRef.current?.handleStreamStart({
                messageId: assistantMessageId,
                timestamp: new Date(jsonData.timestamp || Date.now()),
              });
            }
            // Handle session created (multi-turn conversation support)
            else if (jsonData.type === 'session-created') {
              console.log('[ChatInterface] Claude SDK session created:', jsonData.sessionId);
              // Store Claude SDK session ID for future multi-turn conversation
              claudeSessionIdRef.current = jsonData.sessionId;
            }
            // Handle Claude response (streaming content)
            else if (jsonData.type === 'claude-response') {
              const sdkMessage = jsonData.data;

              // Log the received message for debugging
              console.log('[ChatInterface] Received claude-response message:', JSON.stringify(sdkMessage, null, 2));

              // Skip system messages
              if (sdkMessage.type === 'system') {
                console.log('[ChatInterface] Skipping system message');
                continue;
              }

              if (!streamManagerRef.current) {
                console.error('[ChatInterface] streamManagerRef.current is null!');
                continue;
              }

              // NEW: Handle raw text content from assistant messages
              // The SDK sends messages with `type: 'assistant'` or as complete messages
              if (sdkMessage.type === 'assistant' && sdkMessage.message) {
                const content = sdkMessage.message.content;
                if (content && Array.isArray(content)) {
                  // Extract text from content blocks
                  const textBlocks = content
                    .filter((block: any) => block.type === 'text')
                    .map((block: any) => block.text || '');

                  if (textBlocks.length > 0) {
                    const fullText = textBlocks.join('\n');
                    console.log('[ChatInterface] Displaying assistant message content, length:', fullText.length);
                    const chunk: StreamChunk = {
                      content: fullText,
                      isComplete: true,
                    };
                    streamManagerRef.current?.handleStreamChunk(chunk, assistantMessageId);
                  }
                }
              }
              // Handle message content (NOTE: this is the COMPLETE final content, NOT incremental)
              // Skip this for streaming - we only use stream_event for incremental updates
              else if (sdkMessage.message && sdkMessage.message.content) {
                console.log('[ChatInterface] Skipping message.content (complete content), will use stream_event for incremental updates');
                // 跳过 message.content，因为这是完整的最后内容
                // 如果使用它会导致重复，增量内容已经通过 stream_event 发送了
                continue;
              }
                // Handle streaming text deltas
              else if (sdkMessage.type === 'stream_event' && sdkMessage.event) {
                const event = sdkMessage.event as any;

                // Handle content_block_start - tool_use or text starts
                if (event.type === 'content_block_start') {
                  const block = event.content_block;
                  if (block && block.type === 'tool_use') {
                    const toolName = block.name || 'unknown';
                    const toolInput = block.input || {};
                    const toolId = block.id || crypto.randomUUID();

                    console.log('[ChatInterface] Tool use started:', toolName, 'with input:', JSON.stringify(toolInput));

                    // Set current running tool for UI display (temporary state)
                    setCurrentRunningTool({ toolName, status: 'running' });

                    // Track this tool in the map
                    currentToolMap.set(toolId, { toolName, input: toolInput, toolId });
                  }
                }
                // Handle content_block_delta - incremental updates
                else if (event.type === 'content_block_delta') {
                  const delta = event.delta as { type?: string; partial_json?: string; text?: string; };

                  if (delta.type === 'text_delta' && delta.text) {
                    console.log('[ChatInterface] Adding content_block_delta chunk (text), length:', delta.text.length);
                    const chunk: StreamChunk = {
                      content: delta.text,
                      isComplete: false,
                    };
                    streamManagerRef.current?.handleStreamChunk(chunk, assistantMessageId);
                  }
                }
                // Handle content_block_stop - tool or text block ends
                else if (event.type === 'content_block_stop') {
                  console.log('[ChatInterface] Content block stopped');
                  // Mark tool as completed, then after a short delay remove the running tool bubble
                  setCurrentRunningTool({ toolName: currentRunningTool?.toolName || 'Unknown', status: 'completed' });

                  // Remove the running tool bubble after completion animation
                  setTimeout(() => {
                    setCurrentRunningTool(null);
                  }, 500);
                }
              }
            }
            // Handle stream completion
            else if (jsonData.type === 'claude-complete') {
              streamManagerRef.current?.handleStreamEnd({
                messageId: assistantMessageId,
                timestamp: new Date(jsonData.timestamp || Date.now()),
                finalContent: '',
              });
              setStreaming(false);
              setActiveStreamId(null);
              // Clear tool map
              currentToolMap.clear();
            }
            // Handle stream error
            else if (jsonData.type === 'claude-error') {
              streamManagerRef.current?.handleStreamError({
                messageId: assistantMessageId,
                errorCode: 'CLAUDE_ERROR',
                message: jsonData.error || 'Claude API error',
                retryable: true,
              });
              setStreaming(false);
              setActiveStreamId(null);
              setConnectionState('error');
            }
            // Legacy format support
            else if (jsonData.event === 'chunk' && jsonData.data) {
              const chunk: StreamChunk = {
                content: jsonData.data.content || '',
                isComplete: jsonData.data.isComplete || false,
              };
              streamManagerRef.current?.handleStreamChunk(chunk, assistantMessageId);
            }
            else if (jsonData.event === 'end') {
              streamManagerRef.current?.handleStreamEnd({
                messageId: assistantMessageId,
                timestamp: new Date(jsonData.data?.timestamp || Date.now()),
                finalContent: jsonData.data?.finalContent || '',
              });
              setStreaming(false);
              setActiveStreamId(null);
            }
            else if (jsonData.event === 'error') {
              streamManagerRef.current?.handleStreamError({
                messageId: assistantMessageId,
                errorCode: jsonData.data?.errorCode || 'STREAM_ERROR',
                message: jsonData.data?.message || 'Unknown error',
                retryable: jsonData.data?.retryable ?? true,
              });
              setStreaming(false);
              setActiveStreamId(null);
            }
          } catch (e) {
            console.error('[ChatInterface] Error parsing SSE data:', e);
          }
        }
      }
    } catch (error) {
      console.error('[ChatInterface] Stream error:', error);
      setStreamError({
        messageId: assistantMessageId,
        errorCode: 'STREAM_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      });
      setStreaming(false);
      setActiveStreamId(null);
      setConnectionState('error');
    }
  };

  // Send message directly with streaming
  const sendMessageDirectly = async (content: string, command: any) => {
    addMessage({
      type: 'user',
      content,
      command,
    });

    // Create assistant message for streaming
    const assistantMessageId = crypto.randomUUID();
    addMessage({
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      streamBuffer: '',
      isStreaming: true,
      streamStartTime: new Date(),
      lastChunkTime: new Date(),
    });

    // Stream response from Claude API
    await streamMessage(content, assistantMessageId);
  };

  // Handle message submission - send directly without command interpretation
  const handleSendMessage = async (content: string) => {
    sendMessageDirectly(content, null);
  };

  // Handle slash command execution
  const handleSlashCommand = async (command: SlashCommand, args: Record<string, string>) => {
    // Handle special commands locally first (before creating stream)
    if (command.name === 'help') {
      // Add command message as user message
      addMessage({
        type: 'user',
        content: `/${command.name}`,
      });

      // Add help response directly (no streaming needed)
      addMessage({
        id: crypto.randomUUID(),
        type: 'assistant',
        content: generateHelpMessage(),
      });
      return;
    }

    // Build command message
    const commandMessage = `Executing command: /${command.name}${Object.keys(args).length > 0 ? '\nArguments:\n' + Object.entries(args).map(([k, v]) => `  ${k}: ${v}`).join('\n') : ''}`;

    // Add command message as user message
    addMessage({
      type: 'user',
      content: commandMessage,
    });

    // For now, send the command to Claude with a special prefix
    // This can be extended to directly execute commands via API
    await sendMessageDirectly(`Execute the following slash command: ${command.name} with these arguments: ${JSON.stringify(args, null, 2)}`, null);
  };

  // Generate help message for /help command
  const generateHelpMessage = () => {
    const helpContent = `# Available Slash Commands\n\n## File Operations\n- \`/read\` - Read file contents\n- \`/write\` - Write content to a file\n- \`/delete\` - Delete a file\n\n## Code Operations\n- \`/refactor\` - Refactor code\n- \`/test\` - Run tests\n- \`/debug\` - Debug code issues\n- \`/explain\` - Explain code\n\n## Navigation\n- \`/search\` - Search codebase\n- \`/grep\` - Search using regex\n\n## System\n- \`/commit\` - Create git commit\n\n## Session\n- \`/clear\` - Clear current conversation\n\n## Usage Examples\n\`\`\`\n/read src/app/page.tsx\n/write src/newFile.tsx --content "Hello World"\n/test --pattern "*.test.ts" --watch\n\`\`\`\n\nType \`/\` followed by any command to see available options.`;

    return helpContent;
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toast Notifications (Story 3.4) */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <span className="text-green-500">✓</span> {toast.message}
          </div>
        ))}
      </div>

      {/* Loading indicator (Story 3.4) */}
      <AnimatePresence>
        {isLoadingSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-40"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Loading session...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <ChatHeader
        onNewChat={handleNewChat}
        onSettings={handleSettings}
        onShowSessions={handleShowSessions}
        sessionTitle={currentSession?.title}
        onReconnect={handleRetryConnection}
      />

      {/* Connection Warning Banner */}
      <ConnectionWarning
        onRetry={handleRetryConnection}
        latency={latency}
        reconnectAttempts={reconnectAttempts}
        maxReconnectAttempts={maxReconnectAttempts}
      />

      {/* Message List */}
      <AnimatePresence>
        <MessageList />
      </AnimatePresence>

      {/* Running Tool Indicator (temporary UI state, disappears on completion) */}
      <AnimatePresence mode="wait">
        {currentRunningTool && (
          <div className="px-4 max-w-4xl mx-auto w-full">
            <RunningToolIndicator
              toolName={currentRunningTool.toolName}
              status={currentRunningTool.status}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="relative">
        <MessageInput
          onSend={handleSendMessage}
          onSlashCommand={handleSlashCommand}
          disabled={isLoadingSession || false}
          isStreaming={activeStreamId !== null || isSavingSession}
          savingIndicator={isSavingSession}
        />

        {/* Session Control Buttons (Story 3.5) */}
        {currentSession && (
          <div className="absolute -top-12 right-4">
            <SessionControlButtons
              controlState={sessionControlState}
              isStreaming={isStreaming}
              onPause={handlePause}
              onResume={handleResume}
              onTerminate={() => setShowTerminateDialog(true)}
              disabled={isLoadingSession}
            />
          </div>
        )}
      </div>

      {/* Stream Error Notification */}
      <StreamErrorNotification />

      {/* Terminate Dialog (Story 3.5) */}
      <TerminateDialog
        open={showTerminateDialog}
        onConfirm={handleTerminate}
        onCancel={() => setShowTerminateDialog(false)}
      />

      {/* Session List Panel (Story 3.6 - Multi-session) */}
      <SessionList
        isOpen={showSessionList}
        onClose={() => setShowSessionList(false)}
      />
    </motion.div>
  );
}
