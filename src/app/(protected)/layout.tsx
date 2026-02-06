'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkspacePage = pathname?.includes('/workspace');
  const { user, loading, signOut } = useSession();

  // Don't show user actions while loading or if user is null
  const showUserActions = !loading && user;

  return (
    <div className={`min-h-screen ${isWorkspacePage ? '' : ''}`}>
      {isWorkspacePage ? (
        <AppHeader
          compact
          user={showUserActions ? { name: user?.name || user?.email } : undefined}
          onSignOut={signOut}
        />
      ) : (
        <AppHeader
          user={showUserActions ? { name: user?.name || user?.email } : undefined}
          onSignOut={signOut}
        />
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
