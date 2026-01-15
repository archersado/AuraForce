/**
 * Tool Use Data Types
 *
 * Shared types for tool execution and tool use messages.
 * Moved from claude-store.ts to avoid circular dependency with session.ts.
 */

/**
 * Tool use data for system messages representing tool executions
 */
export interface ToolUseData {
  toolId: string;
  toolName: string;
  input: Record<string, unknown>;
  isInteractive: boolean;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  result?: string;
  error?: string;
}
