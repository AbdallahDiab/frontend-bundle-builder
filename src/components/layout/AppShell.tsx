import { ToastProvider } from '@/components/common'
import { BuilderArea, BundleBuilderProvider } from '@/components/bundle-builder'
import { ReviewPanelArea } from '@/components/review-panel'
import { MainContainer } from './MainContainer'

export function AppShell() {
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-page-bg">
        <MainContainer>
          <BundleBuilderProvider>
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[var(--layout-builder-width)_var(--layout-review-width)] xl:items-start xl:gap-[var(--layout-desktop-gap)]">
              <div className="w-full min-w-0 xl:w-[var(--layout-builder-width)]">
                <BuilderArea />
              </div>
              <div className="w-full min-w-0 xl:w-[var(--layout-review-width)]">
                <ReviewPanelArea />
              </div>
            </div>
          </BundleBuilderProvider>
        </MainContainer>
      </div>
    </ToastProvider>
  )
}
