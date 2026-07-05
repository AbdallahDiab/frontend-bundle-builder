import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AppButtonVariant = 'ghost' | 'outline' | 'icon'

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant
  children: ReactNode
}

const variantClasses: Record<AppButtonVariant, string> = {
  ghost:
    'inline-flex items-center justify-center rounded-control border-0 bg-transparent text-text-primary hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40',
  outline:
    'inline-flex items-center justify-center rounded-control border border-gray-border bg-surface text-text-primary hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40',
  icon: 'inline-flex size-8 shrink-0 items-center justify-center rounded-control border border-gray-border bg-surface text-text-primary hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40',
}

export function AppButton({
  variant = 'ghost',
  className = '',
  type = 'button',
  children,
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
