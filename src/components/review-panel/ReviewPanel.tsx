import satisfactionBadge from '@/assets/icons/satisfaction-guarantee.png'
import shippingTruckIcon from '@/assets/icons/shipping-truck.svg'
import { PriceDisplay, ProductImage, useToast } from '@/components/common'
import { useBundleBuilderContext } from '@/components/bundle-builder/useBundleBuilderContext'
import { saveBundleConfiguration } from '@/lib/bundle'
import { REVIEW_CATEGORY_LABELS, REVIEW_CATEGORY_ORDER } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'
import { useState } from 'react'
import { ReviewLineItem } from './ReviewLineItem'

function getLineItemKey(productId: string, variantId?: string): string {
  return `${productId}-${variantId ?? 'base'}`
}

export function ReviewPanel() {
  const {
    configuration,
    selectedItems,
    groupedSelectedItems,
    pricingSummary,
    shippingSummary,
    increment,
    decrement,
  } = useBundleBuilderContext()
  const { showToast } = useToast()
  const [saveAcknowledged, setSaveAcknowledged] = useState(false)
  const isEmpty = selectedItems.length === 0

  const handleCheckout = () => {
    if (isEmpty) return
    showToast('Checkout is not implemented in this prototype.')
  }

  const handleSaveForLater = () => {
    const saved = saveBundleConfiguration(configuration)

    if (saved) {
      setSaveAcknowledged(true)
      showToast(
        "Your system has been saved. We'll restore it next time you visit.",
      )
      return
    }

    showToast('Unable to save your system right now. Please try again.')
  }

  return (
    <aside
      aria-label="Your security system review"
      className="w-full min-w-0 xl:w-[var(--layout-review-width)] lg:sticky lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:self-start lg:overflow-y-auto"
    >
      <div className="overflow-hidden rounded-card bg-review-panel shadow-panel">
        <header className="border-b border-gray-300/70 px-4 py-4 sm:px-5 sm:py-5">
          <p className="m-0 mb-1 text-[0.6875rem] font-medium tracking-[0.08em] text-gray-600 uppercase">
            Review
          </p>
          <h2 className="m-0 text-xl font-bold text-text-primary sm:text-2xl">
            Your security system
          </h2>
          <p className="mb-0 mt-2 text-sm leading-relaxed text-text-secondary">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </header>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          {isEmpty ? (
            <section
              aria-live="polite"
              className="rounded-control border border-dashed border-gray-300/70 bg-surface px-4 py-10 text-center sm:px-5 sm:py-12"
              data-testid="review-empty-state"
            >
              <h3 className="m-0 text-lg font-semibold text-text-primary">
                Your system is empty
              </h3>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-text-secondary">
                Add products from the builder to see your security system
                summary here.
              </p>
            </section>
          ) : (
            <>
              {REVIEW_CATEGORY_ORDER.map((category) => {
                const items = groupedSelectedItems[category]
                if (items.length === 0) return null

                return (
                  <section
                    key={category}
                    aria-labelledby={`review-section-${category}`}
                    className="border-b border-gray-300/70 pb-1 last:border-b-0"
                  >
                    <h3
                      id={`review-section-${category}`}
                      className="m-0 py-2.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-gray-600 uppercase sm:py-3"
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
                className="border-b border-gray-300/70 py-2.5 sm:py-3"
                data-testid="review-shipping-row"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-surface p-1.5 sm:size-12 sm:p-2">
                    <img
                      src={shippingTruckIcon}
                      alt=""
                      aria-hidden="true"
                      className="size-6 sm:size-7"
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
                    className="shrink-0"
                  />
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="border-t border-gray-300/70 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            {isEmpty ? null : (
              <ProductImage
                src={satisfactionBadge}
                alt="100% Wyze satisfaction guarantee"
                className="size-[4.5rem] shrink-0 sm:size-24"
              />
            )}

            <div className="flex min-w-0 flex-col items-end gap-2">
              {isEmpty ? null : (
                <span className="inline-flex items-center rounded-full bg-wyze-purple px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs">
                  as low as $19.19/mo
                </span>
              )}

              <div className="flex flex-col items-end gap-0.5">
                {isEmpty ? null : (
                  <span
                    className="text-sm text-text-secondary line-through"
                    data-testid="review-compare-total"
                  >
                    {formatCurrency(pricingSummary.compareAtTotalCents)}
                  </span>
                )}
                <span
                  className="text-[1.75rem] font-bold leading-none text-wyze-purple sm:text-3xl"
                  data-testid="review-total"
                >
                  {formatCurrency(pricingSummary.totalCents)}
                </span>
              </div>
            </div>
          </div>

          {isEmpty ? null : (
            <p
              className="m-0 mt-4 text-center text-sm font-medium text-selection"
              data-testid="review-savings"
            >
              Congrats! You&apos;re saving{' '}
              {formatCurrency(pricingSummary.savingsCents)} on your security
              bundle!
            </p>
          )}

          <button
            type="button"
            className="mt-4 w-full min-h-11 rounded-control bg-wyze-purple px-6 py-3 text-base font-semibold text-white motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out hover:bg-wyze-purple/90 hover:shadow-panel motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple disabled:cursor-not-allowed disabled:bg-wyze-purple/50 disabled:text-white/75 disabled:hover:bg-wyze-purple/50 disabled:hover:shadow-none disabled:motion-safe:active:scale-100"
            onClick={handleCheckout}
            disabled={isEmpty}
          >
            Checkout
          </button>

          {isEmpty ? null : (
            <div className="mt-3 flex flex-col items-center gap-1">
              <button
                type="button"
                className="min-h-11 cursor-pointer text-sm text-text-secondary underline underline-offset-2 motion-safe:transition-[color,text-decoration-color] motion-safe:duration-200 motion-safe:ease-out hover:text-text-primary hover:decoration-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple"
                onClick={handleSaveForLater}
              >
                Save my system for later
              </button>
              {saveAcknowledged ? (
                <p
                  className="m-0 text-xs text-selection"
                  data-testid="save-acknowledgement"
                >
                  Saved for your next visit
                </p>
              ) : null}
            </div>
          )}
        </footer>
      </div>
    </aside>
  )
}
