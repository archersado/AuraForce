/**
 * 技能提取对话界面组件
 *
 * 功能：提供类似聊天应用的对话界面，支持实时消息展示和用户输入
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Brain, User, Sparkles,
  MessageCircle, Clock, Lightbulb
} from 'lucide-react';

interface ConversationTurn {
  type: 'assistant' | 'user' | 'system';
  message: string;
  timestamp: Date;
  extractedInfo?: any;
}

interface ChatInterfaceProps {
  conversationHistory: ConversationTurn[];
  onUserMessage: (message: string) => void;
  isProcessing: boolean;
  userRole: string;
}

/**
 * 聊天界面主组件
 */
export default function ChatInterface({
  conversationHistory,
  onUserMessage,
  isProcessing,
  userRole
}: ChatInterfaceProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // 显示打字指示器
  useEffect(() => {
    if (isProcessing) {
      setShowTypingIndicator(true);
    } else {
      const timer = setTimeout(() => setShowTypingIndicator(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  /**
   * 发送消息
   */
  const sendMessage = () => {
    if (currentMessage.trim() && !isProcessing) {
      onUserMessage(currentMessage.trim());
      setCurrentMessage('');
      inputRef.current?.focus();
    }
  };

  /**
   * 处理键盘事件
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * 快速回复建议
   */
  const quickReplies = [
    "告诉我更多细节",
    "这个步骤很重要",
    "我通常会这样做",
    "让我想想..."
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AuraForce 技能助手</h3>
            <p className="text-sm text-gray-600">
              正在提取 {userRole} 技能...
            </p>
          </div>
          <div className="flex items-center space-x-1 ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">在线</span>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {conversationHistory.map((turn, index) => (
            <MessageBubble
              key={index}
              turn={turn}
              isLatest={index === conversationHistory.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* 打字指示器 */}
        {showTypingIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快速回复（仅在特定情况下显示） */}
      {!isProcessing && conversationHistory.length > 2 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex space-x-2 overflow-x-auto">
            {quickReplies.map((reply, index) => (
              <QuickReplyButton
                key={index}
                text={reply}
                onClick={() => {
                  setCurrentMessage(reply);
                  setTimeout(sendMessage, 100);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          {/* 语音输入按钮 */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={isProcessing}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* 文本输入框 */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="分享你的工作经验..."
              className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={Math.min(Math.max(currentMessage.split('\\n').length, 1), 4)}
              disabled={isProcessing}
            />

            {/* 字数提示 */}
            {currentMessage.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {currentMessage.length}
              </div>
            )}
          </div>

          {/* 发送按钮 */}
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isProcessing}
            className={`p-3 rounded-full transition-all duration-200 ${
              currentMessage.trim() && !isProcessing
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 输入提示 */}
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">
          <span className="flex items-center">
            <Lightbulb className="w-3 h-3 mr-1" />
            按Enter发送，Shift+Enter换行
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            预计还需 {Math.max(10 - conversationHistory.length, 0)} 轮对话
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 消息气泡组件
 */
function MessageBubble({ turn, isLatest }: { turn: ConversationTurn; isLatest: boolean }) {
  const isAssistant = turn.type === 'assistant';
  const isSystem = turn.type === 'system';

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
          {turn.message}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex space-x-3 max-w-[80%] ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* 头像 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAssistant
            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
            : 'bg-gray-600'
        }`}>
          {isAssistant ? (
            <Brain className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        {/* 消息内容 */}
        <div className="space-y-2">
          <div className={`px-4 py-3 rounded-2xl ${
            isAssistant
              ? 'bg-gray-100 text-gray-800'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
          }`}>
            <MessageContent message={turn.message} isAssistant={isAssistant} />
          </div>

          {/* 时间戳 */}
          <div className={`text-xs text-gray-500 ${isAssistant ? 'text-left' : 'text-right'}`}>
            {turn.timestamp.toLocaleTimeString()}
          </div>

          {/* 提取信息提示（仅对AI消息显示） */}
          {isAssistant && turn.extractedInfo && isLatest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center space-x-2 text-green-700">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">检测到技能模式</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                {turn.extractedInfo.skillHints?.join('、') || '正在分析...'}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 消息内容渲染组件
 */
function MessageContent({ message, isAssistant }: { message: string; isAssistant: boolean }) {
  // 处理emoji和格式化文本
  const formatMessage = (text: string) => {
    return text.split('\\n').map((line, index) => (
      <div key={index} className={index > 0 ? 'mt-2' : ''}>
        {line}
      </div>
    ));
  };

  return (
    <div className="whitespace-pre-wrap">
      {formatMessage(message)}
    </div>
  );
}

/**
 * 打字指示器组件
 */
function TypingIndicator() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
}

/**
 * 快速回复按钮
 */
function QuickReplyButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors duration-200 border border-gray-200 hover:border-gray-300"
    >
      {text}
    </button>
  );
}