'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

// Create a client-side QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in ms before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in ms that inactive queries will remain in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Retry failed queries
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
