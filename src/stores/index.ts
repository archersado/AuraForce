/**
 * Central Store Exports
 *
 * Provides centralized export of all Zustand stores and their selectors.
 * Import stores using @/stores for type-safe state management.
 */

// Type definitions
export * from './types'

// Skill store
export * from './skill/useSkillStore'

// Session store
export * from './session/useSessionStore'

// UI store
export * from './ui/useUIStore'

// Workflow store
export * from './workflow/useWorkflowStore'

// Workflow market store
export * from './workflow/useWorkflowMarketStore'

/**
 * Example usage:
 *
 * ```typescript
 * // Import entire store
 * import { useSkillStore } from '@/stores'
 *
 * // Import individual selectors (recommended for performance)
 * import { useExtractedSkills, useAddSkill } from '@/stores'
 *
 * // In component:
 * const extractedSkills = useExtractedSkills()
 * const addSkill = useAddSkill()
 * ```
 */
