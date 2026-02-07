/**
 * AI Code Assistant Component
 *
 * Provides AI-powered code assistance with natural language commands,
 * quick action buttons, and diff preview with apply/reject functionality.
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { apiPost } from '@/lib/api-client';
import CodeDiffViewer from './CodeDiffViewer';
import type { DiffResult } from '@/lib/ai/code-diff';

/**
 * Quick action buttons
 */
const QUICK_ACTIONS = [
  { id: 'improve', label: '改善这个函数', icon: '✨', english: 'Improve this function' },
  { id: 'comments', label: '添加注释', icon: '💬', english: 'Add comments' },
  { id: 'refactor', label: '重构代码', icon: '🔧', english: 'Refactor code' },
  { id: 'optimize', label: '优化性能', icon: '⚡', english: 'Optimize performance' },
] as const;

type QuickActionId = typeof QUICK_ACTIONS[number]['id'];

/**
 * Suggestion state
 */
interface Suggestion {
  id: string;
  originalCode: string;
  suggestedCode: string;
  diff: DiffResult;
  explanation: string;
  confidence: number;
  security: {
    isValid: boolean;
    score: number;
    issues: Array<{
      type: string;
      severity: string;
      message: string;
      suggestion?: string;
    }>;
    report?: string;
  };
  command: string;
  timestamp: Date;
}

