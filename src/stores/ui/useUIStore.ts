/**
 * UI Store - Zustand v5.0.9
 *
 * Manages UI component state including modals, loading indicators,
 * navigation state, and theme preferences.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Type definitions
export type ModalType =
  | 'skill-extraction'
  | 'workflow-settings'
  | 'profile-settings'
  | 'subscription'
  | 'feedback'
  | null

export type Theme = 'light' | 'dark' | 'system'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

/**
 * UI state
 */
interface UIState {
  /** Currently active modal */
  activeModal: ModalType
  /** Modal data payload */
  modalData: Record<string, unknown> | null
  /** Global loading state */
  isLoading: boolean
  /** Loading state for specific operations */
  loadingStates: Record<string, LoadingState>
  /** Navigation menu open state */
  isNavOpen: boolean
  /** Current theme */
  theme: Theme
  /** Mobile sidebar open state */
  isMobileSidebarOpen: boolean
  /** Toast notifications */
  toasts: Toast[]
}

/**
 * UI actions
 */
interface UIActions {
  // Modal actions
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
  setModalData: (data: Record<string, unknown> | null) => void

  // Loading actions
  setIsLoading: (isLoading: boolean) => void
  setLoadingState: (key: string, state: LoadingState) => void
  clearLoadingState: (key: string) => void

  // Navigation actions
  toggleNav: () => void
  setNavOpen: (isOpen: boolean) => void

  // Theme actions
  setTheme: (theme: Theme) => void

  // Mobile sidebar actions
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (isOpen: boolean) => void

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  /** Reset entire store state */
  resetStore: () => void
}

/**
 * Combined UI store type
 */
type UIStore = UIState & UIActions

/**
 * Default initial state
 */
const initialState: UIState = {
  activeModal: null,
  modalData: null,
  isLoading: false,
  loadingStates: {},
  isNavOpen: false,
  theme: 'system',
  isMobileSidebarOpen: false,
  toasts: [],
}

/**
 * Create UI store with DevTools middleware
 */
export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Modal actions
      openModal: (modal, data) =>
        set({
          activeModal: modal,
          modalData: data || null,
        }),

      closeModal: () =>
        set({
          activeModal: null,
          modalData: null,
        }),

      setModalData: (data) =>
        set({
          modalData: data,
        }),

      // Loading actions
      setIsLoading: (isLoading) =>
        set({
          isLoading,
        }),

      setLoadingState: (key, loadingStateValue) =>
        set((currentState) => ({
          loadingStates: {
            ...currentState.loadingStates,
            [key]: loadingStateValue,
          },
        })),

      clearLoadingState: (key) =>
        set((state) => {
          const newLoadingStates = { ...state.loadingStates }
          delete newLoadingStates[key]
          return { loadingStates: newLoadingStates }
        }),

      // Navigation actions
      toggleNav: () =>
        set((state) => ({
          isNavOpen: !state.isNavOpen,
        })),

      setNavOpen: (isOpen) =>
        set({
          isNavOpen: isOpen,
        }),

      // Theme actions
      setTheme: (theme) =>
        set({
          theme,
        }),

      // Mobile sidebar actions
      toggleMobileSidebar: () =>
        set((state) => ({
          isMobileSidebarOpen: !state.isMobileSidebarOpen,
        })),

      setMobileSidebarOpen: (isOpen) =>
        set({
          isMobileSidebarOpen: isOpen,
        }),

      // Toast actions
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              ...toast,
              id: crypto.randomUUID(),
            },
          ],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      clearToasts: () =>
        set({
          toasts: [],
        }),

      resetStore: () =>
        set(initialState),
    }),
    {
      name: 'UIStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

/**
 * Individual state selectors for performance optimization
 */
export const useActiveModal = () => useUIStore((state) => state.activeModal)

export const useModalData = () => useUIStore((state) => state.modalData)

export const useIsUIStoreLoading = () => useUIStore((state) => state.isLoading)

export const useUIStoreLoadingState = (key: string) =>
  useUIStore((state) => state.loadingStates[key])

export const useIsNavOpen = () => useUIStore((state) => state.isNavOpen)

export const useTheme = () => useUIStore((state) => state.theme)

export const useIsMobileSidebarOpen = () =>
  useUIStore((state) => state.isMobileSidebarOpen)

export const useToasts = () => useUIStore((state) => state.toasts)

/**
 * Action selectors
 */
export const useOpenModal = () => useUIStore((state) => state.openModal)

export const useCloseModal = () => useUIStore((state) => state.closeModal)

export const useSetModalData = () => useUIStore((state) => state.setModalData)

export const useSetUIStoreLoading = () => useUIStore((state) => state.setIsLoading)

export const useSetLoadingState = () => useUIStore((state) => state.setLoadingState)

export const useClearLoadingState = () => useUIStore((state) => state.clearLoadingState)

export const useToggleNav = () => useUIStore((state) => state.toggleNav)

export const useSetNavOpen = () => useUIStore((state) => state.setNavOpen)

export const useSetTheme = () => useUIStore((state) => state.setTheme)

export const useToggleMobileSidebar = () =>
  useUIStore((state) => state.toggleMobileSidebar)

export const useSetMobileSidebarOpen = () =>
  useUIStore((state) => state.setMobileSidebarOpen)

export const useAddToast = () => useUIStore((state) => state.addToast)

export const useRemoveToast = () => useUIStore((state) => state.removeToast)

export const useClearToasts = () => useUIStore((state) => state.clearToasts)

export const useResetUIStore = () => useUIStore((state) => state.resetStore)
