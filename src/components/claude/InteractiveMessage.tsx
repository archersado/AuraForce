/**
 * InteractiveMessage Component
 *
 * Renders various interactive message types from Claude Agent SDK.
 * Supports askuserquestions, confirm, select, and other tool responses.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  FileText,
  FolderOpen,
  Code,
  AlertCircle,
} from 'lucide-react';
import type {
  InteractiveMessage,
  AskUserQuestionsMessage,
  ConfirmMessage,
  SelectMessage,
  InputMessage,
  ApprovalRequestMessage,
} from '@/types/interactive-message';

interface InteractiveMessageProps {
  message: InteractiveMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}

const containerVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function InteractiveMessage({
  message,
  onResponse,
  disabled = false,
}: InteractiveMessageProps) {
  const [expanded, setExpanded] = useState(false);

  if (message.isResolved) {
    return (
      <motion.div
        className="bg-green-50 border border-green-200 rounded-lg p-3 my-2"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <Check className="w-4 h-4" />
          <span>
            {message.type === 'confirm' && 'Confirm'}
            {message.type === 'ask_user_questions' && 'Questions answered'}
            {message.type === 'select' && 'Option selected'}
            {message.type === 'multi_select' && 'Options selected'}
            {message.type === 'input' && 'Input provided'}
            {message.type === 'approval_request' && 'Changes approved'}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-sm my-2 overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <ToolIcon toolName={message.toolName} type={message.type} />
          <div>
            <h3 className="font-medium text-gray-900">
              {message.title || formatToolTitle(message.toolName, message.type)}
            </h3>
            {message.description && (
              <p className="text-sm text-gray-500">{message.description}</p>
            )}
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-4 py-3 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {message.type === 'ask_user_questions' && (
              <AskUserQuestionsForm
                message={message as AskUserQuestionsMessage}
                onResponse={onResponse}
                disabled={disabled}
              />
            )}
            {message.type === 'confirm' && (
              <ConfirmDialog
                message={message as ConfirmMessage}
                onResponse={onResponse}
                disabled={disabled}
              />
            )}
            {message.type === 'select' || message.type === 'multi_select' ? (
              <SelectOptions
                message={message as SelectMessage}
                onResponse={onResponse}
                disabled={disabled}
              />
            ) : null}
            {message.type === 'input' && (
              <InputField
                message={message as InputMessage}
                onResponse={onResponse}
                disabled={disabled}
              />
            )}
            {message.type === 'approval_request' && (
              <ApprovalRequest
                message={message as ApprovalRequestMessage}
                onResponse={onResponse}
                disabled={disabled}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Tool Icon
 */
function ToolIcon({
  toolName,
  type,
}: {
  toolName: string;
  type: InteractiveMessage['type'];
}) {
  const iconClassName = 'w-5 h-5';

  switch (type) {
    case 'confirm':
      return toolName === 'askuserquestions' ? (
        <Check className={iconClassName + ' text-blue-600'} />
      ) : (
        <AlertCircle className={iconClassName + ' text-yellow-600'} />
      );
    case 'ask_user_questions':
      return <HelpCircle className={iconClassName + ' text-purple-600'} />;
    case 'approval_request':
      return <Code className={iconClassName + ' text-orange-600'} />;
    case 'file_select':
      return <FileText className={iconClassName + ' text-green-600'} />;
    case 'directory_select':
      return <FolderOpen className={iconClassName + ' text-blue-600'} />;
    case 'input':
      return <AlertTriangle className={iconClassName + ' text-amber-600'} />;
    default:
      return <Code className={iconClassName + ' text-gray-600'} />;
  }
}

function formatToolTitle(toolName: string, type: InteractiveMessage['type']): string {
  // Format tool name to be more readable
  const formatted = toolName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^./, (s) => s.toUpperCase());

  const typeSuffixes: Record<InteractiveMessage['type'], string> = {
    ask_user_questions: '',
    confirm: '',
    select: '',
    multi_select: '',
    input: '',
    file_select: ' - Select File',
    directory_select: ' - Select Directory',
    approval_request: ' - Requires Approval',
    error_verification: ' - Verify Error',
  };

  return formatted + (typeSuffixes[type] || '');
}

/**
 * Ask User Questions Form
 */
