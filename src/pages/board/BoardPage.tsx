import { useState } from 'react'
import { useParams } from 'react-router'
import { useMemo } from 'react'
import { useGetDashboardQuery } from '@/features/boards/boards.api'
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/features/tasks/tasks.api'

import Column from '@/features/boards/components/Column.tsx'
import TaskModal from '@/features/tasks/components/TaskModal'
import type { Task } from '@/features/tasks/tasks.types'
import { TaskStatus } from '@/features/tasks/tasks.types'
import type { BoardState } from '@/features/boards/boards.types.ts'

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  )

  // TODO: Replace with RTK Query
  const { data, isLoading, error } = useGetDashboardQuery(boardId!, {
    skip: !boardId,
  })

  const [createTask] = useCreateTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

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

  // Filter tasks by status
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return board?.tasks.filter((task) => task.status === status) || []
  }

  // Handle add task
  const handleAddTask = (status: TaskStatus) => {
    setDefaultTaskStatus(status)
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  // Handle delete task
  const handleDeleteTask = async (taskId: number) => {
    await deleteTask({ boardId: currentBoardId, id: taskId })
  }

  // Handle save task
  const handleSaveTask = async (taskData: Omit<Task, 'id'> | Task) => {
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
      })
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
      })
    }

    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  // Loading state
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

  // Error state
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

  // No board found
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
    <div className="h-[calc(100vh-120px)]">
      {/* Board Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{board.title}</h1>
        {board.description && (
          <p className="text-gray-600">{board.description}</p>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100%-120px)]">
        <Column
          title="To Do"
          status={TaskStatus.TODO}
          tasks={getTasksByStatus(TaskStatus.TODO)}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <Column
          title="In Progress"
          status={TaskStatus.IN_PROGRESS}
          tasks={getTasksByStatus(TaskStatus.IN_PROGRESS)}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <Column
          title="Done"
          status={TaskStatus.DONE}
          tasks={getTasksByStatus(TaskStatus.DONE)}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultTaskStatus}
      />
    </div>
  )
}

export default BoardPage
