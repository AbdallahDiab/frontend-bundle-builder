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
  const useLargeImage =
    item.category === 'sensors' || item.category === 'accessories'
  const isPlanItem = item.category === 'plan'
  const quantityLocked = item.maxQuantity !== undefined && item.maxQuantity <= 1

  return (
    <li
      className="-mx-1 flex items-center gap-2 rounded-control px-1 motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out hover:bg-gray-200/30 sm:gap-3"
      data-testid={`review-line-${getLineItemKey(item)}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-control ${
          isPlanItem
            ? 'size-11 sm:size-12'
            : 'size-11 bg-surface p-1 sm:size-12'
        }`}
      >
        <ProductImage
          src={item.imageSrc}
          alt=""
          aria-hidden="true"
          className={
            isPlanItem
              ? 'h-[23px] w-5 object-contain'
              : useLargeImage
                ? 'size-10 object-contain sm:size-11'
                : 'size-9 object-contain sm:size-10'
          }
        />
      </div>

      <p className="m-0 min-w-0 flex-1 break-words font-gilroy-medium text-sm font-normal leading-snug tracking-[0.5%] text-text-primary [overflow-wrap:anywhere]">
        {displayName}
      </p>

      {quantityLocked ? null : (
        <QuantityStepper
          value={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          decrementDisabled={item.quantity <= 0}
          incrementDisabled={
            item.maxQuantity !== undefined && item.quantity >= item.maxQuantity
          }
          ariaLabel={`${item.productName} quantity`}
          size="sm"
          variant="review"
          className="shrink-0"
        />
      )}

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
