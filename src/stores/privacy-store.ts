/**
 * Privacy Store
 *
 * Manages privacy settings and content sharing state.
 */

import { create } from 'zustand';
import { PrivacySettings, ShareLink } from '@/lib/privacy/types';

interface PrivacyState {
  // State
  settings: PrivacySettings | null;
  shareLinks: ShareLink[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSettings: (settings: PrivacySettings | null) => void;
  setShareLinks: (links: ShareLink[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  // Async actions
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<PrivacySettings>) => Promise<void>;
  fetchShareLinks: () => Promise<void>;
  generateShareLink: (contentId: string, contentType: string, options?: any) => Promise<ShareLink | null>;
  revokeShareLink: (token: string) => Promise<void>;
}

const initialState = {
  settings: null,
  shareLinks: [],
  isLoading: false,
  error: null,
};

export const usePrivacyStore = create<PrivacyState>((set, get) => ({
  ...initialState,

  setSettings: (settings) => set({ settings }),
  setShareLinks: (links) => set({ shareLinks: links }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/user/privacy');
      const data = await response.json();

      if (data.success) {
        set({ settings: data.settings });
      } else {
        set({ error: data.message || '获取隐私设置失败' });
      }
    } catch (err) {
      set({ error: '获取隐私设置失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/user/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        set({ settings: result.settings });
      } else {
        set({ error: result.message || '更新隐私设置失败' });
      }
    } catch (err) {
      set({ error: '更新隐私设置失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchShareLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/share/my');
      const data = await response.json();

      if (data.success) {
        set({ shareLinks: data.shareLinks });
      } else {
        set({ error: data.message || '获取分享链接失败' });
      }
    } catch (err) {
      set({ error: '获取分享链接失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  generateShareLink: async (contentId, contentType, options) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType, options }),
      });
      const data = await response.json();

      if (data.success) {
        set({ shareLinks: [data.shareLink, ...get().shareLinks] });
        return data.shareLink;
      } else {
        set({ error: data.message || '生成分享链接失败' });
        return null;
      }
    } catch (err) {
      set({ error: '生成分享链接失败' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  revokeShareLink: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/share/${token}/revoke`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        set({ shareLinks: get().shareLinks.filter(link => link.token !== token) });
      } else {
        set({ error: data.message || '撤销分享链接失败' });
      }
    } catch (err) {
      set({ error: '撤销分享链接失败' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
