import { PRODUCT_CATALOG, productHasVariants } from '@/data/products'
import type {
  ActiveVariantMap,
  BundleConfiguration,
  ProductId,
  ProductQuantityMap,
  VariantId,
  VariantQuantityMap,
} from '@/types'

function buildInitialQuantities(): BundleConfiguration['quantities'] {
  const products: ProductQuantityMap = {}
  const variants: VariantQuantityMap = {}

  for (const product of PRODUCT_CATALOG) {
    if (productHasVariants(product)) {
      const variantQuantities: Partial<Record<VariantId, number>> = {}

      for (const variant of product.variants ?? []) {
        if (variant.initialQuantity && variant.initialQuantity > 0) {
          variantQuantities[variant.id] = variant.initialQuantity
        }
      }

      if (Object.keys(variantQuantities).length > 0) {
        variants[product.id] = variantQuantities
      }
    } else if (product.initialQuantity && product.initialQuantity > 0) {
      products[product.id] = product.initialQuantity
    }
  }

  return { products, variants }
}

function buildInitialActiveVariants(): ActiveVariantMap {
  const activeVariants: ActiveVariantMap = {}

  for (const product of PRODUCT_CATALOG) {
    if (product.defaultVariantId) {
      activeVariants[product.id] = product.defaultVariantId
    }
  }

  return activeVariants
}

/** Returns the seeded bundle configuration matching the Figma review panel. */
export function getInitialBundleConfiguration(): BundleConfiguration {
  return {
    activeVariants: buildInitialActiveVariants(),
    quantities: buildInitialQuantities(),
  }
}

export function getActiveVariantId(
  configuration: BundleConfiguration,
  productId: ProductId,
): VariantId | undefined {
  return configuration.activeVariants[productId]
}
