/**
 * Workflow Store - Zustand v5.0.9
 *
 * Manages Claude workflow execution state including active workflows,
 * workflow history, and execution status tracking.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Type definitions
export type WorkflowStatus = 'idle' | 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'terminated'

export interface WorkflowStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startedAt?: Date
  completedAt?: Date
  output?: any
  error?: string
  metadata?: Record<string, unknown>
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: WorkflowStatus
  startedAt: Date
  completedAt?: Date
  pausedAt?: Date
  resumedAt?: Date
  steps: WorkflowStep[]
  metadata?: Record<string, unknown>
  error?: string
}

/**
 * Workflow state
 */
interface WorkflowState {
  /** All active workflow executions */
  activeWorkflows: WorkflowExecution[]
  /** Historical workflow executions (completed/failed) */
  workflowHistory: WorkflowExecution[]
  /** Currently focused workflow execution */
  currentWorkflow: WorkflowExecution | null
  /** Workflow execution count */
  executionCount: number
  /** Whether any workflow is running */
  hasRunningWorkflow: boolean
}

/**
 * Workflow actions
 */
interface WorkflowActions {
  /** Start a new workflow execution */
  startWorkflow: (workflowId: string, workflowName: string, steps: Omit<WorkflowStep, 'status'>[]) => void
  /** Pause the current workflow */
  pauseWorkflow: (executionId: string) => void
  /** Resume a paused workflow */
  resumeWorkflow: (executionId: string) => void
  /** Terminate a workflow execution */
  terminateWorkflow: (executionId: string, reason?: string) => void
  /** Update workflow status */
  updateWorkflowStatus: (executionId: string, status: WorkflowStatus) => void
  /** Update a workflow step */
  updateStep: (executionId: string, stepId: string, updates: Partial<WorkflowStep>) => void
  /** Complete a workflow execution */
  completeWorkflow: (executionId: string) => void
  /** Fail a workflow execution */
  failWorkflow: (executionId: string, error: string) => void
  /** Set the current focused workflow */
  setCurrentWorkflow: (executionId: string | null) => void
  /** Clear active workflows */
  clearActiveWorkflows: () => void
  /** Archive workflow to history */
  archiveWorkflow: (executionId: string) => void
  /** Clear workflow history */
  clearWorkflowHistory: () => void
  /** Reset entire store state */
  resetStore: () => void
}

/**
 * Combined workflow store type
 */
type WorkflowStore = WorkflowState & WorkflowActions

/**
 * Default initial state
 */
const initialState: WorkflowState = {
  activeWorkflows: [],
  workflowHistory: [],
  currentWorkflow: null,
  executionCount: 0,
  hasRunningWorkflow: false,
}

/**
 * Create workflow store with DevTools middleware
 */
