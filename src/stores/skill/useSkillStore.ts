/**
 * Skill Store - Zustand v5.0.9
 *
 * Manages skill extraction process state including extracted skills,
 * extraction progress, current stage, and session ID.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Type definitions
export type StageType = 'welcome' | 'chat' | 'visualization' | 'generation' | 'complete'

export interface ExtractedSkill {
  id: string
  name: string
  category: 'workflow' | 'tool_usage' | 'decision_making' | 'quality_control'
  description: string
  confidence: number
  tools: string[]
  steps: any[]
  sourceContext: string
}

export interface ConversationMessage {
  type: 'user' | 'assistant' | 'system'
  message: string
  timestamp: Date
  extractedInfo?: ExtractedSkill[]
}

/**
 * Skill extraction state
 */
interface SkillState {
  /** Extracted skills from conversation */
  extractedSkills: ExtractedSkill[]
  /** Conversation history */
  conversationHistory: ConversationMessage[]
  /** Extraction progress percentage (0-100) */
  extractionProgress: number
  /** Current stage of skill extraction process */
  currentStage: StageType
  /** Current session ID */
  sessionId: string | null
  /** Whether extraction is in progress */
  isExtracting: boolean
}

/**
 * Skill extraction actions
 */
interface SkillActions {
  /** Add a new extracted skill */
  addSkill: (skill: ExtractedSkill) => void
  /** Update an existing skill */
  updateSkill: (id: string, updates: Partial<ExtractedSkill>) => void
  /** Remove a skill by ID */
  removeSkill: (id: string) => void
  /** Reset all skills state */
  resetSkills: () => void
  /** Set extraction progress */
  setExtractionProgress: (progress: number) => void
  /** Set current stage */
  setCurrentStage: (stage: StageType) => void
  /** Set session ID */
  setSessionId: (sessionId: string | null) => void
  /** Add conversation message */
  addConversationMessage: (message: ConversationMessage) => void
  /** Clear conversation history */
  clearConversation: () => void
  /** Set extraction status */
  setIsExtracting: (isExtracting: boolean) => void
  /** Reset entire store state */
  resetStore: () => void
}

/**
 * Combined skill store type
 */
type SkillStore = SkillState & SkillActions

/**
 * Default initial state
 */
const initialState: SkillState = {
  extractedSkills: [],
  conversationHistory: [],
  extractionProgress: 0,
  currentStage: 'welcome',
  sessionId: null,
  isExtracting: false,
}

/**
 * Create skill store with DevTools middleware
 */
export const useSkillStore = create<SkillStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Actions
      addSkill: (skill) =>
        set((state) => ({
          extractedSkills: [...state.extractedSkills, skill],
        })),

      updateSkill: (id, updates) =>
        set((state) => ({
          extractedSkills: state.extractedSkills.map((skill) =>
            skill.id === id ? { ...skill, ...updates } : skill
          ),
        })),

      removeSkill: (id) =>
        set((state) => ({
          extractedSkills: state.extractedSkills.filter((skill) => skill.id !== id),
        })),

      resetSkills: () =>
        set({
          extractedSkills: [],
        }),

      setExtractionProgress: (progress) =>
        set({
          extractionProgress: Math.max(0, Math.min(100, progress)),
        }),

      setCurrentStage: (stage) =>
        set({
          currentStage: stage,
        }),

      setSessionId: (sessionId) =>
        set({
          sessionId,
        }),

      addConversationMessage: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),

      clearConversation: () =>
        set({
          conversationHistory: [],
        }),

      setIsExtracting: (isExtracting) =>
        set({
          isExtracting,
        }),

      resetStore: () =>
        set(initialState),
    }),
    {
      name: 'SkillStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

/**
 * Individual selectors for performance optimization
 */
export const useExtractedSkills = () =>
  useSkillStore((state) => state.extractedSkills)

export const useConversationHistory = () =>
  useSkillStore((state) => state.conversationHistory)

export const useExtractionProgress = () =>
  useSkillStore((state) => state.extractionProgress)

export const useCurrentStage = () =>
  useSkillStore((state) => state.currentStage)

export const useSessionId = () =>
  useSkillStore((state) => state.sessionId)

export const useIsExtracting = () =>
  useSkillStore((state) => state.isExtracting)

/**
 * Action selectors
 */
export const useAddSkill = () =>
  useSkillStore((state) => state.addSkill)

export const useUpdateSkill = () =>
  useSkillStore((state) => state.updateSkill)

export const useRemoveSkill = () =>
  useSkillStore((state) => state.removeSkill)

export const useResetSkills = () =>
  useSkillStore((state) => state.resetSkills)

export const useSetExtractionProgress = () =>
  useSkillStore((state) => state.setExtractionProgress)

export const useSetCurrentStage = () =>
  useSkillStore((state) => state.setCurrentStage)

export const useSetSessionId = () =>
  useSkillStore((state) => state.setSessionId)

export const useAddConversationMessage = () =>
  useSkillStore((state) => state.addConversationMessage)

export const useClearConversation = () =>
  useSkillStore((state) => state.clearConversation)

export const useSetIsExtracting = () =>
  useSkillStore((state) => state.setIsExtracting)

export const useResetSkillStore = () =>
  useSkillStore((state) => state.resetStore)
