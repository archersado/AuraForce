/**
 * Claude Project Sessions Utility
 *
 * Reads Claude Code CLI session data from ~/.claude/projects/
 * Used to list and resume Claude-only sessions for a given project path.
 *
 * Reference: Based on claudecodeui project's projects.js
 */

import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';

/**
 * Encode project path to Claude's directory naming convention
 * Matches the behavior of claude-code-cli:
 * - Replaces /, \, :, spaces, ~, _ with -
 * - Collapses multiple consecutive dashes into one
 * - Removes trailing dashes/slashes
 * - KEEPS leading dash (from absolute path starting with /)
 */
export function encodeProjectPath(projectPath: string): string {
  return projectPath
    .replace(/[\/\\:\s~_]/g, '-')  // Replace special chars with -
    .replace(/-+/g, '-')           // Collapse multiple dashes
    .replace(/-+$/)             // Remove trailing dashes only
    .replace(/\/+$/)             // Remove trailing slashes only
    .replace(/\\+$/);            // Remove trailing backslashes only
}

/**
 * Session metadata extracted from JSONL files
 */
export interface ClaudeSession {
  id: string;           // Session ID (file basename without .jsonl)
  summary: string;      // Session summary/title
  messageCount: number; // Number of messages in the session
  lastActivity: Date;   // Last activity timestamp
  cwd: string;          // Working directory from the session
  lastUserMessage?: string;     // Last user message content
  lastAssistantMessage?: string; // Last assistant message content
}

/**
 * Parsed JSONL entry
 */
interface JsonlEntry {
  type: 'user' | 'assistant' | 'result' | 'summary';
  uuid?: string;
  sessionId?: string;
  timestamp?: string;
  cwd?: string;
  message?: {
    role: string;
    content?: string | Array<{ type: string; text?: string }>;
  };
  parentUuid?: string | null;
}

/**
 * Read project sessions from ~/.claude/projects/
 *
 * @param projectPath - The absolute project path
 * @returns Array of Claude sessions for this project
 */
export async function getClaudeProjectSessions(projectPath: string): Promise<ClaudeSession[]> {
  const encodedPath = encodeProjectPath(projectPath);
  const projectDir = path.join(os.homedir(), '.claude', 'projects', encodedPath);

  try {
    // Check if the project directory exists
    await fs.access(projectDir);

    const files = await fs.readdir(projectDir);
    // Filter for session .jsonl files (exclude agent-*.jsonl)
    const jsonlFiles = files.filter(file => file.endsWith('.jsonl') && !file.startsWith('agent-'));

    if (jsonlFiles.length === 0) {
      return [];
    }

    // Sort files by modification time (newest first)
    const filesWithStats = await Promise.all(
      jsonlFiles.map(async (file) => {
        const filePath = path.join(projectDir, file);
        const stats = await fs.stat(filePath);
        return { file, mtime: stats.mtime };
      })
    );
    filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    const sessions = new Map<string, ClaudeSession>();

    // Parse each JSONL file to extract session metadata
    for (const { file } of filesWithStats) {
      const jsonlFile = path.join(projectDir, file);
      const sessionId = file.replace('.jsonl', '');

      await parseJsonlSessions(jsonlFile, sessions);
    }

    // Convert to array and sort by lastActivity (newest first)
    return Array.from(sessions.values()).sort(
      (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // No Claude sessions for this project
      return [];
    }
    console.error(`[ClaudeProjectSessions] Error reading sessions for ${projectPath}:`, error);
    return [];
  }
}

/**
 * Parse a JSONL file and extract session metadata
 */
async function parseJsonlSessions(
  filePath: string,
  sessionsMap: Map<string, ClaudeSession>
): Promise<void> {
  let messageCount = 0;
  let lastActivity: Date = new Date(0);
  let cwd: string = '';
  let summary = 'New Session';
  let lastUserMessage: string | undefined;
  let lastAssistantMessage: string | undefined;

  try {
    const fileStream = fsSync.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const entry: JsonlEntry = JSON.parse(line);
        messageCount++;

        // Extract cwd from any entry
        if (entry.cwd && !cwd) {
          cwd = entry.cwd;
        }

        // Track last activity
        if (entry.timestamp) {
          const entryTime = new Date(entry.timestamp);
          if (entryTime > lastActivity) {
            lastActivity = entryTime;
          }
        }

        // Update summary from summary entries
        if (entry.type === 'summary' && entry.message?.content) {
          summary = typeof entry.message.content === 'string'
            ? entry.message.content
            : 'Session Summary';
        }

        // Track last user message
        if (
          entry.type === 'user' &&
          entry.message?.role === 'user' &&
          entry.message.content
        ) {
          lastUserMessage = typeof entry.message.content === 'string'
            ? entry.message.content
            : Array.isArray(entry.message.content)
              ? entry.message.content[0]?.text || ''
              : '';
          // Truncate to 100 chars for preview
          if (lastUserMessage && lastUserMessage.length > 100) {
            lastUserMessage = lastUserMessage.substring(0, 100) + '...';
          }
        }

        // Track last assistant message
        if (
          entry.type === 'assistant' &&
          entry.message?.role === 'assistant' &&
          entry.message.content
        ) {
          lastAssistantMessage = typeof entry.message.content === 'string'
            ? entry.message.content
            : 'Assistant response';
        }

      } catch (parseError) {
        // Skip malformed lines
        continue;
      }
    }

    // Add session to map
    const sessionId = path.basename(filePath, '.jsonl');
    if (messageCount > 0) {
      sessionsMap.set(sessionId, {
        id: sessionId,
        summary,
        messageCount,
        lastActivity,
        cwd,
        lastUserMessage,
        lastAssistantMessage,
      });
    }

  } catch (error) {
    console.error(`[ClaudeProjectSessions] Error parsing file ${filePath}:`, error);
  }
}

/**
 * Get the latest (most recent) session for a project
 *
 * @param projectPath - The absolute project path
 * @returns The latest session or null if no sessions exist
 */
export async function getLatestClaudeSession(projectPath: string): Promise<ClaudeSession | null> {
  const sessions = await getClaudeProjectSessions(projectPath);
  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Get session messages from a Claude session (for loading full history)
 *
 * @param projectPath - The absolute project path
 * @param sessionId - The Claude session ID
 * @returns Array of message entries from the session
 */
export async function getClaudeSessionMessages(
  projectPath: string,
  sessionId: string
): Promise<JsonlEntry[]> {
  const encodedPath = encodeProjectPath(projectPath);
  const filePath = path.join(os.homedir(), '.claude', 'projects', encodedPath, `${sessionId}.jsonl`);

  const entries: JsonlEntry[] = [];

  try {
    await fs.access(filePath);

    const fileStream = fsSync.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const entry: JsonlEntry = JSON.parse(line);
        entries.push(entry);
      } catch (parseError) {
        // Skip malformed lines
        continue;
      }
    }

  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`[ClaudeProjectSessions] Error reading session messages:`, error);
    }
  }

  return entries;
}
