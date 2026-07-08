import { describe, expect, it } from 'vitest'
import { BUNDLE_SHIPPING_SUMMARY, PRODUCT_IDS } from '@/data/products'
import {
  calculatePricingSummary,
  decrementItemQuantity,
  getInitialBundleConfiguration,
  getProductQuantity,
  getSelectedCountByStep,
  getSelectedItems,
  getShippingSummary,
  getVariantQuantity,
  incrementItemQuantity,
  setActiveVariant,
} from '@/lib/bundle'
import { formatCurrency } from '@/utils/formatCurrency'

describe('getInitialBundleConfiguration', () => {
  it('seeds review panel quantities from the catalog', () => {
    const configuration = getInitialBundleConfiguration()

    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'white'),
    ).toBe(1)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_PAN_V3, 'white'),
    ).toBe(2)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_PAN_V3, 'black'),
    ).toBe(0)
    expect(
      getProductQuantity(configuration, PRODUCT_IDS.WYZE_SENSE_MOTION_SENSOR),
    ).toBe(2)
    expect(getProductQuantity(configuration, PRODUCT_IDS.WYZE_SENSE_HUB)).toBe(
      1,
    )
    expect(
      getProductQuantity(configuration, PRODUCT_IDS.WYZE_MICROSD_CARD_256GB),
    ).toBe(2)
    expect(getProductQuantity(configuration, PRODUCT_IDS.CAM_UNLIMITED)).toBe(1)
  })

  it('defaults active variant to white for Wyze Cam v4', () => {
    const configuration = getInitialBundleConfiguration()

    expect(configuration.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('white')
  })

  it('defaults active variant to white for Wyze Cam Pan v3', () => {
    const configuration = getInitialBundleConfiguration()

    expect(configuration.activeVariants[PRODUCT_IDS.WYZE_CAM_PAN_V3]).toBe(
      'white',
    )
  })
})

describe('variant quantity behavior', () => {
  it('tracks independent quantities per variant', () => {
    let configuration = getInitialBundleConfiguration()

    configuration = setActiveVariant(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
      'grey',
    )
    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
    )
    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
    )

    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'white'),
    ).toBe(1)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'grey'),
    ).toBe(2)
    expect(getProductQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4)).toBe(3)
  })

  it('does not increase Cam Unlimited beyond maxQuantity of 1', () => {
    let configuration = getInitialBundleConfiguration()

    expect(getProductQuantity(configuration, PRODUCT_IDS.CAM_UNLIMITED)).toBe(1)

    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.CAM_UNLIMITED,
    )

    expect(getProductQuantity(configuration, PRODUCT_IDS.CAM_UNLIMITED)).toBe(1)
  })

  it('does not reset other variant quantities when switching active variant', () => {
    let configuration = getInitialBundleConfiguration()

    configuration = setActiveVariant(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
      'black',
    )
    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
    )

    configuration = setActiveVariant(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
      'grey',
    )

    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'white'),
    ).toBe(1)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'black'),
    ).toBe(1)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_V4, 'grey'),
    ).toBe(0)
  })

  it('tracks Wyze Cam Pan v3 variant quantities independently', () => {
    let configuration = getInitialBundleConfiguration()

    configuration = setActiveVariant(
      configuration,
      PRODUCT_IDS.WYZE_CAM_PAN_V3,
      'black',
    )
    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_PAN_V3,
    )

    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_PAN_V3, 'white'),
    ).toBe(2)
    expect(
      getVariantQuantity(configuration, PRODUCT_IDS.WYZE_CAM_PAN_V3, 'black'),
    ).toBe(1)
    expect(getProductQuantity(configuration, PRODUCT_IDS.WYZE_CAM_PAN_V3)).toBe(
      3,
    )
  })
})

describe('decrementItemQuantity', () => {
  it('never goes below zero', () => {
    let configuration = getInitialBundleConfiguration()

    configuration = decrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_FLOODLIGHT_V2,
    )
    configuration = decrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_FLOODLIGHT_V2,
    )

    expect(
      getProductQuantity(configuration, PRODUCT_IDS.WYZE_CAM_FLOODLIGHT_V2),
    ).toBe(0)
  })
})

