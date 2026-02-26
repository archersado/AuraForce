/**
 * Success Case Experience Center Main Page
 *
 * Epic 5: Success Case Experience Center
 * Implements multiple stories: 05-1, 05-2, 05-3, 05-4, 05-5
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, History, Clock, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import IndustrySelector from '@/components/experience/IndustrySelector';
import ExperienceFlow from '@/components/experience/ExperienceFlow';
import AIAssistant from '@/components/experience/AIAssistant';
import PersonalizationQuestionnaire from '@/components/experience/PersonalizationQuestionnaire';
import HistoryCompare from '@/components/experience/HistoryCompare';
import { useExperienceStore } from '@/stores/experience-store';

type ExperienceStage = 'welcome' | 'questionnaire' | 'selection' | 'experience' | 'completion';

interface Case {
  id: string;
  title: string;
  industry: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
}

export default function ExperienceCenterPage() {
  const [stage, setStage] = useState<ExperienceStage>('welcome');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds

  const {
    userIndustry,
    setUserIndustry,
    userProfile,
    setUserProfile,
    experienceHistory,
    addToHistory,
  } = useExperienceStore();

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/auraforce/api/experience/profile');
      if (response.ok) {
        const data = await response.json();
        setUserIndustry(data.industry);
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleIndustrySelect = useCallback((industry: string) => {
    setSelectedIndustry(industry);
    if (!userIndustry) {
      setStage('questionnaire');
    } else {
      setStage('selection');
    }
  }, [userIndustry]);

  const handleQuestionnaireComplete = useCallback((profile: any) => {
    setUserProfile(profile);
    setStage('selection');
  }, [setUserProfile]);

  const handleCaseSelect = useCallback((case_: Case) => {
    setSelectedCase(case_);
    setStage('experience');
    startExperience(case_);
  }, []);

  const startExperience = useCallback(async (case_: Case) => {
    try {
      const response = await fetch('/auraforce/api/experience/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: case_.id,
          profile: userProfile,
          industry: selectedIndustry,
        }),
      });

      if (response.ok) {
        // Start timer
        const timer = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 0) {
              clearInterval(timer);
              handleCompleteExperience();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    } catch (error) {
      console.error('Failed to start experience:', error);
    }
  }, [userProfile, selectedIndustry]);

  const handleCompleteExperience = useCallback(async () => {
    try {
      const response = await fetch('/auraforce/api/experience/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: selectedCase?.id,
          timeUsed: 30 * 60 - timeRemaining,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Add to history
        addToHistory({
          id: Date.now().toString(),
          caseId: selectedCase?.id || '',
          caseTitle: selectedCase?.title || '',
          industry: selectedIndustry || '',
          completedAt: new Date().toISOString(),
          duration: 30 * 60 - timeRemaining,
          score: result.score,
          strategy: result.strategy,
        });

        setStage('completion');
      }
    } catch (error) {
      console.error('Failed to complete experience:', error);
    }
  }, [selectedCase, selectedIndustry, timeRemaining, addToHistory]);

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
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Success Case Experience Center
            </h1>
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
        {stage === 'questionnaire' && (
          <PersonalizationQuestionnaire
            onComplete={handleQuestionnaireComplete}
            onBack={() => setStage('welcome')}
          />
        )}
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
        {stage === 'history' && experienceHistory.length > 0 && (
          <HistoryStage
            history={experienceHistory}
            onCompare={(ids) => setStage('selection')}
            onBack={() => setStage('welcome')}
          />
        )}
      </main>
    </div>
  );
}

/**
 * Welcome Stage
 */
interface WelcomeStageProps {
  onSelectIndustry: (industry: string) => void;
}

