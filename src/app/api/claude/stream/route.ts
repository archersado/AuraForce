/**
 * Claude Stream API Endpoint
 *
 * Accepts POST requests and streams Claude Code responses via Server-Sent Events (SSE).
 * Follows claudecodeui pattern: forward SDK messages directly with minimal transformation.
 *
 * Runtime: Node.js environment (server-side only)
 *
 * Reference: https://github.com/siteboon/claudecodeui
 */

import { NextRequest } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { claude as claudeConfig } from '@/lib/config';

/**
 * Validate API key from request headers or body
 * For MVP, we accept:
 * 1. API key in x-api-key header
 * 2. API key in request body
 * 3. Environment variable if neither provided
 * 4. Allow skip for MVP testing if no valid key exists
 */
function validateApiKey(request: NextRequest): boolean {
  const headerApiKey = request.headers.get('x-api-key');
  const envApiKey = claudeConfig.apiKey;

  console.log('[Stream API] Key validation:', {
    headerApiKey: headerApiKey ? headerApiKey.substring(0, 10) + '...' : 'none',
    envApiKey: envApiKey ? envApiKey.substring(0, 10) + '...' : 'none',
  });

  // Accept if header API key is provided and looks valid
  if (headerApiKey && headerApiKey.length > 5 && !headerApiKey.includes('your-')) {
    console.log('[Stream API] Using header API key');
    return true;
  }

  // Accept if environment variable is set and looks valid
  if (envApiKey && envApiKey.length > 5 && !envApiKey.includes('your-')) {
    console.log('[Stream API] Using environment API key');
    return true;
  }

  // For MVP testing, allow bypass if no valid key is configured
  console.warn('[Stream API] No valid API key found, allowing request for testing');
  return true;
}

/**
 * SSE (Server-Sent Events) implementation for streaming
 *
 * Following claudecodeui's SSEStreamWriter pattern
 */
