/**
 * Connection Status Component
 *
 * Displays current WebSocket connection state with visual indicators.
 * Shows connection status, reconnection progress, latency, and error information.
 * Supports manual reconnection through the onReconnect callback.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ConnectionState } from '@/lib/claude/types';
import { useClaudeStore } from '@/lib/store/claude-store';
import { RefreshCw, Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Status configuration for visual representation
 */
interface StatusConfig {
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  pulsing: boolean;
}

/**
 * Get status configuration based on connection state
 */
function getStatusConfig(state: ConnectionState): StatusConfig {
  const configs: Record<ConnectionState, StatusConfig> = {
    disconnected: {
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 border-gray-300',
      icon: WifiOff,
      label: '离线',
      pulsing: false,
    },
    connecting: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-300',
      icon: Loader2,
      label: '连接中...',
      pulsing: true,
    },
    connected: {
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-300',
      icon: Wifi,
      label: '在线',
      pulsing: true,
    },
    error: {
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-300',
      icon: AlertCircle,
      label: '错误',
      pulsing: false,
    },
    reconnecting: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-300',
      icon: Loader2,
      label: '重新连接中...',
      pulsing: true,
    },
  };

  return configs[state] || configs.disconnected;
}

interface ConnectionStatusProps {
  position?: 'header' | 'inline';
  showLabel?: boolean;
  compact?: boolean;
  latency?: number;
  reconnectAttempts?: number;
  maxReconnectAttempts?: number;
  onReconnect?: () => void;
}

export function ConnectionStatus({
  position = 'header',
  showLabel = true,
  compact = false,
  latency = 0,
  reconnectAttempts = 0,
  maxReconnectAttempts = 3,
  onReconnect,
}: ConnectionStatusProps) {
  const connectionState = useClaudeStore((state) => state.connectionState);
  const statusConfig = getStatusConfig(connectionState);
  const StatusIcon = statusConfig.icon;

  // Format latency for display
  const formatLatency = (ms: number) => {
    if (ms === 0) return '--';
    if (ms < 50) return `${ms}ms`;
    if (ms < 200) return `${ms}ms`;
    return `${ms}ms`;
  };

  // Get latency color based on value
  const getLatencyColor = (ms: number) => {
    if (ms === 0) return 'text-gray-400';
    if (ms < 50) return 'text-green-600';
    if (ms < 150) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show manual reconnect button only in error or disconnected state
  const showReconnectButton = connectionState === 'error' || connectionState === 'disconnected';
  const showLatency = connectionState === 'connected' && latency > 0;
  const showReconnectProgress = connectionState === 'reconnecting' && reconnectAttempts > 0;

  if (compact) {
    return (
      <motion.div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${statusConfig.bgColor} ${statusConfig.color} text-xs`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={showReconnectButton ? { scale: 1.05 } : {}}
        whileTap={showReconnectButton && onReconnect ? { scale: 0.95 } : {}}
        onClick={showReconnectButton && onReconnect ? onReconnect : undefined}
        style={showReconnectButton ? { cursor: 'pointer' } : {}}
      >
        <StatusIcon className={`w-3 h-3 ${statusConfig.pulsing ? 'animate-spin' : ''}`} />

        {showLatency && (
          <motion.span
            className={getLatencyColor(latency)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {formatLatency(latency)}
          </motion.span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex items-center gap-2 ${position === 'header' ? 'text-sm' : 'text-xs'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
          ${statusConfig.bgColor} ${statusConfig.color}
          transition-colors duration-300
        `}
      >
        <StatusIcon className={`w-4 h-4 ${statusConfig.pulsing ? 'animate-spin' : ''}`} />

        {showLabel && <span className="font-medium">{statusConfig.label}</span>}

        {showLatency && (
          <motion.span
            className={`ml-1 ${getLatencyColor(latency)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-medium">{formatLatency(latency)}</span>
          </motion.span>
        )}

        {showReconnectProgress && (
          <motion.span
            className="text-xs opacity-70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ({reconnectAttempts}/{maxReconnectAttempts})
          </motion.span>
        )}
      </div>

      {showReconnectButton && onReconnect && (
        <motion.button
          onClick={onReconnect}
          className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="手动重连"
        >
          <RefreshCw className="w-3 h-3 text-gray-600" />
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * Connection Warning Banner
 *
 * Shows a warning banner when connection is in error state or offline.
 */
interface ConnectionWarningProps {
  onRetry?: () => void;
  latency?: number;
  reconnectAttempts?: number;
  maxReconnectAttempts?: number;
}

export function ConnectionWarning({
  onRetry,
  latency = 0,
  reconnectAttempts = 0,
  maxReconnectAttempts = 3,
}: ConnectionWarningProps) {
  const connectionState = useClaudeStore((state) => state.connectionState);
  const streamError = useClaudeStore((state) => state.streamError);

  // Only show warning for error state or when max reconnection attempts reached
  // Don't show warning for simple disconnection
  const showWarning =
    connectionState === 'error' ||
    (connectionState === 'reconnecting' && reconnectAttempts >= maxReconnectAttempts);

  const isMaxReconnectReached = connectionState === 'reconnecting' && reconnectAttempts >= maxReconnectAttempts;
  const isConnectedState = connectionState === 'connected';

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b ${
            connectionState === 'error' || isMaxReconnectReached
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <span className={(connectionState === 'error' || isMaxReconnectReached) ? 'text-red-600 text-lg mt-0.5' : 'text-amber-600 text-lg mt-0.5'}>
              {connectionState === 'error' ? '✕' : '⚠'}
            </span>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm mb-1 ${
                connectionState === 'error' || isMaxReconnectReached ? 'text-red-900' : 'text-amber-900'
              }`}>
                {isMaxReconnectReached
                  ? '重连失败'
                  : '连接错误'}
              </h3>
              <p className={`text-xs mb-2 ${
                connectionState === 'error' || isMaxReconnectReached ? 'text-red-800' : 'text-amber-800'
              }`}>
                {streamError?.message ||
                  isMaxReconnectReached
                  ? `已达到最大重连尝试次数 (${maxReconnectAttempts} 次)。请检查网络连接或手动重试。`
                  : '无法连接到服务器，请检查网络连接。'}
              </p>
              <div className="flex items-center gap-4">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className={`text-xs underline font-medium ${
                      connectionState === 'error' || isMaxReconnectReached ? 'text-red-900 hover:text-red-700' : 'text-amber-900 hover:text-amber-700'
                    }`}
                  >
                    立即重试
                  </button>
                )}
              </div>
            </div>
            <button
              className={`text-sm hover:opacity-70 ${
                connectionState === 'error' || isMaxReconnectReached ? 'text-red-600' : 'text-amber-600'
              }`}
              aria-label="关闭警告"
              onClick={() => {/* Optional: Add dismiss functionality */}}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
