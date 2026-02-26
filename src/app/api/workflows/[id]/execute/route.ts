/**
 * Workflow Execution API Endpoint
 *
 * POST /api/workflows/[id]/execute - Execute a workflow spec using Claude Agent SDK
 * Streams execution results via Server-Sent Events (SSE)
 *
 * Runtime: Node.js environment (server-side only)
 */

import { NextRequest } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/custom-session';
import { claude as claudeConfig } from '@/lib/config';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Validate API key
 */
function validateApiKey(): boolean {
  const envApiKey = claudeConfig.apiKey;
  return envApiKey && envApiKey.length > 5 && !envApiKey.includes('your-');
}

/**
 * POST /api/workflows/[id]/execute
 * Execute a workflow spec via Claude Agent SDK with streaming
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  // Verify authentication
  const session = await getSession();
  if (!session?.user?.id || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get workflow ID
    const { id } = await params;

    // Find workflow spec
    const workflow = await prisma.workflowSpec.findUnique({
      where: { id },
    });

    if (!workflow) {
      return new Response('Workflow not found', { status: 404 });
    }

    // Verify ownership or public visibility
    if (workflow.userId !== session.user.id && workflow.visibility !== 'public') {
      return new Response('Forbidden', { status: 403 });
    }

    // Verify workflow status
    if (workflow.status !== 'deployed') {
      return new Response('Workflow is not deployed', { status: 400 });
    }

    // Check API key
    if (!validateApiKey()) {
      console.warn('[Workflow Execute] No valid API key configured');
      return new Response('Claude API key not configured', { status: 500 });
    }

    // Parse request body for parameters
    const body = await request.json();
    const {
      params: executeParams = {},
      model = 'sonnet',
      permissionMode = 'bypassPermissions',
      sessionId: resumeSessionId,
    } = body;

    console.log('[Workflow Execute] Starting execution:', {
      workflowId: id,
      workflowName: workflow.name,
      ccPath: workflow.ccPath,
      params: executeParams,
      model,
    });

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
          // Send execution start event
          sendSSE({
            type: 'status',
            message: 'Workflow execution started',
            workflowName: workflow.name,
            timestamp: new Date().toISOString(),
          });

          // Use the workflow's ccPath as the execution prompt/trigger
          const prompt = workflow.ccPath;

          // Add parameters to prompt if provided
          const paramsText = Object.entries(executeParams)
            .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
            .join('\n');

          const fullPrompt = paramsText
            ? `${prompt}\n\nParameters:\n${paramsText}`
            : prompt;

          // Use model from request or fall back to config
          const actualModel = (claudeConfig.defaultModel || model || 'sonnet').trim();

          // Determine node path
          const nodePath = process.execPath;
          const nodeDir = nodePath.substring(0, nodePath.lastIndexOf('/'));

          console.log('[Workflow Execute] Node path:', nodePath);
          console.log('[Workflow Execute] Full prompt length:', fullPrompt.length);

          // Build PATH ensuring Node.js directory is included
          const existingPath = process.env.PATH || '';
          const pathDirs = [
            nodeDir,
            existingPath.includes(nodeDir) ? existingPath : `${nodeDir}:${existingPath}`,
          ].filter(p => p).join(':');

          // Build SDK options
          const sdkOptions: Record<string, unknown> = {
            model: actualModel,
            permissionMode,
            cwd: process.cwd(),
            systemPrompt: {
              type: 'preset',
              preset: 'claude_code'
            },
            settingSources: ['project', 'user', 'local'],
            includePartialMessages: true,
            ...(resumeSessionId && { resume: resumeSessionId }),
            env: {
              NODE: nodePath,
              PATH: pathDirs,
              ANTHROPIC_AUTH_TOKEN: claudeConfig.authToken,
              ANTHROPIC_BASE_URL: claudeConfig.baseUrl,
              ANTHROPIC_MODEL: claudeConfig.defaultModel,
              ANTHROPIC_API_KEY: claudeConfig.apiKey,
              WORKFLOW_ID: workflow.id,
              WORKFLOW_NAME: workflow.name,
              WORKFLOW_PATH: workflow.ccPath,
            },
          };

          console.log('[Workflow Execute] Starting Claude query with model:', actualModel);

          try {
            const queryInstance = query({
              prompt: fullPrompt,
              options: sdkOptions
            });

            let sessionId = '';
            let messageCount = 0;
            let actualError: string | null = null;
            let lastMessage: any = null;
            let lastMessageTime = Date.now();
            const timeoutMs = 120000; // 2 minute timeout
            let timeoutHandle: NodeJS.Timeout | null = null;

            // Set up timeout
            timeoutHandle = setTimeout(() => {
              const lastMsgElapsed = Date.now() - lastMessageTime;
              console.error(`[Workflow Execute] TIMEOUT! Time since last message: ${lastMsgElapsed}ms, Messages received: ${messageCount}`);
            }, timeoutMs);

            try {
              // Process streaming messages from SDK
              for await (const message of queryInstance) {
                if (timeoutHandle) {
                  clearTimeout(timeoutHandle);
                  timeoutHandle = null;
                }

                lastMessageTime = Date.now();
                messageCount++;
                lastMessage = message;

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
                  console.error('[Workflow Execute] SDK error detected:', actualError);
                }

                // Forward Claude SDK messages
                sendSSE({
                  type: 'claude-response',
                  data: message,
                });
              }
            } catch (loopError) {
              const errorMessage = loopError instanceof Error ? loopError.message : String(loopError);

              // Check for captured SDK errors
              if (actualError) {
                console.error('[Workflow Execute] SDK error (captured from messages):', actualError);
                sendSSE({
                  type: 'claude-error',
                  error: actualError,
                  timestamp: new Date().toISOString(),
                });
                return;
              }

              // Handle process exit scenarios
              if (messageCount > 0 && (errorMessage.includes('exited with code') || errorMessage.includes('exited'))) {
                const exitCodeMatch = errorMessage.match(/exited with code (\d+)/);
                if (exitCodeMatch && parseInt(exitCodeMatch[1], 10) !== 0) {
                  const isGracefulExit = lastMessage?.type === 'result' && lastMessage?.subtype === 'success' && !lastMessage?.is_error;
                  
                  if (!isGracefulExit) {
                    console.error('[Workflow Execute] Process exited with non-zero code:', errorMessage);
                    const errorDetail = actualError || `Claude SDK process exited abnormally: ${errorMessage}`;
                    sendSSE({
                      type: 'claude-error',
                      error: errorDetail,
                      timestamp: new Date().toISOString(),
                    });
                    return;
                  }
                }
              } else {
                console.error('[Workflow Execute] Real error:', errorMessage);
                throw loopError;
              }
            }

            // Clear timeout if still active
            if (timeoutHandle) {
              clearTimeout(timeoutHandle);
            }

            // Check if no messages were received
            if (messageCount === 0) {
              console.error('[Workflow Execute] No messages received');
              sendSSE({
                type: 'claude-error',
                error: 'No messages received from Claude SDK',
                timestamp: new Date().toISOString(),
              });
            }

            // Send completion event
            if (!sessionId) {
              sessionId = crypto.randomUUID();
            }
            sendSSE({
              type: 'claude-complete',
              sessionId,
              workflowId: workflow.id,
              workflowName: workflow.name,
              timestamp: new Date().toISOString(),
            });

            console.log('[Workflow Execute] Execution completed successfully');
          } catch (queryError) {
            console.error('[Workflow Execute] Query error:', queryError);
            sendSSE({
              type: 'claude-error',
              error: queryError instanceof Error ? queryError.message : 'Query failed',
              timestamp: new Date().toISOString(),
            });
          }

          closeController();
        } catch (error) {
          console.error('[Workflow Execute] SSE error:', error);
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
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    console.error('[Workflow Execute] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
