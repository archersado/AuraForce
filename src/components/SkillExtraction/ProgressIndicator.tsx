/**
 * 进度指示器组件
 *
 * 功能：显示技能提取和CC资产生成的整体进度
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Zap, Download } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  stage: 'welcome' | 'chat' | 'visualization' | 'generation' | 'complete';
}

/**
 * 进度指示器主组件
 */
export default function ProgressIndicator({ progress, stage }: ProgressIndicatorProps) {
  const stages = [
    { id: 'welcome', name: '开始', icon: Clock, color: 'gray' },
    { id: 'chat', name: '对话提取', icon: Clock, color: 'blue' },
    { id: 'visualization', name: '技能可视化', icon: Clock, color: 'purple' },
    { id: 'generation', name: '资产生成', icon: Zap, color: 'orange' },
    { id: 'complete', name: '完成', icon: Download, color: 'green' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);

  return (
    <div className="flex items-center space-x-4">
      {/* 进度条 */}
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-sm text-gray-600">进度:</span>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-900">{progress}%</span>
      </div>

      {/* 阶段指示器 */}
      <div className="flex items-center space-x-2">
        {stages.map((stageItem, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          const IconComponent = stageItem.icon;

          return (
            <div key={stageItem.id} className="flex items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted
                    ? 'bg-green-500 border-green-500'
                    : isActive
                    ? `bg-${stageItem.color}-500 border-${stageItem.color}-500`
                    : 'bg-gray-200 border-gray-300'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <IconComponent
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                )}
              </motion.div>

              {index < stages.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-colors duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 当前阶段名称 */}
      <div className="hidden lg:block">
        <span className="text-sm font-medium text-gray-900">
          {stages[currentStageIndex]?.name || '未知阶段'}
        </span>
      </div>
    </div>
  );
}