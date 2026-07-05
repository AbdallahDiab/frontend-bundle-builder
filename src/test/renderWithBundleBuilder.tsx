import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { BundleBuilderProvider } from '@/components/bundle-builder/BundleBuilderProvider'

export function renderWithBundleBuilder(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BundleBuilderProvider>{children}</BundleBuilderProvider>
    ),
    ...options,
  })
}
