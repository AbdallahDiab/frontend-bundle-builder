import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuantityStepper } from './QuantityStepper'

describe('QuantityStepper', () => {
  it('disables decrement at 0', () => {
    render(
      <QuantityStepper
        value={0}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
        ariaLabel="Test quantity"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Decrease quantity' }),
    ).toBeDisabled()
  })

  it('enables decrement when value is greater than 0', () => {
    render(
      <QuantityStepper
        value={2}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
        ariaLabel="Test quantity"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Decrease quantity' }),
    ).not.toBeDisabled()
  })

  it('calls increment and decrement handlers', async () => {
    const user = userEvent.setup()
    const onIncrement = vi.fn()
    const onDecrement = vi.fn()

    render(
      <QuantityStepper
        value={1}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        ariaLabel="Test quantity"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))

    expect(onIncrement).toHaveBeenCalledOnce()
    expect(onDecrement).toHaveBeenCalledOnce()
  })
})
