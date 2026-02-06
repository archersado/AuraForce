/**
 * Skill Builder Pages Layout
 *
 * Uses the unified AppHeader for skill builder pages.
 */

'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { useSession } from '@/hooks/useSession';

export default function SkillBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useSession();

  // Don't show user actions while loading or if user is null
  const showUserActions = !loading && user;

  return (
    <div className="min-h-screen">
      <AppHeader
        compact
        user={showUserActions ? { name: user?.name || user?.email } : undefined}
        onSignOut={signOut}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
