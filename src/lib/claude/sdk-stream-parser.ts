/**
 * SDK Stream Message Parser
 *
 * Parses messages from Claude Agent SDK stream protocol.
 * Converts raw SDK messages to frontend-friendly message objects.
 * Supports tool_use, content_block, delta events, and interactive tools.
 */

import type { ToolUseData } from '@/components/claude/ToolUse';
import type { InteractiveMessage } from '@/types/interactive-message';
import { hasInteractiveTool, parseInteractiveMessage } from './message-parser';

/**
 * Raw SDK message from Claude Agent SDK
 * Based on claudecodeui protocol (reference: ChatInterface.jsx line 2950+)
 */
export interface SDKMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * SDK Content Block (text or tool_use)
 */
interface SDKContentBlock {
  type: 'text' | 'tool_use';
  text?: string;
  name?: string;
  input?: Record<string, unknown>;
  id?: string;
}

/**
 * Parsed message for frontend consumption
 */
export interface ParsedStreamMessage {
  // Message metadata
  messageId?: string;
  timestamp?: string;

  // Content
  content: string;
  contentDelta?: string; // Incremental text delta

  // Tool use
  isToolUse?: boolean;
  toolUse?: ToolUseData;

  // Interactive tool (askuserquestions, confirm, etc.)
  interactive?: InteractiveMessage;

  // Status
  isComplete?: boolean;
  isError?: boolean;

  // Session info
  sessionId?: string;
}

/**
 * Parse SDK message to frontend format
 * Handles various message types from Claude Agent SDK
 */
export function parseSDKMessage(
  message: SDKMessage,
  existingMessage?: { toolUse?: ToolUseData | null }
): ParsedStreamMessage {
  const result: ParsedStreamMessage = {
    content: '',
    isComplete: false,
  };

  // Extract common metadata
  if (message.message_id) {
    result.messageId = message.message_id as string;
  }
  if (message.timestamp) {
    result.timestamp = message.timestamp as string;
  }
  if (message.session_id) {
    result.sessionId = message.session_id as string;
  }

  // Handle different message types based on claudecodeui protocol
  switch (message.type) {
    /**
     * Text content delta - streaming response chunk
     * Reference: claudecodeui case 'claude-output'
     */
    case 'content_block_delta':
    case 'text_delta': {
      const delta = message.delta as { type: string; text?: string } | undefined;
      if (delta?.text) {
        result.content = delta.text;
        result.contentDelta = delta.text;
      }
      break;
    }

    /**
     * Content block start (text or tool)
     * Reference: claudecodeui content_block handling
     */
    case 'content_block_start': {
      const contentBlock = message.content_block as SDKContentBlock | undefined;

      if (contentBlock?.type === 'tool_use') {
        // Parse tool use
        result.isToolUse = true;
        result.toolUse = {
          toolName: contentBlock.name || 'unknown',
          toolId: contentBlock.id || crypto.randomUUID(),
          toolInput: JSON.stringify(contentBlock.input || {}, null, 2),
          status: 'pending',
        };
      } else if (contentBlock?.type === 'text' && contentBlock.text) {
        result.content = contentBlock.text;
      }
      break;
    }

    /**
     * Content block stop - content block complete
     */
    case 'content_block_stop':
      result.isComplete = true;
      break;

    /**
     * Message delta - metadata updates including stop_reason
     */
    case 'message_delta': {
      const delta = message.delta as { stop_reason?: string } | undefined;
      if (delta?.stop_reason) {
        result.isComplete = true;
      }
      break;
    }

    /**
     * Message stop - response complete
     * Reference: claudecodeui case 'claude-complete'
     */
    case 'message_stop':
    case 'claude-complete':
      result.isComplete = true;
      break;

    /**
     * Error event
     * Reference: claudecodeui case 'claude-error'
     */
    case 'error':
    case 'claude-error':
      result.isError = true;
      result.content = message.error ? String(message.error) : 'An error occurred';
      break;

    /**
     * Tool result - output from a tool call
     * Reference: claudecodeui tool_result handling
     */
    case 'tool_result':
    case 'content_block_result': {
      const content = message.content as { content?: string; is_error?: boolean } | undefined;
      const toolUseId = message.tool_use_id as string | undefined;

      if (toolUseId && content) {
        // Update existing tool use with result
        result.isToolUse = true;
        result.toolUse = existingMessage?.toolUse
          ? {
              ...existingMessage.toolUse,
              toolResult: {
                content: content.content || '',
                isError: content.is_error || false,
                timestamp: new Date(),
              },
              status: content.is_error ? 'error' : 'success',
            }
          : undefined;
      }
      break;
    }

    /**
     * Agent message - direct messages from the agent
     * Reference: claudecodeui case 'codex-response' -> 'agent_message'
     */
    case 'agent_message': {
      const msg = message.message as { content?: string } | undefined;
      if (msg?.content) {
        result.content = msg.content;
      }
      break;
    }

    /**
     * Thinking/reasoning output
     * Reference: claudecodeui case 'codex-response' -> 'reasoning'
     */
    case 'reasoning': {
      const msg = message.message as { content?: string } | undefined;
      if (msg?.content) {
        result.content = `[Thinking] ${msg.content}`;
      }
      break;
    }

    /**
     * Command execution
     * Reference: claudecodeui case 'codex-response' -> 'command_execution'
     */
    case 'command_execution': {
      const command = message.command as string | undefined;
      const output = message.output as string | undefined;
      const exitCode = message.exitCode as number | undefined;

      result.isToolUse = true;
      result.toolUse = {
        toolName: 'Bash',
        toolId: crypto.randomUUID(),
        toolInput: command || '',
        toolResult: output ? {
          content: output,
          isError: (exitCode ?? 0) !== 0,
          timestamp: new Date(),
        } : undefined,
        status: output ? (exitCode !== 0 ? 'error' : 'success') : 'pending',
      };
      break;
    }

    /**
     * File changes
     * Reference: claudecodeui case 'codex-response' -> 'file_change'
     */
    case 'file_change':
    case 'file_changes': {
      const changes = message.changes as Array<{ kind?: string; path?: string }> | undefined;
      const status = message.status as string | undefined;

      if (changes && changes.length > 0) {
        result.isToolUse = true;
        result.toolUse = {
          toolName: 'FileChanges',
          toolId: crypto.randomUUID(),
          toolInput: changes
            .map(c => `${c.kind || 'modify'}: ${c.path || 'unknown'}`)
            .join('\n'),
          toolResult: status ? {
            content: `Status: ${status}`,
            isError: false,
            timestamp: new Date(),
          } : undefined,
          status: 'success',
        };
      }
      break;
    }

    /**
     * MCP tool calls
     * Reference: claudecodeui case 'codex-response' -> 'mcp_tool_call'
     */
    case 'mcp_tool_call': {
      const server = message.server as string | undefined;
      const tool = message.tool as string | undefined;
      const args = message.arguments as Record<string, unknown> | undefined;
      const toolResult = message.result as Record<string, unknown> | undefined;
      const toolError = message.error as { message?: string } | undefined;

      result.isToolUse = true;
      result.toolUse = {
        toolName: `${server}:${tool}`,
        toolId: crypto.randomUUID(),
        toolInput: JSON.stringify(args || {}, null, 2),
        toolResult: (toolResult || toolError) ? {
          content: toolResult
            ? JSON.stringify(toolResult, null, 2)
            : toolError?.message || 'Unknown error',
          isError: !!toolError,
          timestamp: new Date(),
        } : undefined,
        status: toolResult ? 'success' : (toolError ? 'error' : 'pending'),
      };
      break;
    }

    /**
     * Generic message with content array (Claude message format)
     */
    case 'message': {
      const msg = message.message as { content?: SDKContentBlock[] } | undefined;
      if (msg?.content && Array.isArray(msg.content)) {
        // Check for tool_use or interactive tools in content
        for (const block of msg.content) {
          if (block.type === 'tool_use' && block.name) {
            // Check if this is an interactive tool
            const parsedInteractive = parseInteractiveMessage(
              { content: [block] },
              block.id
            );

            if (parsedInteractive.interactive) {
              result.interactive = parsedInteractive.interactive as InteractiveMessage;
              result.content += parsedInteractive.content || '';
            } else {
              result.isToolUse = true;
              result.toolUse = {
                toolName: block.name,
                toolId: block.id || crypto.randomUUID(),
                toolInput: JSON.stringify(block.input || {}, null, 2),
                status: 'pending',
              };
            }
          } else if (block.type === 'text' && block.text) {
            result.content += block.text;
          }
        }
      }
      break;
    }
  }

  return result;
}

