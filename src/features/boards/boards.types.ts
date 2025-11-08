import type { TaskState } from '../tasks/tasks.types.ts'

export interface BoardState {
  id: string
  title: string
  description?: string | null
  tasks: TaskState[]
}
