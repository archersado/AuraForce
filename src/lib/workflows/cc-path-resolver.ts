/**
 * CC Path Resolver Service
 *
 * Provides cross-platform path resolution and validation for Claude Code
 * directory operations. Handles OS-specific path formats and custom configurations.
 */

import path from 'path';
import { homedir } from 'os';
import { access, stat } from 'fs/promises';

export interface CCPathConfig {
  basePath: string;
  extensionsDir: string;
  workflowsDir: string;
}

export interface ValidationResult {
  valid: boolean;
  path: string;
  error?: string;
  readable: boolean;
  writable: boolean;
  exists: boolean;
}

/**
 * CC Path Resolver with cross-platform support
 */
export class CCPathResolver {
  private static readonly DEFAULT_CC_PATHS: Record<string, string> = {
    win32: path.join(process.env.USERPROFILE || 'C:\\Users\\Default', '.claude'),
    darwin: path.join(process.env.HOME || '/Users/Default', '.claude'),
    linux: path.join(process.env.HOME || '/home/default', '.claude'),
  };

  private static readonly EXTENSIONS_SUBDIR = 'extensions';
  private static readonly WORKFLOWS_SUBDIR = 'workflows';

  /**
   * Resolve the Claude Code base path for the current platform
   */
  static async resolveBasePath(customPath?: string): Promise<string> {
    if (customPath) {
      await this.validatePath(customPath);
      return customPath;
    }

    const platform = process.platform;
    const basePath =
      process.env.CLAUDE_CODE_HOME ||
      process.env.CLAUDE_HOME ||
      this.DEFAULT_CC_PATHS[platform] ||
      path.join(homedir(), '.claude');

    return basePath;
  }

  /**
   * Get the full CC configuration including all relevant paths
   */
  static async getConfig(customBasePath?: string): Promise<CCPathConfig> {
    const basePath = await this.resolveBasePath(customBasePath);
    const extensionsDir = path.join(basePath, this.EXTENSIONS_SUBDIR);
    const workflowsDir = path.join(extensionsDir, this.WORKFLOWS_SUBDIR);

    return {
      basePath,
      extensionsDir,
      workflowsDir,
    };
  }

  /**
   * Get the workflows directory path
   */
  static async getWorkflowsDir(customBasePath?: string): Promise<string> {
    const config = await this.getConfig(customBasePath);
    return config.workflowsDir;
  }

  /**
   * Generate a CC path for a workflow spec
   */
  static async getWorkflowCCPath(
    workflowName: string,
    customBasePath?: string
  ): Promise<string> {
    const workflowsDir = await this.getWorkflowsDir(customBasePath);
    const sanitizedName = this.sanitizeWorkflowName(workflowName);
    return path.join(workflowsDir, sanitizedName);
  }

  /**
   * Validate a path for accessibility and permissions
   */
  static async validatePath(targetPath: string): Promise<ValidationResult> {
    try {
      const stats = await stat(targetPath);

      return {
        valid: true,
        path: targetPath,
        readable: true, // Assumes readable if stat succeeded
        writable: !!(stats.mode & 0o200), // Check write permission bit
        exists: true,
      };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;

      // Path doesn't exist - this is okay, we'll create it
      if (code === 'ENOENT') {
        return {
          valid: true,
          path: targetPath,
          readable: true,
          writable: true,
          exists: false,
        };
      }

      // Permission denied
      if (code === 'EACCES') {
        return {
          valid: false,
          path: targetPath,
          error: 'Permission denied',
          readable: false,
          writable: false,
          exists: true,
        };
      }

      // Other errors
      return {
        valid: false,
        path: targetPath,
        error: error instanceof Error ? error.message : String(error),
        readable: false,
        writable: false,
        exists: false,
      };
    }
  }

  /**
   * Check for path conflicts with existing workflow specs
   */
  static async checkPathConflict(
    workflowName: string,
    customBasePath?: string
  ): Promise<{ conflicted: boolean; conflictingPath?: string; suggestion?: string }> {
    const targetPath = await this.getWorkflowCCPath(workflowName, customBasePath);

    try {
      await access(targetPath);
      // Path exists - potential conflict
      const variation = `${workflowName}-1`;
      const suggestion = await this.getWorkflowCCPath(variation, customBasePath);

      try {
        await access(suggestion);
        return { conflicted: true, conflictingPath: targetPath };
      } catch {
        return {
          conflicted: true,
          conflictingPath: targetPath,
          suggestion: variation,
        };
      }
    } catch {
      // Path doesn't exist - no conflict
      return { conflicted: false };
    }
  }

  /**
   * Get path history for a workflow spec
   */
  static async getPathHistory(previousPaths: string[] = []): Promise<{
    current: string;
    history: Array<{ path: string; version: number; migratedAt: string }>;
    nextVersion: number;
  }> {
    const history: Array<{ path: string; version: number; migratedAt: string }> =
      previousPaths.map((p, idx) => ({
        path: p,
        version: idx + 1,
        migratedAt: new Date().toISOString(),
      }));

    return {
      current: previousPaths[previousPaths.length - 1] || '',
      history,
      nextVersion: previousPaths.length + 1,
    };
  }

  /**
   * Sanitize workflow name for filesystem compatibility
   */
  static sanitizeWorkflowName(name: string): string {
    // Remove or replace invalid characters
    return name
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 100); // Limit length to 100 characters
  }

  /**
   * Detect the current platform
   */
  static getPlatform(): string {
    return process.platform;
  }

  /**
   * Check if the current platform is Windows
   */
  static isWindows(): boolean {
    return process.platform === 'win32';
  }

  /**
   * Check if the current platform is macOS
   */
  static isMacOS(): boolean {
    return process.platform === 'darwin';
  }

  /**
   * Check if the current platform is Linux
   */
  static isLinux(): boolean {
    return process.platform === 'linux';
  }

  /**
   * Normalize a path to the current platform format
   */
  static normalizePath(targetPath: string): string {
    return path.normalize(targetPath);
  }

  /**
   * Check if a path is within the CC directory structure
   */
  static async isInCCDirectory(targetPath: string, customBasePath?: string): Promise<boolean> {
    const config = await this.getConfig(customBasePath);
    const normalizedTarget = path.normalize(targetPath);
    const normalizedBase = path.normalize(config.basePath);

    return normalizedTarget.startsWith(normalizedBase + path.sep) ||
           normalizedTarget === normalizedBase;
  }

  /**
   * Get relative path within CC directory
   */
  static async getRelativePath(
    targetPath: string,
    customBasePath?: string
  ): Promise<string | null> {
    const config = await this.getConfig(customBasePath);
    try {
      return path.relative(config.basePath, targetPath);
    } catch {
      return null;
    }
  }
}

/**
 * Utility function to get default workflows directory
 */
export async function getDefaultWorkflowsDir(): Promise<string> {
  return CCPathResolver.getWorkflowsDir();
}

/**
 * Utility function to get workflow CC path
 */
export async function getWorkflowPath(workflowName: string): Promise<string> {
  return CCPathResolver.getWorkflowCCPath(workflowName);
}
