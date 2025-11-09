export interface RecentDashboard {
  id: string
  title: string
  lastVisited: string
}

const STORAGE_KEY = 'recentDashboards'
const MAX_RECENT = 5

export const recentDashboardsUtils = {

  getRecent(): RecentDashboard[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error reading recent dashboards:', error)
      return []
    }
  },


  addRecent(dashboard: { id: string; title: string }): void {
    try {
      const recent = this.getRecent()


      const filtered = recent.filter((d) => d.id !== dashboard.id)


      const updated: RecentDashboard[] = [
        {
          id: dashboard.id,
          title: dashboard.title,
          lastVisited: new Date().toISOString(),
        },
        ...filtered,
      ]


      const trimmed = updated.slice(0, MAX_RECENT)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch (error) {
      console.error('Error saving recent dashboard:', error)
    }
  },

  removeRecent(id: string): void {
    try {
      const recent = this.getRecent()
      const filtered = recent.filter((d) => d.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error removing recent dashboard:', error)
    }
  },

  // Clear all recent dashboards
  clearRecent(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing recent dashboards:', error)
    }
  },
}
