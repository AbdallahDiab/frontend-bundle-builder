import type { Product, ProductId, ShippingSummaryRow } from '@/types'

/** Canonical product ids used across catalog, state, and tests. */
export const PRODUCT_IDS = {
  WYZE_CAM_V4: 'wyze-cam-v4',
  WYZE_CAM_PAN_V3: 'wyze-cam-pan-v3',
  WYZE_CAM_FLOODLIGHT_V2: 'wyze-cam-floodlight-v2',
  WYZE_DUO_CAM_DOORBELL: 'wyze-duo-cam-doorbell',
  WYZE_BATTERY_CAM_PRO: 'wyze-battery-cam-pro',
  WYZE_SENSE_MOTION_SENSOR: 'wyze-sense-motion-sensor',
  WYZE_SENSE_HUB: 'wyze-sense-hub',
  WYZE_MICROSD_CARD_256GB: 'wyze-microsd-card-256gb',
  CAM_UNLIMITED: 'cam-unlimited',
} as const satisfies Record<string, ProductId>

const productImage = (slug: string) => `/src/assets/products/${slug}.png`
const productSwatch = (slug: string) => `/src/assets/products/${slug}.svg`

/** Shipping summary row — not a selectable catalog product. */
export const BUNDLE_SHIPPING_SUMMARY: ShippingSummaryRow = {
  label: 'Fast Shipping',
  priceCents: 0,
  compareAtPriceCents: 599,
  priceLabel: 'FREE',
}

export const PRODUCT_CATALOG: readonly Product[] = [
  // ── Cameras (step 1) ──────────────────────────────────────────────────────
  {
    id: PRODUCT_IDS.WYZE_CAM_V4,
    name: 'Wyze Cam v4',
    description: 'The clearest Wyze Cam ever made.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-v4',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-cam-v4-white'),
    discountBadge: 'Save 22%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-cam-v4-white'),
        swatchSrc: productSwatch('wyze-cam-v4-swatch-white'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
        initialQuantity: 1,
      },
      {
        id: 'grey',
        name: 'Grey',
        imageSrc: productSwatch('wyze-cam-v4-swatch-grey'),
        swatchSrc: productSwatch('wyze-cam-v4-swatch-grey'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productSwatch('wyze-cam-v4-swatch-black'),
        swatchSrc: productSwatch('wyze-cam-v4-swatch-black'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_CAM_PAN_V3,
    name: 'Wyze Cam Pan v3',
    description: '360° pan and 180° tilt security camera.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-pan-v3',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-cam-pan-v3-white'),
    discountBadge: 'Save 12%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-cam-pan-v3-white'),
        swatchSrc: productSwatch('wyze-cam-pan-v3-swatch-white'),
        priceCents: 3498,
        compareAtPriceCents: 3998,
        initialQuantity: 2,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productSwatch('wyze-cam-pan-v3-swatch-black'),
        swatchSrc: productSwatch('wyze-cam-pan-v3-swatch-black'),
        priceCents: 3498,
        compareAtPriceCents: 3998,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_CAM_FLOODLIGHT_V2,
    name: 'Wyze Cam Floodlight v2',
    description:
      '2K floodlight camera with a 160° wide-angle view for your garage.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-floodlight-v2',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productSwatch('wyze-cam-floodlight-v2-swatch-white'),
    discountBadge: 'Save 22%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productSwatch('wyze-cam-floodlight-v2-swatch-white'),
        swatchSrc: productSwatch('wyze-cam-floodlight-v2-swatch-white'),
        priceCents: 6998,
        compareAtPriceCents: 8998,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productSwatch('wyze-cam-floodlight-v2-swatch-black'),
        swatchSrc: productSwatch('wyze-cam-floodlight-v2-swatch-black'),
        priceCents: 6998,
        compareAtPriceCents: 8998,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_DUO_CAM_DOORBELL,
    name: 'Wyze Duo Cam Doorbell',
    description: 'Two cameras. Two views. Double the porch protection.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-duo-cam-doorbell',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-duo-cam-doorbell'),
    priceCents: 6998,
  },
  {
    id: PRODUCT_IDS.WYZE_BATTERY_CAM_PRO,
    name: 'Wyze Battery Cam Pro',
    description:
      'Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-battery-cam-pro',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-battery-cam-pro-white'),
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-battery-cam-pro-white'),
        swatchSrc: productSwatch('wyze-battery-cam-pro-swatch-white'),
        priceCents: 8998,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productSwatch('wyze-battery-cam-pro-swatch-black'),
        swatchSrc: productSwatch('wyze-battery-cam-pro-swatch-black'),
        priceCents: 8998,
      },
    ],
  },

  // ── Plan (step 2) ─────────────────────────────────────────────────────────
  {
    id: PRODUCT_IDS.CAM_UNLIMITED,
    name: 'Cam Unlimited',
    description: 'Unlimited camera licenses with smart detections.',
    learnMoreUrl: 'https://www.wyze.com/pages/service-plans',
    category: 'plan',
    stepId: 'plan',
    imageSrc: productSwatch('cam-unlimited'),
    priceCents: 999,
    compareAtPriceCents: 1299,
    priceSuffix: '/mo',
    initialQuantity: 1,
    maxQuantity: 1,
  },

  // ── Sensors (step 3) ──────────────────────────────────────────────────────
  {
    id: PRODUCT_IDS.WYZE_SENSE_MOTION_SENSOR,
    name: 'Wyze Sense Motion Sensor',
    description: 'Detect motion throughout your home.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-sense-motion-sensor',
    category: 'sensors',
    stepId: 'sensors',
    imageSrc: productSwatch('wyze-sense-motion-sensor'),
    priceCents: 2999,
    initialQuantity: 2,
  },
  {
    id: PRODUCT_IDS.WYZE_SENSE_HUB,
    name: 'Wyze Sense Hub Required',
    description: 'Required hub that connects your monitoring components.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-hms-bundle',
    category: 'sensors',
    stepId: 'sensors',
    imageSrc: productSwatch('wyze-sense-hub'),
    priceCents: 0,
    compareAtPriceCents: 2992,
    priceLabel: 'FREE',
    isIncluded: true,
    isRequired: true,
    requiredLabel: 'Required',
    initialQuantity: 1,
  },

  // ── Accessories (step 4) ──────────────────────────────────────────────────
  {
    id: PRODUCT_IDS.WYZE_MICROSD_CARD_256GB,
    name: 'Wyze MicroSD Card (256GB)',
    description: 'Unlock continuous recording and timelapses for Wyze Cams.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-microsd-card',
    category: 'accessories',
    stepId: 'accessories',
    imageSrc: productSwatch('wyze-microsd-card-256gb'),
    discountBadge: 'Save 37%',
    priceCents: 2098,
    initialQuantity: 2,
  },
] as const

export const PRODUCT_CATALOG_BY_ID = Object.fromEntries(
  PRODUCT_CATALOG.map((product) => [product.id, product]),
) as Record<ProductId, Product>

export function getProductById(productId: ProductId): Product | undefined {
  return PRODUCT_CATALOG_BY_ID[productId]
}

export function getProductsByStep(stepId: Product['stepId']): Product[] {
  return PRODUCT_CATALOG.filter((product) => product.stepId === stepId)
}

export function getProductsByCategory(
  category: Product['category'],
): Product[] {
  return PRODUCT_CATALOG.filter((product) => product.category === category)
}

export function productHasVariants(product: Product): boolean {
  return (product.variants?.length ?? 0) > 0
}
