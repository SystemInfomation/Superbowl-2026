'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Providers wrapper for TanStack Query and other client-side providers
 */
export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 1000, // Data is fresh for 2 seconds
            refetchInterval: 1 * 1000, // Refetch every 1 second
            refetchOnWindowFocus: true,
            retry: 3,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
