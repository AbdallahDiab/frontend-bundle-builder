import { screen, within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AccordionBuilder } from '@/components/bundle-builder/AccordionBuilder'
import { ReviewPanel } from '@/components/review-panel/ReviewPanel'
import { PRODUCT_IDS } from '@/data/products'
import {
  BUNDLE_BUILDER_STORAGE_KEY,
  saveBundleConfiguration,
} from '@/lib/bundle'
import { renderWithBundleBuilder } from '@/test/renderWithBundleBuilder'

function renderBundlePage() {
  return renderWithBundleBuilder(
    <>
      <AccordionBuilder />
      <ReviewPanel />
    </>,
  )
}

describe('ReviewPanel', () => {
  it('renders the review panel title and subtitle', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(
      screen.getByRole('heading', { name: 'Your security system' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/review your personalized protection system/i),
    ).toBeInTheDocument()
  })

  it('renders section headings for non-empty groups', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByText('Cameras')).toBeInTheDocument()
    expect(screen.getByText('Sensors')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
  })

  it('shows initial selected items from seeded bundle state', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument()
    expect(screen.getByText('Wyze Cam Pan v3')).toBeInTheDocument()
    expect(screen.getByText('Wyze Sense Motion Sensor')).toBeInTheDocument()
    expect(screen.getByText('Wyze Sense Hub Required')).toBeInTheDocument()
    expect(screen.getByText('Wyze MicroSD Card (256GB)')).toBeInTheDocument()
    expect(screen.getByText('Cam Unlimited')).toBeInTheDocument()
  })

  it('renders initial total $187.89', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByTestId('review-total')).toHaveTextContent('$187.89')
  })

  it('renders compare-at total $238.81', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByText('$238.81')).toBeInTheDocument()
  })

  it('renders savings $50.92', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByTestId('review-savings')).toHaveTextContent('$50.92')
  })

  it('renders Fast Shipping as a separate shipping row', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    const shippingRow = screen.getByTestId('review-shipping-row')
    expect(within(shippingRow).getByText('Fast Shipping')).toBeInTheDocument()
    expect(within(shippingRow).getByText('FREE')).toBeInTheDocument()
    expect(within(shippingRow).getByText('$5.99')).toBeInTheDocument()
  })

  it('does not render Fast Shipping under Accessories', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    const accessoriesHeading = screen.getByText('Accessories')
    const accessoriesSection = accessoriesHeading.closest('section')
    expect(accessoriesSection).not.toBeNull()
    expect(
      within(accessoriesSection!).queryByText('Fast Shipping'),
    ).not.toBeInTheDocument()
  })

  it('renders FREE for Wyze Sense Hub Required', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    const hubLine = screen.getByTestId('review-line-wyze-sense-hub-base')
    expect(within(hubLine).getByText('FREE')).toBeInTheDocument()
    expect(within(hubLine).getByText('$29.92')).toBeInTheDocument()
  })

  it('renders /mo for Cam Unlimited', () => {
    renderWithBundleBuilder(<ReviewPanel />)

    const planLine = screen.getByTestId('review-line-cam-unlimited-base')
    expect(within(planLine).getByText('$9.99/mo')).toBeInTheDocument()
    expect(within(planLine).getByText('$12.99/mo')).toBeInTheDocument()
  })

  it('shows checkout feedback message', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<ReviewPanel />)

    await user.click(screen.getByRole('button', { name: 'Checkout' }))

    expect(
      screen.getByRole('status', {
        name: 'Checkout is not implemented in this prototype.',
      }),
    ).toBeInTheDocument()
  })

  it('saves configuration and shows success feedback', async () => {
    const user = userEvent.setup()
    renderBundlePage()

    const camV4Line = screen.getByTestId('review-line-wyze-cam-v4-white')
    await user.click(
      within(camV4Line).getByRole('button', { name: 'Increase quantity' }),
    )

    await user.click(
      screen.getByRole('button', { name: 'Save my system for later' }),
    )

    expect(
      screen.getByRole('status', {
        name: "Your system has been saved. We'll restore it next time you visit.",
      }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('save-acknowledgement')).toHaveTextContent(
      'Saved for your next visit',
    )

    const saved = JSON.parse(
      window.localStorage.getItem(BUNDLE_BUILDER_STORAGE_KEY)!,
    )

    expect(saved.quantities.variants[PRODUCT_IDS.WYZE_CAM_V4].white).toBe(2)
    expect(saved.activeVariants[PRODUCT_IDS.WYZE_CAM_V4]).toBe('white')
    expect(saved).not.toHaveProperty('selectedItems')
    expect(saved).not.toHaveProperty('pricingSummary')
  })
})

