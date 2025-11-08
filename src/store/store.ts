import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import boardsReducer from '../features/boards/boards.slice.ts'
import { boardsApi } from '@/features/boards/boards.api'
import { baseApi } from '@/features/api/baseApi.ts'

export const store = configureStore({
  reducer: {
    [boardsApi.reducerPath]: boardsApi.reducer,
    boards: boardsReducer,
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware),
})

export type rootState = ReturnType<typeof store.dispatch>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
