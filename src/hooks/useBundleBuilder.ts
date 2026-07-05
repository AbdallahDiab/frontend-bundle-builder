import { useCallback, useMemo, useState } from 'react'
import {
  calculatePricingSummary,
  decrementItemQuantity,
  getInitialBundleConfiguration,
  getSelectedCountByStep,
  getSelectedItems,
  getShippingSummary,
  groupSelectedItemsByCategory,
  incrementItemQuantity,
  setActiveVariant,
} from '@/lib/bundle'
import type { BundleConfiguration, ProductId, VariantId } from '@/types'

export function useBundleBuilder(
  initialConfiguration: BundleConfiguration = getInitialBundleConfiguration(),
) {
  const [configuration, setConfiguration] =
    useState<BundleConfiguration>(initialConfiguration)

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

  const increment = useCallback((productId: ProductId) => {
    setConfiguration((current) => incrementItemQuantity(current, productId))
  }, [])

  const decrement = useCallback((productId: ProductId) => {
    setConfiguration((current) => decrementItemQuantity(current, productId))
  }, [])

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
