import {
  PriceDisplay,
  ProductImage,
  QuantityStepper,
} from '@/components/common'
import type { SelectedItem } from '@/types'

type ReviewLineItemProps = {
  item: SelectedItem
  onIncrement: () => void
  onDecrement: () => void
}

function getLineItemKey(item: SelectedItem): string {
  return `${item.productId}-${item.variantId ?? 'base'}`
}

export function ReviewLineItem({
  item,
  onIncrement,
  onDecrement,
}: ReviewLineItemProps) {
  const displayName = item.productName

  return (
    <li
      className="flex items-center gap-3 border-b border-gray-300/70 py-3 last:border-b-0"
      data-testid={`review-line-${getLineItemKey(item)}`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-control bg-surface p-1">
        <ProductImage
          src={item.imageSrc}
          alt=""
          aria-hidden="true"
          className="size-10"
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <p className="m-0 min-w-0 flex-1 text-sm font-medium text-text-primary">
          {displayName}
        </p>

        <QuantityStepper
          value={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          decrementDisabled={item.quantity <= 0}
          ariaLabel={`${item.productName} quantity`}
          size="sm"
          className="shrink-0"
        />
      </div>

      <PriceDisplay
        variant="review"
        priceCents={item.lineTotalCents}
        compareAtPriceCents={item.compareAtLineTotalCents}
        priceLabel={item.priceLabel}
        priceSuffix={item.priceSuffix}
        className="shrink-0"
      />
    </li>
  )
}
