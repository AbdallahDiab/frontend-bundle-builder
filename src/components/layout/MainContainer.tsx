import type { ReactNode } from 'react'

type MainContainerProps = {
  children: ReactNode
}

export function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-shell py-shell">{children}</div>
  )
}
