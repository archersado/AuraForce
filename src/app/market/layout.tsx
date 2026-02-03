/**
 * Market layout - redirects to protected namespace
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect all market pages to /auraforce/market
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/market')) {
        router.replace(currentPath.replace('/market', '/auraforce/market'));
      }
    }
  }, [router]);

  return <>{children}</>;
}
