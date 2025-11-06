export interface TaskState {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  status: TaskStatus
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'In progress',
  DONE = 'Done',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}
