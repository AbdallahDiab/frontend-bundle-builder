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
      className="-mx-1 flex items-center gap-2 rounded-control border-b border-gray-300/70 px-1 py-2.5 motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out last:border-b-0 hover:bg-gray-200/30 sm:gap-3 sm:py-3"
      data-testid={`review-line-${getLineItemKey(item)}`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-surface p-1 sm:size-12">
        <ProductImage
          src={item.imageSrc}
          alt=""
          aria-hidden="true"
          className="size-9 object-contain sm:size-10"
        />
      </div>

      <p className="m-0 min-w-0 flex-1 text-sm font-medium leading-snug text-text-primary line-clamp-2">
        {displayName}
      </p>

      <QuantityStepper
        value={item.quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        decrementDisabled={item.quantity <= 0}
        ariaLabel={`${item.productName} quantity`}
        size="sm"
        variant="review"
        className="shrink-0"
      />

      <PriceDisplay
        variant="review"
        priceCents={item.lineTotalCents}
        compareAtPriceCents={item.compareAtLineTotalCents}
        priceLabel={item.priceLabel}
        priceSuffix={item.priceSuffix}
        className="w-[4.25rem] shrink-0 sm:w-auto"
      />
    </li>
  )
}