export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Actions
      startWorkflow: (workflowId, workflowName, steps) =>
        set((state) => {
          const executionId = crypto.randomUUID()
          const newExecution: WorkflowExecution = {
            id: executionId,
            workflowId,
            workflowName,
            status: 'running',
            startedAt: new Date(),
            steps: steps.map((step) => ({
              ...step,
              status: 'pending',
            })),
          }

          return {
            activeWorkflows: [...state.activeWorkflows, newExecution],
            currentWorkflow: newExecution,
            executionCount: state.executionCount + 1,
            hasRunningWorkflow: true,
          }
        }),

      pauseWorkflow: (executionId) =>
        set((state) => ({
          activeWorkflows: state.activeWorkflows.map((w) =>
            w.id === executionId
              ? {
                  ...w,
                  status: 'paused',
                  pausedAt: new Date(),
                }
              : w
          ),
        })),

      resumeWorkflow: (executionId) =>
        set((state) => ({
          activeWorkflows: state.activeWorkflows.map((w) =>
            w.id === executionId
              ? {
                  ...w,
                  status: 'running',
                  resumedAt: new Date(),
                }
              : w
          ),
          hasRunningWorkflow: true,
        })),

      terminateWorkflow: (executionId, reason) =>
        set((currentState) => {
          const workflow = currentState.activeWorkflows.find((w) => w.id === executionId)
          const updatedWorkflow = workflow
            ? {
                ...workflow,
                status: 'terminated' as const,
                completedAt: new Date(),
                error: reason || 'Workflow terminated by user',
              }
            : null

          return {
            activeWorkflows: currentState.activeWorkflows.filter((w) => w.id !== executionId),
            workflowHistory: updatedWorkflow
              ? [updatedWorkflow, ...currentState.workflowHistory]
              : currentState.workflowHistory,
            currentWorkflow:
              currentState.currentWorkflow?.id === executionId ? null : currentState.currentWorkflow,
            hasRunningWorkflow: currentState.activeWorkflows.some((w) => w.id === executionId && w.status === 'running')
              ? false
              : currentState.hasRunningWorkflow,
          }
        }),

      updateWorkflowStatus: (executionId, status) =>
        set((state) => ({
          activeWorkflows: state.activeWorkflows.map((w) =>
            w.id === executionId
              ? {
                  ...w,
                  status,
                  completedAt: ['completed', 'failed', 'terminated'].includes(status)
                    ? new Date()
                    : w.completedAt,
                }
              : w
          ),
        })),

      updateStep: (executionId, stepId, updates) =>
        set((state) => ({
          activeWorkflows: state.activeWorkflows.map((w) =>
            w.id === executionId
              ? {
                  ...w,
                  steps: w.steps.map((s) =>
                    s.id === stepId
                      ? {
                          ...s,
                          ...updates,
                        }
                      : s
                  ),
                }
              : w
          ),
        })),

      completeWorkflow: (executionId) =>
        set((currentState) => {
          const workflow = currentState.activeWorkflows.find((w) => w.id === executionId)
          const completedWorkflow = workflow
            ? {
                ...workflow,
                status: 'completed' as const,
                completedAt: new Date(),
              }
            : null

          return {
            activeWorkflows: currentState.activeWorkflows.filter((w) => w.id !== executionId),
            workflowHistory: completedWorkflow
              ? [completedWorkflow, ...currentState.workflowHistory]
              : currentState.workflowHistory,
            currentWorkflow:
              currentState.currentWorkflow?.id === executionId ? null : currentState.currentWorkflow,
            hasRunningWorkflow: currentState.activeWorkflows.length > 1,
          }
        }),

      failWorkflow: (executionId, error) =>
        set((currentState) => {
          const workflow = currentState.activeWorkflows.find((w) => w.id === executionId)
          const failedWorkflow = workflow
            ? {
                ...workflow,
                status: 'failed' as const,
                completedAt: new Date(),
                error,
              }
            : null

          return {
            activeWorkflows: currentState.activeWorkflows.filter((w) => w.id !== executionId),
            workflowHistory: failedWorkflow
              ? [failedWorkflow, ...currentState.workflowHistory]
              : currentState.workflowHistory,
            currentWorkflow:
              currentState.currentWorkflow?.id === executionId ? null : currentState.currentWorkflow,
            hasRunningWorkflow: currentState.activeWorkflows.length > 1,
          }
        }),

      setCurrentWorkflow: (executionId) =>
        set((state) => ({
          currentWorkflow: executionId
            ? state.activeWorkflows.find((w) => w.id === executionId) ||
              state.workflowHistory.find((w) => w.id === executionId) || null
            : null,
        })),

      clearActiveWorkflows: () =>
        set({
          activeWorkflows: [],
          currentWorkflow: null,
          hasRunningWorkflow: false,
        }),

      archiveWorkflow: (executionId) =>
        set((state) => {
          const workflowToArchive = state.activeWorkflows.find((w) => w.id === executionId)
          return {
            activeWorkflows: state.activeWorkflows.filter((w) => w.id !== executionId),
            workflowHistory: workflowToArchive
              ? [workflowToArchive, ...state.workflowHistory]
              : state.workflowHistory,
            currentWorkflow:
              state.currentWorkflow?.id === executionId ? null : state.currentWorkflow,
          }
        }),

      clearWorkflowHistory: () =>
        set({
          workflowHistory: [],
        }),

      resetStore: () =>
        set(initialState),
    }),
    {
      name: 'WorkflowStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

/**
 * Individual state selectors for performance optimization
 */
export const useActiveWorkflows = () =>
  useWorkflowStore((state) => state.activeWorkflows)

export const useWorkflowHistory = () =>
  useWorkflowStore((state) => state.workflowHistory)

export const useCurrentWorkflow = () =>
  useWorkflowStore((state) => state.currentWorkflow)

export const useExecutionCount = () =>
  useWorkflowStore((state) => state.executionCount)

export const useHasRunningWorkflow = () =>
  useWorkflowStore((state) => state.hasRunningWorkflow)

/**
 * Action selectors
 */
export const useStartWorkflow = () =>
  useWorkflowStore((state) => state.startWorkflow)

export const usePauseWorkflow = () =>
  useWorkflowStore((state) => state.pauseWorkflow)

export const useResumeWorkflow = () =>
  useWorkflowStore((state) => state.resumeWorkflow)

export const useTerminateWorkflow = () =>
  useWorkflowStore((state) => state.terminateWorkflow)

export const useUpdateWorkflowStatus = () =>
  useWorkflowStore((state) => state.updateWorkflowStatus)

export const useUpdateStep = () =>
  useWorkflowStore((state) => state.updateStep)

export const useCompleteWorkflow = () =>
  useWorkflowStore((state) => state.completeWorkflow)

export const useFailWorkflow = () =>
  useWorkflowStore((state) => state.failWorkflow)

export const useSetCurrentWorkflow = () =>
  useWorkflowStore((state) => state.setCurrentWorkflow)

export const useClearActiveWorkflows = () =>
  useWorkflowStore((state) => state.clearActiveWorkflows)

export const useArchiveWorkflow = () =>
  useWorkflowStore((state) => state.archiveWorkflow)

export const useClearWorkflowHistory = () =>
  useWorkflowStore((state) => state.clearWorkflowHistory)

export const useResetWorkflowStore = () =>
  useWorkflowStore((state) => state.resetStore)
