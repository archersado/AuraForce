/**
 * Tenant Store
 *
 * Manages tenant state, members, and settings.
 */

import { create } from 'zustand';
import { TenantRole } from '@/lib/tenant/rbac.service';
import { TenantSettings, TenantUsage } from '@/lib/tenant/config';

export interface Tenant {
  id: string;
  name: string;
  description: string | null;
  settings: TenantSettings;
  plan: string;
  maxMembers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantMember {
  id: string;
  name: string | null;
  email: string;
  role: TenantRole;
  avatar: string | null;
  createdAt: Date;
}

interface TenantState {
  // State
  currentTenant: Tenant | null;
  userRole: TenantRole | null;
  members: TenantMember[];
  usage: TenantUsage | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentTenant: (tenant: Tenant | null) => void;
  setUserRole: (role: TenantRole | null) => void;
  setMembers: (members: TenantMember[]) => void;
  setUsage: (usage: TenantUsage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  currentTenant: null,
  userRole: null,
  members: [],
  usage: null,
  isLoading: false,
  error: null,
};

export const useTenantStore = create<TenantState>((set) => ({
  ...initialState,

  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
  setUserRole: (role) => set({ userRole: role }),
  setMembers: (members) => set({ members }),
  setUsage: (usage) => set({ usage }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
