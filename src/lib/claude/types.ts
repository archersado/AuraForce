/**
 * Claude Command Type Definitions
 *
 * Defines interfaces for command translation and templating system.
 */

/**
 * Command types supported by the translation system
 */
export type CommandType =
  | 'read'
  | 'write'
  | 'execute'
  | 'debug'
  | 'explain'
  | 'refactor'
  | 'test'
  | 'other';

/**
 * Command structure after translation
 */
export interface Command {
  type: CommandType;
  action: string;
  parameters: Record<string, string | string[] | boolean>;
  description: string;
}

/**
 * Translation request from client
 */
export interface TranslationRequest {
  message: string;
  context?: {
    previousCommands?: Command[];
    workingDirectory?: string;
  };
}

/**
 * Translation result with confidence and alternatives
 */
export interface TranslationResult {
  command: Command;
  confidence: number;
  alternatives?: Command[];
  suggestions?: string[];
}

/**
 * Command template for pattern matching
 */
export interface CommandTemplate {
  id: string;
  pattern: RegExp;
  intent: CommandType;
  action: string;
  parameterMatch?: Record<string, RegExp | string>;
  description: string;
  examples: string[];
}

/**
 * Parameter extraction result
 */
export interface ExtractedParameters {
  [key: string]: string | string[] | boolean;
}

/**
 * Translation error types
 */
export interface TranslationError {
  code: 'UNKNOWN_INTENT' | 'MISSING_PARAMETERS' | 'AMBIGUOUS' | 'INVALID_INPUT';
  message: string;
  suggestions?: string[];
  partialCommand?: Command;
}