function WelcomeStage({ onSelectIndustry }: WelcomeStageProps) {
  const industries = [
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', description: 'Online retail success stories' },
    { id: 'finance', name: 'Finance', icon: '💰', description: 'Banking and fintech innovations' },
    { id: 'education', name: 'Education', icon: '📚', description: 'Learning platform transformations' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Medical tech breakthroughs' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠', description: 'Property tech revolution' },
    { id: 'logistics', name: 'Logistics', icon: '🚚', description: 'Supply chain optimizations' },
  ];

  return (
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Step Into Success
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Experience real business success stories through immersive 30-minute scenarios
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {industries.map((industry) => (
          <button
            key={industry.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left border-2 border-transparent hover:border-blue-500"
            onClick={() => onSelectIndustry(industry.id)}
          >
            <div className="text-5xl mb-4">{industry.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {industry.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{industry.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>30 min experiences</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>AI-powered guidance</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span>Learn by doing</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Case Selection Stage
 */
interface CaseSelectionStageProps {
  industry: string;
  onSelectCase: (case_: Case) => void;
  onBack: () => void;
}

function CaseSelectionStage({ industry, onSelectCase, onBack }: CaseSelectionStageProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, [industry]);

  const loadCases = async () => {
    try {
      const response = await fetch(`/auraforce/api/experience/cases?industry=${industry}`);
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || getMockCases(industry));
      }
    } catch (error) {
      console.error('Failed to load cases:', error);
      setCases(getMockCases(industry));
    } finally {
      setLoading(false);
    }
  };

  const getMockCases = (ind: string): Case[] => [
    {
      id: `${ind}-1`,
      title: `${ind.charAt(0).toUpperCase() + ind.slice(1)} Platform Launch`,
      industry: ind,
      description: 'Experience the journey of launching a successful platform from scratch',
      duration: 30,
      difficulty: 'beginner',
      image: `/images/cases/${ind}-1.jpg`,
    },
    {
      id: `${ind}-2`,
      title: `Crisis Management Response`,
      industry: ind,
      description: 'Navigate through a critical business crisis and emerge stronger',
      duration: 30,
      difficulty: 'advanced',
      image: `/images/cases/${ind}-2.jpg`,
    },
  ];

  return (
    <div>
      <button
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        onClick={onBack}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Industry Selection
      </button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {industry.charAt(0).toUpperCase() + industry.slice(1)} Success Cases
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cases...</p>
        </div>
      ) : (
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
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => onSelectCase(case_)}
                >
                  <Play className="w-4 h-4" />
                  Start Experience
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Experience Stage
 */
interface ExperienceStageProps {
  case_: Case;
  timeRemaining: number;
  onComplete: () => void;
  onBack: () => void;
}

function ExperienceStage({ case_, timeRemaining, onComplete, onBack }: ExperienceStageProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
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
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={onComplete}
            >
              Complete
            </button>
          </div>
        </div>

        {/* Experience Flow */}
        <div className="flex-1 overflow-auto">
          {isPaused ? (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Experience Paused
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Take a break, we'll save your progress
                </p>
              </div>
            </div>
          ) : (
            <ExperienceFlow caseId={case_.id} />
          )}
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {isSidebarOpen && (
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <AIAssistant caseId={case_.id} />
        </div>
      )}

      {/* Toggle Sidebar */}
      <button
        className="absolute right-96 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg p-2 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <ArrowRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
      </button>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Completion Stage
 */
interface CompletionStageProps {
  case_: Case;
  duration: number;
  onRestart: () => void;
}

function CompletionStage({ case_, duration, onRestart }: CompletionStageProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Congratulations!
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        You've completed the "{case_.title}" experience
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{formatTime(duration)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">Great</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Strategy</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={onRestart}
        >
          <Play className="w-4 h-4" />
          Start Another Case
        </button>
        <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

/**
 * History Stage
 */
interface HistoryStageProps {
  history: Array<{
    id: string;
    caseId: string;
    caseTitle: string;
    industry: string;
    completedAt: string;
    duration: number;
    score: number;
    strategy: string;
  }>;
  onCompare: (ids: string[]) => void;
  onBack: () => void;
}

function HistoryStage({ history, onCompare, onBack }: HistoryStageProps) {
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());

  const toggleCompare = (id: string) => {
    const newSelected = new Set(selectedForCompare);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else if (newSelected.size < 2) {
      newSelected.add(id);
    }
    setSelectedForCompare(newSelected);
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        onClick={onBack}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back
      </button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Your Experience History
      </h2>

      <div className="flex gap-4 mb-6">
        {selectedForCompare.size === 2 && (
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            onClick={() => onCompare(Array.from(selectedForCompare))}
          >
            Compare Selected
          </button>
        )}
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${
              selectedForCompare.has(record.id) ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {record.caseTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {record.industry.charAt(0).toUpperCase() + record.industry.slice(1)} •{' '}
                  {new Date(record.completedAt).toLocaleDateString()}
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedForCompare.has(record.id)}
                  onChange={() => toggleCompare(record.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Compare</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{record.score}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(record.duration)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 truncate text-ellipsis overflow-hidden">
                  {record.strategy}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Strategy</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