describe('BundleBuilderProvider shared state', () => {
  it('updates ReviewPanel when quantity changes in AccordionBuilder', async () => {
    const user = userEvent.setup()
    renderBundlePage()

    const doorbellCard = screen.getByLabelText('Wyze Duo Cam Doorbell')
    await user.click(
      within(doorbellCard).getByRole('button', { name: 'Increase quantity' }),
    )

    expect(
      screen.getByTestId('review-line-wyze-duo-cam-doorbell-base'),
    ).toBeInTheDocument()
    expect(doorbellCard).toHaveAttribute('data-selected', 'true')
  })

  it('updates AccordionBuilder when quantity changes in ReviewPanel', async () => {
    const user = userEvent.setup()
    renderBundlePage()

    const camV4Line = screen.getByTestId('review-line-wyze-cam-v4-white')
    await user.click(
      within(camV4Line).getByRole('button', { name: 'Increase quantity' }),
    )

    const camV4Card = screen.getByLabelText('Wyze Cam v4')
    expect(within(camV4Card).getByText('2')).toBeInTheDocument()
  })

  it('removes item from ReviewPanel and updates accordion count when decremented to zero', async () => {
    const user = userEvent.setup()
    renderBundlePage()

    const camV4Line = screen.getByTestId('review-line-wyze-cam-v4-white')
    await user.click(
      within(camV4Line).getByRole('button', { name: 'Decrease quantity' }),
    )

    expect(
      screen.queryByTestId('review-line-wyze-cam-v4-white'),
    ).not.toBeInTheDocument()

    const camerasHeader = screen.getByRole('button', {
      name: 'Choose your cameras, 1 selected',
    })
    expect(within(camerasHeader).getByText('1 selected')).toBeInTheDocument()
  })

  it('updates ReviewPanel total when quantities change', async () => {
    const user = userEvent.setup()
    renderBundlePage()

    const camV4Line = screen.getByTestId('review-line-wyze-cam-v4-white')
    await user.click(
      within(camV4Line).getByRole('button', { name: 'Increase quantity' }),
    )

    expect(screen.getByTestId('review-total')).toHaveTextContent('$215.87')
  })

  it('restores saved configuration when the provider remounts', () => {
    saveBundleConfiguration({
      activeVariants: {
        [PRODUCT_IDS.WYZE_CAM_V4]: 'black',
      },
      quantities: {
        products: {},
        variants: {
          [PRODUCT_IDS.WYZE_CAM_V4]: {
            black: 3,
          },
        },
      },
    })

    const { unmount } = renderBundlePage()

    expect(
      screen.getByTestId('review-line-wyze-cam-v4-black'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('review-line-wyze-cam-v4-black')).getByText(
        '3',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId('review-line-wyze-cam-v4-white'),
    ).not.toBeInTheDocument()

    unmount()
    renderBundlePage()

    expect(
      screen.getByTestId('review-line-wyze-cam-v4-black'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('review-line-wyze-cam-v4-black')).getByText(
        '3',
      ),
    ).toBeInTheDocument()
  })

  it('keeps AccordionBuilder and ReviewPanel synced after restore', async () => {
    saveBundleConfiguration({
      activeVariants: {
        [PRODUCT_IDS.WYZE_CAM_V4]: 'black',
      },
      quantities: {
        products: {},
        variants: {
          [PRODUCT_IDS.WYZE_CAM_V4]: {
            black: 2,
          },
        },
      },
    })

    const user = userEvent.setup()
    renderBundlePage()

    const camV4Card = screen.getByLabelText('Wyze Cam v4')
    expect(within(camV4Card).getByText('2')).toBeInTheDocument()

    const blackLine = screen.getByTestId('review-line-wyze-cam-v4-black')
    await user.click(
      within(blackLine).getByRole('button', { name: 'Increase quantity' }),
    )

    expect(within(camV4Card).getByText('3')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('review-line-wyze-cam-v4-black')).getByText(
        '3',
      ),
    ).toBeInTheDocument()
  })

  it('uses seeded defaults when saved configuration is invalid', () => {
    window.localStorage.setItem(BUNDLE_BUILDER_STORAGE_KEY, '{bad-json')

    renderWithBundleBuilder(<ReviewPanel />)

    expect(screen.getByTestId('review-total')).toHaveTextContent('$187.89')
    expect(screen.getByText('Wyze Cam Pan v3')).toBeInTheDocument()
  })
})
