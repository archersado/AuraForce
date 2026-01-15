/**
 * Interactive Message Types
 *
 * Defines types for Claude Agent SDK interactive messages that require user input.
 * Includes askuserquestions, confirm, select, and other tool responses.
 */

/**
 * Base interface for interactive tool responses
 */
export interface InteractiveMessage {
  id: string;
  toolName: string;
  toolId: string;
  type: InteractiveMessageType;
  title?: string;
  description?: string;
  timestamp: Date;
  isResolved: boolean;
}

/**
 * Types of interactive messages
 */
export type InteractiveMessageType =
  | 'ask_user_questions'      // User needs to answer questions
  | 'confirm'                  // User needs to confirm/deny an action
  | 'select'                   // User needs to select from options
  | 'multi_select'             // User needs to select multiple options
  | 'input'                    // User needs to provide an input value
  | 'file_select'              // User needs to select a file
  | 'directory_select'         // User needs to select a directory
  | 'approval_request'         // User needs to approve a code change
  | 'error_verification'       // User needs to verify an error situation;

/**
 * askuserquestions tool response
 */
export interface AskUserQuestionsMessage extends InteractiveMessage {
  type: 'ask_user_questions';
  questions: UserQuestion[];
  instruction?: string;
}

export interface UserQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multi_select' | 'confirm' | 'number' | 'textarea';
  options?: string[];
  placeholder?: string;
  required: boolean;
  defaultValue?: string | string[];
  currentAnswer?: string | string[];
}

/**
 * confirm tool response
 */
export interface ConfirmMessage extends InteractiveMessage {
  type: 'confirm';
  message: string;
  details?: Record<string, unknown>;
  confirmText?: string;      // Default: "Confirm"
  denyText?: string;         // Default: "Cancel"
  confirmStyle?: 'danger' | 'warning' | 'info' | 'success';
}

/**
 * select tool response
 */
export interface SelectMessage extends InteractiveMessage {
  type: 'select' | 'multi_select';
  options: SelectOption[];
  multiple?: boolean;
  minSelections?: number;
  maxSelections?: number;
  searchPlaceholder?: string;
}

export interface SelectOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * input tool response
 */
export interface InputMessage extends InteractiveMessage {
  type: 'input';
  fieldLabel: string;
  inputType: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'code';
  placeholder?: string;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

/**
 * file/directory selection response
 */
export interface FileSelectMessage extends InteractiveMessage {
  type: 'file_select' | 'directory_select';
  path?: string;
  allowMultiple?: boolean;
  allowedExtensions?: string[];
  description?: string;
}

/**
 * approval request for code changes
 */
export interface ApprovalRequestMessage extends InteractiveMessage {
  type: 'approval_request';
  changes: CodeChange[];
  summary?: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedImpact?: string;
}

export interface CodeChange {
  filePath: string;
  changeType: 'create' | 'modify' | 'delete';
  diff?: string;
  reason?: string;
}

/**
 * User response to an interactive message
 */
export interface InteractiveResponse {
  messageId: string;
  toolId: string;
  toolName: string;
  response: unknown;
  timestamp: Date;
}

/**
 * Message with embedded interactive component
 */
export interface MessageWithInteractive {
  id: string;
  role: 'assistant' | 'system';
  content: string;              // Text content before/after the interactive component
  hasInteractive: true;
  interactive: InteractiveMessage;
  streaming?: boolean;
  timestamp: Date;
}

/**
 * Extended Message type that includes interactive messages
 */
export type ExtendedMessage =
  | MessageWithInteractive
  | {                         // Regular message (non-interactive)
      id: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
      timestamp: Date;
      hasInteractive: false;
      streaming?: boolean;
    };
