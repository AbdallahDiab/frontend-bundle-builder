import { productHasVariants } from '@/data/products'
import type { Product, VariantId } from '@/types'

export type ProductDisplayPricing = {
  imageSrc: string
  priceCents?: number
  compareAtPriceCents?: number
  priceLabel?: string
  priceSuffix?: string
}

/** Resolves display image and pricing for the active variant or base product. */
export function getProductDisplayPricing(
  product: Product,
  activeVariantId?: VariantId,
): ProductDisplayPricing {
  if (productHasVariants(product) && activeVariantId) {
    const variant = product.variants?.find((v) => v.id === activeVariantId)
    if (variant) {
      return {
        imageSrc: variant.imageSrc,
        priceCents: variant.priceCents,
        compareAtPriceCents: variant.compareAtPriceCents,
        priceLabel: product.priceLabel,
        priceSuffix: product.priceSuffix,
      }
    }
  }

  return {
    imageSrc: product.imageSrc,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents,
    priceLabel: product.priceLabel,
    priceSuffix: product.priceSuffix,
  }
}

/** Selected when the active line (variant or product) has quantity > 0. */
export function isProductCardSelected(quantity: number): boolean {
  return quantity > 0
}
