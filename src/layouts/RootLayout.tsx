// src/layouts/RootLayout.tsx

import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { buildBoardPath } from '@/router/paths'
import { useCreateDashboardMutation } from '@/features/boards/boards.api'
import toast from 'react-hot-toast'

const RootLayout = () => {
  const navigate = useNavigate()

  // RTK Query mutations
  const [createDashboard, { isLoading: isCreating }] =
    useCreateDashboardMutation()

  // State for board ID input
  const [boardId, setBoardId] = useState('')

  // State for create board modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')

  // Handle load board
  const handleLoadBoard = () => {
    if (boardId.trim()) {
      navigate(buildBoardPath(boardId.trim()))
      setBoardId('') // Clear input after navigation
    }
  }

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadBoard()
    }
  }

  // Handle create board
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return

    try {
      const result = await createDashboard({
        title: newBoardName.trim(),
      }).unwrap()

      // Close modal and reset
      setIsCreateModalOpen(false)
      setNewBoardName('')

      // Show success message
      toast.success(`Board "${result.title}" created successfully!`)

      // Navigate to new board
      navigate(buildBoardPath(result.id))
    } catch (error) {
      console.error('Failed to create board:', error)
      toast.error('Failed to create board. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Board ID Input */}
            <Input
              placeholder="Enter a board ID here..."
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
            />

            {/* Load Button */}
            <Button
              onClick={handleLoadBoard}
              size="lg"
              className="whitespace-nowrap"
            >
              Load
            </Button>

            {/* Create Board Button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="secondary"
              size="lg"
              className="whitespace-nowrap"
            >
              + New Board
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setNewBoardName('')
        }}
        title="Create New Board"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Board Name"
            placeholder="My awesome board"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newBoardName.trim() && !isCreating) {
                handleCreateBoard()
              }
            }}
            fullWidth
            autoFocus
          />

          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setIsCreateModalOpen(false)
                setNewBoardName('')
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={!newBoardName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RootLayout
