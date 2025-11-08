import { TaskPriority, TaskStatus } from '../tasks.types'
import type { Task } from '../tasks.types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import IconButton from '@/components/ui/IconButton'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  // Map priority to badge variant
  const getPriorityVariant = (
    priority: TaskPriority
  ): 'low' | 'medium' | 'high' => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'low'
      case TaskPriority.MEDIUM:
        return 'medium'
      case TaskPriority.HIGH:
        return 'high'
    }
  }

  const isOverdue = (dateString: string | null): boolean => {
    if (!dateString) return false

    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && task.status !== TaskStatus.DONE
  }
  const overdue = isOverdue(task.dueDate)

  // Format date to readable format
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No due date'

    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card hoverable className="group">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-base leading-tight flex-1">
          {task.title}
        </h3>

        {/* Action buttons - visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <IconButton
            icon={
              <svg
                className="w-4 h-4"
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
            ariaLabel="Edit task"
            variant="primary"
            size="sm"
            onClick={() => onEdit(task)}
          />

          <IconButton
            icon={
              <svg
                className="w-4 h-4"
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
            ariaLabel="Delete task"
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
          />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer with due date and priority */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
        {/* Due date */}
        <div
          className={`flex items-center gap-1.5 text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(task.dueDate)}</span>
          {overdue && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
              Overdue
            </span>
          )}
        </div>

        {/* Priority badge */}
        <Badge variant={getPriorityVariant(task.priority)} size="sm">
          {task.priority}
        </Badge>
      </div>
    </Card>
  )
}

export default TaskCard
