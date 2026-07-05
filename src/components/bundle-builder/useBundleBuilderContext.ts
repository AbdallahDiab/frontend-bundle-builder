import { createContext, useContext } from 'react'
import type { UseBundleBuilderReturn } from '@/hooks/useBundleBuilder'

export const BundleBuilderContext =
  createContext<UseBundleBuilderReturn | null>(null)

export function useBundleBuilderContext(): UseBundleBuilderReturn {
  const context = useContext(BundleBuilderContext)

  if (!context) {
    throw new Error(
      'useBundleBuilderContext must be used within a BundleBuilderProvider',
    )
  }

  return context
}
