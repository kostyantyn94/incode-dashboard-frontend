import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import BoardPage from './BoardPage'
import { renderWithProviders } from '@/test/test-utils'

// Mock react-router
vi.mock('react-router', () => ({
  useParams: () => ({ boardId: '123' }),
  useNavigate: () => vi.fn(),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  closestCorners: vi.fn(),
  useDroppable: () => ({ setNodeRef: () => {} }),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
    isSorting: false,
  }),
}))

// Create a simple mock that can be overridden per test
let mockDashboardQuery: {
  data: unknown
  isLoading: boolean
  error: unknown
} = { data: null, isLoading: false, error: null }

vi.mock('@/features/boards/boards.api', () => ({
  useGetDashboardQuery: () => mockDashboardQuery,
  useUpdateDashboardMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteDashboardMutation: () => [vi.fn(), { isLoading: false }],
}))

vi.mock('@/features/tasks/tasks.api', () => ({
  useCreateTaskMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateTaskMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteTaskMutation: () => [vi.fn(), { isLoading: false }],
  useReorderTaskMutation: () => [vi.fn(), { isLoading: false }],
}))

describe('BoardPage', () => {
  it('shows loading state when fetching board', () => {
    mockDashboardQuery = { data: undefined, isLoading: true, error: undefined }
    renderWithProviders(<BoardPage />)
    expect(screen.getByText('Loading board...')).toBeInTheDocument()
  })

  it('shows error state when board fetch fails', () => {
    mockDashboardQuery = {
      data: undefined,
      isLoading: false,
      error: { message: 'Network error' },
    }
    renderWithProviders(<BoardPage />)
    expect(screen.getByText('Failed to load board')).toBeInTheDocument()
    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
  })

  it('shows not found state when board data is null', () => {
    mockDashboardQuery = { data: null, isLoading: false, error: undefined }
    renderWithProviders(<BoardPage />)
    expect(screen.getByText('Board not found')).toBeInTheDocument()
  })

  it('renders board when data is loaded', () => {
    mockDashboardQuery = {
      data: {
        dashboard: {
          id: '123',
          title: 'My Board',
          description: 'Board description',
        },
        tasks: [],
      },
      isLoading: false,
      error: undefined,
    }
    renderWithProviders(<BoardPage />)
    expect(screen.getByText('My Board')).toBeInTheDocument()
    expect(screen.getByText('Board description')).toBeInTheDocument()
  })

  it('renders column titles', () => {
    mockDashboardQuery = {
      data: {
        dashboard: { id: '123', title: 'My Board', description: null },
        tasks: [],
      },
      isLoading: false,
      error: undefined,
    }
    renderWithProviders(<BoardPage />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders edit and delete board buttons', () => {
    mockDashboardQuery = {
      data: {
        dashboard: { id: '123', title: 'My Board', description: null },
        tasks: [],
      },
      isLoading: false,
      error: undefined,
    }
    renderWithProviders(<BoardPage />)
    expect(screen.getByLabelText('Edit board')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete board')).toBeInTheDocument()
  })
})
