import { screen, waitFor, within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithBundleBuilder } from '@/test/renderWithBundleBuilder'
import { AccordionBuilder } from './AccordionBuilder'

const STEP_HEADERS = {
  cameras: 'Choose your cameras, 2 selected',
  plan: 'Choose your plan, 1 selected',
  sensors: 'Choose your sensors, 2 selected',
  accessories: 'Add extra protection, 1 selected',
} as const

describe('AccordionBuilder', () => {
  it('opens step 1 by default', () => {
    renderWithBundleBuilder(<AccordionBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: STEP_HEADERS.cameras,
    })

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('region', { name: STEP_HEADERS.cameras }),
    ).toBeInTheDocument()
  })

  it('renders all four step headers', () => {
    renderWithBundleBuilder(<AccordionBuilder />)

    expect(
      screen.getByRole('button', { name: STEP_HEADERS.cameras }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: STEP_HEADERS.plan }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: STEP_HEADERS.sensors }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: STEP_HEADERS.accessories }),
    ).toBeInTheDocument()
  })

  it('shows selected count only on the open accordion step', () => {
    renderWithBundleBuilder(<AccordionBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: STEP_HEADERS.cameras,
    })
    const planHeader = screen.getByRole('button', { name: STEP_HEADERS.plan })
    const sensorsHeader = screen.getByRole('button', {
      name: STEP_HEADERS.sensors,
    })
    const accessoriesHeader = screen.getByRole('button', {
      name: STEP_HEADERS.accessories,
    })

    expect(within(camerasHeader).getByText('2 selected')).toBeInTheDocument()
    expect(within(planHeader).queryByText('1 selected')).not.toBeInTheDocument()
    expect(
      within(sensorsHeader).queryByText('2 selected'),
    ).not.toBeInTheDocument()
    expect(
      within(accessoriesHeader).queryByText('1 selected'),
    ).not.toBeInTheDocument()
  })

  it('closes step 1 when its open header is clicked', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: STEP_HEADERS.cameras,
    })
    expect(camerasHeader).toHaveAttribute('aria-expanded', 'true')
    expect(within(camerasHeader).getByText('2 selected')).toBeInTheDocument()

    await user.click(camerasHeader)

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('region', { name: STEP_HEADERS.cameras }),
    ).not.toBeInTheDocument()
    expect(
      within(camerasHeader).queryByText('2 selected'),
    ).not.toBeInTheDocument()
  })

  it('reopens step 1 when its collapsed header is clicked', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: STEP_HEADERS.cameras,
    })

    await user.click(camerasHeader)
    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')

    await user.click(camerasHeader)

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('region', { name: STEP_HEADERS.cameras }),
    ).toBeInTheDocument()
  })

  it('updates aria-expanded when toggling accordion steps', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const camerasHeader = screen.getByRole('button', {
      name: STEP_HEADERS.cameras,
    })
    const planHeader = screen.getByRole('button', { name: STEP_HEADERS.plan })

    expect(camerasHeader).toHaveAttribute('aria-expanded', 'true')
    expect(planHeader).toHaveAttribute('aria-expanded', 'false')

    await user.click(camerasHeader)
    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')

    await user.click(planHeader)
    expect(planHeader).toHaveAttribute('aria-expanded', 'true')
    expect(camerasHeader).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a collapsed step when its header is clicked', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const planHeader = screen.getByRole('button', { name: STEP_HEADERS.plan })
    expect(planHeader).toHaveAttribute('aria-expanded', 'false')

    await user.click(planHeader)

    expect(planHeader).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('region', { name: STEP_HEADERS.plan }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: STEP_HEADERS.cameras }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('advances to the next step when Next is clicked', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    await user.click(
      screen.getByRole('button', { name: /next: choose your plan/i }),
    )

    expect(
      screen.getByRole('button', { name: STEP_HEADERS.plan }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('button', { name: STEP_HEADERS.cameras }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('does not show a Next button on the final step', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    await user.click(
      screen.getByRole('button', { name: STEP_HEADERS.accessories }),
    )

    expect(
      screen.queryByRole('button', { name: /^next:/i }),
    ).not.toBeInTheDocument()
  })

  it('renders camera product cards from catalog data in step 1', () => {
    renderWithBundleBuilder(<AccordionBuilder />)

    expect(screen.getByLabelText('Wyze Cam v4')).toBeInTheDocument()
    expect(screen.getByLabelText('Wyze Cam Pan v3')).toBeInTheDocument()
    expect(screen.getByLabelText('Wyze Cam Floodlight v2')).toBeInTheDocument()
    expect(screen.getByLabelText('Wyze Duo Cam Doorbell')).toBeInTheDocument()
    expect(screen.getByLabelText('Wyze Battery Cam Pro')).toBeInTheDocument()
  })

  it('updates quantity from within the accordion', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const doorbellCard = screen.getByLabelText('Wyze Duo Cam Doorbell')
    const incrementButton = within(doorbellCard).getByRole('button', {
      name: 'Increase quantity',
    })

    await user.click(incrementButton)

    expect(within(doorbellCard).getByText('1')).toBeInTheDocument()
    expect(doorbellCard).toHaveAttribute('data-selected', 'true')
  })

  it('switches variants from within the accordion', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    const camV4Card = screen.getByLabelText('Wyze Cam v4')
    const blackVariant = within(camV4Card).getByRole('radio', {
      name: /black/i,
    })

    await user.click(blackVariant)

    expect(blackVariant).toHaveAttribute('aria-checked', 'true')
    expect(
      within(camV4Card).getByRole('radio', { name: /white/i }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('shows plan products when the plan step is opened', async () => {
    const user = userEvent.setup()
    renderWithBundleBuilder(<AccordionBuilder />)

    await user.click(screen.getByRole('button', { name: STEP_HEADERS.plan }))

    expect(screen.getByLabelText('Cam Unlimited')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByLabelText('Wyze Cam v4')).not.toBeInTheDocument()
    })
  })

  it('renders the mobile-only heading with lg:hidden visibility class', () => {
    renderWithBundleBuilder(<AccordionBuilder />)

    const heading = screen.getByTestId('builder-mobile-heading')
    expect(heading).toHaveTextContent("Let's get started!")
    expect(heading.tagName).toBe('H1')
    expect(heading.closest('header')).toHaveClass('lg:hidden')
  })
})
