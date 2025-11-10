import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskModal from './TaskModal'
import { TaskPriority, TaskStatus } from '../tasks.types'
import type { Task } from '../tasks.types'

describe('TaskModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSave.mockResolvedValue(undefined)
  })

  describe('Create Mode', () => {
    it('renders with "Create New Task" title', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    it('has empty initial values', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )
      expect(screen.getByLabelText('Title')).toHaveValue('')
      expect(screen.getByLabelText('Description')).toHaveValue('')
    })

    it('shows "Create Task" button text', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )
      expect(
        screen.getByRole('button', { name: /create task/i })
      ).toBeInTheDocument()
    })

    it('does not show status dropdown in create mode', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )
      expect(screen.queryByLabelText('Status')).not.toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing description',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: '2024-12-31T00:00:00.000Z',
      position: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      dashboardId: 1,
    }

    it('renders with "Edit Task" title', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
        />
      )
      expect(screen.getByText('Edit Task')).toBeInTheDocument()
    })

    it('populates form with initial task values', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
        />
      )
      expect(screen.getByLabelText('Title')).toHaveValue('Existing Task')
      expect(screen.getByLabelText('Description')).toHaveValue(
        'Existing description'
      )
    })

    it('shows status dropdown in edit mode', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
        />
      )
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
    })

    it('shows "Save Changes" button text', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
        />
      )
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows error when title is empty', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      const saveButton = screen.getByRole('button', { name: /create task/i })
      await user.click(saveButton)

      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('allows saving with valid title', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      await user.type(screen.getByLabelText('Title'), 'New Task')
      await user.click(screen.getByRole('button', { name: /create task/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })
    })
  })

  describe('Form Interaction', () => {
    it('updates title input', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      const titleInput = screen.getByLabelText('Title')
      await user.type(titleInput, 'My Task')
      expect(titleInput).toHaveValue('My Task')
    })

    it('updates description input', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      const descInput = screen.getByLabelText('Description')
      await user.type(descInput, 'Task description')
      expect(descInput).toHaveValue('Task description')
    })

    it('calls onClose when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('shows loading text when isLoading is true', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
          isLoading={true}
        />
      )

      expect(
        screen.getByRole('button', { name: /creating.../i })
      ).toBeInTheDocument()
    })

    it('disables buttons when loading', () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
          isLoading={true}
        />
      )

      expect(
        screen.getByRole('button', { name: /creating.../i })
      ).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })

    it('shows "Saving..." in edit mode when loading', () => {
      const mockTask: Task = {
        id: 1,
        title: 'Task',
        description: null,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        position: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        dashboardId: 1,
      }

      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
          isLoading={true}
        />
      )

      expect(
        screen.getByRole('button', { name: /saving.../i })
      ).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('calls onSave with correct data in create mode', async () => {
      const user = userEvent.setup()
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          defaultStatus={TaskStatus.TODO}
        />
      )

      await user.type(screen.getByLabelText('Title'), 'New Task')
      await user.type(screen.getByLabelText('Description'), 'Task description')
      await user.click(screen.getByRole('button', { name: /create task/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Task',
            description: 'Task description',
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.TODO,
          })
        )
      })
    })

    it('calls onSave with task id in edit mode', async () => {
      const user = userEvent.setup()
      const mockTask: Task = {
        id: 123,
        title: 'Task',
        description: null,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        position: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        dashboardId: 1,
      }

      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          initialTask={mockTask}
        />
      )

      await user.clear(screen.getByLabelText('Title'))
      await user.type(screen.getByLabelText('Title'), 'Updated Task')
      await user.click(screen.getByRole('button', { name: /save changes/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 123,
            title: 'Updated Task',
          })
        )
      })
    })
  })
})
