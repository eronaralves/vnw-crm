'use client'

import type { ReactNode } from 'react'

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

interface QueryClientProviderProps {
  children: ReactNode
}

export default function QueryClientProvider({
  children,
}: QueryClientProviderProps) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
