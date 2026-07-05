import { type ReactNode } from 'react'
import { useBundleBuilder } from '@/hooks/useBundleBuilder'
import { BundleBuilderContext } from './useBundleBuilderContext'

type BundleBuilderProviderProps = {
  children: ReactNode
}

export function BundleBuilderProvider({
  children,
}: BundleBuilderProviderProps) {
  const value = useBundleBuilder()

  return (
    <BundleBuilderContext.Provider value={value}>
      {children}
    </BundleBuilderContext.Provider>
  )
}
