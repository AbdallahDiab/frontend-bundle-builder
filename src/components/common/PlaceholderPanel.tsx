import type { ReactNode } from 'react'

type PlaceholderPanelProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PlaceholderPanel({
  title,
  description,
  children,
}: PlaceholderPanelProps) {
  return (
    <section
      aria-label={title}
      className="flex min-h-64 flex-col rounded-card border border-dashed border-gray-300 bg-surface p-6 shadow-panel"
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </header>
      {children ?? (
        <div className="flex flex-1 items-center justify-center rounded-control bg-gray-200/60">
          <span className="text-sm text-gray-700">Coming soon</span>
        </div>
      )}
    </section>
  )
}
