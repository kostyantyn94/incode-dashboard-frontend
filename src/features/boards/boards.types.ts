import type { Task } from '@/features/tasks/tasks.types'

export interface Dashboard {
  id: string
  title: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface BoardState {
  id: string
  title: string
  description: string | null
  tasks: Task[]
}

export interface CreateDashboardDto {
  title: string
  description?: string | null
}

export interface UpdateDashboardDto {
  title?: string
  description?: string | null
}
