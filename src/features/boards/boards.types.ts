import type { TaskState } from '../tasks/tasks.types.ts'

export interface BoardState {
  id: number | null
  title: string
  description: string
  tasks: TaskState[]
}
