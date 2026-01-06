/**
 * User Store
 *
 * Manages user authentication state and profile.
 */

import { create } from 'zustand';
import { SessionData } from '@/lib/auth/session';
import type { Tenant } from './tenant-store';
import type { TenantMember } from './tenant-store';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  tenantId: string | null;
  tenantRole: string | null;
  subscriptionLevel?: string | null;
}

interface UserState {
  // State
  user: User | null;
  session: SessionData | null;
  currentTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: SessionData | null) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  session: null,
  currentTenant: null,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));