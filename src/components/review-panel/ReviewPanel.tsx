import satisfactionBadge from '@/assets/icons/satisfaction-guarantee.png'
import shippingTruckIcon from '@/assets/icons/shipping-truck.svg'
import { PriceDisplay, ProductImage } from '@/components/common'
import { useBundleBuilderContext } from '@/components/bundle-builder/useBundleBuilderContext'
import { REVIEW_CATEGORY_LABELS, REVIEW_CATEGORY_ORDER } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'
import { ReviewLineItem } from './ReviewLineItem'

function getLineItemKey(productId: string, variantId?: string): string {
  return `${productId}-${variantId ?? 'base'}`
}

export function ReviewPanel() {
  const {
    groupedSelectedItems,
    pricingSummary,
    shippingSummary,
    increment,
    decrement,
  } = useBundleBuilderContext()

  const handleCheckout = () => {
    window.alert('Checkout is not implemented in this prototype.')
  }

  const handleSaveForLater = () => {
    window.alert('Persistence will be added in the next step.')
  }

  return (
    <aside
      aria-label="Your security system review"
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <div className="overflow-hidden rounded-card bg-gray-200 shadow-panel">
        <header className="border-b border-gray-300/70 px-5 py-5">
          <h2 className="m-0 text-xl font-bold text-text-primary sm:text-2xl">
            Your security system
          </h2>
          <p className="mb-0 mt-2 text-sm leading-relaxed text-text-secondary">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </header>

        <div className="px-5 py-4">
          {REVIEW_CATEGORY_ORDER.map((category) => {
            const items = groupedSelectedItems[category]
            if (items.length === 0) return null

            return (
              <section
                key={category}
                aria-labelledby={`review-section-${category}`}
                className="border-b border-gray-300/70 pb-2 last:border-b-0"
              >
                <h3
                  id={`review-section-${category}`}
                  className="m-0 py-3 text-xs font-semibold tracking-[0.08em] text-gray-600 uppercase"
                >
                  {REVIEW_CATEGORY_LABELS[category]}
                </h3>

                <ul className="m-0 list-none p-0">
                  {items.map((item) => (
                    <ReviewLineItem
                      key={getLineItemKey(item.productId, item.variantId)}
                      item={item}
                      onIncrement={() =>
                        increment(item.productId, item.variantId)
                      }
                      onDecrement={() =>
                        decrement(item.productId, item.variantId)
                      }
                    />
                  ))}
                </ul>
              </section>
            )
          })}

          <section
            aria-label="Shipping"
            className="border-b border-gray-300/70 py-3"
            data-testid="review-shipping-row"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-control bg-surface p-2">
                <img
                  src={shippingTruckIcon}
                  alt=""
                  aria-hidden="true"
                  className="size-7"
                />
              </div>

              <p className="m-0 min-w-0 flex-1 text-sm font-medium text-text-primary">
                {shippingSummary.label}
              </p>

              <PriceDisplay
                variant="review"
                priceCents={shippingSummary.priceCents}
                compareAtPriceCents={shippingSummary.compareAtPriceCents}
                priceLabel={shippingSummary.priceLabel}
              />
            </div>
          </section>
        </div>

        <footer className="border-t border-gray-300/70 bg-gray-200 px-5 py-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <ProductImage
                src={satisfactionBadge}
                alt="100% Wyze satisfaction guarantee"
                className="size-24 sm:size-28"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-wyze-purple px-3 py-1 text-xs font-semibold text-white">
                as low as $19.19/mo
              </span>

              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-text-secondary line-through">
                  {formatCurrency(pricingSummary.compareAtTotalCents)}
                </span>
                <span
                  className="text-3xl font-bold text-wyze-purple"
                  data-testid="review-total"
                >
                  {formatCurrency(pricingSummary.totalCents)}
                </span>
              </div>

              <p
                className="m-0 text-center text-sm font-medium text-selection sm:text-left"
                data-testid="review-savings"
              >
                Congrats! You&apos;re saving{' '}
                {formatCurrency(pricingSummary.savingsCents)} on your security
                bundle!
              </p>

              <button
                type="button"
                className="w-full rounded-control bg-wyze-purple px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-wyze-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple"
                onClick={handleCheckout}
              >
                Checkout
              </button>

              <button
                type="button"
                className="mx-auto text-sm text-text-secondary underline underline-offset-2 transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple sm:mx-0"
                onClick={handleSaveForLater}
              >
                Save my system for later
              </button>
            </div>
          </div>
        </footer>
      </div>
    </aside>
  )
}
