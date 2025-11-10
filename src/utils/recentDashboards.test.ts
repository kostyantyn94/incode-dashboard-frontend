import { describe, it, expect, beforeEach, vi } from 'vitest'
import { recentDashboardsUtils } from './recentDashboards'
import type { RecentDashboard } from './recentDashboards'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

globalThis.localStorage = localStorageMock as Storage

describe('recentDashboardsUtils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getRecent', () => {
    it('returns empty array when no dashboards are stored', () => {
      const result = recentDashboardsUtils.getRecent()
      expect(result).toEqual([])
    })

    it('returns stored dashboards', () => {
      const dashboards: RecentDashboard[] = [
        {
          id: '1',
          title: 'Dashboard 1',
          lastVisited: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Dashboard 2',
          lastVisited: '2024-01-02T00:00:00.000Z',
        },
      ]
      localStorage.setItem('recentDashboards', JSON.stringify(dashboards))

      const result = recentDashboardsUtils.getRecent()
      expect(result).toEqual(dashboards)
    })

    it('returns empty array on parse error', () => {
      localStorage.setItem('recentDashboards', 'invalid-json')

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = recentDashboardsUtils.getRecent()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('addRecent', () => {
    it('adds new dashboard to empty list', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'New Dashboard' })

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe('1')
      expect(stored[0].title).toBe('New Dashboard')
      expect(stored[0].lastVisited).toBeDefined()
    })

    it('adds dashboard to the beginning of the list', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })
      recentDashboardsUtils.addRecent({ id: '2', title: 'Second' })

      const stored = recentDashboardsUtils.getRecent()
      expect(stored[0].id).toBe('2') // Most recent first
      expect(stored[1].id).toBe('1')
    })

    it('moves existing dashboard to the front when added again', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })
      recentDashboardsUtils.addRecent({ id: '2', title: 'Second' })
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toHaveLength(2)
      expect(stored[0].id).toBe('1') // Moved to front
      expect(stored[1].id).toBe('2')
    })

    it('limits list to 5 items', () => {
      for (let i = 1; i <= 10; i++) {
        recentDashboardsUtils.addRecent({ id: `${i}`, title: `Dashboard ${i}` })
      }

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toHaveLength(5)
      expect(stored[0].id).toBe('10') // Most recent
      expect(stored[4].id).toBe('6') // Oldest of the 5
    })

    it('updates lastVisited timestamp', () => {
      const before = new Date().toISOString()
      recentDashboardsUtils.addRecent({ id: '1', title: 'Dashboard' })
      const after = new Date().toISOString()

      const stored = recentDashboardsUtils.getRecent()
      expect(stored[0].lastVisited).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      )
      expect(new Date(stored[0].lastVisited).getTime()).toBeGreaterThanOrEqual(
        new Date(before).getTime()
      )
      expect(new Date(stored[0].lastVisited).getTime()).toBeLessThanOrEqual(
        new Date(after).getTime()
      )
    })

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock setItem to throw error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      recentDashboardsUtils.addRecent({ id: '1', title: 'Dashboard' })

      expect(consoleSpy).toHaveBeenCalled()

      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe('removeRecent', () => {
    it('removes dashboard by id', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })
      recentDashboardsUtils.addRecent({ id: '2', title: 'Second' })

      recentDashboardsUtils.removeRecent('1')

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe('2')
    })

    it('does nothing if id not found', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })

      recentDashboardsUtils.removeRecent('999')

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toHaveLength(1)
    })

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      recentDashboardsUtils.removeRecent('1')

      expect(consoleSpy).toHaveBeenCalled()

      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe('clearRecent', () => {
    it('removes all dashboards', () => {
      recentDashboardsUtils.addRecent({ id: '1', title: 'First' })
      recentDashboardsUtils.addRecent({ id: '2', title: 'Second' })

      recentDashboardsUtils.clearRecent()

      const stored = recentDashboardsUtils.getRecent()
      expect(stored).toEqual([])
    })

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      recentDashboardsUtils.clearRecent()

      expect(consoleSpy).toHaveBeenCalled()

      localStorage.removeItem = originalRemoveItem
      consoleSpy.mockRestore()
    })
  })
})
