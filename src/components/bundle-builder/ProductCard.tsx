import { productHasVariants } from '@/data/products'
import {
  getProductDisplayPricing,
  isProductCardSelected,
} from '@/lib/productDisplay'
import type { Product, VariantId } from '@/types'
import { DiscountBadge } from '@/components/common/DiscountBadge'
import { PriceDisplay } from '@/components/common/PriceDisplay'
import { ProductImage } from '@/components/common/ProductImage'
import { QuantityStepper } from '@/components/common/QuantityStepper'
import { VariantSelector } from '@/components/common/VariantSelector'

export type ProductCardProps = {
  product: Product
  activeVariantId?: VariantId
  quantity: number
  onVariantChange: (variantId: VariantId) => void
  onIncrement: () => void
  onDecrement: () => void
  /** Tighter layout for accordion grid cells. */
  compact?: boolean
  className?: string
}

export function ProductCard({
  product,
  activeVariantId,
  quantity,
  onVariantChange,
  onIncrement,
  onDecrement,
  compact = false,
  className = '',
}: ProductCardProps) {
  const hasVariants = productHasVariants(product)
  const selected = isProductCardSelected(quantity)
  const pricing = getProductDisplayPricing(product, activeVariantId)

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-card border-2 bg-surface shadow-panel transition-colors sm:flex-row ${
        compact ? 'sm:min-h-[8.75rem]' : 'sm:min-h-[11.5rem]'
      } ${
        selected
          ? 'border-wyze-purple-border bg-selection-bg'
          : 'border-gray-border'
      } ${className}`.trim()}
      aria-label={product.name}
      data-selected={selected ? 'true' : 'false'}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center ${
          compact
            ? 'px-3 pt-8 pb-3 sm:w-[34%] sm:px-4 sm:py-4'
            : 'px-4 pt-10 pb-4 sm:w-[38%] sm:px-6 sm:py-6'
        }`}
      >
        {product.discountBadge && (
          <div
            className={`absolute z-10 ${compact ? 'top-2 left-2 sm:left-3' : 'top-3 left-3 sm:left-4'}`}
          >
            <DiscountBadge label={product.discountBadge} />
          </div>
        )}

        <ProductImage
          src={pricing.imageSrc}
          alt={product.name}
          className={
            compact
              ? 'max-h-20 w-full max-w-[6.5rem] object-contain sm:max-h-[5.5rem]'
              : 'max-h-28 w-full max-w-[9.5rem] object-contain sm:max-h-32'
          }
        />
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          compact
            ? 'gap-2 px-3 pb-3 sm:py-3 sm:pr-4 sm:pl-1'
            : 'gap-3 px-4 pb-4 sm:py-5 sm:pr-5 sm:pl-2'
        }`}
      >
        <div>
          <h3
            className={`leading-snug font-semibold text-text-primary ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`mt-0.5 leading-snug text-text-secondary ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {product.description}
          </p>
          {product.learnMoreUrl && (
            <a
              href={product.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-link underline-offset-2 hover:underline"
            >
              Learn More
            </a>
          )}
        </div>

        {hasVariants && product.variants && (
          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariantId}
            productName={product.name}
            onSelectVariant={onVariantChange}
          />
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <QuantityStepper
            value={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            decrementDisabled={quantity <= 0}
            ariaLabel={`${product.name} quantity`}
          />

          <PriceDisplay
            priceCents={pricing.priceCents}
            compareAtPriceCents={pricing.compareAtPriceCents}
            priceLabel={pricing.priceLabel}
            priceSuffix={pricing.priceSuffix}
            variant="card"
          />
        </div>
      </div>
    </article>
  )
}
