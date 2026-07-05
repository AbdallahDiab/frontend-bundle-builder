import { ToastProvider } from '@/components/common'
import { BuilderArea, BundleBuilderProvider } from '@/components/bundle-builder'
import { ReviewPanelArea } from '@/components/review-panel'
import { MainContainer } from './MainContainer'

export function AppShell() {
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-gray-200">
        <MainContainer>
          <BundleBuilderProvider>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <BuilderArea />
              <ReviewPanelArea />
            </div>
          </BundleBuilderProvider>
        </MainContainer>
      </div>
    </ToastProvider>
  )
}
