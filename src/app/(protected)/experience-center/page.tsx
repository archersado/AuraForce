/**
 * Success Case Experience Center Main Page
 *
 * Epic 5: Success Case Experience Center
 * Implements multiple stories: 05-1, 05-2, 05-3, 05-4, 05-5
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, History, Clock, CheckCircle, ArrowRight, TrendingUp, MessageSquare, User } from 'lucide-react';

type ExperienceStage = 'welcome' | 'questionnaire' | 'selection' | 'experience' | 'completion' | 'history';

interface Case {
  id: string;
  title: string;
  industry: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ExperienceRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  industry: string;
  completedAt: string;
  duration: number;
  score: number;
  strategy: string;
}

export default function ExperienceCenterPage() {
  const [stage, setStage] = useState<ExperienceStage>('welcome');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [experienceHistory, setExperienceHistory] = useState<ExperienceRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('experience-history');
    if (saved) {
      try {
        setExperienceHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addToHistory = (record: ExperienceRecord) => {
    const newHistory = [...experienceHistory, record];
    setExperienceHistory(newHistory);
    localStorage.setItem('experience-history', JSON.stringify(newHistory));
  };

  const handleIndustrySelect = useCallback((industry: string) => {
    setSelectedIndustry(industry);
    setStage('selection');
  }, []);

  const handleCaseSelect = useCallback((case_: Case) => {
    setSelectedCase(case_);
    setStage('experience');
    setTimeRemaining(30 * 60);
  }, []);

  const handleCompleteExperience = useCallback(() => {
    if (!selectedCase) return;

    const score = Math.floor(Math.random() * 20) + 80; // Random score 80-100
    const strategies = ['Conservative', 'Aggressive', 'Balanced', 'Strategic'];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

    const record: ExperienceRecord = {
      id: Date.now().toString(),
      caseId: selectedCase.id,
      caseTitle: selectedCase.title,
      industry: selectedIndustry || '',
      completedAt: new Date().toISOString(),
      duration: 30 * 60 - timeRemaining,
      score,
      strategy,
    };

    addToHistory(record);
    setStage('completion');
  }, [selectedCase, selectedIndustry, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Success Case Experience Center
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Epic 5 - 成功案例体验中心</p>
            </div>
          </div>
          {experienceHistory.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setStage('history')}
            >
              <History className="w-4 h-4" />
              Your History ({experienceHistory.length})
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {stage === 'welcome' && <WelcomeStage onSelectIndustry={handleIndustrySelect} />}
        {stage === 'selection' && selectedIndustry && (
          <CaseSelectionStage
            industry={selectedIndustry}
            onSelectCase={handleCaseSelect}
            onBack={() => setStage('welcome')}
          />
        )}
        {stage === 'experience' && selectedCase && (
          <ExperienceStage
            case_={selectedCase}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onComplete={handleCompleteExperience}
            onBack={() => setStage('selection')}
          />
        )}
        {stage === 'completion' && selectedCase && (
          <CompletionStage
            case_={selectedCase}
            duration={30 * 60 - timeRemaining}
            onRestart={() => {
              setTimeRemaining(30 * 60);
              setStage('selection');
            }}
          />
        )}
        {stage === 'history' && (
          <HistoryStage
            history={experienceHistory}
            onBack={() => setStage('welcome')}
          />
        )}
      </main>
    </div>
  );
}

/**
 * Welcome Stage - Story 05-1
 */
interface WelcomeStageProps {
  onSelectIndustry: (industry: string) => void;
}

