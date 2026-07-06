import type { ReactNode } from 'react'

type MainContainerProps = {
  children: ReactNode
}

export function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[var(--layout-content-width)] px-shell py-6 sm:px-shell-lg sm:py-8">
      {children}
    </div>
  )
}
