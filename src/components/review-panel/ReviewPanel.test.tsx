import { screen, within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccordionBuilder } from '@/components/bundle-builder/AccordionBuilder'
import { ReviewPanel } from '@/components/review-panel/ReviewPanel'
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

  it('shows checkout placeholder action', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    renderWithBundleBuilder(<ReviewPanel />)

    await user.click(screen.getByRole('button', { name: 'Checkout' }))

    expect(alertSpy).toHaveBeenCalledWith(
      'Checkout is not implemented in this prototype.',
    )
    alertSpy.mockRestore()
  })

  it('shows save placeholder action', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    renderWithBundleBuilder(<ReviewPanel />)

    await user.click(
      screen.getByRole('button', { name: 'Save my system for later' }),
    )

    expect(alertSpy).toHaveBeenCalledWith(
      'Persistence will be added in the next step.',
    )
    alertSpy.mockRestore()
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
})
