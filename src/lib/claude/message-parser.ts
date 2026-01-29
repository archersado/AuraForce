/**
 * SDK Message Parser
 *
 * Converts Claude Agent SDK messages to interactive message types.
 * Handles tool_use responses including askuserquestions and other interactive tools.
 */

import type {
  AskUserQuestionsMessage,
  ConfirmMessage,
  SelectMessage,
  InputMessage,
  ApprovalRequestMessage,
  InteractiveMessage,
  UserQuestion,
} from '@/types/interactive-message';

/**
 * SDK Message structure from Claude Agent SDK
 */
interface SDKToolUse {
  content: Array<{
    type: 'tool_use';
    name: string;
    input?: Record<string, unknown>;
    id: string;
  }>;
}
/**
 * Parsed interactive message result
 */
export interface ParsedInteractiveMessage {
  interactive: InteractiveMessage | null;
  content: string;  // Non-interactive content to display
}

/**
 * Check if a message contains an interactive tool use
 */
export function hasInteractiveTool(message: unknown): boolean {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const msg = message as Record<string, unknown>;

  // Check for tool_use with interactive tool names
  if (msg.type === 'tool_use' || msg.content_block) {
    const toolName = msg.name || (msg.content_block as any)?.name;
    if (toolName && isInteractiveToolName(toolName)) {
      return true;
    }
  }

  // Check for message with tool_use in content
  if (msg.message && Array.isArray((msg.message as any).content)) {
    const content = (msg.message as any).content as Array<unknown>;
    for (const item of content) {
      if (typeof item === 'object' && item !== null) {
        const typedItem = item as Record<string, unknown>;
        if (typedItem.type === 'tool_use' && typedItem.name && isInteractiveToolName(typedItem.name as string)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if a tool name is interactive
 */
export function isInteractiveToolName(toolName: string): boolean {
  const interactiveTools = [
    'askuserquestions',
    'ask_user_questions',
    'confirm',
    'userconfirm',
    'select',
    'choose',
    'input',
    'get_input',
    'fileselect',
    'select_file',
    'directoryselect',
    'select_directory',
    'approvechanges',
    'requestapproval',
  ];
  return interactiveTools.some((name) => toolName.toLowerCase().includes(name));
}

/**
 * Parse SDK message into interactive components
 */
export function parseInteractiveMessage(
  message: unknown,
  toolId?: string
): ParsedInteractiveMessage {
  let interactive: InteractiveMessage | null = null;
  let content = '';

  if (!message || typeof message !== 'object') {
    return { interactive: null, content: '' };
  }

  const msg = message as Record<string, unknown>;

  // Try different message structures
  const toolUses = extractToolUses(msg);

  for (const toolUse of toolUses) {
    if (isInteractiveToolName(toolUse.name)) {
      const parsed = parseToolUse(toolUse.name, toolUse.input || {}, toolUse.id);
      if (parsed) {
        interactive = parsed;
        // Add formatted content before interactive component
        content += `\n\n${formatToolDescription(toolUse)}\n\n`;
      }
    } else {
      // Add tool info as regular content
      content += formatToolDescription(toolUse);
    }
  }

  return { interactive, content };
}

/**
 * Extract all tool_use items from different message structures
 */
function extractToolUses(message: Record<string, unknown>): Array<{ name: string; input: Record<string, unknown>; id: string }> {
  const results: Array<{ name: string; input: Record<string, unknown>; id: string }> = [];

  // Check for direct tool_use
  if (message.type === 'tool_use') {
    results.push({
      name: message.name as string || 'unknown',
      input: (message.input as Record<string, unknown>) || {},
      id: message.id as string || crypto.randomUUID(),
    });
  }

  // Check for content_block
  if (message.content_block && typeof message.content_block === 'object') {
    const block = message.content_block as Record<string, unknown>;
    if (block.type === 'tool_use') {
      results.push({
        name: block.name as string || 'unknown',
        input: (block.input as Record<string, unknown>) || {},
        id: block.id as string || crypto.randomUUID(),
      });
    }
  }

  // Check for array of content items
  if (message.message && Array.isArray((message.message as any).content)) {
    const content = (message.message as any).content as Array<unknown>;
    for (const item of content) {
      if (typeof item === 'object' && item !== null) {
        const typedItem = item as Record<string, unknown>;
        if (typedItem.type === 'tool_use') {
          results.push({
            name: typedItem.name as string || 'unknown',
            input: (typedItem.input as Record<string, unknown>) || {},
            id: typedItem.id as string || crypto.randomUUID(),
          });
        }
      }
    }
  }

  // Check for content array directly
  if (message.content && Array.isArray(message.content)) {
    for (const item of message.content as Array<unknown>) {
      if (typeof item === 'object' && item !== null) {
        const typedItem = item as Record<string, unknown>;
        if (typedItem.type === 'tool_use') {
          results.push({
            name: typedItem.name as string || 'unknown',
            input: (typedItem.input as Record<string, unknown>) || {},
            id: typedItem.id as string || crypto.randomUUID(),
          });
        }
      }
    }
  }

  return results;
}

/**
 * Parse individual tool_use into InteractiveMessage
 */
function parseToolUse(
  toolName: string,
  input: Record<string, unknown>,
  toolId: string
): InteractiveMessage | null {
  const lowerToolName = toolName.toLowerCase();

  if (lowerToolName.includes('ask_user_questions') || lowerToolName.includes('askuserquestions')) {
    return parseAskUserQuestions(toolName, input, toolId);
  }

  if (lowerToolName.includes('confirm') || lowerToolName.includes('userconfirm')) {
    return parseConfirm(toolName, input, toolId);
  }

  if (lowerToolName.includes('select') || lowerToolName.includes('choose')) {
    return parseSelect(toolName, input, toolId);
  }

  if (lowerToolName.includes('input') || lowerToolName.includes('get_input')) {
    return parseInput(toolName, input, toolId);
  }

  if (lowerToolName.includes('approve') || lowerToolName.includes('requestapproval')) {
    return parseApprovalRequest(toolName, input, toolId);
  }

  return null;
}

/**
 * Parse askuserquestions tool
 */
function parseAskUserQuestions(toolName: string, input: Record<string, unknown>, toolId: string): AskUserQuestionsMessage {
  const questionsInput: unknown = input.questions;
  const questions: UserQuestion[] = [];

  if (Array.isArray(questionsInput)) {
    questionsInput.forEach((q, idx) => {
      const question = q as Record<string, unknown>;

      // Support both old and new formats
      const questionType: UserQuestion['type'] = parseQuestionType(question);

      questions.push({
        id: question.id as string || `q${idx}`,
        question: question.question as string || question.title as string || `Question ${idx + 1}`,
        type: questionType,
        header: question.header as string | undefined, // New format field
        options: parseOptions(question, questionType),
        placeholder: question.placeholder as string | undefined,
        required: question.required !== undefined ? question.required as boolean : true,
        defaultValue: question.defaultValue as string | string[] | undefined,
        currentAnswer: undefined,
      } as UserQuestion);
    });
  }

  return {
    id: `interactive-${toolId}`,
    toolName,
    toolId,
    type: 'ask_user_questions',
    title: input.title as string || 'Answer Questions',
    description: input.description as string,
    questions,
    instruction: input.instruction as string,
    timestamp: new Date(),
    isResolved: false,
  };
}

/**
 * Parse question type from various formats
 */
function parseQuestionType(question: Record<string, unknown>): UserQuestion['type'] {
  // Check for explicit type field
  if (question.type && typeof question.type === 'string') {
    const validTypes: UserQuestion['type'][] = ['text', 'select', 'multi_select', 'confirm', 'number', 'textarea'];
    if (validTypes.includes(question.type as UserQuestion['type'])) {
      return question.type as UserQuestion['type'];
    }
  }

  // Infer from multiSelect field (new format)
  if (question.multiSelect === true) {
    return 'multi_select';
  }
  if (question.multiSelect === false) {
    return 'select';
  }

  // Infer from options presence
  if (question.options && Array.isArray(question.options)) {
    return question.multiSelect === true ? 'multi_select' : 'select';
  }

  // Default to text
  return 'text';
}

/**
 * Parse options from question, supporting both string array and object array formats
 */
function parseOptions(question: Record<string, unknown>, questionType: UserQuestion['type']): string[] | undefined {
  const optionsInput = question.options;

  if (!optionsInput || !Array.isArray(optionsInput)) {
    return undefined;
  }

  if (optionsInput.length === 0) {
    return undefined;
  }

  // If options are strings
  if (typeof optionsInput[0] === 'string') {
    return optionsInput as string[];
  }

  // If options are objects (new format)
  if (typeof optionsInput[0] === 'object' && optionsInput[0] !== null) {
    return (optionsInput as Array<Record<string, unknown>>).map(opt =>
      opt.label as string || opt.value as string || String(opt)
    );
  }

  return undefined;
}

/**
 * Parse confirm tool
 */
function parseConfirm(toolName: string, input: Record<string, unknown>, toolId: string): ConfirmMessage {
  // Detect confirm style from message or context
  const message = input.message as string || 'Are you sure you want to proceed?';
  const isDangerous = /delete|remove|destroy|danger/i.test(message);
  const isWarning = /warning|caution|alert/i.test(message);

  return {
    id: `interactive-${toolId}`,
    toolName,
    toolId,
    type: 'confirm',
    title: input.title as string || 'Confirmation Required',
    message,
    details: input.details as Record<string, unknown> | undefined,
    confirmText: input.confirmText as string | undefined,
    denyText: input.denyText as string | undefined,
    confirmStyle: isDangerous ? 'danger' : isWarning ? 'warning' : 'info',
    timestamp: new Date(),
    isResolved: false,
  };
}

/**
 * Parse/select choose tool
 */
function parseSelect(toolName: string, input: Record<string, unknown>, toolId: string): SelectMessage {
  const options = (input.options as Array<unknown> || []).map((opt, idx) => {
    const option = opt as Record<string, unknown>;
    return {
      id: option.id as string || option.value as string || `opt${idx}`,
      label: option.label as string || (option.value as string) || `Option ${idx + 1}`,
      value: option.value as string || String(option.id) || `opt${idx}`,
      description: option.description as string | undefined,
      icon: option.icon as string | undefined,
      disabled: option.disabled as boolean | undefined,
    };
  });

  return {
    id: `interactive-${toolId}`,
    toolName,
    toolId,
    type: input.multiple ? 'multi_select' : 'select',
    title: input.title as string,
    description: input.description as string,
    options,
    multiple: input.multiple as boolean | undefined,
    minSelections: input.minSelections as number | undefined,
    maxSelections: input.maxSelections as number | undefined,
    searchPlaceholder: input.searchPlaceholder as string | undefined,
    timestamp: new Date(),
    isResolved: false,
  };
}

/**
 * Parse input/get_input tool
 */
function parseInput(toolName: string, input: Record<string, unknown>, toolId: string): InputMessage {
  // Detect input type from various properties
  const inputType = input.inputType as string || input.type as string || 'text';
  const validTypes = ['text', 'number', 'email', 'password', 'textarea', 'code'];

  return {
    id: `interactive-${toolId}`,
    toolName,
    toolId,
    type: 'input',
    title: input.title as string,
    fieldLabel: input.fieldLabel as string || input.label as string || 'Please provide input',
    inputType: validTypes.includes(inputType) ? inputType as InputMessage['inputType'] : 'text',
    placeholder: input.placeholder as string | undefined,
    defaultValue: input.defaultValue as string | undefined,
    validation: input.validation as {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
    } | undefined,
    timestamp: new Date(),
    isResolved: false,
  };
}

/**
 * Parse approve/requestapproval tool
 */
function parseApprovalRequest(toolName: string, input: Record<string, unknown>, toolId: string): ApprovalRequestMessage {
  const changesArray = input.changes as Array<unknown> || [];

  const changes = changesArray.map((c, idx) => {
    const change = c as Record<string, unknown>;
    return {
      filePath: change.filePath as string || `file-${idx}`,
      changeType: change.changeType as ApprovalRequestMessage['changes'][0]['changeType'] || 'modify',
      diff: change.diff as string | undefined,
      reason: change.reason as string | undefined,
    };
  });

  // Detect risk level from message or file patterns
  let riskLevel: ApprovalRequestMessage['riskLevel'] = 'medium';
  const summary = input.summary as string || '';

  if (/delete|remove/i.test(summary) || changes.some(c => c.changeType === 'delete')) {
    riskLevel = 'high';
  } else if (/create|new/i.test(summary) || changes.some(c => c.changeType === 'create')) {
    riskLevel = 'low';
  }

  return {
    id: `interactive-${toolId}`,
    toolName,
    toolId,
    type: 'approval_request',
    title: input.title as string || 'Code Changes Require Approval',
    description: input.description as string | undefined,
    changes,
    summary,
    riskLevel,
    estimatedImpact: input.estimatedImpact as string | undefined,
    timestamp: new Date(),
    isResolved: false,
  };
}

/**
 * Format tool description for display
 */
function formatToolDescription(toolUse: { name: string; input: Record<string, unknown> }): string {
  const { name, input } = toolUse;
  const toolInput = Object.keys(input).length > 0 ? JSON.stringify(input, null, 2) : '{}';

  return `\n\n🔧 **Using tool:** \`${name}\`\n\`\`\`\n${toolInput}\n\`\`\`\n\n`;
}
