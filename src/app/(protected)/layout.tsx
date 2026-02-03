'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { usePathname } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkspacePage = pathname?.includes('/workspace');

  return (
    <div className={`min-h-screen ${isWorkspacePage ? '' : ''}`}>
      {isWorkspacePage ? (
        <AppHeader compact />
      ) : (
        <AppHeader />
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
