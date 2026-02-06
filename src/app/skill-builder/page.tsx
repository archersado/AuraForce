/**
 * AuraForce 技能构建主页面
 *
 * 功能：整合技能提取对话、可视化展示、CC资产生成的完整用户界面
 *
 * 更新：添加隐式指令触发功能，进入页面后自动发送
 * /bmad:bmb:workflows:create-workflow 命令来启动工作流
 */

'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Target, Sparkles, MessageCircle, Eye,
  CheckCircle, ArrowRight, Download, Play, Pause
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

import ChatInterface from '@/components/SkillExtraction/ChatInterface';
import SkillRadar from '@/components/Visualization/SkillRadar';
import SkillCards from '@/components/Visualization/SkillCards';
import WorkflowDiagram from '@/components/Visualization/WorkflowDiagram';
import CCAssetPreview from '@/components/Visualization/CCAssetPreview';
import ProgressIndicator from '@/components/SkillExtraction/ProgressIndicator';

// Type definitions
type StageType = 'welcome' | 'chat' | 'visualization' | 'generation' | 'complete';

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

interface ConversationMessage {
  type: 'user' | 'assistant' | 'system';
  message: string;
  timestamp: Date;
  extractedInfo?: ExtractedSkill[];
}

interface UserInfo {
  name: string;
  role: string;
  experience: string;
}

/**
 * 技能构建器主页面
 */
