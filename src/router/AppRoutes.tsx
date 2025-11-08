import { Route, Routes } from 'react-router'
import { ROOT, BOARD } from './paths'

import RootLayout from '@/layouts/RootLayout'
import HomePage from '@/pages/home/HomePage'
import BoardPage from '@/pages/board/BoardPage'
import NotFoundPage from '@/pages/not-found/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={ROOT} element={<HomePage />} />
        <Route path={BOARD} element={<BoardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
