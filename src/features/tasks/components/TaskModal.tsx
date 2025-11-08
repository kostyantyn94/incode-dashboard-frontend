// src/features/tasks/components/TaskModal.tsx

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/TextArea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

import type { TaskState } from '../tasks.types'
import { TaskPriority, TaskStatus } from '../tasks.types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<TaskState, 'id'> | TaskState) => void
  initialTask?: TaskState | null
  defaultStatus?: TaskStatus
}

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  initialTask = null,
  defaultStatus = TaskStatus.TODO,
}: TaskModalProps) => {
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)

  // Validation errors
  const [errors, setErrors] = useState<{
    title?: string
    dueDate?: string
  }>({})

  // Priority options for Select
  const priorityOptions = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
  ]

  // Status options for Select
  const statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.DONE, label: 'Done' },
  ]

  // Initialize form with initial task data (for edit mode)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title)
      setDescription(initialTask.description)
      setPriority(initialTask.priority)
      setDueDate(initialTask.dueDate)
      setStatus(initialTask.status)
    } else {
      // Reset form for create mode
      setTitle('')
      setDescription('')
      setPriority(TaskPriority.MEDIUM)
      setDueDate('')
      setStatus(defaultStatus)
    }
    setErrors({})
  }, [initialTask, defaultStatus, isOpen])

  // Validate form
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = () => {
    if (!validate()) {
      return
    }

    const taskData = {
      ...(initialTask?.id && { id: initialTask.id }),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status,
    }

    onSave(taskData as TaskState)
    handleClose()
  }

  // Handle close
  const handleClose = () => {
    setTitle('')
    setDescription('')
    setPriority(TaskPriority.MEDIUM)
    setDueDate('')
    setStatus(defaultStatus)
    setErrors({})
    onClose()
  }

  const isEditMode = !!initialTask

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          fullWidth
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          resize="none"
          fullWidth
        />

        {/* Priority and Due Date in row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            fullWidth
          />

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            fullWidth
          />
        </div>

        {/* Status (only in edit mode) */}
        {isEditMode && (
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            fullWidth
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TaskModal
