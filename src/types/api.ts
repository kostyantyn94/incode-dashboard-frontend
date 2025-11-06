export type ApiError = {
  status: number
  message: string
  data?: unknown
}

export const isApiError = (e: unknown): e is ApiError =>
  typeof e === 'object' && e !== null && 'status' in e && 'message' in e
