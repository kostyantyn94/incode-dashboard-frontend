import { configureStore } from '@reduxjs/toolkit'
import boards from '../features/boards/boards.slice.ts'

export const store = configureStore({
  reducer: {
    boards,
  },
})

export type rootState = ReturnType<typeof store.dispatch>
export type AppDispatch = typeof store.dispatch
