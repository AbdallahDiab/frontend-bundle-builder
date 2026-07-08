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
            className={`inline-flex cursor-pointer items-center gap-0 rounded-control border py-0 pl-1 pr-2 motion-safe:transition-[colors,box-shadow] motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple ${
              isActive
                ? 'border-selection bg-selection-bg text-text-primary hover:border-selection hover:bg-selection-bg'
                : 'border-gray-border bg-surface text-text-secondary hover:border-gray-400 hover:bg-gray-200/50'
            }`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden">
              <ProductImage
                src={variant.swatchSrc ?? variant.imageSrc}
                alt=""
                aria-hidden="true"
                className="size-7 object-cover"
              />
            </span>
            <span className="font-gilroy-medium text-[10px] font-normal tracking-[0.6px]">
              {variant.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