/**
 * Check if message contains tool_use
 */
export function hasToolUse(message: SDKMessage): boolean {
  if (message.type === 'content_block_start' || message.type === 'tool_use') {
    const contentBlock = message.content_block as SDKContentBlock | undefined;
    if (contentBlock?.type === 'tool_use') {
      return true;
    }
  }

  if (message.type === 'message') {
    const msg = message.message as { content?: SDKContentBlock[] } | undefined;
    if (msg?.content && Array.isArray(msg.content)) {
      return msg.content.some(block => block.type === 'tool_use');
    }
  }

  if (message.type === 'command_execution' ||
      message.type === 'file_change' ||
      message.type === 'mcp_tool_call') {
    return true;
  }

  return false;
}

/**
 * Check if message has interactive tool content
 */
export function hasInteractiveMessage(message: SDKMessage): boolean {
  return hasInteractiveTool(message);
}

/**
 * Extract tool use info from SDK message
 */
export function extractToolUse(message: SDKMessage): ToolUseData | null {
  // Check for content_block_start with tool_use
  if (message.type === 'content_block_start') {
    const contentBlock = message.content_block as SDKContentBlock | undefined;
    if (contentBlock?.type === 'tool_use' && contentBlock.name) {
      return {
        toolName: contentBlock.name,
        toolId: contentBlock.id || crypto.randomUUID(),
        toolInput: JSON.stringify(contentBlock.input || {}, null, 2),
        status: 'pending',
      };
    }
  }

  // Check for command execution
  if (message.type === 'command_execution') {
    const command = message.command as string | undefined;
    const output = message.output as string | undefined;
    const exitCode = message.exitCode as number | undefined;

    return {
      toolName: 'Bash',
      toolId: crypto.randomUUID(),
      toolInput: command || '',
      toolResult: output ? {
        content: output,
        isError: (exitCode ?? 0) !== 0,
        timestamp: new Date(),
      } : undefined,
      status: output ? (exitCode !== 0 ? 'error' : 'success') : 'pending',
    };
  }

  // Check for MCP tool
  if (message.type === 'mcp_tool_call') {
    const server = message.server as string;
    const tool = message.tool as string;
    const args = message.arguments as Record<string, unknown>;
    const result = message.result as Record<string, unknown> | undefined;
    const error = message.error as { message?: string } | undefined;

    return {
      toolName: `${server}:${tool}`,
      toolId: crypto.randomUUID(),
      toolInput: JSON.stringify(args || {}, null, 2),
      toolResult: (result || error) ? {
        content: result
          ? JSON.stringify(result, null, 2)
          : error?.message || 'Unknown error',
        isError: !!error,
        timestamp: new Date(),
      } : undefined,
      status: result ? 'success' : (error ? 'error' : 'pending'),
    };
  }

  return null;
}
