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
            onClick={() => onSelectVariant(variant.id)}
            className={`inline-flex items-center gap-1.5 rounded-control border px-2 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple ${
              isActive
                ? 'border-selection bg-selection-bg text-text-primary'
                : 'border-gray-border bg-surface text-text-secondary hover:border-gray-400'
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
