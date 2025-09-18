'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
