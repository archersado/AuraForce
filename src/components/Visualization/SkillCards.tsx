/**
 * 技能卡片组件
 *
 * 功能：以卡片形式展示提取的技能，支持紧凑和详细两种显示模式
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow, Settings, Brain, Shield, Clock, Target,
  CheckCircle, ArrowRight, Star, TrendingUp, Zap, PenTool
} from 'lucide-react';

interface ExtractedSkill {
  id: string;
  name: string;
  category: 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control';
  description: string;
  confidence: number;
  tools: string[];
  steps: any[];
  sourceContext: string;
}

interface SkillCardsProps {
  skills: ExtractedSkill[];
  compact?: boolean;
  animated?: boolean;
  onSkillSelect?: (skill: ExtractedSkill) => void;
}

/**
 * 技能卡片列表组件
 */
export default function SkillCards({
  skills,
  compact = false,
  animated = true,
  onSkillSelect
}: SkillCardsProps) {
  // 技能分类配置
  const categoryConfig = {
    workflow: {
      name: '工作流程',
      icon: Workflow,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    tool_usage: {
      name: '工具使用',
      icon: PenTool,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    decision_making: {
      name: '决策制定',
      icon: Brain,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    quality_control: {
      name: '质量控制',
      icon: Shield,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    }
  };

  return (
    <div className={`space-y-4 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
      <AnimatePresence>
        {skills.length === 0 ? (
          <EmptyState compact={compact} />
        ) : (
          skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              compact={compact}
              animated={animated}
              categoryConfig={categoryConfig[skill.category]}
              onSelect={onSkillSelect}
            />
          ))
        )}
      </AnimatePresence>

      {/* 技能统计摘要 */}
      {skills.length > 0 && !compact && (
        <SkillSummary skills={skills} categoryConfig={categoryConfig} />
      )}
    </div>
  );
}

/**
 * 单个技能卡片组件
 */
function SkillCard({
  skill,
  index,
  compact,
  animated,
  categoryConfig,
  onSelect
}: {
  skill: ExtractedSkill;
  index: number;
  compact: boolean;
  animated: boolean;
  categoryConfig: any;
  onSelect?: (skill: ExtractedSkill) => void;
}) {
  const IconComponent = categoryConfig.icon;

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${categoryConfig.borderColor} ${categoryConfig.bgColor}
        hover:shadow-lg hover:scale-105 hover:-translate-y-1
        ${compact ? 'p-3' : 'p-6'}
      `}
      onClick={() => onSelect?.(skill)}
    >
      <div className="flex items-start space-x-3">
        {/* 技能图标 */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
          ${categoryConfig.bgColor} border ${categoryConfig.borderColor}
        `}>
          <IconComponent className={`w-5 h-5 ${categoryConfig.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* 技能标题行 */}
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold truncate ${compact ? 'text-sm' : 'text-lg'} text-gray-900`}>
              {skill.name}
            </h3>
            <div className="flex items-center space-x-2">
              <ConfidenceBadge confidence={skill.confidence} compact={compact} />
              {!compact && <CategoryBadge category={categoryConfig.name} color={categoryConfig.color} />}
            </div>
          </div>

          {/* 技能描述 */}
          <p className={`text-gray-600 mb-3 ${compact ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>
            {skill.description}
          </p>

          {/* 技能指标 */}
          <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-3 gap-4'}`}>
            <SkillMetric
              icon={<Target className="w-4 h-4" />}
              label="步骤"
              value={skill.steps.length}
              compact={compact}
            />
            <SkillMetric
              icon={<PenTool className="w-4 h-4" />}
              label="工具"
              value={skill.tools.length}
              compact={compact}
            />
            {!compact && (
              <SkillMetric
                icon={<TrendingUp className="w-4 h-4" />}
                label="可信度"
                value={`${Math.round(skill.confidence * 100)}%`}
                compact={compact}
              />
            )}
          </div>

          {/* 工具列表（非紧凑模式） */}
          {!compact && skill.tools.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2">使用工具</h4>
              <div className="flex flex-wrap gap-1">
                {skill.tools.slice(0, 3).map((tool, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                  >
                    {tool}
                  </span>
                ))}
                {skill.tools.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                    +{skill.tools.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮（非紧凑模式） */}
          {!compact && (
            <div className="mt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>查看详情</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* 新技能标识 */}
      {index === 0 && animated && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium"
        >
          新发现!
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * 置信度徽章组件
 */
function ConfidenceBadge({ confidence, compact }: { confidence: number; compact: boolean }) {
  const percentage = Math.round(confidence * 100);

  const getColorClass = (conf: number) => {
    if (conf >= 0.8) return 'bg-green-100 text-green-700 border-green-200';
    if (conf >= 0.6) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className={`
      inline-flex items-center space-x-1 px-2 py-1 rounded-md border
      ${getColorClass(confidence)} ${compact ? 'text-xs' : 'text-sm'}
    `}>
      <Star className="w-3 h-3 fill-current" />
      <span className="font-medium">{percentage}%</span>
    </div>
  );
}

/**
 * 分类徽章组件
 */
function CategoryBadge({ category, color }: { category: string; color: string }) {
  return (
    <span className={`
      inline-block px-2 py-1 rounded-md text-xs font-medium
      bg-${color}-100 text-${color}-700 border border-${color}-200
    `}>
      {category}
    </span>
  );
}

/**
 * 技能指标组件
 */
function SkillMetric({
  icon,
  label,
  value,
  compact
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  compact: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-gray-400">
        {icon}
      </div>
      <div>
        <div className={`font-semibold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>
          {value}
        </div>
        <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>
          {label}
        </div>
      </div>
    </div>
  );
}

/**
 * 技能统计摘要组件
 */
function SkillSummary({ skills, categoryConfig }: { skills: ExtractedSkill[]; categoryConfig: any }) {
  const categoryStats = Object.keys(categoryConfig).map(category => {
    const categorySkills = skills.filter(skill => skill.category === category);
    const avgConfidence = categorySkills.length > 0
      ? categorySkills.reduce((sum, skill) => sum + skill.confidence, 0) / categorySkills.length
      : 0;

    return {
      category,
      count: categorySkills.length,
      confidence: avgConfidence,
      config: categoryConfig[category]
    };
  }).filter(stat => stat.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Zap className="w-5 h-5 text-purple-600 mr-2" />
        技能概览统计
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats.map(stat => {
          const IconComponent = stat.config.icon;
          return (
            <div
              key={stat.category}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.config.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.config.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{stat.config.name}</div>
                  <div className="text-xs text-gray-500">{stat.count} 项技能</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">平均可信度</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(stat.confidence * 100)}%
                </span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-1">
                <div
                  className={`bg-gradient-to-r from-${stat.config.color}-400 to-${stat.config.color}-600 h-1 rounded-full transition-all duration-500`}
                  style={{ width: `${stat.confidence * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 整体统计 */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-purple-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{skills.length}</div>
          <div className="text-sm text-gray-600">总技能数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length * 100)}%
          </div>
          <div className="text-sm text-gray-600">平均可信度</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {skills.reduce((sum, skill) => sum + skill.tools.length, 0)}
          </div>
          <div className="text-sm text-gray-600">涉及工具</div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 空状态组件
 */
function EmptyState({ compact }: { compact: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-center py-8 ${compact ? 'py-4' : 'py-12'}`}
    >
      <div className="text-6xl mb-4">🎯</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        技能探索中...
      </h3>
      <p className="text-gray-600 max-w-sm mx-auto">
        继续与AI对话，我们将实时识别并提取你的专业技能
      </p>
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-purple-400 rounded-full"
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
      </div>
    </motion.div>
  );
}