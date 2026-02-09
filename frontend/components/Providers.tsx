'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'
import ServiceWorkerRegister from './ServiceWorkerRegister'

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
            staleTime: 500, // Data is fresh for 0.5 seconds
            refetchInterval: 500, // Refetch every 0.5 seconds
            refetchOnWindowFocus: true,
            retry: 3,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceWorkerRegister />
      {children}
    </QueryClientProvider>
  )
}
