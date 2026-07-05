import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PRODUCT_IDS } from '@/data/products'
import {
  BUNDLE_BUILDER_STORAGE_KEY,
  clearSavedBundleConfiguration,
  getInitialBundleConfiguration,
  loadBundleConfiguration,
  saveBundleConfiguration,
  sanitizeSavedBundleConfiguration,
} from '@/lib/bundle'

describe('saveBundleConfiguration', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('writes expected JSON to localStorage', () => {
    const configuration = getInitialBundleConfiguration()

    const saved = saveBundleConfiguration(configuration)

    expect(saved).toBe(true)
    expect(window.localStorage.getItem(BUNDLE_BUILDER_STORAGE_KEY)).toBe(
      JSON.stringify({
        activeVariants: configuration.activeVariants,
        quantities: configuration.quantities,
      }),
    )
  })

  it('stores only quantities and activeVariants', () => {
    saveBundleConfiguration(getInitialBundleConfiguration())

    const parsed = JSON.parse(
      window.localStorage.getItem(BUNDLE_BUILDER_STORAGE_KEY)!,
    ) as Record<string, unknown>

    expect(Object.keys(parsed).sort()).toEqual(['activeVariants', 'quantities'])
  })
})

describe('loadBundleConfiguration', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores valid saved configuration', () => {
    const savedConfiguration = {
      activeVariants: {
        [PRODUCT_IDS.WYZE_CAM_V4]: 'black',
        [PRODUCT_IDS.WYZE_CAM_PAN_V3]: 'black',
      },
      quantities: {
        products: {
          [PRODUCT_IDS.WYZE_SENSE_MOTION_SENSOR]: 1,
        },
        variants: {
          [PRODUCT_IDS.WYZE_CAM_V4]: {
            black: 3,
          },
          [PRODUCT_IDS.WYZE_CAM_PAN_V3]: {
            black: 2,
          },
        },
      },
    }

    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify(savedConfiguration),
    )

    const loaded = loadBundleConfiguration()

    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('black')
    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_CAM_PAN_V3]).toBe('black')
    expect(
      loaded.quantities.products[PRODUCT_IDS.WYZE_SENSE_MOTION_SENSOR],
    ).toBe(1)
    expect(loaded.quantities.variants[PRODUCT_IDS.WYZE_CAM_V4]?.black).toBe(3)
    expect(loaded.quantities.variants[PRODUCT_IDS.WYZE_CAM_PAN_V3]?.black).toBe(
      2,
    )
  })

  it('falls back safely on missing data', () => {
    const loaded = loadBundleConfiguration()

    expect(loaded).toEqual(getInitialBundleConfiguration())
  })

  it('falls back safely on invalid JSON', () => {
    window.localStorage.setItem(BUNDLE_BUILDER_STORAGE_KEY, '{not-json')

    const loaded = loadBundleConfiguration()

    expect(loaded).toEqual(getInitialBundleConfiguration())
  })

  it('falls back safely on invalid payload shape', () => {
    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify({ activeVariants: {}, totals: 123 }),
    )

    const loaded = loadBundleConfiguration()

    expect(loaded).toEqual(getInitialBundleConfiguration())
  })

  it('ignores unknown product ids', () => {
    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify({
        activeVariants: {
          'unknown-product': 'white',
          [PRODUCT_IDS.WYZE_CAM_V4]: 'white',
        },
        quantities: {
          products: {
            'unknown-product': 5,
            [PRODUCT_IDS.CAM_UNLIMITED]: 1,
          },
          variants: {
            'unknown-product': { white: 2 },
          },
        },
      }),
    )

    const loaded = loadBundleConfiguration()

    expect(
      loaded.activeVariants[
        'unknown-product' as typeof PRODUCT_IDS.WYZE_CAM_V4
      ],
    ).toBeUndefined()
    expect(
      loaded.quantities.products[
        'unknown-product' as typeof PRODUCT_IDS.WYZE_CAM_V4
      ],
    ).toBeUndefined()
    expect(
      loaded.quantities.variants[
        'unknown-product' as typeof PRODUCT_IDS.WYZE_CAM_V4
      ],
    ).toBeUndefined()
    expect(loaded.quantities.products[PRODUCT_IDS.CAM_UNLIMITED]).toBe(1)
    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('white')
  })

  it('ignores unknown variant ids', () => {
    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify({
        activeVariants: {
          [PRODUCT_IDS.WYZE_CAM_V4]: 'unknown-color',
        },
        quantities: {
          products: {},
          variants: {
            [PRODUCT_IDS.WYZE_CAM_V4]: {
              unknown: 4,
              white: 2,
            },
          },
        },
      }),
    )

    const loaded = loadBundleConfiguration()

    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('white')
    expect(loaded.quantities.variants[PRODUCT_IDS.WYZE_CAM_V4]).toEqual({
      white: 2,
    })
  })

  it('restores active variant selections for variant products', () => {
    window.localStorage.setItem(
      BUNDLE_BUILDER_STORAGE_KEY,
      JSON.stringify({
        activeVariants: {
          [PRODUCT_IDS.WYZE_CAM_V4]: 'grey',
          [PRODUCT_IDS.WYZE_BATTERY_CAM_PRO]: 'black',
        },
        quantities: {
          products: {},
          variants: {
            [PRODUCT_IDS.WYZE_CAM_V4]: {
              grey: 1,
            },
          },
        },
      }),
    )

    const loaded = loadBundleConfiguration()

    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('grey')
    expect(loaded.activeVariants[PRODUCT_IDS.WYZE_BATTERY_CAM_PRO]).toBe(
      'black',
    )
  })

  it('falls back when localStorage is unavailable', () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('localStorage unavailable')
      })

    try {
      const loaded = loadBundleConfiguration()
      expect(loaded).toEqual(getInitialBundleConfiguration())
    } finally {
      getItemSpy.mockRestore()
    }
  })
})

describe('sanitizeSavedBundleConfiguration', () => {
  it('returns null for non-object payloads', () => {
    expect(sanitizeSavedBundleConfiguration(null)).toBeNull()
    expect(sanitizeSavedBundleConfiguration('invalid')).toBeNull()
  })
})

describe('clearSavedBundleConfiguration', () => {
  it('removes the saved configuration key', () => {
    saveBundleConfiguration(getInitialBundleConfiguration())

    clearSavedBundleConfiguration()

    expect(window.localStorage.getItem(BUNDLE_BUILDER_STORAGE_KEY)).toBeNull()
  })
})
