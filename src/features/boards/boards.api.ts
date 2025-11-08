import { baseApi } from '@/features/api/baseApi'
import type {
  Dashboard,
  CreateDashboardDto,
  UpdateDashboardDto,
} from './boards.types'
import type { GetDashboardResponse } from './boards.view.types'

const base = '/api/v1/dashboard'

export const boardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Dashboards list GET /api/v1/dashboard
    getDashboards: build.query<Dashboard[], void>({
      query: () => ({ url: `${base}` }),
      providesTags: ['Board'],
    }),

    // One Dashboard + Tasks GET /api/v1/dashboard/:id
    getDashboard: build.query<GetDashboardResponse, string>({
      query: (id) => ({ url: `${base}/${encodeURIComponent(id)}` }),
      providesTags: (_res, _err, id) => [{ type: 'Board', id }],
    }),

    // Create Dashboard POST /api/v1/dashboard
    createDashboard: build.mutation<Dashboard, CreateDashboardDto>({
      query: (body) => ({
        url: `${base}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Board'],
    }),

    // Update Dashboard PATCH /api/v1/dashboard/:id
    updateDashboard: build.mutation<
      Dashboard,
      { id: string; data: UpdateDashboardDto }
    >({
      query: ({ id, data }) => ({
        url: `${base}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Board', id }],
    }),

    // Delete Dashboard DELETE /api/v1/dashboard/:id
    deleteDashboard: build.mutation<Dashboard, string>({
      query: (id) => ({
        url: `${base}/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => ['Board', { type: 'Board', id }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetDashboardsQuery,
  useGetDashboardQuery,
  useCreateDashboardMutation,
  useUpdateDashboardMutation,
  useDeleteDashboardMutation,
} = boardsApi
