export interface Task {
  id: number
  createdAt: string
  updatedAt: string
  title: string
  description: string | null
  priority: TaskPriority
  dueDate: string | null
  dashboardId: number
  status: TaskStatus
  position: number
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface CreateTaskDto {
  title: string
  description?: string | null
  dashboardId: string
  priority?: TaskPriority
  dueDate?: string | null
  status?: TaskStatus
}

export interface UpdateTaskDto {
  title?: string
  description?: string | null
  priority?: TaskPriority
  dueDate?: string | null
  status?: TaskStatus
  position?: number
}

export interface ReorderTaskDto {
  taskId: number
  prevId?: number | null
  nextId?: number | null
  targetStatus?: TaskStatus
}
