import { useState } from 'react'
import { useParams } from 'react-router'
import Column from '@/features/boards/components/Column.tsx'
import TaskModal from '@/features/tasks/components/TaskModal'
import type { BoardState } from '@/features/boards/boards.types'
import type { TaskState } from '@/features/tasks/tasks.types'
import { TaskStatus, TaskPriority } from '@/features/tasks/tasks.types'

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskState | null>(null)
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  )

  // TODO: Replace with RTK Query
  // const { data: board, isLoading, error } = useGetBoardQuery(boardId)

  // Mock data for now
  const [board, setBoard] = useState<BoardState>({
    id: Number(boardId),
    title: 'My Project Board',
    description: 'Project management board',
    tasks: [
      {
        id: '1',
        title: 'Design new landing page',
        description: 'Create mockups and prototypes for the new landing page',
        priority: TaskPriority.HIGH,
        dueDate: '2025-11-15',
        status: TaskStatus.TODO,
      },
      {
        id: '2',
        title: 'Fix login bug',
        description: 'Users are unable to login with Google OAuth',
        priority: TaskPriority.HIGH,
        dueDate: '2025-11-10',
        status: TaskStatus.IN_PROGRESS,
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Add API documentation for new endpoints',
        priority: TaskPriority.LOW,
        dueDate: '2025-11-20',
        status: TaskStatus.DONE,
      },
    ],
  })

  // Loading state
  const isLoading = false
  const error = null

  // Filter tasks by status
  const getTasksByStatus = (status: TaskStatus): TaskState[] => {
    return board?.tasks.filter((task) => task.status === status) || []
  }

  // Handle add task
  const handleAddTask = (status: TaskStatus) => {
    setDefaultTaskStatus(status)
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  // Handle edit task
  const handleEditTask = (task: TaskState) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  // Handle delete task
  const handleDeleteTask = (taskId: string) => {
    // TODO: Add confirmation dialog
    // TODO: Replace with RTK Query mutation
    setBoard((prev) => ({
      ...prev!,
      tasks: prev!.tasks.filter((task) => task.id !== taskId),
    }))
    console.log('Deleting task:', taskId)
  }

  // Handle save task
  const handleSaveTask = (taskData: Omit<TaskState, 'id'> | TaskState) => {
    if ('id' in taskData) {
      // Edit existing task
      // TODO: Replace with RTK Query mutation
      setBoard((prev) => ({
        ...prev!,
        tasks: prev!.tasks.map((task) =>
          task.id === taskData.id ? (taskData as TaskState) : task
        ),
      }))
      console.log('Updating task:', taskData)
    } else {
      // Create new task
      // TODO: Replace with RTK Query mutation
      const newTask: TaskState = {
        ...taskData,
        id: Date.now().toString(), // Temporary ID generation
        status: defaultTaskStatus,
      }
      setBoard((prev) => ({
        ...prev!,
        tasks: [...prev!.tasks, newTask],
      }))
      console.log('Creating task:', newTask)
    }
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
