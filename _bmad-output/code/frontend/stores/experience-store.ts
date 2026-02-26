/**
 * Experience Store
 * Zustand store for managing Success Case Experience Center state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserProfile {
  role?: string;
  experience?: string;
  interests?: string[];
  goals?: string[];
}

export interface ExperienceRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  industry: string;
  completedAt: string;
  duration: number; // seconds
  score: number;
  strategy: string;
  decisions?: DecisionData[];
}

export interface DecisionData {
  step: number;
  decision: string;
  timestamp: string;
  aiFeedback?: string;
}

export interface Case {
  id: string;
  title: string;
  industry: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
}

export interface ExperienceStep {
  id: string;
  type: 'scenario' | 'decision' | 'outcome' | 'reflection';
  title: string;
  content: string;
  options?: {
    id: string;
    label: string;
    description: string;
    consequences: string[];
  }[];
  recommended?: string;
  analytics?: {
    successRate?: number;
    avgTime?: number;
    userCount?: number;
  };
}

interface ExperienceState {
  // Current experience
  currentCase: Case | null;
  currentStep: ExperienceStep | null;
  stepIndex: number;
  timeRemaining: number;
  isPaused: boolean;
  startTime: number | null;

  // User profile
  userIndustry: string | null;
  userProfile: UserProfile | null;

  // History
  experienceHistory: ExperienceRecord[];

  // AI assistant
  chatHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  isWaitingForAI: boolean;

  // Actions - Experience
  startExperience: (case_: Case) => void;
  pauseExperience: () => void;
  resumeExperience: () => void;
  completeExperience: () => void;
  setCurrentStep: (step: ExperienceStep, index: number) => void;
  makeDecision: (optionId: string, step: ExperienceStep) => void;
  updateTimeRemaining: (time: number) => void;

  // Actions - User profile
  setUserIndustry: (industry: string) => void;
  setUserProfile: (profile: UserProfile) => void;

  // Actions - History
  addToHistory: (record: ExperienceRecord) => void;
  clearHistory: () => void;
  getHistoryByCase: (caseId: string) => ExperienceRecord[];
  getHistoryByIndustry: (industry: string) => ExperienceRecord[];

  // Actions - AI assistant
  addMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
  clearChat: () => void;
  setWaitingForAI: (waiting: boolean) => void;
}

export const useExperienceStore = create<ExperienceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentCase: null,
      currentStep: null,
      stepIndex: 0,
      timeRemaining: 30 * 60, // 30 minutes
      isPaused: false,
      startTime: null,
      userIndustry: null,
      userProfile: null,
      experienceHistory: [],
      chatHistory: [],
      isWaitingForAI: false,

      // Experience actions
      startExperience: (case_) =>
        set({
          currentCase: case_,
          currentStep: null,
          stepIndex: 0,
          timeRemaining: case_.duration * 60,
          isPaused: false,
          startTime: Date.now(),
          chatHistory: [],
        }),

      pauseExperience: () => set({ isPaused: true }),

      resumeExperience: () => set({ isPaused: false }),

      completeExperience: () =>
        set((state) => ({
          isPaused: true,
          currentCase: null,
          currentStep: null,
          stepIndex: 0,
          startTime: null,
        })),

      setCurrentStep: (step, index) =>
        set({ currentStep: step, stepIndex: index }),

      makeDecision: (optionId, step) =>
        set((state) => {
          const selectedOption = step.options?.find((o) => o.id === optionId);
          return {
            chatHistory: [
              ...state.chatHistory,
              {
                role: 'user',
                content: `I chose: ${selectedOption?.label || optionId}`,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }),

      updateTimeRemaining: (time) => set({ timeRemaining: time }),

      // User profile actions
      setUserIndustry: (industry) => set({ userIndustry: industry }),

      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      // History actions
      addToHistory: (record) =>
        set((state) => ({
          experienceHistory: [record, ...state.experienceHistory].slice(0, 50), // Keep last 50
        })),

      clearHistory: () => set({ experienceHistory: [] }),

      getHistoryByCase: (caseId) =>
        get().experienceHistory.filter((r) => r.caseId === caseId),

      getHistoryByIndustry: (industry) =>
        get().experienceHistory.filter((r) => r.industry === industry),

      // AI assistant actions
      addMessage: (role, content) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              role,
              content,
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      clearChat: () => set({ chatHistory: [] }),

      setWaitingForAI: (waiting) => set({ isWaitingForAI: waiting }),
    }),
    {
      name: 'experience-store',
    }
  )
);