interface AICodeAssistantProps {
  code: string;
  language?: string;
  onApplySuggestion: (suggestedCode: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AICodeAssistant({
  code,
  language = 'javascript',
  onApplySuggestion,
  isOpen = true,
  onClose,
  className = '',
}: AICodeAssistantProps) {
  // State
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);

  // Refs
  const commandInputRef = useRef<HTMLInputElement>(null);
  const suggestionIdRef = useRef<string>();

  /**
   * Handle quick action click
   */
  const handleQuickAction = useCallback((action: typeof QUICK_ACTIONS[number]) => {
    const commandText = action.english;
    setCommand(commandText);
    setActiveAction(action.id);
    handleAction(commandText);
  }, []);

  /**
   * Handle custom command submission
   */
  const handleSubmitCommand = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setActiveAction(null);
    await handleAction(command.trim());
  }, [command]);

  /**
   * Execute AI action
   */
  const handleAction = useCallback(async (actualCommand: string) => {
    if (!code.trim()) {
      setError('代码不能为空');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuggestion(null);

    try {
      const response = await apiPost('/api/ai/code-assist', {
        command: actualCommand,
        code,
        language,
        sessionId,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate suggestion');
      }

      // Check security
      if (!result.security.isValid) {
        setError(`Security concerns detected (${result.security.score}/100): ${result.security.report}`);
        // Still show suggestion but with warning
      }

      // Create suggestion object
      const newSuggestion: Suggestion = {
        id: crypto.randomUUID(),
        originalCode: result.original,
        suggestedCode: result.suggestion,
        diff: result.diff,
        explanation: result.explanation,
        confidence: result.confidence,
        security: result.security,
        command: actualCommand,
        timestamp: new Date(),
      };

      setSuggestion(newSuggestion);
      suggestionIdRef.current = newSuggestion.id;

      // Update session ID for context preservation
      if (!sessionId) {
        setSessionId(result.meta?.sessionId);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[AI Assistant] Error:', err);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
    }
  }, [code, language, sessionId]);

  /**
   * Handle apply suggestion
   */
  const handleApply = useCallback(() => {
    if (!suggestion) return;

    onApplySuggestion(suggestion.suggestedCode);
    setSuggestion(null);
    setCommand('');
    setActiveAction(null);
  }, [suggestion, onApplySuggestion]);

  /**
   * Handle reject suggestion
   */
  const handleReject = useCallback(() => {
    setSuggestion(null);
    setCommand('');
    setActiveAction(null);
  }, []);

  /**
   * Focus command input when panel opens
   */
  useEffect(() => {
    if (isOpen && commandInputRef.current && !suggestion) {
      commandInputRef.current.focus();
    }
  }, [isOpen, suggestion]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`ai-code-assistant ${className}`}>
      {/* Header */}
      <div className="ai-assistant-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h3 className="font-semibold">AI 代码助手</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="ai-assistant-input">
        {/* Quick Actions */}
        <div className="quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              disabled={isProcessing}
              className={`quick-action-btn ${activeAction === action.id ? 'active' : ''} ${isProcessing ? 'disabled' : ''}`}
              title={action.english}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Command */}
        <form onSubmit={handleSubmitCommand} className="command-form">
          <div className="input-group">
            <span className="input-icon">💭</span>
            <input
              ref={commandInputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="输入指令，如：'简化这个函数'、'添加 TypeScript 类型'..."
              disabled={isProcessing}
              className="command-input"
            />
            <button
              type="submit"
              disabled={isProcessing || !command.trim()}
              className="submit-btn"
            >
              {isProcessing ? '⏳' : '🚀'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="ai-error-message">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <p className="error-title">Error</p>
            <p className="error-text">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="error-close">✕</button>
        </div>
      )}

      {/* Loading State */}
      {isProcessing && (
        <div className="ai-loading">
          <div className="loading-spinner"></div>
          <p>AI 正在分析代码...</p>
        </div>
      )}

      {/* Suggestion Result */}
      {suggestion && !isProcessing && (
        <div className="ai-suggestion">
          {/* Command Context */}
          <div className="suggestion-header">
            <div className="command-badge">
              <span className="badge-icon">{(QUICK_ACTIONS.find(a => a.english.includes(suggestion.command))?.icon) || '📝'}</span>
              <span className="badge-text">{suggestion.command}</span>
            </div>
            <div className="suggestion-meta">
              <span className="confidence-badge" style={{
                backgroundColor: suggestion.confidence >= 0.8 ? '#dcfce7' :
                                 suggestion.confidence >= 0.5 ? '#fef9c3' : '#fee2e2',
                color: suggestion.confidence >= 0.8 ? '#166534' :
                       suggestion.confidence >= 0.5 ? '#854d0e' : '#991b1b',
              }}>
                置信度: {Math.round(suggestion.confidence * 100)}%
              </span>
              {!suggestion.security.isValid && (
                <span className="security-badge warning">
                  ⚠️ 存在安全问题 ({suggestion.security.score}/100)
                </span>
              )}
            </div>
          </div>

          {/* Security Report */}
          {!suggestion.security.isValid && suggestion.security.issues.length > 0 && (
            <div className="security-warning">
              <div className="warning-header">
                <span>🔒</span>
                <h4>安全警告</h4>
              </div>
              <div className="warning-content">
                {suggestion.security.issues.map((issue, idx) => (
                  <div key={idx} className="issue-item">
                    <span className={`issue-marker issue-${issue.severity}`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <div>
                      <p className="issue-type">{issue.type}</p>
                      <p className="issue-message">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="issue-suggestion">💡 {issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {suggestion.explanation && (
            <div className="suggestion-explanation">
              <h4>改動說明</h4>
              <p>{suggestion.explanation}</p>
            </div>
          )}

          {/* Diff Viewer */}
          <div className="suggestion-diff">
            <CodeDiffViewer
              diff={suggestion.diff}
              fileName={`code.${language}`}
              language={language}
              viewMode="unified"
              maxHeight="400px"
            />
          </div>

          {/* Action Buttons */}
          <div className="suggestion-actions">
            <button
              onClick={handleApply}
              disabled={!suggestion.security.isValid}
              className={`action-btn apply-btn ${!suggestion.security.isValid ? 'disabled' : ''}`}
              title={!suggestion.security.isValid ? '存在安全问题，无法应用' : '应用建议'}
            >
              <span className="btn-icon">✅</span>
              <span>应用建议</span>
            </button>
            <button
              onClick={handleReject}
              className="action-btn reject-btn"
            >
              <span className="btn-icon">❌</span>
              <span>拒绝</span>
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!suggestion && !isProcessing && !error && (
        <div className="ai-help-text">
          <p>💡 <strong>使用提示：</strong></p>
          <ul>
            <li>点击上方快捷按钮进行常见操作</li>
            <li>输入自定义指令获得更精准的帮助</li>
            <li>AI 会理解上下文并保持对话历史</li>
            <li>查看 Diff 预览后再决定是否应用</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AICodeAssistant;
