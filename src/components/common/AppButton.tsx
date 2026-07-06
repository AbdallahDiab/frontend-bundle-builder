import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AppButtonVariant = 'ghost' | 'outline' | 'icon'

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant
  children: ReactNode
}

const interactiveBase =
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98] disabled:motion-safe:active:scale-100'

const variantClasses: Record<AppButtonVariant, string> = {
  ghost: `${interactiveBase} inline-flex cursor-pointer items-center justify-center rounded-control border-0 bg-transparent text-text-primary hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`,
  outline: `${interactiveBase} inline-flex cursor-pointer items-center justify-center rounded-control border border-gray-border bg-surface text-text-primary hover:border-gray-400 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-border disabled:hover:bg-surface`,
  icon: `${interactiveBase} inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control border border-gray-border bg-surface text-text-primary hover:border-gray-400 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-border disabled:hover:bg-surface`,
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
