/**
 * Session Store - Zustand v5.0.9
 *
 * Manages user session and authentication state including user data,
 * authentication status, and session metadata.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Type definitions
export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  role?: string
  subscriptionLevel?: 'free' | 'pro' | 'enterprise'
  createdAt: Date
  updatedAt: Date
}

export interface SessionData {
  lastLoginAt: Date
  loginCount: number
  sessionId: string
  deviceInfo?: {
    userAgent: string
    platform: string
  }
}

/**
 * Session state
 */
interface SessionState {
  /** Current authenticated user */
  user: UserProfile | null
  /** Authentication status */
  isAuthenticated: boolean
  /** Session data */
  sessionData: SessionData | null
  /** Authentication loading state */
  isLoading: boolean
  /** Authentication error message */
  error: string | null
}

/**
 * Session actions
 */
interface SessionActions {
  /** Set user data and mark as authenticated */
  setUser: (user: UserProfile) => void
  /** Update user profile */
  updateUserProfile: (updates: Partial<UserProfile>) => void
  /** Logout and clear session */
  logout: () => void
  /** Set loading state */
  setIsLoading: (isLoading: boolean) => void
  /** Set error message */
  setError: (error: string | null) => void
  /** Clear error message */
  clearError: () => void
  /** Set session data */
  setSessionData: (data: SessionData) => void
  /** Reset entire store state */
  resetStore: () => void
}

/**
 * Combined session store type
 */
type SessionStore = SessionState & SessionActions

/**
 * Default initial state
 */
const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  sessionData: null,
  isLoading: false,
  error: null,
}

/**
 * Create session store with persistence and DevTools middleware
 */
export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
            error: null,
          }),

        updateUserProfile: (updates) =>
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  ...updates,
                  updatedAt: new Date(),
                }
              : null,
          })),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            sessionData: null,
            error: null,
          }),

        setIsLoading: (isLoading) =>
          set({
            isLoading,
          }),

        setError: (error) =>
          set({
            error,
          }),

        clearError: () =>
          set({
            error: null,
          }),

        setSessionData: (data) =>
          set({
            sessionData: data,
          }),

        resetStore: () =>
          set(initialState),
      }),
      {
        name: 'auraforce-session',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sessionData: state.sessionData,
        }),
      }
    ),
    {
      name: 'SessionStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

/**
 * Individual state selectors for performance optimization
 */
export const useUser = () => useSessionStore((state) => state.user)

export const useIsAuthenticated = () =>
  useSessionStore((state) => state.isAuthenticated)

export const useSessionData = () =>
  useSessionStore((state) => state.sessionData)

export const useIsSessionLoading = () =>
  useSessionStore((state) => state.isLoading)

export const useSessionError = () =>
  useSessionStore((state) => state.error)

/**
 * Action selectors
 */
export const useSetUser = () => useSessionStore((state) => state.setUser)

export const useUpdateUserProfile = () =>
  useSessionStore((state) => state.updateUserProfile)

export const useLogout = () => useSessionStore((state) => state.logout)

export const useSetSessionLoading = () =>
  useSessionStore((state) => state.setIsLoading)

export const useSetSessionError = () =>
  useSessionStore((state) => state.setError)

export const useClearSessionError = () =>
  useSessionStore((state) => state.clearError)

export const useSetSessionData = () =>
  useSessionStore((state) => state.setSessionData)

export const useResetSessionStore = () =>
  useSessionStore((state) => state.resetStore)
