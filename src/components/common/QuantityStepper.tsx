import minusIcon from '@/assets/icons/minus.svg'
import plusIcon from '@/assets/icons/plus.svg'
import { AppButton } from './AppButton'
import { VisuallyHidden } from './VisuallyHidden'

type QuantityStepperSize = 'sm' | 'md'

type QuantityStepperProps = {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  decrementDisabled?: boolean
  ariaLabel: string
  size?: QuantityStepperSize
  className?: string
}

const sizeClasses: Record<QuantityStepperSize, string> = {
  sm: 'h-9 min-h-9 text-sm',
  md: 'h-9 min-h-9 text-sm',
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  decrementDisabled = value <= 0,
  ariaLabel,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  return (
    <div
      className={`inline-flex items-center rounded-control border border-gray-border bg-surface ${sizeClasses[size]} ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <AppButton
        variant="icon"
        className="size-9 min-h-9 min-w-9 rounded-none border-0 border-r border-gray-border"
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label="Decrease quantity"
      >
        <img src={minusIcon} alt="" className="size-3.5" aria-hidden="true" />
      </AppButton>

      <span
        className="flex min-w-9 items-center justify-center px-1.5 font-medium tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        <VisuallyHidden>Quantity:</VisuallyHidden>
        {value}
      </span>

      <AppButton
        variant="icon"
        className="size-9 min-h-9 min-w-9 rounded-none border-0 border-l border-gray-border"
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <img src={plusIcon} alt="" className="size-3.5" aria-hidden="true" />
      </AppButton>
    </div>
  )
}
