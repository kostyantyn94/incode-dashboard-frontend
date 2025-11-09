// src/pages/home/HomePage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { recentDashboardsUtils } from '@/utils/recentDashboards'
import type { RecentDashboard } from '@/utils/recentDashboards'
import { buildBoardPath } from '@/router/paths'
import Card from '@/components/ui/Card'

const HomePage = () => {
  const navigate = useNavigate()
  const [recentDashboards, setRecentDashboards] = useState<RecentDashboard[]>(
    []
  )

  // Load recent dashboards from localStorage
  useEffect(() => {
    const recent = recentDashboardsUtils.getRecent()
    setRecentDashboards(recent)
  }, [])

  // Navigate to a dashboard
  const handleDashboardClick = (id: string) => {
    navigate(buildBoardPath(id))
  }

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center max-w-4xl px-4 w-full">
        {/* Icon */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 text-blue-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Task Board
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          Manage your projects efficiently with our intuitive kanban board.
          Enter a board ID above to load an existing board, or create a new one
          to get started.
        </p>

        {/* Recent Dashboards */}
        {recentDashboards.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Dashboards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDashboards.map((dashboard) => (
                <Card
                  key={dashboard.id}
                  hoverable
                  onClick={() => handleDashboardClick(dashboard.id)}
                  className="cursor-pointer text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base truncate mb-1">
                        {dashboard.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(dashboard.lastVisited)}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Organize Tasks</h3>
            <p className="text-sm text-gray-600">
              Create and manage tasks across different stages of your workflow
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Set Priorities</h3>
            <p className="text-sm text-gray-600">
              Assign priority levels to focus on what matters most
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Track Deadlines
            </h3>
            <p className="text-sm text-gray-600">
              Set due dates and never miss an important deadline
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
