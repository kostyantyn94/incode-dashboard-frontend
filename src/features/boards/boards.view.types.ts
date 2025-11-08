import type { Dashboard } from './boards.types'
import type { Task } from '@/features/tasks/tasks.types'

export type GetDashboardResponse = {
  dashboard: Dashboard
  tasks: Task[]
}