function WelcomeStage({ onSelectIndustry }: WelcomeStageProps) {
  const industries = [
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', description: '电商 - 在线零售成功案例' },
    { id: 'finance', name: 'Finance', icon: '💰', description: '金融 - 银行和金融创新' },
    { id: 'education', name: 'Education', icon: '📚', description: '教育 - 学习平台转型' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: '医疗- 医疗技术突破' },
    { id: 'logistics', name: 'Logistics', icon: '🚚', description: '物流 - 供应链优化' },
  ];

  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          8 分钟行业选择体验
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          探索不同行业的成功案例，30 分钟沉浸式体验
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {industries.map((industry) => (
          <button
            key={industry.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left border-2 border-transparent hover:border-blue-500"
            onClick={() => onSelectIndustry(industry.id)}
          >
            <div className="text-6xl mb-4">{industry.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {industry.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{industry.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>30 分钟沉浸体验</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>AI 辅助解释</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span>路径定制化</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Case Selection Stage - Story 05-1 extended
 */
interface CaseSelectionStageProps {
  industry: string;
  onSelectCase: (case_: Case) => void;
  onBack: () => void;
}

function CaseSelectionStage({ industry, onSelectCase, onBack }: CaseSelectionStageProps) {
  const cases: Case[] = [
    {
      id: `${industry}-1`,
      title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} 平台发布`,
      industry,
      description: '体验从零开始发布成功平台的旅程',
      duration: 30,
      difficulty: 'beginner',
    },
    {
      id: `${industry}-2`,
      title: '危机管理响应',
      industry,
      description: '在关键业务危机中导航并变得更强大',
      duration: 30,
      difficulty: 'advanced',
    },
  ];

  return (
    <div>
      <button
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        onClick={onBack}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        返回行业选择
      </button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {industry.charAt(0).toUpperCase() + industry.slice(1)} 成功案例
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((case_) => (
          <div
            key={case_.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-6xl">📊</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  case_.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  case_.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {case_.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {case_.duration} min
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {case_.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {case_.description}
              </p>
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => onSelectCase(case_)}
              >
                <Play className="w-4 h-4" />
                开始体验
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Experience Stage - Story 05-2, 05-3
 */
interface ExperienceStageProps {
  case_: Case;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  onComplete: () => void;
  onBack: () => void;
}

function ExperienceStage({ case_, timeRemaining, setTimeRemaining, onComplete, onBack }: ExperienceStageProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: `欢迎来到"${case_.title}"体验！我会在过程中帮你理解每个决策。你现在有什么问题吗？` }
  ]);
  const [userMessage, setUserMessage] = useState('');

  // Timer effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, setTimeRemaining, onComplete]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user' as const, content: userMessage }]);
    setUserMessage('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `这是一个很好的问题！在${case_.industry}行业中，这类决策非常关键。让我为你详细解释...（AI 响应模拟）`
      }]);
    }, 1000);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Main Experience Area */}
      <div className="flex-1 flex flex-col">
        {/* Timer */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {case_.title}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className={`font-mono ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                isPaused
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? '继续' : '暂停'}
            </button>
            <button
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={onComplete}
            >
              结束体验
            </button>
          </div>
        </div>

        {/* Experience Content */}
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg p-6">
          {isPaused ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  体验已暂停
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  请点击继续按钮恢复体验
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold mb-2">当前场景</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  你正在体验 {case_.description}
                  这是一个 {case_.difficulty} 级别的案例。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">可操作步骤</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    步骤 1: 分析市场环境
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    步骤 2: 评估竞争格局
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    步骤 3: 制定策略计划
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Panel - Story 05-3 */}
      <div className="w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">AI 辅助解释</h3>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'ai' ? <MessageSquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span className="text-xs font-medium">{msg.role === 'ai' ? 'Claude AI' : '你'}</span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="向 AI 提问..."
              disabled={isPaused}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPaused || !userMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Completion Stage - Story 05-2
 */
interface CompletionStageProps {
  case_: Case;
  duration: number;
  onRestart: () => void;
}

function CompletionStage({ case_, duration, onRestart }: CompletionStageProps) {
  const score = Math.floor((30 * 60 - duration) / (30 * 60) * 100); // Higher score for faster completion

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        体验完成！
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        你完成了 "{case_.title}" 体验
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-600">{score}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">完成度</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{formatTime(duration)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">使用时间</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">Great</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">表现</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={onRestart}
        >
          <Play className="w-4 h-4" />
          开始新案例
        </button>
        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <History className="w-4 h-4" />
          查看历史
        </button>
      </div>
    </div>
  );
}

/**
 * History Stage - Story 05-5
 */
interface HistoryStageProps {
  history: ExperienceRecord[];
  onBack: () => void;
}

function HistoryStage({ history, onBack }: HistoryStageProps) {
  return (
    <div>
      <button
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        onClick={onBack}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        返回
      </button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        体验历史
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">暂无体验记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {record.caseTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {record.industry.charAt(0).toUpperCase() + record.industry.slice(1)} •{' '}
                    {new Date(record.completedAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{record.score}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">完成度</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatTime(record.duration)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">时间</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{record.strategy}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">策略</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
