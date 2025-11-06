import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BoardState } from './boards.types.ts'

const initialState: BoardState = {
  id: null,
  title: '',
  description: '',
  tasks: [],
}

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
})

export default boardsSlice.reducer
