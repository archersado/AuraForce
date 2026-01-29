'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
}

export interface SessionData {
  user: SessionUser;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setSession(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch session');
      }

      const data = await response.json();
      setSession(data);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session');
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
    user: session?.user || null,
  };
}

export function useRequireAuth() {
  const result = useSession();

  useEffect(() => {
    if (!result.loading && !result.session) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [result.session, result.loading]);

  return result;
}
