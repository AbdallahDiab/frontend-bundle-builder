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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_var(--width-review-panel)] lg:items-start lg:gap-10 xl:gap-12">
              <BuilderArea />
              <ReviewPanelArea />
            </div>
          </BundleBuilderProvider>
        </MainContainer>
      </div>
    </ToastProvider>
  )
}
