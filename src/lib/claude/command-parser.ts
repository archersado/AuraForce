/**
 * Claude Command Parser
 *
 * Parses natural language input to extract command parameters.
 */

import type { Command, CommandType, ExtractedParameters, TranslationError } from './types';
import { commandTemplates, findMatchingTemplate } from './command-templates';

/**
 * Detect command intent from input
 */
function detectCommandIntent(input: string): CommandType {
  const lowerInput = input.toLowerCase();

  // Write/Create patterns
  if (/create|write|add|new|make/i.test(lowerInput) && /component|file|function|class/i.test(lowerInput)) {
    return 'write';
  }

  // Read patterns
  if (/read|show|display|list|get/i.test(lowerInput)) {
    return 'read';
  }

  // Debug patterns
  if (/debug|fix|find (?:bug|issue|error|problem)|what(?:'s| is) wrong/i.test(lowerInput)) {
    return 'debug';
  }

  // Explain patterns
  if (/explain|how does|describe|what (?:is|does) (?:this|the|it)/i.test(lowerInput)) {
    return 'explain';
  }

  // Refactor patterns
  if (/refactor|improve|optimize|clean/i.test(lowerInput)) {
    return 'refactor';
  }

  // Test patterns
  if (/test|spec|coverage|assert/i.test(lowerInput)) {
    return 'test';
  }

  // Execute patterns
  if (/run|execute|build|deploy|start/i.test(lowerInput)) {
    return 'execute';
  }

  return 'other';
}

/**
 * Extract parameters from regex match groups
 */
function extractParameters(
  matches: RegExpMatchArray,
  templatePattern: RegExp
): ExtractedParameters {
  const parameters: ExtractedParameters = {};

  // Extract named and numbered capture groups
  for (let i = 1; i < matches.length; i++) {
    const capture = matches[i];
    if (capture) {
      // Try to identify parameter name from pattern
      const patternSource = templatePattern.source;
      const nameRegex = /\?<(\w+)>/g;
      const namedCaptures: { name: string; index: number }[] = [];
      let match: RegExpExecArray | null;

      while ((match = nameRegex.exec(patternSource)) !== null) {
        namedCaptures.push({ name: match[1], index: match.index });
      }

      if (i - 1 < namedCaptures.length && namedCaptures[i - 1]) {
        // Named capture group
        const paramName = namedCaptures[i - 1].name;
        parameters[paramName] = capture.trim();
      } else {
        // Numbered capture group - use generic names
        const paramNames = ['text', 'name', 'value', 'detail'];
        parameters[paramNames[(i - 1) % paramNames.length]] = capture.trim();
      }
    }
  }

  return parameters;
}

/**
 * Parse user input into a command structure
 */
export function parseCommand(
  input: string
): { command: Command; confidence: number } | { error: TranslationError } {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      error: {
        code: 'INVALID_INPUT',
        message: 'Input cannot be empty',
        suggestions: ['Try typing a command like "create component Header"'],
      },
    };
  }

  // Try to match against templates first
  const templateMatch = findMatchingTemplate(trimmedInput);

  if (templateMatch) {
    const { template, matches } = templateMatch;
    const parameters = extractParameters(matches, template.pattern);

    return {
      command: {
        type: template.intent,
        action: template.action,
        parameters,
        description: template.description,
      },
      confidence: 0.9, // High confidence for template matches
    };
  }

  // Fallback: detect intent and create generic command
  const intent = detectCommandIntent(trimmedInput);

  return {
    command: {
      type: intent,
      action: `${intent}-generic`,
      parameters: {
        input: trimmedInput,
      },
      description: `Perform ${intent} operation with input: "${trimmedInput}"`,
    },
    confidence: 0.5, // Lower confidence for generic matches
  };
}

/**
 * Validate command has required parameters
 */
export function validateCommand(command: Command): TranslationError | null {
  const requiredParams = getRequiredParameters(command.action);

  for (const param of requiredParams) {
    if (!command.parameters[param] || command.parameters[param] === '') {
      return {
        code: 'MISSING_PARAMETERS',
        message: `Missing required parameter: ${param}`,
        suggestions: [`Provide a value for ${param}`],
        partialCommand: command,
      };
    }
  }

  return null;
}

/**
 * Get required parameters for a command action
 */
function getRequiredParameters(action: string): string[] {
  const requiredParamsMap: Record<string, string[]> = {
    'create-component': ['name'],
    'create-file': ['filename'],
    'write-code': ['name'],
    'read-file': ['filename'],
    'debug-function': ['functionName'],
    'explain-function': ['functionName'],
    'write-test': ['functionName'],
    'run-script': ['scriptName'],
  };

  return requiredParamsMap[action] || [];
}

/**
 * Generate alternative commands for ambiguous input
 */
export function generateAlternatives(
  input: string,
  confidence: number
): Command[] | undefined {
  if (confidence > 0.7) {
    return undefined; // No alternatives needed for high confidence
  }

  const alternatives: Command[] = [];

  // Generate alternatives with different intents
  const intents: CommandType[] = ['read', 'write', 'debug', 'explain'];

  // Try each intent
  for (const intent of intents) {
    if (intent !== detectCommandIntent(input)) {
      alternatives.push({
        type: intent,
        action: `${intent}-alt`,
        parameters: { input },
        description: `Alternative: Perform ${intent} operation`,
      });
    }
  }

  return alternatives.length > 0 ? alternatives : undefined;
}
