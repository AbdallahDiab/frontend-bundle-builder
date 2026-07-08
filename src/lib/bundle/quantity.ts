import { getProductById, productHasVariants } from '@/data/products'
import type { BundleConfiguration, ProductId, VariantId } from '@/types'
import { getActiveVariantId } from './initialState'

export function getVariantQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
  variantId: VariantId,
): number {
  return configuration.quantities.variants[productId]?.[variantId] ?? 0
}

export function getProductQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
): number {
  const product = getProductById(productId)
  if (!product) return 0

  if (productHasVariants(product)) {
    const variantQuantities = configuration.quantities.variants[productId]
    if (!variantQuantities) return 0

    return Object.values(variantQuantities).reduce<number>(
      (sum, quantity) => sum + (quantity ?? 0),
      0,
    )
  }

  return configuration.quantities.products[productId] ?? 0
}

function clampQuantity(quantity: number, maxQuantity?: number): number {
  const floored = Math.max(0, quantity)
  if (maxQuantity === undefined) return floored
  return Math.min(floored, maxQuantity)
}

function nextIncrementedQuantity(
  current: number,
  maxQuantity?: number,
): number | null {
  const next = current + 1
  if (maxQuantity !== undefined && next > maxQuantity) return null
  return next
}

export function incrementItemQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
): BundleConfiguration {
  const product = getProductById(productId)
  if (!product) return configuration

  if (productHasVariants(product)) {
    const variantId =
      getActiveVariantId(configuration, productId) ?? product.defaultVariantId
    if (!variantId) return configuration

    const current = getVariantQuantity(configuration, productId, variantId)
    const next = nextIncrementedQuantity(current, product.maxQuantity)
    if (next === null) return configuration

    return {
      ...configuration,
      quantities: {
        ...configuration.quantities,
        variants: {
          ...configuration.quantities.variants,
          [productId]: {
            ...configuration.quantities.variants[productId],
            [variantId]: next,
          },
        },
      },
    }
  }

  const current = getProductQuantity(configuration, productId)
  const next = nextIncrementedQuantity(current, product.maxQuantity)
  if (next === null) return configuration

  return {
    ...configuration,
    quantities: {
      ...configuration.quantities,
      products: {
        ...configuration.quantities.products,
        [productId]: next,
      },
    },
  }
}

export function incrementVariantQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
  variantId: VariantId,
): BundleConfiguration {
  const product = getProductById(productId)
  if (!product || !productHasVariants(product)) return configuration
  if (!product.variants?.some((variant) => variant.id === variantId)) {
    return configuration
  }

  const current = getVariantQuantity(configuration, productId, variantId)
  const next = nextIncrementedQuantity(current, product.maxQuantity)
  if (next === null) return configuration

  return {
    ...configuration,
    quantities: {
      ...configuration.quantities,
      variants: {
        ...configuration.quantities.variants,
        [productId]: {
          ...configuration.quantities.variants[productId],
          [variantId]: next,
        },
      },
    },
  }
}

export function decrementVariantQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
  variantId: VariantId,
): BundleConfiguration {
  const product = getProductById(productId)
  if (!product || !productHasVariants(product)) return configuration
  if (!product.variants?.some((variant) => variant.id === variantId)) {
    return configuration
  }

  const current = getVariantQuantity(configuration, productId, variantId)

  return {
    ...configuration,
    quantities: {
      ...configuration.quantities,
      variants: {
        ...configuration.quantities.variants,
        [productId]: {
          ...configuration.quantities.variants[productId],
          [variantId]: clampQuantity(current - 1),
        },
      },
    },
  }
}

export function decrementItemQuantity(
  configuration: BundleConfiguration,
  productId: ProductId,
): BundleConfiguration {
  const product = getProductById(productId)
  if (!product) return configuration

  if (productHasVariants(product)) {
    const variantId =
      getActiveVariantId(configuration, productId) ?? product.defaultVariantId
    if (!variantId) return configuration

    const current = getVariantQuantity(configuration, productId, variantId)

    return {
      ...configuration,
      quantities: {
        ...configuration.quantities,
        variants: {
          ...configuration.quantities.variants,
          [productId]: {
            ...configuration.quantities.variants[productId],
            [variantId]: clampQuantity(current - 1),
          },
        },
      },
    }
  }

  const current = getProductQuantity(configuration, productId)

  return {
    ...configuration,
    quantities: {
      ...configuration.quantities,
      products: {
        ...configuration.quantities.products,
        [productId]: clampQuantity(current - 1),
      },
    },
  }
}

export function setActiveVariant(
  configuration: BundleConfiguration,
  productId: ProductId,
  variantId: VariantId,
): BundleConfiguration {
  const product = getProductById(productId)
  if (!product?.variants?.some((variant) => variant.id === variantId)) {
    return configuration
  }

  return {
    ...configuration,
    activeVariants: {
      ...configuration.activeVariants,
      [productId]: variantId,
    },
  }
}