function AskUserQuestionsForm({
  message,
  onResponse,
  disabled,
}: {
  message: AskUserQuestionsMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    // Check required questions
    const missing = message.questions.filter((q) => q.required && !answers[q.id]);
    if (missing.length > 0) {
      alert(`Please answer all required questions: ${missing.map((q) => q.question).join(', ')}`);
      return;
    }
    onResponse(answers);
  };

  return (
    <div className="space-y-4">
      {message.instruction && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-900">{message.instruction}</p>
        </div>
      )}
      {message.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {question.type === 'text' && (
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={question.placeholder}
              defaultValue={question.defaultValue as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={disabled}
            />
          )}
          {question.type === 'textarea' && (
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={question.placeholder}
              defaultValue={question.defaultValue as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={disabled}
              rows={3}
            />
          )}
          {question.type === 'select' && question.options && (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={disabled}
            >
              <option value="">Select an option...</option>
              {question.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {question.type === 'multi_select' && question.options && (
            <div className="space-y-1">
              {question.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                    defaultChecked={Array.isArray(question.defaultValue) ? question.defaultValue.includes(opt) : false}
                    onChange={(e) => {
                      const current = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...current, opt]);
                      } else {
                        handleAnswerChange(question.id, current.filter((o) => o !== opt));
                      }
                    }}
                    disabled={disabled}
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}
          {question.type === 'confirm' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => handleAnswerChange(question.id, e.target.checked ? 'true' : 'false')}
                  disabled={disabled}
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => handleAnswerChange(question.id, e.target.checked ? 'true' : 'false')}
                  disabled={disabled}
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          )}
          {question.type === 'number' && (
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={question.placeholder || 'Enter a number'}
              defaultValue={question.defaultValue as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      ))}
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        onClick={handleSubmit}
        disabled={disabled}
      >
        Submit Answers
      </button>
    </div>
  );
}

/**
 * Confirm Dialog
 */
function ConfirmDialog({
  message,
  onResponse,
  disabled,
}: {
  message: ConfirmMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}) {
  const confirmStyle =
    {
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    }[message.confirmStyle || 'info'];

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-md border ${
        message.confirmStyle === 'danger' ? 'bg-red-50 border-red-200 text-red-900' :
        message.confirmStyle === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
        'bg-blue-50 border-blue-200 text-blue-900'
      }`}>
        <p className="font-medium">{message.message}</p>
        {message.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm opacity-70">View details</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-48 border">
              {JSON.stringify(message.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
      <div className="flex gap-3">
        <button
          className={`flex-1 py-2 px-4 text-white rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${confirmStyle}`}
          onClick={() => onResponse(true)}
          disabled={disabled}
        >
          {message.confirmText || 'Confirm'}
        </button>
        <button
          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => onResponse(false)}
          disabled={disabled}
        >
          {message.denyText || 'Cancel'}
        </button>
      </div>
    </div>
  );
}

/**
 * Select Options
 */
function SelectOptions({
  message,
  onResponse,
  disabled,
}: {
  message: SelectMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(
    message.multiple ? [] : []
  );

  const handleToggle = (optionId: string) => {
    if (message.multiple) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId].slice(0, message.maxSelections || Infinity)
      );
    } else {
      setSelected([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      alert('Please select at least one option');
      return;
    }
    onResponse(message.multiple ? selected : selected[0]);
  };

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto space-y-2">
        {message.options.map((option) => (
          <button
            key={option.id}
            className={`w-full text-left p-3 rounded-md border-2 transition-colors ${
              selected.includes(option.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !option.disabled && handleToggle(option.id)}
            disabled={option.disabled || disabled}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                selected.includes(option.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selected.includes(option.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        onClick={handleSubmit}
        disabled={selected.length === 0 || disabled}
      >
        {message.multiple ? `Select${selected.length > 0 ? ` (${selected.length})` : ''}` : 'Select'}
      </button>
    </div>
  );
}

/**
 * Input Field
 */
function InputField({
  message,
  onResponse,
  disabled,
}: {
  message: InputMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(message.defaultValue || '');

  const handleSubmit = () => {
    onResponse(value);
  };

  const inputElement = {
    text: (
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={message.placeholder}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
    ),
    number: (
      <input
        type="number"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={message.placeholder || 'Enter a number'}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        min={message.validation?.min}
        max={message.validation?.max}
      />
    ),
    email: (
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={message.placeholder || 'Enter email address'}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
    ),
    password: (
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={message.placeholder || 'Enter password'}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
    ),
    textarea: (
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={message.placeholder}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        rows={6}
      />
    ),
    code: (
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
        placeholder={message.placeholder || 'Enter code...'}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        rows={8}
      />
    ),
  }[message.inputType];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {message.fieldLabel}
      </label>
      {inputElement}
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        onClick={handleSubmit}
        disabled={!value || disabled}
      >
        Submit
      </button>
    </div>
  );
}

/**
 * Approval Request
 */
function ApprovalRequest({
  message,
  onResponse,
  disabled,
}: {
  message: ApprovalRequestMessage;
  onResponse: (response: unknown) => void;
  disabled?: boolean;
}) {
  const [approved, setApproved] = useState<boolean | null>(null);

  const handleApprove = () => {
    setApproved(true);
    onResponse(true);
  };

  const handleReject = () => {
    setApproved(false);
    onResponse(false);
  };

  const riskBadge = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }[message.riskLevel];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${riskBadge}`}>
          {message.riskLevel.toUpperCase()} RISK
        </span>
        {message.estimatedImpact && (
          <span className="text-xs text-gray-500">{message.estimatedImpact}</span>
        )}
      </div>
      {message.summary && (
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-sm text-gray-700">{message.summary}</p>
        </div>
      )}
      <div className="space-y-2">
        {message.changes.map((change, idx) => (
          <div key={idx} className="border border-gray-200 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{change.filePath}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                change.changeType === 'create' ? 'bg-green-100 text-green-800' :
                change.changeType === 'delete' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {change.changeType.toUpperCase()}
              </span>
            </div>
            {change.reason && (
              <p className="text-xs text-gray-600 mb-2">{change.reason}</p>
            )}
            {change.diff && (
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">View diff</summary>
                <pre className="mt-2 p-2 bg-gray-900 text-green-400 rounded overflow-auto max-h-32">
                  {change.diff}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          onClick={handleApprove}
          disabled={disabled}
        >
          Approve Changes
        </button>
        <button
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          onClick={handleReject}
          disabled={disabled}
        >
          Reject Changes
        </button>
      </div>
    </div>
  );
}
