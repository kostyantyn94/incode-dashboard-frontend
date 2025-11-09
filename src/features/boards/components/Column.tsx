import type { Task } from '@/features/tasks/tasks.types'
import { TaskStatus } from '@/features/tasks/tasks.types'
import TaskCard from '@/features/tasks/components/TaskCard'
import Button from '@/components/ui/Button'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface ColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: number) => void
  deletingTaskId?: number | null
}

const Column = ({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  deletingTaskId = null,
}: ColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  const taskIds = tasks.map((task) => task.id)

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg">
      {/* Column Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-gray-500">
            ({tasks.length})
          </span>
        </h2>
      </div>

      {/* Tasks List */}
      <div ref={setNodeRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                isDeleting={deletingTaskId === task.id}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={() => onAddTask(status)}
          variant="ghost"
          fullWidth
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </Button>
      </div>
    </div>
  )
}

export default Column