export default function SkillBuilder() {
  const [currentStage, setCurrentStage] = React.useState<StageType>('welcome');
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [extractedSkills, setExtractedSkills] = React.useState<ExtractedSkill[]>([]);
  const [conversationHistory, setConversationHistory] = React.useState<ConversationMessage[]>([]);
  const [generatedAssets, setGeneratedAssets] = React.useState<any[]>([]);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  const implicitCommandTriggered = useRef(false);

  // 用户信息
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    name: '',
    role: '营销专家',
    experience: ''
  });

  /**
   * 触发隐式指令
   * 进入页面后自动发送 /bmad:bmb:workflows:create-workflow
   * 该指令不会显示在用户界面中
   */
  useEffect(() => {
    if (implicitCommandTriggered.current) return;

    const triggerImplicitCommand = async () => {
      console.log('[SkillBuilder] Triggering implicit command:', '/bmad:bmb:workflows:create-workflow');

      try {
        // 存储隐式指令标志，前端其他组件可以读取这个标志
        sessionStorage.setItem('skill-builder-implicit-command', '/bmad:bmb:workflows:create-work');

        // 可选：调用后端 API 记录隐式指令已发送
        const response = await fetch('/api/skill-builder/implicit-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            command: '/bmad:bmb:workflows:create-workflow',
            silent: true,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('[SkillBuilder] Implicit command acknowledged:', result);
        }
      } catch (error) {
        console.error('[SkillBuilder] Failed to trigger implicit command:', error);
      }

      implicitCommandTriggered.current = true;
    };

    // 延迟一下触发，确保页面完全加载
    const timeoutId = setTimeout(triggerImplicitCommand, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  /**
   * 开始技能提取会话
   */
  const startSkillExtraction = async (selectedRole: string) => {
    setIsProcessing(true);
    setCurrentStage('chat');

    try {
      // 调用后端API创建会话
      const response = await apiFetch('/api/skill-extraction/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user',
          scenario: 'campaign_creation',
          userRole: selectedRole
        })
      });

      const { sessionId: newSessionId, initialMessage } = await response.json();

      setSessionId(newSessionId);
      setUserInfo(prev => ({ ...prev, role: selectedRole }));
      setConversationHistory([{
        type: 'assistant',
        message: initialMessage,
        timestamp: new Date()
      }]);

      setProgress(10);
    } catch (error) {
      console.error('启动会话失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 处理用户消息
   */
  const handleUserMessage = async (message: string) => {
    if (!sessionId) return;

    setIsProcessing(true);

    // 添加用户消息到历史
    const userTurn: ConversationMessage = {
      type: 'user',
      message,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userTurn]);

    try {
      // 调用后端API处理消息
      const response = await apiFetch('/api/skill-extraction/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message
        })
      });

      const result = await response.json();

      // 添加AI响应
      const aiTurn: ConversationMessage = {
        type: 'assistant',
        message: result.response,
        timestamp: new Date(),
        extractedInfo: result.extractedInfo
      };

      setConversationHistory(prev => [...prev, aiTurn]);

      // 更新提取的技能
      if (result.skillUpdates) {
        setExtractedSkills(prev => [...prev, ...result.skillUpdates]);
      }

      // 更新进度
      setProgress(prev => Math.min(prev + 10, 80));

      // 检查是否完成
      if (result.sessionComplete) {
        setProgress(90);
        setTimeout(() => {
          setCurrentStage('visualization');
        }, 1500);
      }

    } catch (error) {
      console.error('处理消息失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 生成CC资产
   */
  const generateCCAssets = async () => {
    setIsProcessing(true);
    setCurrentStage('generation');

    try {
      const response = await apiFetch('/api/cc-generation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          skills: extractedSkills,
          userInfo
        })
      });

      const result = await response.json();
      setGeneratedAssets(result.assets);
      setProgress(100);

      setTimeout(() => {
        setCurrentStage('complete');
      }, 2000);

    } catch (error) {
      console.error('生成CC资产失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 下载生成的资产包
   */
  const downloadAssetPack = async () => {
    try {
      const response = await fetch(`/api/cc-generation/download/${sessionId}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${userInfo.role}_skill_pack.zip`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator progress={progress} stage={currentStage} />
        </div>

        <AnimatePresence mode="wait">
          {/* 欢迎阶段 */}
          {currentStage === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  让你的专业技能
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {' '}变成AI工具
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  通过30分钟的对话，将你的工作经验转化为Claude Code扩展资产
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <FeatureCard
                    icon={<MessageCircle className="w-8 h-8" />}
                    title="情景式对话"
                    description="像聊天一样轻松分享你的工作经验"
                  />
                  <FeatureCard
                    icon={<Eye className="w-8 h-8" />}
                    title="实时可视化"
                    description="边聊边看你的技能雷达图生成"
                  />
                  <FeatureCard
                    icon={<Zap className="w-8 h-8" />}
                    title="一键生成"
                    description="自动生成可用的CC扩展资产包"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  选择你的专业角色
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { role: '内容营销专家', desc: '擅长campaign策划与内容创作', icon: '🎯' },
                    { role: '市场分析师', desc: '专注数据分析与市场洞察', icon: '📊' },
                    { role: '创意总监', desc: '精通品牌创意与视觉设计', icon: '🎨' },
                    { role: '产品经理', desc: '负责产品规划与项目管理', icon: '🚀' },
                    { role: '数字营销师', desc: '专业线上推广与投放优化', icon: '💻' },
                    { role: '品牌策略师', desc: '品牌定位与传播策略制定', icon: '🎪' }
                  ].map((item) => (
                    <RoleCard
                      key={item.role}
                      role={item.role}
                      description={item.desc}
                      icon={item.icon}
                      onSelect={() => startSkillExtraction(item.role)}
                      isLoading={isProcessing}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 对话阶段 */}
          {currentStage === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* 对话界面 */}
              <div className="lg:col-span-2">
                <ChatInterface
                  conversationHistory={conversationHistory}
                  onUserMessage={handleUserMessage}
                  isProcessing={isProcessing}
                  userRole={userInfo.role}
                />
              </div>

              {/* 实时技能预览 */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-2" />
                    技能提取实况
                  </h3>
                  <SkillCards skills={extractedSkills} compact />
                </div>

                {extractedSkills.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      技能雷达预览
                    </h3>
                    <SkillRadar skills={extractedSkills} size="small" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 可视化阶段 */}
          {currentStage === 'visualization' && (
            <motion.div
              key="visualization"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🎉 技能提取完成！
                </h2>
                <p className="text-gray-600">
                  我们成功提取了 {extractedSkills.length} 项专业技能
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 技能雷达图 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    你的技能全景图
                  </h3>
                  <SkillRadar skills={extractedSkills} />
                </div>

                {/* 工作流可视化 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    工作流程图
                  </h3>
                  <WorkflowDiagram skills={extractedSkills} />
                </div>
              </div>

              {/* 技能详情卡片 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  提取的技能详情
                </h3>
                <SkillCards skills={extractedSkills} />
              </div>

              {/* 生成按钮 */}
              <div className="text-center">
                <button
                  onClick={generateCCAssets}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center mx-auto"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      正在生成CC资产...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      生成Claude Code扩展包
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* 生成阶段 */}
          {currentStage === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    正在施展魔法...
                  </h2>
                  <p className="text-gray-600">
                    正在将你的技能转换为Claude Code扩展资产
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { step: 'workflow', name: '生成工作流文件', icon: '📝' },
                    { step: 'subagent', name: '创建智能子代理', icon: '🤖' },
                    { step: 'skill', name: '编译技能模块', icon: '⚡' },
                    { step: 'script', name: '打包自动化脚本', icon: '📦' }
                  ].map((item, index) => (
                    <GenerationStep
                      key={item.step}
                      name={item.name}
                      icon={item.icon}
                      isActive={index <= Math.floor(progress / 25)}
                      delay={index * 500}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 完成阶段 */}
          {currentStage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  🎉 恭喜！技能包生成完成
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  你的专业技能已经成功转化为Claude Code扩展资产包！
                </p>
              </div>

              {/* 生成的资产预览 */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  生成的CC扩展资产
                </h3>
                <CCAssetPreview assets={generatedAssets} />
              </div>

              {/* 下载和使用指南 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    📥 下载资产包
                  </h4>
                  <p className="text-gray-600 mb-4">
                    包含完整的工作流、子代理、技能模块和自动化脚本
                  </p>
                  <button
                    onClick={downloadAssetPack}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    下载CC扩展包
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    🚀 立即使用
                  </h4>
                  <p className="text-gray-600 mb-4">
                    在Claude Code中安装并开始使用你的专属AI工具
                  </p>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2" />
                    查看使用指南
                  </button>
                </div>
              </div>

              {/* 分享和反馈 */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  分享你的技能包，让更多人受益！
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    分享到社区
                  </button>
                  <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    提供反馈
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * 功能特性卡片组件
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * 角色选择卡片组件
 */
interface RoleCardProps {
  role: string;
  description: string;
  icon: string;
  onSelect: (role: string) => void;
  isLoading: boolean;
}

function RoleCard({ role, description, icon, onSelect, isLoading }: RoleCardProps) {
  return (
    <button
      onClick={() => onSelect(role)}
      disabled={isLoading}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left border-2 border-transparent hover:border-purple-200"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-1">{role}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

/**
 * 生成步骤组件
 */
interface GenerationStepProps {
  name: string;
  icon: string;
  isActive: boolean;
  delay: number;
}

function GenerationStep({ name, icon, isActive, delay }: GenerationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
      transition={{ delay: delay / 1000 }}
      className={`flex items-center space-x-3 p-3 rounded-lg ${
        isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className={`font-medium ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
        {name}
      </span>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ml-auto"
        >
          <CheckCircle className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
