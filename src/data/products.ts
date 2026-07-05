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
    imageSrc: productImage('wyze-cam-v4'),
    discountBadge: 'Save 22%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-cam-v4-white'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
        initialQuantity: 1,
      },
      {
        id: 'grey',
        name: 'Grey',
        imageSrc: productImage('wyze-cam-v4-grey'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productImage('wyze-cam-v4-black'),
        priceCents: 2798,
        compareAtPriceCents: 3598,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_CAM_PAN_V3,
    name: 'Wyze Cam Pan v3',
    description: 'Pan and tilt security with 360° coverage.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-pan-v3',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-cam-pan-v3'),
    discountBadge: 'Save 17%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-cam-pan-v3-white'),
        priceCents: 2399,
        compareAtPriceCents: 2899,
        initialQuantity: 2,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productImage('wyze-cam-pan-v3-black'),
        priceCents: 2399,
        compareAtPriceCents: 2899,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_CAM_FLOODLIGHT_V2,
    name: 'Wyze Cam Floodlight v2',
    description: 'Bright floodlight meets sharp 2K video.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-floodlight-v2',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-cam-floodlight-v2'),
    discountBadge: 'Save 10%',
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-cam-floodlight-v2-white'),
        priceCents: 8498,
        compareAtPriceCents: 9498,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productImage('wyze-cam-floodlight-v2-black'),
        priceCents: 8498,
        compareAtPriceCents: 9498,
      },
    ],
  },
  {
    id: PRODUCT_IDS.WYZE_DUO_CAM_DOORBELL,
    name: 'Wyze Duo Cam Doorbell',
    description: 'Dual-camera doorbell with head-to-toe view.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-duo-cam-doorbell',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-duo-cam-doorbell'),
    priceCents: 8998,
    compareAtPriceCents: 9998,
  },
  {
    id: PRODUCT_IDS.WYZE_BATTERY_CAM_PRO,
    name: 'Wyze Battery Cam Pro',
    description: 'Wire-free outdoor camera with extended battery life.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-battery-cam-pro',
    category: 'cameras',
    stepId: 'cameras',
    imageSrc: productImage('wyze-battery-cam-pro'),
    defaultVariantId: 'white',
    variants: [
      {
        id: 'white',
        name: 'White',
        imageSrc: productImage('wyze-battery-cam-pro-white'),
        priceCents: 8998,
        compareAtPriceCents: 9998,
      },
      {
        id: 'black',
        name: 'Black',
        imageSrc: productImage('wyze-battery-cam-pro-black'),
        priceCents: 8998,
        compareAtPriceCents: 9998,
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
    imageSrc: productImage('cam-unlimited'),
    priceCents: 999,
    compareAtPriceCents: 1299,
    priceSuffix: '/mo',
    initialQuantity: 1,
  },

  // ── Sensors (step 3) ──────────────────────────────────────────────────────
  {
    id: PRODUCT_IDS.WYZE_SENSE_MOTION_SENSOR,
    name: 'Wyze Sense Motion Sensor',
    description: 'Detect motion throughout your home.',
    learnMoreUrl: 'https://www.wyze.com/products/wyze-sense-motion-sensor',
    category: 'sensors',
    stepId: 'sensors',
    imageSrc: productImage('wyze-sense-motion-sensor'),
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
    imageSrc: productImage('wyze-sense-hub'),
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
    imageSrc: productImage('wyze-microsd-card-256gb'),
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
