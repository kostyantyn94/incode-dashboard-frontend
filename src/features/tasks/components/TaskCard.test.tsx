import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from './TaskCard'
import { TaskPriority, TaskStatus } from '../tasks.types'
import type { Task } from '../tasks.types'

// Mock @dnd-kit/sortable
vi.mock('@dnd-kit/sortable', () => ({
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

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '2024-12-31T00:00:00.000Z',
    position: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    dashboardId: 1,
  }

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task title', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description when provided', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const taskWithoutDesc = { ...mockTask, description: null }
    render(
      <TaskCard
        task={taskWithoutDesc}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.queryByText('Test description')).not.toBeInTheDocument()
  })

  it('displays priority badge', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('displays due date', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument()
  })

  it('shows "No due date" when dueDate is null', () => {
    const taskWithoutDate = { ...mockTask, dueDate: null }
    render(
      <TaskCard
        task={taskWithoutDate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('No due date')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const editButton = screen.getByLabelText('Edit task')
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const deleteButton = screen.getByLabelText('Delete task')
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('shows overdue badge for past due dates', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2020-01-01T00:00:00.000Z',
      status: TaskStatus.TODO,
    }
    render(
      <TaskCard
        task={overdueTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('does not show overdue badge for completed tasks', () => {
    const completedTask = {
      ...mockTask,
      dueDate: '2020-01-01T00:00:00.000Z',
      status: TaskStatus.DONE,
    }
    render(
      <TaskCard
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument()
  })

  it('shows deleting state when isDeleting is true', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDeleting
      />
    )
    const deleteButton = screen.getByLabelText('Deleting task...')
    expect(deleteButton).toBeDisabled()
  })

  it('renders high priority badge correctly', () => {
    const highPriorityTask = { ...mockTask, priority: TaskPriority.HIGH }
    render(
      <TaskCard
        task={highPriorityTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders low priority badge correctly', () => {
    const lowPriorityTask = { ...mockTask, priority: TaskPriority.LOW }
    render(
      <TaskCard
        task={lowPriorityTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('Low')).toBeInTheDocument()
  })
})
