import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    )
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('applies hoverable styles when hoverable prop is true', () => {
    render(
      <Card hoverable data-testid="card">
        Content
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:shadow-lg', 'cursor-pointer')
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Card hoverable onClick={handleClick}>
        Clickable Card
      </Card>
    )

    await user.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-card" data-testid="card">
        Content
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-card')
  })

  it('renders without onClick handler', () => {
    render(<Card>Static Card</Card>)
    expect(screen.getByText('Static Card')).toBeInTheDocument()
  })

  it('combines multiple props correctly', () => {
    const handleClick = vi.fn()
    render(
      <Card
        hoverable
        onClick={handleClick}
        className="extra-class"
        data-testid="card"
      >
        Multi-prop Card
      </Card>
    )

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:shadow-lg', 'cursor-pointer', 'extra-class')
  })
})
