import { BUNDLE_STEPS } from '@/data/bundleSteps'
import {
  BUNDLE_SHIPPING_SUMMARY,
  PRODUCT_CATALOG,
  productHasVariants,
} from '@/data/products'
import type {
  BundleConfiguration,
  GroupedSelectedItems,
  PricingSummary,
  ProductCategory,
  SelectedCountByStep,
  SelectedItem,
  SelectedQuantityByStep,
  ShippingSummaryRow,
} from '@/types'

const CATEGORY_ORDER: ProductCategory[] = [
  'cameras',
  'plan',
  'sensors',
  'accessories',
]

function createEmptyGroupedItems(): GroupedSelectedItems {
  return {
    cameras: [],
    plan: [],
    sensors: [],
    accessories: [],
  }
}

function buildSelectedItemLine(
  product: (typeof PRODUCT_CATALOG)[number],
  quantity: number,
  unitPriceCents: number,
  compareAtUnitPriceCents: number | undefined,
  variant?: { id: string; name: string; imageSrc: string },
): SelectedItem {
  const lineTotalCents = unitPriceCents * quantity
  const compareAtLineTotalCents = compareAtUnitPriceCents
    ? compareAtUnitPriceCents * quantity
    : undefined

  return {
    productId: product.id,
    productName: product.name,
    variantId: variant?.id,
    variantName: variant?.name,
    quantity,
    unitPriceCents,
    compareAtUnitPriceCents,
    lineTotalCents,
    compareAtLineTotalCents,
    category: product.category,
    imageSrc: variant?.imageSrc ?? product.imageSrc,
    isRequired: product.isRequired,
    requiredLabel: product.requiredLabel,
    priceLabel: product.priceLabel,
    priceSuffix: product.priceSuffix,
    isIncluded: product.isIncluded,
  }
}

export function getSelectedItems(
  configuration: BundleConfiguration,
): SelectedItem[] {
  const items: SelectedItem[] = []

  for (const product of PRODUCT_CATALOG) {
    if (productHasVariants(product)) {
      for (const variant of product.variants ?? []) {
        const quantity =
          configuration.quantities.variants[product.id]?.[variant.id] ?? 0

        if (quantity > 0) {
          items.push(
            buildSelectedItemLine(
              product,
              quantity,
              variant.priceCents,
              variant.compareAtPriceCents,
              variant,
            ),
          )
        }
      }
      continue
    }

    const quantity = configuration.quantities.products[product.id] ?? 0
    if (quantity > 0) {
      items.push(
        buildSelectedItemLine(
          product,
          quantity,
          product.priceCents ?? 0,
          product.compareAtPriceCents,
        ),
      )
    }
  }

  return items
}

export function groupSelectedItemsByCategory(
  items: SelectedItem[],
): GroupedSelectedItems {
  const grouped = createEmptyGroupedItems()

  for (const item of items) {
    grouped[item.category].push(item)
  }

  return grouped
}

function countSelectedLinesForProduct(
  configuration: BundleConfiguration,
  product: (typeof PRODUCT_CATALOG)[number],
): number {
  if (productHasVariants(product)) {
    return Object.values(
      configuration.quantities.variants[product.id] ?? {},
    ).filter((quantity) => (quantity ?? 0) > 0).length
  }

  return (configuration.quantities.products[product.id] ?? 0) > 0 ? 1 : 0
}

function sumSelectedQuantityForProduct(
  configuration: BundleConfiguration,
  product: (typeof PRODUCT_CATALOG)[number],
): number {
  if (productHasVariants(product)) {
    return Object.values(
      configuration.quantities.variants[product.id] ?? {},
    ).reduce<number>((sum, quantity) => sum + (quantity ?? 0), 0)
  }

  return configuration.quantities.products[product.id] ?? 0
}

/** Counts distinct selected lines per step (variant lines count separately). */
export function getSelectedCountByStep(
  configuration: BundleConfiguration,
): SelectedCountByStep {
  const counts = Object.fromEntries(
    BUNDLE_STEPS.map((step) => [step.id, 0]),
  ) as SelectedCountByStep

  for (const product of PRODUCT_CATALOG) {
    counts[product.stepId] =
      (counts[product.stepId] ?? 0) +
      countSelectedLinesForProduct(configuration, product)
  }

  return counts
}

/** Sums total quantity per step (all units across selected lines). */
export function getSelectedQuantityByStep(
  configuration: BundleConfiguration,
): SelectedQuantityByStep {
  const quantities = Object.fromEntries(
    BUNDLE_STEPS.map((step) => [step.id, 0]),
  ) as SelectedQuantityByStep

  for (const product of PRODUCT_CATALOG) {
    quantities[product.stepId] =
      (quantities[product.stepId] ?? 0) +
      sumSelectedQuantityForProduct(configuration, product)
  }

  return quantities
}

/** Returns the fixed shipping summary row for the review panel. */
export function getShippingSummary(): ShippingSummaryRow {
  return BUNDLE_SHIPPING_SUMMARY
}

export function calculatePricingSummary(items: SelectedItem[]): PricingSummary {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  )

  const compareAtTotalCents = items.reduce(
    (sum, item) => sum + (item.compareAtLineTotalCents ?? item.lineTotalCents),
    0,
  )

  const savingsCents = Math.max(0, compareAtTotalCents - subtotalCents)

  return {
    subtotalCents,
    compareAtTotalCents,
    savingsCents,
    totalCents: subtotalCents,
  }
}

export { CATEGORY_ORDER }