export async function POST(request: NextRequest) {
  // Validate API key (now allows bypass for MVP testing)
  if (!validateApiKey(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      content,
      apiKey: clientApiKey,
      model = 'sonnet',
      permissionMode = 'bypassPermissions',
      sessionId: resumeSessionId, // Resume existing session to maintain context
      projectPath,
      projectId,
      projectName,
    } = body;

    if (!content) {
      return new Response('Content is required', { status: 400 });
    }

    // Determine actual API key to use
    const apiKey = clientApiKey || process.env.ANTHROPIC_AUTH_TOKEN;
    const useMock = !apiKey || apiKey.includes('your-');

    console.log('[Stream API] API Key decision - clientApiKey:', clientApiKey ? 'provided' : 'none', 'envApiKey:', apiKey ? 'present' : 'none', 'useMock:', useMock);

    // Set ANTHROPIC_API_KEY in environment for SDK
    if (apiKey && !apiKey.includes('your-')) {
      process.env.ANTHROPIC_AUTH_TOKEN = apiKey;
      console.log('[Stream API] Set ANTHROPIC_API_KEY:', apiKey.substring(0, 20) + '...');
    }

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let isControllerClosed = false;

        const closeController = () => {
          if (!isControllerClosed) {
            isControllerClosed = true;
            try {
              controller.close();
            } catch (e) {
              // Ignore close errors when already closed
            }
          }
        };

        const sendSSE = (data: Record<string, unknown>) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (e) {
            // Ignore enqueue errors if already closed
          }
        };

        try {
          // Send session start event
          sendSSE({
            type: 'status',
            message: 'Session started',
            timestamp: new Date().toISOString(),
          });

          if (useMock) {
            // Mock mode for testing without valid API key
            console.log('[Stream API] Using mock mode for testing');
            const mockResponse = `This is a mock streaming response to demonstrate the SSE functionality.

Your message was: "${content}"

The Story 3.3 implementation includes:
- Real-time streaming display with character-by-character updates
- Connection state management (disconnected → connecting → connected → error → reconnecting)
- Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s)
- Incremental markdown rendering during streaming
- Code block highlighting on completion (not during stream)
- Connection status indicator with Chinese labels (离线/连接中/在线/错误/重新连接中...)
- Error recovery with retry mechanism
- Smooth auto-scroll during streaming
- Stream abort on new message submission
- Partial response preservation on errors

**Note:** This is a MOCK response because no valid ANTHROPIC_API_KEY is configured. To enable real Claude streaming, set a valid API key in your environment variable.`;

            const messageId = crypto.randomUUID();
            const chunks = mockResponse.split('');
            for (let i = 0; i < chunks.length; i++) {
              sendSSE({
                messageId,
                timestamp: new Date().toISOString(),
                type: 'claude-response',
                data: {
                  type: 'assistant',
                  message: {
                    content: [{ type: 'text', text: chunks[i] }],
                    usage: { input_tokens: 0, output_tokens: 1 },
                  },
                },
              });
              // Simulate typing speed
              await new Promise(resolve => setTimeout(resolve, 30));
            }

            sendSSE({
              type: 'claude-complete',
              sessionId: 'mock-session',
              messageId,
              timestamp: new Date().toISOString(),
            });
          } else {
            // Real mode - use Claude Agent SDK directly (claudecodeui pattern)
            console.log('[Stream API] Starting real Claude query with model:', model, 'content length:', content.length);
            console.log('[Stream API] Env vars check:', {
                ANTHROPIC_API_KEY: claudeConfig.apiKey ? claudeConfig.apiKey.substring(0, 20) + '...' : 'NOT_SET',
                ANTHROPIC_BASE_URL: claudeConfig.baseUrl || 'NOT_SET',
                ANTHROPIC_MODEL: claudeConfig.defaultModel || 'NOT_SET',
            });

            // Use model from request or fall back to config, then default to 'sonnet'
            const actualModel = (claudeConfig.defaultModel || model || 'sonnet').trim();

            // Use project path if provided, otherwise use current working directory
            const workingDir = projectPath || process.cwd();
            console.log('[Stream API] Working directory:', workingDir);

            // Determine node path to fix "spawn node ENOENT" issue
            // Use absolute path to current node to ensure SDK can find it
            const nodePath = process.execPath;
            const nodeDir = nodePath.substring(0, nodePath.lastIndexOf('/'));

            console.log('[Stream API] Node path check:');
            console.log('[Stream API]   process.execPath:', nodePath);
            console.log('[Stream API]   nodeDir:', nodeDir);
            console.log('[Stream API]   exists:', await (async () => {
              const { access } = await import('fs/promises');
              try {
                await access(nodePath);
                return true;
              } catch {
                return false;
              }
            })());

            // Build PATH ensuring Node.js directory is included
            // Make sure nodeDir is first and appears in PATH to help SDK find node
            const existingPath = process.env.PATH || '';
            const pathDirs = [
              nodeDir, // Add node directory first for priority
              existingPath.includes(nodeDir) ? existingPath : `${nodeDir}:${existingPath}`,
            ].filter(p => p).join(':');

            console.log('[Stream API]   PATH constructed (first 200 chars):', pathDirs.slice(0, 200));

            const sdkOptions: Record<string, unknown> = {
              model: actualModel,
              permissionMode,
              cwd: workingDir,
              systemPrompt: {
                type: 'preset',
                preset: 'claude_code'
              },
              settingSources: ['project', 'user', 'local'],
              // Enable partial message streaming for character-by-character output
              includePartialMessages: true,
              // IMPORTANT: Resume session to maintain context (claudecodeui pattern)
              ...(resumeSessionId && { resume: resumeSessionId }),
              // Add environment variables for SDK
              env: {
                // CRITICAL: Use absolute node path and ensure PATH includes node directory
                NODE: nodePath,
                PATH: pathDirs,
                // IMPORTANT: Keep other environment variables
                ...(claudeConfig.authToken && { ANTHROPIC_AUTH_TOKEN: claudeConfig.authToken }),
                ...(claudeConfig.baseUrl && { ANTHROPIC_BASE_URL: claudeConfig.baseUrl }),
                ...(claudeConfig.defaultModel && { ANTHROPIC_MODEL: claudeConfig.defaultModel }),
                // IMPORTANT: Force override ANTHROPIC_API_KEY with our value (server-side only, ignore NEXT_PUBLIC_ version)
                ANTHROPIC_API_KEY: claudeConfig.apiKey,
                ANTHROPIC_AUTH_TOKEN: claudeConfig.authToken,
                // Add project context to environment
                ...(projectPath && { PROJECT_PATH: projectPath }),
                ...(projectId && { PROJECT_ID: projectId }),
                ...(projectName && { PROJECT_NAME: projectName }),
              },
            };

            try {
              const queryInstance = query({
                prompt: content,
                options: sdkOptions
              });

              let sessionId = '';
              let messageCount = 0;
              let lastMessage: any = null;
              let actualError: string | null = null;
              let startTime = Date.now();
              let lastMessageTime = Date.now();
              const timeoutMs = 120000; // 2分钟超时
              let timeoutHandle: NodeJS.Timeout | null = null;

              // Set up timeout to detect hanging loop
              timeoutHandle = setTimeout(() => {
                const elapsed = Date.now() - startTime;
                const lastMsgElapsed = Date.now() - lastMessageTime;
                console.error(`[Stream API] TIMEOUT! Total elapsed: ${elapsed}ms, Time since last message: ${lastMsgElapsed}ms, Messages received: ${messageCount}`);
              }, timeoutMs);

              try {
                // Process streaming messages from SDK (same pattern as claudecodeui)
                for await (const message of queryInstance) {
                  if (timeoutHandle) {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = null;
                  }

                  const elapsed = Date.now() - startTime;
                  lastMessageTime = Date.now();
                  messageCount++;
                  lastMessage = message;

                  // Log all message types for debugging
                  console.log('[Stream API] Message received:', {
                    type: message.type,
                    hasSessionId: !!message.session_id,
                    hasEvent: !!message.event,
                    eventType: message.event?.type,
                    hasContent: !!message.message,
                    messageType: message.message?.type,
                    contentFirstType: message.message?.content?.[0]?.type,
                  });

                  // Capture session ID from first message
                  if (message.session_id && !sessionId) {
                    sessionId = message.session_id;
                    sendSSE({
                      type: 'session-created',
                      sessionId,
                      timestamp: new Date().toISOString(),
                    });
                  }

                  // Check for error in result messages
                  if (message.type === 'result' && (message as any).is_error === true) {
                    actualError = (message as any).result || 'Unknown error from Claude SDK';
                    console.error('[Stream API] SDK error detected:', actualError);
                  }

                  // 转换并发送消息 - 不要跳过任何消息，按 claudecodeui 的方式处理
                  sendSSE({
                    type: 'claude-response',
                    data: message,
                  });
                }
              } catch (loopError) {
                // Check if this is the expected "process exited" error after receiving messages
                const errorMessage = loopError instanceof Error ? loopError.message : String(loopError);

                // If we captured an actual error from the SDK messages, use that instead
                if (actualError) {
                  console.error('[Stream API] SDK error (captured from messages):', actualError);
                  sendSSE({
                    type: 'claude-error',
                    error: actualError,
                    timestamp: new Date().toISOString(),
                  });
                  return; // Exit early after sending error
                }

                // Check if this is a graceful exit after completing work
                if (messageCount > 0 && (errorMessage.includes('exited with code') || errorMessage.includes('exited'))) {
                  // Check if exit code is non-zero and we don't have a completion message
                  // This indicates an actual error (like invalid API key)
                  const exitCodeMatch = errorMessage.match(/exited with code (\d+)/);
                  if (exitCodeMatch && parseInt(exitCodeMatch[1], 10) !== 0) {
                    // Non-zero exit code after receiving messages - likely an error
                    // Check if last message was a result with data (indicates completion with data)
                    const isGracefulExit = lastMessage?.type === 'result' && lastMessage?.subtype === 'success' && !lastMessage?.is_error;
                    
                    if (!isGracefulExit) {
                      console.error('[Stream API] Process exited with non-zero code:', errorMessage);
                      const errorDetail = actualError || `Claude SDK process exited abnormally: ${errorMessage}`;
                      sendSSE({
                        type: 'claude-error',
                        error: errorDetail,
                        timestamp: new Date().toISOString(),
                      });
                      return;
                    }
                  }
                  // Otherwise, it's just the normal cleanup of the child process
                } else {
                  // Real error - rethrow
                  console.error('[Stream API] Real error:', errorMessage);
                  throw loopError;
                }
              }

              // Clear timeout if still active
              if (timeoutHandle) {
                clearTimeout(timeoutHandle);
              }

              // Only send error if no messages were received
              if (messageCount === 0) {
                console.error('[Stream API] No messages received');
                sendSSE({
                  type: 'claude-error',
                  error: 'No messages received from Claude SDK',
                  timestamp: new Date().toISOString(),
                });
              }

              // 确保发送完成事件
              if (!sessionId) {
                sessionId = crypto.randomUUID();
              }
              sendSSE({
                type: 'claude-complete',
                sessionId,
                timestamp: new Date().toISOString(),
              });
            } catch (queryError) {
              console.error('[Stream API] Query error:', queryError);
              if (queryError instanceof Error) {
                console.error('[Stream API] Error name:', queryError.name);
                console.error('[Stream API] Error message:', queryError.message);
              }
              sendSSE({
                type: 'claude-error',
                error: queryError instanceof Error ? queryError.message : 'Query failed',
                timestamp: new Date().toISOString(),
              });
            }
          }

          closeController();
        } catch (error) {
          console.error('[Stream API] SSE error:', error);
          sendSSE({
            type: 'claude-error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          });
          closeController();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable buffering
      },
    });

  } catch (error) {
    console.error('[Stream API] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
