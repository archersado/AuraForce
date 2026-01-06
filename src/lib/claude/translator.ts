/**
 * Claude Command Translator Service
 *
 * Translates natural language input to structured CLI commands.
 */

import type { TranslationRequest, TranslationResult } from './types';
import { parseCommand, generateAlternatives, validateCommand } from './command-parser';

/**
 * Translate natural language to CLI command
 */
export async function translateCommand(
  request: TranslationRequest
): Promise<TranslationResult> {
  const { message, context } = request;

  // Parse the command
  const parseResult = parseCommand(message);

  // Handle parse errors
  if ('error' in parseResult) {
    // Return as translation result with error info
    return {
      command: {
        type: 'other',
        action: 'raw-input',
        parameters: { input: message },
        description: 'Unable to parse command, treating as raw input',
      },
      confidence: 0,
      suggestions: parseResult.error.suggestions,
    };
  }

  const { command, confidence } = parseResult;

  // Validate required parameters
  const validationError = validateCommand(command);

  if (validationError) {
    return {
      command,
      confidence: 0.3,
      suggestions: validationError.suggestions,
    };
  }

  // Generate alternatives for low confidence translations
  const alternatives = generateAlternatives(message, confidence);

  // Generate suggestions based on context
  const suggestions = generateSuggestions(message, command, confidence, context);

  return {
    command,
    confidence,
    alternatives: alternatives && alternatives.length > 0 ? alternatives : undefined,
    suggestions: suggestions && suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Generate suggestions for improving translation accuracy
 */
function generateSuggestions(
  message: string,
  command: { description: string },
  confidence: number,
  context?: TranslationRequest['context']
): string[] | undefined {
  const suggestions: string[] = [];

  // Low confidence suggestions
  if (confidence < 0.5) {
    suggestions.push('Try being more specific with component/file names');
    suggestions.push('Include the programming language or framework');
  }

  // Context-based suggestions
  if (context?.previousCommands && context.previousCommands.length > 0) {
    const lastCommand = context.previousCommands[context.previousCommands.length - 1];
    suggestions.push(`Previous action: ${lastCommand.action}`);
  }

  return suggestions.length > 0 ? suggestions : undefined;
}

/**
 * Batch translate multiple messages (for future use)
 */
export async function translateBatch(
  messages: string[]
): Promise<TranslationResult[]> {
  const translations = messages.map(async (message) => {
    return translateCommand({ message });
  });

  return Promise.all(translations);
}
