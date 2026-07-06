import type { ProductVariant, VariantId } from '@/types'
import { ProductImage } from './ProductImage'

type VariantSelectorProps = {
  variants: readonly ProductVariant[]
  activeVariantId?: VariantId
  productName: string
  onSelectVariant: (variantId: VariantId) => void
  className?: string
}

export function VariantSelector({
  variants,
  activeVariantId,
  productName,
  onSelectVariant,
  className = '',
}: VariantSelectorProps) {
  if (variants.length === 0) return null

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`.trim()}
      role="radiogroup"
      aria-label={`${productName} color options`}
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId

        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${variant.name} color`}
            onClick={() => onSelectVariant(variant.id)}
            className={`inline-flex cursor-pointer items-center gap-1 rounded-control border px-1.5 py-0.5 text-[0.6875rem] font-medium motion-safe:transition-[colors,box-shadow] motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs ${
              isActive
                ? 'border-selection bg-selection-bg text-text-primary hover:border-selection hover:bg-selection-bg'
                : 'border-gray-border bg-surface text-text-secondary hover:border-gray-400 hover:bg-gray-200/50'
            }`}
          >
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-200">
              <ProductImage
                src={variant.imageSrc}
                alt=""
                aria-hidden="true"
                className="size-5 object-cover"
              />
            </span>
            <span>{variant.name}</span>
          </button>
        )
      })}
    </div>
  )
}