describe('getSelectedItems', () => {
  it('includes each variant with quantity > 0 as a separate line', () => {
    let configuration = getInitialBundleConfiguration()

    configuration = setActiveVariant(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
      'black',
    )
    configuration = incrementItemQuantity(
      configuration,
      PRODUCT_IDS.WYZE_CAM_V4,
    )

    const items = getSelectedItems(configuration)
    const camV4Lines = items.filter(
      (item) => item.productId === PRODUCT_IDS.WYZE_CAM_V4,
    )

    expect(camV4Lines).toHaveLength(2)
    expect(camV4Lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ variantId: 'white', quantity: 1 }),
        expect.objectContaining({ variantId: 'black', quantity: 1 }),
      ]),
    )
  })

  it('includes all seeded review panel products but not shipping', () => {
    const items = getSelectedItems(getInitialBundleConfiguration())

    expect(items).toHaveLength(6)
    expect(items.map((item) => item.productName)).toEqual(
      expect.arrayContaining([
        'Wyze Cam v4',
        'Wyze Cam Pan v3',
        'Wyze Sense Motion Sensor',
        'Wyze Sense Hub Required',
        'Wyze MicroSD Card (256GB)',
        'Cam Unlimited',
      ]),
    )
    expect(items.map((item) => item.productName)).not.toContain('Fast Shipping')
  })

  it('does not include Fast Shipping as a selected item', () => {
    const items = getSelectedItems(getInitialBundleConfiguration())

    expect(items.some((item) => item.productName === 'Fast Shipping')).toBe(
      false,
    )
  })
})

describe('getSelectedCountByStep', () => {
  it('counts distinct selected lines per builder step, not total quantity', () => {
    const counts = getSelectedCountByStep(getInitialBundleConfiguration())

    expect(counts).toEqual({
      cameras: 2,
      plan: 1,
      sensors: 2,
      accessories: 1,
    })
  })

  it('does not count shipping as an accessory selection', () => {
    const counts = getSelectedCountByStep(getInitialBundleConfiguration())

    expect(counts.accessories).toBe(1)
  })
})

describe('getShippingSummary', () => {
  it('returns the Fast Shipping summary row separately from products', () => {
    const shipping = getShippingSummary()

    expect(shipping).toEqual(BUNDLE_SHIPPING_SUMMARY)
    expect(shipping).toEqual({
      label: 'Fast Shipping',
      priceCents: 0,
      compareAtPriceCents: 599,
      priceLabel: 'FREE',
    })
  })
})

describe('calculatePricingSummary', () => {
  it('calculates product totals from catalog seed quantities', () => {
    const items = getSelectedItems(getInitialBundleConfiguration())
    const summary = calculatePricingSummary(items)

    expect(summary).toEqual({
      subtotalCents: 20987,
      compareAtTotalCents: 26079,
      savingsCents: 5092,
      totalCents: 20987,
    })
  })

  it('excludes shipping from savings calculation', () => {
    const items = getSelectedItems(getInitialBundleConfiguration())
    const summary = calculatePricingSummary(items)
    const shipping = getShippingSummary()

    expect(summary.savingsCents).toBe(5092)
    expect(summary.savingsCents).not.toBe(
      summary.compareAtTotalCents -
        summary.totalCents +
        shipping.compareAtPriceCents,
    )
  })

  it('matches expected line totals for seeded items', () => {
    const items = getSelectedItems(getInitialBundleConfiguration())
    const byName = Object.fromEntries(
      items.map((item) => [item.productName, item]),
    )

    expect(byName['Wyze Cam v4']).toMatchObject({
      lineTotalCents: 2798,
      compareAtLineTotalCents: 3598,
    })
    expect(byName['Wyze Cam Pan v3']).toMatchObject({
      lineTotalCents: 6996,
      compareAtLineTotalCents: 7996,
    })
    expect(byName['Wyze Sense Motion Sensor']).toMatchObject({
      lineTotalCents: 5998,
    })
    expect(byName['Wyze Sense Hub Required']).toMatchObject({
      lineTotalCents: 0,
      compareAtLineTotalCents: 2992,
      priceLabel: 'FREE',
    })
    expect(byName['Wyze MicroSD Card (256GB)']).toMatchObject({
      lineTotalCents: 4196,
    })
    expect(byName['Cam Unlimited']).toMatchObject({
      lineTotalCents: 999,
      compareAtLineTotalCents: 1299,
      priceSuffix: '/mo',
    })
  })
})

describe('formatCurrency', () => {
  it('formats cent amounts as USD', () => {
    expect(formatCurrency(2798)).toBe('$27.98')
    expect(formatCurrency(20987)).toBe('$209.87')
    expect(formatCurrency(26079)).toBe('$260.79')
    expect(formatCurrency(5092)).toBe('$50.92')
  })
})
