// Simple fix for auth check - just pass through for now

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Session {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface SessionContext {
  session: Session | null;
  loading: boolean;
  user: Session['user'] | null;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // TODO: Implement real auth check
    // For now, just simulate logged-in state
    setSession({
      user: {
        id: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }, [pathname]);

  return { session, loading, user: session?.user || null };
}

export function useRequireAuth() {
  const { session, loading, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      // TODO: Redirect to login if needed
      // router.push('/login');
    }
  }, [session, loading, router]);

  return { session, loading, user };
}
