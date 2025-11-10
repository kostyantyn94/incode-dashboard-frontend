import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Column from './Column'
import { TaskStatus, TaskPriority } from '@/features/tasks/tasks.types'
import type { Task } from '@/features/tasks/tasks.types'
import * as React from 'react'

// Mock @dnd-kit modules
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: () => {},
  }),
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

describe('Column', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: null,
      position: 1,
      createdAt: '',
      updatedAt: '',
      dashboardId: 0,
    },
    {
      id: 2,
      title: 'Task 2',
      description: null,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: null,
      position: 2,
      createdAt: '',
      updatedAt: '',
      dashboardId: 0,
    },
  ]

  const mockOnAddTask = vi.fn()
  const mockOnEditTask = vi.fn()
  const mockOnDeleteTask = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders column title', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('displays task count', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('(2)')).toBeInTheDocument()
  })

  it('renders all tasks', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows "No tasks yet" when tasks array is empty', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('calls onAddTask with correct status when Add Task is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(mockOnAddTask).toHaveBeenCalledWith(TaskStatus.TODO)
  })

  it('passes deletingTaskId to TaskCards', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        deletingTaskId={1}
      />
    )
    // The first task should be in deleting state
    expect(screen.getByLabelText('Deleting task...')).toBeInTheDocument()
  })

  it('renders Add Task button', () => {
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(
      screen.getByRole('button', { name: /add task/i })
    ).toBeInTheDocument()
  })

  it('updates count when tasks change', () => {
    const { rerender } = render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('(2)')).toBeInTheDocument()

    rerender(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={[mockTasks[0]]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )
    expect(screen.getByText('(1)')).toBeInTheDocument()
  })

  it('passes onEditTask to TaskCards', async () => {
    const user = userEvent.setup()
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const editButtons = screen.getAllByLabelText('Edit task')
    await user.click(editButtons[0])

    expect(mockOnEditTask).toHaveBeenCalledWith(mockTasks[0])
  })

  it('passes onDeleteTask to TaskCards', async () => {
    const user = userEvent.setup()
    render(
      <Column
        title="To Do"
        status={TaskStatus.TODO}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const deleteButtons = screen.getAllByLabelText('Delete task')
    await user.click(deleteButtons[0])

    expect(mockOnDeleteTask).toHaveBeenCalledWith(1)
  })
})
