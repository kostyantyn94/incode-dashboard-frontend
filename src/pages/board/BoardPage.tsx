import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useMemo } from 'react'
import {
  useGetDashboardQuery,
  useUpdateDashboardMutation,
  useDeleteDashboardMutation,
} from '@/features/boards/boards.api'
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useReorderTaskMutation,
} from '@/features/tasks/tasks.api'

import Column from '@/features/boards/components/Column.tsx'
import TaskModal from '@/features/tasks/components/TaskModal'
import TaskCard from '@/features/tasks/components/TaskCard'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import IconButton from '@/components/ui/IconButton'
import type { Task } from '@/features/tasks/tasks.types'
import { TaskStatus } from '@/features/tasks/tasks.types'
import type { BoardState } from '@/features/boards/boards.types.ts'
import toast from 'react-hot-toast'
import { recentDashboardsUtils } from '@/utils/recentDashboards'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  )

  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false)
  const [editedBoardTitle, setEditedBoardTitle] = useState('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const { data, isLoading, error } = useGetDashboardQuery(boardId!, {
    skip: !boardId,
  })

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation()
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [reorderTask] = useReorderTaskMutation()
  const [updateDashboard, { isLoading: isUpdatingBoard }] =
    useUpdateDashboardMutation()
  const [deleteDashboard, { isLoading: isDeletingBoard }] =
    useDeleteDashboardMutation()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  const board: BoardState | null = useMemo(() => {
    if (!data) return null
    return {
      id: data.dashboard.id,
      title: data.dashboard.title,
      description: data.dashboard.description ?? null,
      tasks: data.tasks,
    }
  }, [data])

  const currentBoardId = board?.id ?? boardId!

  useEffect(() => {
    if (board) {
      recentDashboardsUtils.addRecent({
        id: board.id,
        title: board.title,
      })
    }
  }, [board])

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return (
      board?.tasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position) || []
    )
  }

  const handleAddTask = (status: TaskStatus) => {
    setDefaultTaskStatus(status)
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    setDeletingTaskId(taskId)
    try {
      await deleteTask({ boardId: currentBoardId, id: taskId }).unwrap()
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task. Please try again.')
    } finally {
      setDeletingTaskId(null)
    }
  }

  const handleSaveTask = async (taskData: Omit<Task, 'id'> | Task) => {
    try {
      if ('id' in taskData) {
        await updateTask({
          boardId: currentBoardId,
          id: taskData.id,
          data: {
            title: taskData.title,
            description: taskData.description ?? null,
            priority: taskData.priority,
            dueDate: taskData.dueDate ?? null,
            status: taskData.status,
          },
        }).unwrap()
        toast.success('Task updated successfully!')
      } else {
        await createTask({
          boardId: currentBoardId,
          data: {
            title: taskData.title,
            description: taskData.description ?? null,
            dashboardId: currentBoardId,
            priority: taskData.priority,
            dueDate: taskData.dueDate ?? null,
            status: defaultTaskStatus,
          },
        }).unwrap()
        toast.success('Task created successfully!')
      }

      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to save task:', error)
      toast.error('Failed to save task. Please try again.')
    }
  }

  const handleOpenEditBoard = () => {
    if (board) {
      setEditedBoardTitle(board.title)
      setIsEditBoardModalOpen(true)
    }
  }

  const handleUpdateBoard = async () => {
    if (!editedBoardTitle.trim()) return

    try {
      await updateDashboard({
        id: currentBoardId,
        data: { title: editedBoardTitle.trim() },
      }).unwrap()

      toast.success('Board updated successfully!')
      setIsEditBoardModalOpen(false)
    } catch (error) {
      console.error('Failed to update board:', error)
      toast.error('Failed to update board. Please try again.')
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteDashboard(currentBoardId).unwrap()

      toast.success('Board deleted successfully!')
      setIsDeleteConfirmOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Failed to delete board:', error)
      toast.error('Failed to delete board. Please try again.')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = board?.tasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = () => {
    // Provides smooth collision detection during drag
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || !board) return

    const activeTaskId = active.id as number
    const activeTask = board.tasks.find((t) => t.id === activeTaskId)
    if (!activeTask) return
    let targetStatus: TaskStatus = activeTask.status
    if (Object.values(TaskStatus).includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus
    } else {
      const overTask = board.tasks.find((t) => t.id === over.id)
      if (overTask) {
        targetStatus = overTask.status
      }
    }
    const targetColumnTasks = board.tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.position - b.position)
    const activeIndex = targetColumnTasks.findIndex(
      (t) => t.id === activeTaskId
    )
    const overIndex = targetColumnTasks.findIndex((t) => t.id === over.id)
    let prevId: number | null = null
    let nextId: number | null = null

    if (over.id === targetStatus) {
      if (targetColumnTasks.length > 0) {
        prevId = targetColumnTasks[targetColumnTasks.length - 1].id
      }
    } else if (activeIndex === -1) {
      if (overIndex === 0) {
        nextId = targetColumnTasks[0].id
      } else if (overIndex > 0) {
        prevId = targetColumnTasks[overIndex - 1].id
        nextId = targetColumnTasks[overIndex].id
      }
    } else {
      if (activeIndex === overIndex) return // No change

      if (activeIndex < overIndex) {
        prevId = targetColumnTasks[overIndex].id
        if (overIndex + 1 < targetColumnTasks.length) {
          nextId = targetColumnTasks[overIndex + 1].id
        }
      } else {
        if (overIndex > 0) {
          prevId = targetColumnTasks[overIndex - 1].id
        }
        nextId = targetColumnTasks[overIndex].id
      }
    }

    try {
      await reorderTask({
        boardId: currentBoardId,
        data: {
          taskId: activeTaskId,
          prevId: prevId ?? undefined,
          nextId: nextId ?? undefined,
          targetStatus,
        },
      }).unwrap()
    } catch (error) {
      console.error('Failed to reorder task:', error)
      toast.error('Failed to move task. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to load board
          </h2>
          <p className="text-gray-600">
            {/* {error.message} */}
            Something went wrong. Please try again.
          </p>
        </div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Board not found
          </h2>
          <p className="text-gray-600">
            The board with ID "{boardId}" does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-120px)]">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-gray-600">{board.description}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <IconButton
              onClick={handleOpenEditBoard}
              variant="default"
              size="md"
              ariaLabel="Edit board"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            />

            <IconButton
              onClick={() => setIsDeleteConfirmOpen(true)}
              variant="danger"
              size="md"
              ariaLabel="Delete board"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100%-120px)]">
          <Column
            title="To Do"
            status={TaskStatus.TODO}
            tasks={getTasksByStatus(TaskStatus.TODO)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            deletingTaskId={deletingTaskId}
          />

          <Column
            title="In Progress"
            status={TaskStatus.IN_PROGRESS}
            tasks={getTasksByStatus(TaskStatus.IN_PROGRESS)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            deletingTaskId={deletingTaskId}
          />

          <Column
            title="Done"
            status={TaskStatus.DONE}
            tasks={getTasksByStatus(TaskStatus.DONE)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            deletingTaskId={deletingTaskId}
          />
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(null)
          }}
          onSave={handleSaveTask}
          initialTask={editingTask}
          defaultStatus={defaultTaskStatus}
          isLoading={isCreating || isUpdatingTask}
        />

        <Modal
          isOpen={isEditBoardModalOpen}
          onClose={() => {
            setIsEditBoardModalOpen(false)
            setEditedBoardTitle('')
          }}
          title="Edit Board"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Board Name"
              placeholder="Enter board name"
              value={editedBoardTitle}
              onChange={(e) => setEditedBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  editedBoardTitle.trim() &&
                  !isUpdatingBoard
                ) {
                  handleUpdateBoard()
                }
              }}
              fullWidth
              autoFocus
            />

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setIsEditBoardModalOpen(false)
                  setEditedBoardTitle('')
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBoard}
                disabled={!editedBoardTitle.trim() || isUpdatingBoard}
              >
                {isUpdatingBoard ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          title="Delete Board"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the board{' '}
              <strong>"{board?.title}"</strong>? This action cannot be undone
              and will permanently delete all tasks in this board.
            </p>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsDeleteConfirmOpen(false)}
                variant="secondary"
                disabled={isDeletingBoard}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteBoard}
                variant="danger"
                disabled={isDeletingBoard}
              >
                {isDeletingBoard ? 'Deleting...' : 'Delete Board'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default BoardPage
