/**
 * 工作流程图组件
 *
 * 功能：显示提取技能的工作流程和步骤关系
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Circle, CheckCircle, Clock,
  Settings, Target, Zap, AlertCircle
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  tools?: string[];
  estimatedTime?: string;
  dependencies?: string[];
}

interface ExtractedSkill {
  id: string;
  name: string;
  category: 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control';
  steps: WorkflowStep[];
}

interface WorkflowDiagramProps {
  skills: ExtractedSkill[];
  activeSkillId?: string;
  onStepClick?: (skillId: string, stepId: string) => void;
}

/**
 * 工作流程图主组件
 */
export default function WorkflowDiagram({
  skills,
  activeSkillId,
  onStepClick
}: WorkflowDiagramProps) {
  if (skills.length === 0) {
    return <EmptyWorkflowState />;
  }

  // 显示活跃技能的工作流，或第一个技能
  const activeSkill = skills.find(skill => skill.id === activeSkillId) || skills[0];

  return (
    <div className="space-y-6">
      {/* 技能选择器 */}
      {skills.length > 1 && (
        <SkillSelector
          skills={skills}
          activeSkillId={activeSkill.id}
          onSkillSelect={(skillId) => {
            // 回调处理技能选择
            const newActiveSkill = skills.find(s => s.id === skillId);
            if (newActiveSkill && onStepClick) {
              onStepClick(skillId, newActiveSkill.steps[0]?.id || '');
            }
          }}
        />
      )}

      {/* 工作流程图 */}
      <WorkflowSteps
        skill={activeSkill}
        onStepClick={onStepClick}
      />

      {/* 工作流统计 */}
      <WorkflowStats skill={activeSkill} />
    </div>
  );
}

/**
 * 技能选择器组件
 */
function SkillSelector({
  skills,
  activeSkillId,
  onSkillSelect
}: {
  skills: ExtractedSkill[];
  activeSkillId: string;
  onSkillSelect: (skillId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {skills.map((skill) => (
        <button
          key={skill.id}
          onClick={() => onSkillSelect(skill.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${activeSkillId === skill.id
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {skill.name}
        </button>
      ))}
    </div>
  );
}

/**
 * 工作流步骤组件
 */
function WorkflowSteps({
  skill,
  onStepClick
}: {
  skill: ExtractedSkill;
  onStepClick?: (skillId: string, stepId: string) => void;
}) {
  const categoryConfig = {
    workflow: { color: 'purple', bgColor: 'bg-purple-50' },
    tool_usage: { color: 'blue', bgColor: 'bg-blue-50' },
    decision_making: { color: 'green', bgColor: 'bg-green-50' },
    quality_control: { color: 'yellow', bgColor: 'bg-yellow-50' }
  };

  const config = categoryConfig[skill.category] || categoryConfig.workflow;

  return (
    <div className={`rounded-xl p-6 border-2 border-gray-200 ${config.bgColor}`}>
      {/* 技能标题 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.name}</h3>
        <p className="text-sm text-gray-600">
          {skill.steps.length} 个步骤 • {skill.category.replace('_', ' ')} 类型
        </p>
      </div>

      {/* 步骤列表 */}
      <div className="space-y-4">
        {skill.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            {/* 步骤编号 */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <StepIcon step={step} index={index} />
              {index < skill.steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
              )}
            </div>

            {/* 步骤内容 */}
            <StepContent
              step={step}
              skillId={skill.id}
              onStepClick={onStepClick}
            />

            {/* 连接箭头（桌面端） */}
            {index < skill.steps.length - 1 && (
              <div className="hidden lg:flex items-center">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * 步骤图标组件
 */
function StepIcon({ step, index }: { step: WorkflowStep; index: number }) {
  const getIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex-shrink-0"
    >
      {getIcon()}
    </motion.div>
  );
}

/**
 * 步骤内容组件
 */
function StepContent({
  step,
  skillId,
  onStepClick
}: {
  step: WorkflowStep;
  skillId: string;
  onStepClick?: (skillId: string, stepId: string) => void;
}) {
  return (
    <div
      className={`
        flex-1 bg-white rounded-lg p-4 border border-gray-200 cursor-pointer
        transition-all duration-200 hover:shadow-md hover:border-purple-300
        ${step.status === 'in_progress' ? 'ring-2 ring-blue-200' : ''}
      `}
      onClick={() => onStepClick?.(skillId, step.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{step.name}</h4>
        {step.estimatedTime && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {step.estimatedTime}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{step.description}</p>

      {/* 工具列表 */}
      {step.tools && step.tools.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {step.tools.slice(0, 3).map((tool, idx) => (
              <span
                key={idx}
                className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
              >
                {tool}
              </span>
            ))}
            {step.tools.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{step.tools.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 状态指示器 */}
      <div className="flex items-center justify-between">
        <StatusBadge status={step.status} />
        {step.dependencies && step.dependencies.length > 0 && (
          <span className="text-xs text-gray-500">
            依赖 {step.dependencies.length} 个前置步骤
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * 状态徽章组件
 */
function StatusBadge({ status }: { status: WorkflowStep['status'] }) {
  const statusConfig = {
    pending: { label: '待执行', className: 'bg-gray-100 text-gray-600' },
    in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
    completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
    error: { label: '错误', className: 'bg-red-100 text-red-700' }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-block text-xs px-2 py-1 rounded ${config.className}`}>
      {config.label}
    </span>
  );
}

/**
 * 工作流统计组件
 */
function WorkflowStats({ skill }: { skill: ExtractedSkill }) {
  const totalSteps = skill.steps.length;
  const completedSteps = skill.steps.filter(step => step.status === 'completed').length;
  const inProgressSteps = skill.steps.filter(step => step.status === 'in_progress').length;
  const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const allTools = skill.steps.reduce((acc, step) => {
    if (step.tools) {
      acc.push(...step.tools);
    }
    return acc;
  }, [] as string[]);
  const uniqueTools = Array.from(new Set(allTools));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">{totalSteps}</div>
        <div className="text-sm text-gray-600">总步骤数</div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-green-600">{completedSteps}</div>
        <div className="text-sm text-gray-600">已完成</div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-blue-600">{inProgressSteps}</div>
        <div className="text-sm text-gray-600">进行中</div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-purple-600">{uniqueTools.length}</div>
        <div className="text-sm text-gray-600">涉及工具</div>
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyWorkflowState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔄</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        工作流程图
      </h3>
      <p className="text-gray-600 max-w-sm mx-auto">
        继续对话，我们将实时构建你的工作流程图
      </p>
    </div>
  );
}