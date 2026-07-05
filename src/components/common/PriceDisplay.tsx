import { formatCurrency } from '@/utils/formatCurrency'

export type PriceDisplayVariant = 'card' | 'review'

type PriceDisplayProps = {
  priceCents?: number
  compareAtPriceCents?: number
  priceLabel?: string
  priceSuffix?: string
  variant?: PriceDisplayVariant
  className?: string
}

export function PriceDisplay({
  priceCents,
  compareAtPriceCents,
  priceLabel,
  priceSuffix = '',
  variant = 'card',
  className = '',
}: PriceDisplayProps) {
  const hasCompare =
    compareAtPriceCents !== undefined && compareAtPriceCents > 0
  const showSaleCompare = variant === 'card' && hasCompare

  const activePrice =
    priceLabel ??
    (priceCents !== undefined ? formatCurrency(priceCents) : undefined)

  if (!activePrice && !hasCompare) return null

  return (
    <div className={`flex flex-col items-end gap-0.5 ${className}`.trim()}>
      {showSaleCompare && (
        <span className="text-sm leading-none text-sale line-through">
          {formatCurrency(compareAtPriceCents)}
          {priceSuffix}
        </span>
      )}

      {variant === 'review' && hasCompare && (
        <span className="text-sm leading-none text-text-secondary line-through">
          {formatCurrency(compareAtPriceCents)}
          {priceSuffix}
        </span>
      )}

      {activePrice && (
        <span
          className={`font-semibold leading-none ${
            variant === 'card' ? 'text-base text-text-primary' : 'text-sm'
          }`}
        >
          {activePrice}
          {!priceLabel && priceSuffix}
        </span>
      )}
    </div>
  )
}
