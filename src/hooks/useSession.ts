/**
 * useSession Hook
 *
 * Client-side hook for managing user session state.
 * Fetches session from /api/auth/session API.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiGet } from '@/lib/api-client';

export interface Session {
  user?: {
    id: string;
    email: string;
    name?: string;
    emailVerified?: string;
  };
  expires?: string;
}

interface SessionResult {
  session: Session | null;
  loading: boolean;
  user: Session['user'] | null;
  error: Error | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Hook to get current session from server
 *
 * Automatically refetches on route changes to keep session data fresh.
 */
export function useSession(): SessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet('/api/auth/session');
      const data = await response.json();

      // Set is null when not authenticated
      setSession(data);
    } catch (err) {
      console.error('[useSession] Error fetching session:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch session'));
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch session on mount and when pathname changes
  useEffect(() => {
    fetchSession();
  }, [fetchSession, pathname]);

  /**
   * Manually refresh the session
   */
  const refresh = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  /**
   * Sign out the current user
   *
   * Calls DELETE /api/auth/login to clear the session cookie
   * and redirects to login page.
   */
  const signOut = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear local session state
        setSession(null);
        // Redirect to login page
        const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
        router.push(`${basePath}/login`);
      } else {
        console.error('[useSession] Sign out failed');
      }
    } catch (err) {
      console.error('[useSession] Sign out error:', err);
    }
  }, [router]);

  return {
    session,
    loading,
    user: session?.user || null,
    error,
    refresh,
    signOut,
  };
}

/**
 * Hook to require authentication
 *
 * Redirects to login page if user is not authenticated.
 */
export function useRequireAuth(): SessionResult {
  const sessionResult = useSession();
  const { session, loading } = sessionResult;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session?.user) {
      // Redirect to login if not authenticated
      const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
      const currentPath = window.location.pathname;

      // Keep the current path for redirect after login
      router.push(`${basePath}/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [session, loading, router]);

  return sessionResult;
}
