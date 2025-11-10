import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from './HomePage'

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock recentDashboards utils
const mockGetRecent = vi.fn()
const mockRemoveRecent = vi.fn()
const mockClearRecent = vi.fn()

vi.mock('@/utils/recentDashboards', () => ({
  recentDashboardsUtils: {
    getRecent: () => mockGetRecent(),
    removeRecent: (id: string) => mockRemoveRecent(id),
    clearRecent: () => mockClearRecent(),
  },
}))

// Mock paths
vi.mock('@/router/paths', () => ({
  buildBoardPath: (id: string) => `/board/${id}`,
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetRecent.mockReturnValue([])
  })

  it('renders welcome message', () => {
    render(<HomePage />)
    expect(screen.getByText('Welcome to Task Board')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Organize Tasks')).toBeInTheDocument()
    expect(screen.getByText('Set Priorities')).toBeInTheDocument()
    expect(screen.getByText('Track Deadlines')).toBeInTheDocument()
  })

  describe('Recent Dashboards', () => {
    it('does not show recent dashboards section when list is empty', () => {
      mockGetRecent.mockReturnValue([])
      render(<HomePage />)
      expect(screen.queryByText('Recent Dashboards')).not.toBeInTheDocument()
    })

    it('shows recent dashboards when available', () => {
      mockGetRecent.mockReturnValue([
        {
          id: '1',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Dashboard 2',
          lastVisited: '2024-01-02T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      expect(screen.getByText('Recent Dashboards')).toBeInTheDocument()
      expect(screen.getByText('Dashboard 1')).toBeInTheDocument()
      expect(screen.getByText('Dashboard 2')).toBeInTheDocument()
    })

    it('navigates to board when dashboard is clicked', async () => {
      const user = userEvent.setup()
      mockGetRecent.mockReturnValue([
        {
          id: '123',
          title: 'My Dashboard',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      await user.click(screen.getByText('My Dashboard'))

      expect(mockNavigate).toHaveBeenCalledWith('/board/123')
    })

    it('shows Clear All button when dashboards exist', () => {
      mockGetRecent.mockReturnValue([
        {
          id: '1',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      expect(
        screen.getByRole('button', { name: /clear all/i })
      ).toBeInTheDocument()
    })

    it('calls clearRecent when Clear All is clicked', async () => {
      const user = userEvent.setup()
      mockGetRecent.mockReturnValue([
        {
          id: '1',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      await user.click(screen.getByRole('button', { name: /clear all/i }))

      expect(mockClearRecent).toHaveBeenCalled()
    })

    it('shows remove button for each dashboard', () => {
      mockGetRecent.mockReturnValue([
        {
          id: '1',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Dashboard 2',
          lastVisited: '2024-01-02T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      const removeButtons = screen.getAllByLabelText('Remove from recent')
      expect(removeButtons).toHaveLength(2)
    })

    it('calls removeRecent when remove button is clicked', async () => {
      const user = userEvent.setup()
      mockGetRecent.mockReturnValue([
        {
          id: '123',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      await user.click(screen.getByLabelText('Remove from recent'))

      expect(mockRemoveRecent).toHaveBeenCalledWith('123')
    })

    it('does not navigate when remove button is clicked', async () => {
      const user = userEvent.setup()
      mockGetRecent.mockReturnValue([
        {
          id: '123',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
      ])

      render(<HomePage />)
      await user.click(screen.getByLabelText('Remove from recent'))

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Relative Time Display', () => {
    it('shows "Just now" for very recent visits', () => {
      const now = new Date().toISOString()
      mockGetRecent.mockReturnValue([
        { id: '1', title: 'Dashboard', lastVisited: now },
      ])

      render(<HomePage />)
      expect(screen.getByText('Just now')).toBeInTheDocument()
    })

    it('shows minutes ago for recent visits', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      mockGetRecent.mockReturnValue([
        { id: '1', title: 'Dashboard', lastVisited: fiveMinutesAgo },
      ])

      render(<HomePage />)
      expect(screen.getByText(/5m ago/)).toBeInTheDocument()
    })

    it('shows hours ago for visits within 24 hours', () => {
      const threeHoursAgo = new Date(
        Date.now() - 3 * 60 * 60 * 1000
      ).toISOString()
      mockGetRecent.mockReturnValue([
        { id: '1', title: 'Dashboard', lastVisited: threeHoursAgo },
      ])

      render(<HomePage />)
      expect(screen.getByText(/3h ago/)).toBeInTheDocument()
    })

    it('shows days ago for visits within a week', () => {
      const twoDaysAgo = new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString()
      mockGetRecent.mockReturnValue([
        { id: '1', title: 'Dashboard', lastVisited: twoDaysAgo },
      ])

      render(<HomePage />)
      expect(screen.getByText(/2d ago/)).toBeInTheDocument()
    })
  })
})
