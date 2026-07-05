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
      className={`relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-[border-color,background-color,box-shadow] ${
        compact ? 'sm:flex-row' : 'sm:flex-row'
      } ${compact ? 'sm:min-h-[9rem]' : 'sm:min-h-[11.5rem]'} ${
        selected
          ? 'border-2 border-wyze-purple bg-selection-bg shadow-panel'
          : 'border border-gray-300'
      } ${className}`.trim()}
      aria-label={product.name}
      data-selected={selected ? 'true' : 'false'}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center ${
          compact
            ? 'px-3 pt-8 pb-3 sm:w-[32%] sm:max-w-[7.5rem] sm:px-2 sm:py-4'
            : 'px-4 pt-10 pb-4 sm:w-[38%] sm:px-6 sm:py-6'
        }`}
      >
        {product.discountBadge && (
          <div
            className={`absolute z-10 ${compact ? 'top-2 left-2' : 'top-3 left-3 sm:left-4'}`}
          >
            <DiscountBadge label={product.discountBadge} />
          </div>
        )}

        <ProductImage
          src={pricing.imageSrc}
          alt={product.name}
          className={
            compact
              ? 'h-20 w-full max-w-[5.5rem] object-contain sm:h-[4.75rem] sm:max-w-[5rem]'
              : 'max-h-28 w-full max-w-[9.5rem] object-contain sm:max-h-32'
          }
        />
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          compact
            ? 'gap-1.5 px-3 pb-3 sm:gap-2 sm:py-3 sm:pr-3 sm:pl-0'
            : 'gap-3 px-4 pb-4 sm:py-5 sm:pr-5 sm:pl-2'
        }`}
      >
        <div className="min-w-0">
          <h3
            className={`truncate leading-snug font-semibold text-text-primary ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`mt-0.5 line-clamp-2 leading-snug text-text-secondary ${
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
              className="mt-0.5 inline-block text-xs text-link underline-offset-2 hover:underline sm:text-sm"
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
            className={compact ? 'gap-1.5' : undefined}
          />
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <QuantityStepper
            value={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            decrementDisabled={quantity <= 0}
            ariaLabel={`${product.name} quantity`}
            size={compact ? 'sm' : 'md'}
          />

          <PriceDisplay
            priceCents={pricing.priceCents}
            compareAtPriceCents={pricing.compareAtPriceCents}
            priceLabel={pricing.priceLabel}
            priceSuffix={pricing.priceSuffix}
            variant="card"
            className="shrink-0"
          />
        </div>
      </div>
    </article>
  )
}
