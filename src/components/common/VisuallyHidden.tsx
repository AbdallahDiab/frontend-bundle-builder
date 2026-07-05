import type { ReactNode } from 'react'

type VisuallyHiddenProps = {
  children: ReactNode
  /** Optional element type; defaults to span. */
  as?: 'span' | 'div'
}

/** Hides content visually while keeping it available to screen readers. */
export function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return (
    <Component className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
      {children}
    </Component>
  )
}
