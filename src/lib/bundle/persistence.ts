import { PRODUCT_CATALOG, productHasVariants } from '@/data/products'
import { getInitialBundleConfiguration } from '@/lib/bundle/initialState'
import type {
  ActiveVariantMap,
  BundleConfiguration,
  ProductId,
  ProductQuantityMap,
  QuantityMap,
  VariantId,
  VariantQuantityMap,
} from '@/types'

export const BUNDLE_BUILDER_STORAGE_KEY = 'bundle-builder-config-v1'

export type SavedBundleConfiguration = Pick<
  BundleConfiguration,
  'activeVariants' | 'quantities'
>

function buildDefaultActiveVariants(): ActiveVariantMap {
  const activeVariants: ActiveVariantMap = {}

  for (const product of PRODUCT_CATALOG) {
    if (product.defaultVariantId) {
      activeVariants[product.id] = product.defaultVariantId
    }
  }

  return activeVariants
}

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }

    const testKey = '__bundle_builder_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function isValidQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function getKnownVariantIds(productId: ProductId): Set<VariantId> {
  const product = PRODUCT_CATALOG.find((entry) => entry.id === productId)
  if (!product?.variants) {
    return new Set()
  }

  return new Set(product.variants.map((variant) => variant.id))
}

function isKnownProductId(productId: string): productId is ProductId {
  return PRODUCT_CATALOG.some((product) => product.id === productId)
}

function sanitizeProductQuantities(raw: unknown): ProductQuantityMap {
  if (!raw || typeof raw !== 'object') {
    return {}
  }

  const sanitized: ProductQuantityMap = {}

  for (const [productId, quantity] of Object.entries(raw)) {
    if (!isKnownProductId(productId)) continue

    const product = PRODUCT_CATALOG.find((entry) => entry.id === productId)
    if (!product || productHasVariants(product)) continue
    if (!isValidQuantity(quantity)) continue

    sanitized[productId] =
      product.maxQuantity !== undefined
        ? Math.min(quantity, product.maxQuantity)
        : quantity
  }

  return sanitized
}

function sanitizeVariantQuantities(raw: unknown): VariantQuantityMap {
  if (!raw || typeof raw !== 'object') {
    return {}
  }

  const sanitized: VariantQuantityMap = {}

  for (const [productId, variantEntries] of Object.entries(raw)) {
    if (!isKnownProductId(productId)) continue

    const product = PRODUCT_CATALOG.find((entry) => entry.id === productId)
    if (!product || !productHasVariants(product)) continue
    if (!variantEntries || typeof variantEntries !== 'object') continue

    const knownVariantIds = getKnownVariantIds(productId)
    const variantQuantities: Partial<Record<VariantId, number>> = {}

    for (const [variantId, quantity] of Object.entries(variantEntries)) {
      if (!knownVariantIds.has(variantId)) continue
      if (!isValidQuantity(quantity)) continue

      variantQuantities[variantId] =
        product.maxQuantity !== undefined
          ? Math.min(quantity, product.maxQuantity)
          : quantity
    }

    if (Object.keys(variantQuantities).length > 0) {
      sanitized[productId] = variantQuantities
    }
  }

  return sanitized
}

function sanitizeActiveVariants(raw: unknown): ActiveVariantMap {
  const defaults = buildDefaultActiveVariants()

  if (!raw || typeof raw !== 'object') {
    return defaults
  }

  const sanitized: ActiveVariantMap = { ...defaults }

  for (const [productId, variantId] of Object.entries(raw)) {
    if (!isKnownProductId(productId)) continue
    if (typeof variantId !== 'string') continue

    const knownVariantIds = getKnownVariantIds(productId)
    if (knownVariantIds.size > 0) {
      if (knownVariantIds.has(variantId)) {
        sanitized[productId] = variantId
      }
      continue
    }

    delete sanitized[productId]
  }

  return sanitized
}

function sanitizeQuantities(raw: unknown): QuantityMap | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const quantities = raw as Record<string, unknown>

  if ('products' in quantities || 'variants' in quantities) {
    return {
      products: sanitizeProductQuantities(quantities.products),
      variants: sanitizeVariantQuantities(quantities.variants),
    }
  }

  return null
}

/** Validates and sanitizes a parsed saved payload. Returns null when shape is invalid. */
export function sanitizeSavedBundleConfiguration(
  raw: unknown,
): BundleConfiguration | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const payload = raw as Record<string, unknown>
  const quantities = sanitizeQuantities(payload.quantities)

  if (!quantities) {
    return null
  }

  return {
    activeVariants: sanitizeActiveVariants(payload.activeVariants),
    quantities,
  }
}

function stripZeroQuantities(configuration: BundleConfiguration): QuantityMap {
  const products: ProductQuantityMap = {}
  const variants: VariantQuantityMap = {}

  for (const [productId, quantity] of Object.entries(
    configuration.quantities.products,
  )) {
    if (quantity && quantity > 0) {
      products[productId as ProductId] = quantity
    }
  }

  for (const [productId, variantEntries] of Object.entries(
    configuration.quantities.variants,
  )) {
    if (!variantEntries) continue

    const sanitizedVariants: Partial<Record<VariantId, number>> = {}

    for (const [variantId, quantity] of Object.entries(variantEntries)) {
      if (quantity && quantity > 0) {
        sanitizedVariants[variantId as VariantId] = quantity
      }
    }

    if (Object.keys(sanitizedVariants).length > 0) {
      variants[productId as ProductId] = sanitizedVariants
    }
  }

  return { products, variants }
}

/** Persists the minimum bundle configuration state to localStorage. */
export function saveBundleConfiguration(
  configuration: BundleConfiguration,
): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  const payload: SavedBundleConfiguration = {
    activeVariants: configuration.activeVariants,
    quantities: stripZeroQuantities(configuration),
  }

  try {
    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify(payload),
    )
    return true
  } catch {
    return false
  }
}

/** Loads and sanitizes a saved bundle configuration, or returns the seeded default. */
export function loadBundleConfiguration(): BundleConfiguration {
  if (!isLocalStorageAvailable()) {
    return getInitialBundleConfiguration()
  }

  try {
    const raw = window.localStorage.getItem(BUNDLE_BUILDER_STORAGE_KEY)
    if (!raw) {
      return getInitialBundleConfiguration()
    }

    const parsed: unknown = JSON.parse(raw)
    const sanitized = sanitizeSavedBundleConfiguration(parsed)

    if (!sanitized) {
      return getInitialBundleConfiguration()
    }

    return sanitized
  } catch {
    return getInitialBundleConfiguration()
  }
}

/** Removes the saved bundle configuration from localStorage. */
export function clearSavedBundleConfiguration(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    window.localStorage.removeItem(BUNDLE_BUILDER_STORAGE_KEY)
  } catch {
    // Ignore storage errors — clearing is best-effort.
  }
}
