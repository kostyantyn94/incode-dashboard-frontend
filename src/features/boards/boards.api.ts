import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const boardsApi = createApi({
  reducerPath: 'boardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Board', 'Tasks'],
  endpoints: () => ({}),
})
