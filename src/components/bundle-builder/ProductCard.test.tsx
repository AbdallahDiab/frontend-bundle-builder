import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PRODUCT_ASSETS } from '@/assets/productAssets'
import { PRODUCT_IDS } from '@/data/products'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

const variantProduct: Product = {
  id: PRODUCT_IDS.WYZE_CAM_V4,
  name: 'Wyze Cam v4',
  description: 'The clearest Wyze Cam ever made.',
  learnMoreUrl: 'https://www.wyze.com/products/wyze-cam-v4',
  category: 'cameras',
  stepId: 'cameras',
  imageSrc: PRODUCT_ASSETS.wyzeCamV4White,
  discountBadge: 'Save 22%',
  defaultVariantId: 'white',
  variants: [
    {
      id: 'white',
      name: 'White',
      imageSrc: PRODUCT_ASSETS.wyzeCamV4White,
      priceCents: 2798,
      compareAtPriceCents: 3598,
    },
    {
      id: 'black',
      name: 'Black',
      imageSrc: PRODUCT_ASSETS.wyzeCamV4SwatchBlack,
      priceCents: 2798,
      compareAtPriceCents: 3598,
    },
  ],
}

const simpleProduct: Product = {
  id: PRODUCT_IDS.WYZE_DUO_CAM_DOORBELL,
  name: 'Wyze Duo Cam Doorbell',
  description: 'Dual-camera doorbell with head-to-toe view.',
  category: 'cameras',
  stepId: 'cameras',
  imageSrc: PRODUCT_ASSETS.wyzeDuoCamDoorbell,
  priceCents: 8998,
  compareAtPriceCents: 9998,
}

describe('ProductCard', () => {
  it('renders variants when provided', () => {
    render(
      <ProductCard
        product={variantProduct}
        activeVariantId="white"
        quantity={1}
        onVariantChange={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /White/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Black/i })).toBeInTheDocument()
  })

  it('does not render VariantSelector for non-variant products', () => {
    render(
      <ProductCard
        product={simpleProduct}
        quantity={0}
        onVariantChange={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  it('calls onIncrement and onDecrement', async () => {
    const user = userEvent.setup()
    const onIncrement = vi.fn()
    const onDecrement = vi.fn()

    render(
      <ProductCard
        product={simpleProduct}
        quantity={1}
        onVariantChange={vi.fn()}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))

    expect(onIncrement).toHaveBeenCalledOnce()
    expect(onDecrement).toHaveBeenCalledOnce()
  })

  it('calls onVariantChange when a variant is selected', async () => {
    const user = userEvent.setup()
    const onVariantChange = vi.fn()

    render(
      <ProductCard
        product={variantProduct}
        activeVariantId="white"
        quantity={0}
        onVariantChange={onVariantChange}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('radio', { name: /Black/i }))

    expect(onVariantChange).toHaveBeenCalledWith('black')
  })

  it('shows selected state when active quantity is greater than 0', () => {
    const { rerender } = render(
      <ProductCard
        product={variantProduct}
        activeVariantId="white"
        quantity={0}
        onVariantChange={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Wyze Cam v4')).toHaveAttribute(
      'data-selected',
      'false',
    )

    rerender(
      <ProductCard
        product={variantProduct}
        activeVariantId="white"
        quantity={2}
        onVariantChange={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Wyze Cam v4')).toHaveAttribute(
      'data-selected',
      'true',
    )
  })

  it('disables increment when quantity reaches maxQuantity', () => {
    const planProduct: Product = {
      id: PRODUCT_IDS.CAM_UNLIMITED,
      name: 'Cam Unlimited',
      description: 'Unlimited camera licenses with smart detections.',
      category: 'plan',
      stepId: 'plan',
      imageSrc: PRODUCT_ASSETS.camUnlimited,
      priceCents: 999,
      maxQuantity: 1,
    }

    render(
      <ProductCard
        product={planProduct}
        quantity={1}
        onVariantChange={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Increase quantity' }),
    ).toBeDisabled()
  })
})
