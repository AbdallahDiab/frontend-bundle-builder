/** Stable identifier for a catalog product. */
export type ProductId = string

/** Stable identifier for a product variant (color, size, etc.). */
export type VariantId = string

/** Builder accordion step identifiers. */
export type BundleStepId = 'cameras' | 'plan' | 'sensors' | 'accessories'

/** Review panel and catalog grouping categories. */
export type ProductCategory = 'cameras' | 'plan' | 'sensors' | 'accessories'

/** Human-readable review panel section labels keyed by category. */
export const REVIEW_CATEGORY_LABELS: Record<ProductCategory, string> = {
  cameras: 'Cameras',
  plan: 'Plan',
  sensors: 'Sensors',
  accessories: 'Accessories',
}

/** Review panel section display order (distinct from builder step order). */
export const REVIEW_CATEGORY_ORDER: ProductCategory[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
]

export type BundleStep = {
  id: BundleStepId
  stepNumber: number
  title: string
  iconKey: string
  category: ProductCategory
  nextButtonLabel?: string
}

export type ProductVariant = {
  id: VariantId
  name: string
  imageSrc: string
  /** Optional color swatch icon for variant selector buttons. */
  swatchSrc?: string
  priceCents: number
  compareAtPriceCents?: number
  /** Seeded quantity when the bundle first loads. */
  initialQuantity?: number
}

export type Product = {
  id: ProductId
  name: string
  description: string
  learnMoreUrl?: string
  category: ProductCategory
  stepId: BundleStepId
  imageSrc: string
  priceCents?: number
  compareAtPriceCents?: number
  discountBadge?: string
  variants?: readonly ProductVariant[]
  defaultVariantId?: VariantId
  /** Seeded quantity for products without variants. */
  initialQuantity?: number
  /** Marks required items such as the Wyze Sense Hub. */
  isRequired?: boolean
  requiredLabel?: string
  /** Display override when the active price is not shown as currency (e.g. FREE). */
  priceLabel?: string
  /** Suffix appended to formatted price (e.g. /mo). */
  priceSuffix?: string
  /** Included at no charge; compare-at may still apply for savings. */
  isIncluded?: boolean
}

/** Product-level quantities for items without variants. */
export type ProductQuantityMap = Partial<Record<ProductId, number>>

/** Per-product, per-variant quantity tracking. */
export type VariantQuantityMap = Partial<
  Record<ProductId, Partial<Record<VariantId, number>>>
>

export type QuantityMap = {
  products: ProductQuantityMap
  variants: VariantQuantityMap
}

/** Active variant selection keyed by product id. */
export type ActiveVariantMap = Partial<Record<ProductId, VariantId>>

/** Runtime bundle selection state. */
export type BundleConfiguration = {
  activeVariants: ActiveVariantMap
  quantities: QuantityMap
}

/** A single line item in the review panel. */
export type SelectedItem = {
  productId: ProductId
  productName: string
  variantId?: VariantId
  variantName?: string
  quantity: number
  unitPriceCents: number
  compareAtUnitPriceCents?: number
  lineTotalCents: number
  compareAtLineTotalCents?: number
  category: ProductCategory
  imageSrc: string
  isRequired?: boolean
  requiredLabel?: string
  priceLabel?: string
  priceSuffix?: string
  isIncluded?: boolean
}

/** Alias emphasizing cart/review semantics. */
export type CartItem = SelectedItem

/** Shipping row shown in the review panel summary — not a selectable product. */
export type ShippingSummaryRow = {
  label: string
  priceCents: number
  compareAtPriceCents: number
  priceLabel: string
}

export type PricingSummary = {
  subtotalCents: number
  compareAtTotalCents: number
  savingsCents: number
  totalCents: number
}

export type GroupedSelectedItems = Record<ProductCategory, SelectedItem[]>

/** Distinct selected lines per builder step (not total quantity). */
export type SelectedCountByStep = Record<BundleStepId, number>

/** Total quantity per builder step (sum of all line quantities). */
export type SelectedQuantityByStep = Record<BundleStepId, number>
