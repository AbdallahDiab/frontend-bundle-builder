import { VisuallyHidden } from './VisuallyHidden'

type QuantityStepperSize = 'sm' | 'md'
type QuantityStepperVariant = 'card' | 'review'

type QuantityStepperProps = {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  ariaLabel: string
  size?: QuantityStepperSize
  variant?: QuantityStepperVariant
  className?: string
}

const QUANTITY_VALUE =
  'min-w-5 text-center font-gilroy-medium text-base font-normal leading-5 tracking-normal align-bottom tabular-nums text-gray-obsidian'

const stepperButtonBase =
  'inline-flex size-5 min-h-5 min-w-5 shrink-0 cursor-pointer items-center justify-center rounded-control motion-safe:transition-[background-color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:motion-safe:active:scale-100'

function getMinusButtonClass(
  variant: QuantityStepperVariant,
  decrementDisabled: boolean,
): string {
  if (decrementDisabled) {
    return 'border border-gray-300 bg-surface hover:bg-surface'
  }

  if (variant === 'review') {
    return 'bg-surface hover:bg-gray-200/50'
  }

  return 'bg-gray-200 hover:bg-gray-300/80'
}

function getPlusButtonClass(
  variant: QuantityStepperVariant,
  incrementDisabled: boolean,
): string {
  if (incrementDisabled) {
    return 'border border-gray-300 bg-surface hover:bg-surface'
  }

  if (variant === 'review') {
    return 'bg-surface hover:bg-gray-200/50'
  }

  return 'bg-gray-200 hover:bg-gray-300/80'
}

function MinusIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 8h10" />
    </svg>
  )
}

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  decrementDisabled = value <= 0,
  incrementDisabled = false,
  ariaLabel,
  size: _size = 'md',
  variant = 'card',
  className = '',
}: QuantityStepperProps) {
  return (
    <div
      className={`inline-flex items-end gap-2.5 ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={`${stepperButtonBase} ${getMinusButtonClass(variant, decrementDisabled)}`}
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label="Decrease quantity"
      >
        <MinusIcon
          className={`size-2.5 ${
            decrementDisabled ? 'text-gray-400' : 'text-gray-obsidian'
          }`}
        />
      </button>

      <span
        className={QUANTITY_VALUE}
        aria-live="polite"
        aria-atomic="true"
      >
        <VisuallyHidden>Quantity:</VisuallyHidden>
        {value}
      </span>

      <button
        type="button"
        className={`${stepperButtonBase} ${getPlusButtonClass(variant, incrementDisabled)}`}
        onClick={onIncrement}
        disabled={incrementDisabled}
        aria-label="Increase quantity"
      >
        <PlusIcon
          className={`size-2.5 ${
            incrementDisabled ? 'text-gray-400' : 'text-gray-obsidian'
          }`}
        />
      </button>
    </div>
  )
}
