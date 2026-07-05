import { useCallback, useMemo, useState } from 'react'
import {
  calculatePricingSummary,
  decrementItemQuantity,
  decrementVariantQuantity,
  getSelectedCountByStep,
  getSelectedItems,
  getShippingSummary,
  groupSelectedItemsByCategory,
  incrementItemQuantity,
  incrementVariantQuantity,
  loadBundleConfiguration,
  setActiveVariant,
} from '@/lib/bundle'
import type { BundleConfiguration, ProductId, VariantId } from '@/types'

function applyQuantityChange(
  configuration: BundleConfiguration,
  productId: ProductId,
  variantId: VariantId | undefined,
  direction: 'increment' | 'decrement',
): BundleConfiguration {
  if (variantId) {
    return direction === 'increment'
      ? incrementVariantQuantity(configuration, productId, variantId)
      : decrementVariantQuantity(configuration, productId, variantId)
  }

  return direction === 'increment'
    ? incrementItemQuantity(configuration, productId)
    : decrementItemQuantity(configuration, productId)
}

export function useBundleBuilder(initialConfiguration?: BundleConfiguration) {
  const [configuration, setConfiguration] = useState<BundleConfiguration>(
    () => initialConfiguration ?? loadBundleConfiguration(),
  )

  const selectedItems = useMemo(
    () => getSelectedItems(configuration),
    [configuration],
  )

  const groupedSelectedItems = useMemo(
    () => groupSelectedItemsByCategory(selectedItems),
    [selectedItems],
  )

  const pricingSummary = useMemo(
    () => calculatePricingSummary(selectedItems),
    [selectedItems],
  )

  const selectedCountByStep = useMemo(
    () => getSelectedCountByStep(configuration),
    [configuration],
  )

  const shippingSummary = useMemo(() => getShippingSummary(), [])

  const increment = useCallback(
    (productId: ProductId, variantId?: VariantId) => {
      setConfiguration((current) =>
        applyQuantityChange(current, productId, variantId, 'increment'),
      )
    },
    [],
  )

  const decrement = useCallback(
    (productId: ProductId, variantId?: VariantId) => {
      setConfiguration((current) =>
        applyQuantityChange(current, productId, variantId, 'decrement'),
      )
    },
    [],
  )

  const selectVariant = useCallback(
    (productId: ProductId, variantId: VariantId) => {
      setConfiguration((current) =>
        setActiveVariant(current, productId, variantId),
      )
    },
    [],
  )

  return {
    configuration,
    selectedItems,
    groupedSelectedItems,
    pricingSummary,
    selectedCountByStep,
    shippingSummary,
    increment,
    decrement,
    selectVariant,
  }
}

export type UseBundleBuilderReturn = ReturnType<typeof useBundleBuilder>
