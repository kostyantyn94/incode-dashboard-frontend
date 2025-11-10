import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IconButton from './IconButton'

const TestIcon = (
  <svg data-testid="test-icon">
    <circle />
  </svg>
)

describe('IconButton', () => {
  it('renders icon correctly', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Test button" />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Delete item" />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Delete item')
  })

  it('has correct title attribute', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Delete item" />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'Delete item')
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <IconButton icon={TestIcon} ariaLabel="Click me" onClick={handleClick} />
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies default variant styles', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Default" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-gray-600')
  })

  it('applies danger variant styles', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Delete" variant="danger" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-red-600')
  })

  it('applies primary variant styles', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Primary" variant="primary" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-blue-600')
  })

  it('applies small size styles', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Small" size="sm" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('p-1', 'text-sm')
  })

  it('applies medium size styles by default', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Medium" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('p-2', 'text-base')
  })

  it('applies large size styles', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Large" size="lg" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('p-3', 'text-lg')
  })

  it('disables button when disabled prop is true', () => {
    render(<IconButton icon={TestIcon} ariaLabel="Disabled" disabled />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <IconButton
        icon={TestIcon}
        ariaLabel="Disabled"
        onClick={handleClick}
        disabled
      />
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(
      <IconButton icon={TestIcon} ariaLabel="Custom" className="custom-class" />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<IconButton icon={TestIcon} ariaLabel="Ref button" ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
