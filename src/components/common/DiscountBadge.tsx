type DiscountBadgeProps = {
  label: string
  className?: string
}

export function DiscountBadge({ label, className = '' }: DiscountBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-wyze-purple px-2 py-0.5 text-xs font-semibold leading-tight text-white ${className}`.trim()}
    >
      {label}
    </span>
  )
}
