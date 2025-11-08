export const ROOT = '/'
export const BOARD = '/board/:boardId'

export const buildBoardPath = (boardId: string) =>
  `/board/${encodeURIComponent(boardId)}`
