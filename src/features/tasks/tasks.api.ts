import type {
  CreateTaskDto,
  ReorderTaskDto,
  Task,
  UpdateTaskDto,
} from '@/features/tasks/tasks.types.ts'
import { baseApi } from '@/features/api/baseApi.ts'

const base = '/api/v1/task'

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createTask: b.mutation<Task, { boardId: string; data: CreateTaskDto }>({
      query: ({ data }) => ({
        url: `${base}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_r, _e, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),

    updateTask: b.mutation<
      Task,
      { boardId: string; id: number; data: UpdateTaskDto }
    >({
      query: ({ id, data }) => ({
        url: `${base}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),

    deleteTask: b.mutation<Task, { boardId: string; id: number }>({
      query: ({ id }) => ({
        url: `${base}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),

    reorderTask: b.mutation<Task, { boardId: string; data: ReorderTaskDto }>({
      query: ({ data }) => ({
        url: `${base}/reorder`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { boardId }) => [
        { type: 'Board', id: boardId },
      ],
    }),
  }),
})

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useReorderTaskMutation,
} = tasksApi
