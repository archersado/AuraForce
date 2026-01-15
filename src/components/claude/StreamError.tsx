/**
 * Stream Error Component
 *
 * Display error messages for failed streams with retry mechanism.
 * Provides user-friendly error messages and recovery options.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useClaudeStore } from '@/lib/store/claude-store';
import type { StreamError as StreamErrorType } from '@/lib/claude/types';

interface StreamErrorProps {
  messageId: string;
  error?: StreamErrorType;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

/**
 * Get human-readable error message
 */
function getErrorMessage(error: StreamErrorType): string {
  const messages: Record<string, string> = {
    NO_API_KEY: '未找到 API 密钥，请配置 Claude API 密钥',
    CLAUDE_API_ERROR: 'Claude API 请求失败',
    SEND_FAILED: '发送消息失败',
    TIMEOUT: '请求超时',
    NETWORK_ERROR: '网络错误，请检查连接',
    UNAUTHORIZED: '授权失败，请检查 API 密钥',
  };

  return messages[error.errorCode] || error.message || '流式传输失败';
}

/**
 * Get error icon based on error type
 */
function getErrorIcon(errorCode: string): string {
  const icons: Record<string, string> = {
    NO_API_KEY: '🔑',
    TIMEOUT: '⏱',
    NETWORK_ERROR: '🌐',
    UNAUTHORIZED: '🔒',
  };

  return icons[errorCode] || '⚠';
}

export function StreamError({
  messageId,
  error,
  onRetry,
  onDismiss,
  compact = false,
}: StreamErrorProps) {
  const storeError = useClaudeStore((state) =>
    state.streamError?.messageId === messageId ? state.streamError : undefined
  );
  const displayError = error || storeError;
  const clearError = useClaudeStore((state) => state.clearStreamError);

  if (!displayError) return null;

  const errorMessage = getErrorMessage(displayError);
  const errorIcon = getErrorIcon(displayError.errorCode);

  const handleRetry = () => {
    clearError();
    onRetry?.();
  };

  const handleDismiss = () => {
    clearError();
    onDismiss?.();
  };

  if (compact) {
    return (
      <motion.div
        className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span>{errorIcon}</span>
        <span>{errorMessage.split('，')[0]}</span>
        {displayError.retryable && onRetry && (
          <button
            onClick={handleRetry}
            className="text-red-900 underline ml-1 hover:text-red-700"
            type="button"
          >
            重试
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-lg mt-0.5">{errorIcon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1">{errorMessage}</p>

        {displayError.retryable && onRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
            type="button"
          >
            <span>⟳</span>
            <span>重试发送</span>
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="text-red-400 hover:text-red-600 transition-colors p-1"
        aria-label="关闭错误提示"
        type="button"
      >
        ✕
      </button>
    </motion.div>
  );
}

/**
 * Inline stream error banner (shown within message bubble)
 */
interface InlineStreamErrorProps {
  error: StreamErrorType;
  onRetry?: () => void;
}

export function InlineStreamError({ error, onRetry }: InlineStreamErrorProps) {
  const errorMessage = getErrorMessage(error);
  const errorIcon = getErrorIcon(error.errorCode);

  return (
    <motion.div
      className="my-2 p-2 rounded bg-red-50 border border-red-200 text-red-800 text-xs"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center gap-2">
        <span>{errorIcon}</span>
        <span className="flex-1">{errorMessage}</span>
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="text-red-900 underline hover:text-red-700 font-medium"
            type="button"
          >
            重试
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Stream error notification (toast-style)
 */
export function StreamErrorNotification() {
  const streamError = useClaudeStore((state) => state.streamError);

  return (
    <AnimatePresence>
      {streamError && (
        <motion.div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <StreamError
            messageId={streamError.messageId}
            error={streamError}
            onRetry={() => window.location.reload()}
            onDismiss={() => useClaudeStore.getState().clearStreamError()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
