import React, { useState, useEffect } from 'react'
import {
  FaPlus,
  FaExclamationTriangle,
  FaTasks,
  FaClipboardList,
  FaChevronRight,
  FaChevronDown,
  FaCheckCircle,
} from 'react-icons/fa'

import { Task } from '@/types/todo'

import { CategoryModal } from '@/components/CategoryModal'
import { ExportModal } from '@/components/ExportModal'
import { TaskItem } from '@/components/TaskItem'
import { TaskModal } from '@/components/TaskModal'
import { useTodoStore } from '@/hooks/useTodoStore'
import { Button } from '@/ui/button'

export function TodoApp() {
  const {
    tasks,
    categories,
    deleteMode,
    selectedForDelete,
    completedCollapsed,
    addTask,
    updateTask,
    toggleTask,
    reorderTasks,
    toggleDeleteMode,
    toggleTaskSelection,
    deleteSelectedTasks,
    toggleCompletedCollapse,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useTodoStore()

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }

    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsDarkMode(customEvent.detail.isDark)
    }

    window.addEventListener('theme-change', handleThemeChange)
    return () => {
      window.removeEventListener('theme-change', handleThemeChange)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteMode) {
          toggleDeleteMode()
        } else if (taskModalOpen) {
          setTaskModalOpen(false)
        } else if (categoryModalOpen) {
          setCategoryModalOpen(false)
        } else if (exportModalOpen) {
          setExportModalOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [deleteMode, taskModalOpen, categoryModalOpen, exportModalOpen, toggleDeleteMode])

  useEffect(() => {
    window.api.receive('focus-new-task', () => {
      setTaskModalOpen(true)
      setEditingTask(null)
    })

    window.api.receive('focus-new-category', () => {
      setCategoryModalOpen(true)
    })

    window.api.receive('export-json', () => {
      setExportModalOpen(true)
    })

    window.api.receive('export-csv', () => {
      setExportModalOpen(true)
    })

    window.api.receive('handle-theme-toggle', () => {
      setIsDarkMode(!isDarkMode)
    })

    window.api.receive('toggle-delete-mode', () => {
      toggleDeleteMode()
    })

    return () => {
      window.api.removeAllListeners('focus-new-task')
      window.api.removeAllListeners('focus-new-category')
      window.api.removeAllListeners('export-json')
      window.api.removeAllListeners('export-csv')
      window.api.removeAllListeners('handle-theme-toggle')
      window.api.removeAllListeners('toggle-delete-mode')
    }
  }, [isDarkMode, toggleDeleteMode])

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskData.text!,
        extraDetails: taskData.extraDetails!,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: taskData.dueDate || null,
        categoryId: taskData.categoryId || null,
        priority: taskData.priority || null,
      }
      addTask(newTask)
    }
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskModalOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50')
    setDraggedTaskId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const draggingOver = e.currentTarget
    if (draggingOver && !draggingOver.classList.contains('opacity-50')) {
      draggingOver.classList.add('border-t-2', 'border-blue-500')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const draggingOver = e.currentTarget
    if (draggingOver) {
      draggingOver.classList.remove('border-t-2', 'border-blue-500')
    }
  }

  const handleDrop = (e: React.DragEvent, dropTaskId: string) => {
    e.preventDefault()
    const dropTarget = e.currentTarget
    dropTarget.classList.remove('border-t-2', 'border-blue-500')

    if (draggedTaskId && draggedTaskId !== dropTaskId) {
      reorderTasks(draggedTaskId, dropTaskId)
    }
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  activeTasks.sort((a, b) => {
    const parseLocalDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const aPastDue = a.dueDate && parseLocalDate(a.dueDate) < today ? 1 : 0
    const bPastDue = b.dueDate && parseLocalDate(b.dueDate) < today ? 1 : 0
    if (aPastDue !== bPastDue) return bPastDue - aPastDue

    const priorityOrder = { high: 1, medium: 2, low: 3, '': 4 }
    const aPriority = priorityOrder[a.priority || ''] || 4
    const bPriority = priorityOrder[b.priority || ''] || 4
    if (aPriority !== bPriority) return aPriority - bPriority

    if (a.dueDate && b.dueDate) {
      const dateDiff = parseLocalDate(a.dueDate).getTime() - parseLocalDate(b.dueDate).getTime()
      if (dateDiff !== 0) return dateDiff
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1

    return 0
  })

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Tasks</h1>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>{activeTasks.length} active</span>, <span>{completedTasks.length} completed</span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setTaskModalOpen(true)
                setEditingTask(null)
              }}
            >
              <FaPlus /> New Task
            </Button>
          </div>

          {deleteMode && (
            <div className="mt-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <span className="text-sm text-red-700 dark:text-red-400 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {selectedForDelete.size} tasks selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedTasks}
                  disabled={selectedForDelete.size === 0}
                >
                  Delete Selected
                </Button>
                <Button onClick={toggleDeleteMode} variant="secondary" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full px-6 py-4 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FaTasks className="text-blue-500" />
              Active Tasks
            </h2>

            <div className="space-y-2">
              {activeTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FaClipboardList className="text-6xl mb-4 mx-auto" />
                  <p className="text-lg">No tasks yet. Click "New Task" to add one!</p>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div key={task.id} className="group">
                    <TaskItem
                      task={task}
                      category={categories.find((c) => c.id === task.categoryId)}
                      isDeleteMode={deleteMode}
                      isSelected={selectedForDelete.has(task.id)}
                      onToggle={() => toggleTask(task.id)}
                      onEdit={() => handleEditTask(task)}
                      onSelect={() => toggleTaskSelection(task.id)}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, task.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <button
                  onClick={toggleCompletedCollapse}
                  className="flex items-center gap-2 w-full text-left hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {completedCollapsed ? <FaChevronRight className="text-sm" /> : <FaChevronDown className="text-sm" />}
                  <FaCheckCircle className="text-green-500" />
                  Completed Tasks ({completedTasks.length})
                </button>
              </h2>

              {!completedCollapsed && (
                <div className="space-y-2 opacity-60">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="group">
                      <TaskItem
                        task={task}
                        category={categories.find((c) => c.id === task.categoryId)}
                        isDeleteMode={deleteMode}
                        isSelected={selectedForDelete.has(task.id)}
                        onToggle={() => toggleTask(task.id)}
                        onEdit={() => handleEditTask(task)}
                        onSelect={() => toggleTaskSelection(task.id)}
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                        onDragOver={() => {}}
                        onDragLeave={() => {}}
                        onDrop={() => {}}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={taskModalOpen}
        task={editingTask}
        categories={categories}
        onClose={() => {
          setTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleTaskSave}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        categories={categories}
        onClose={() => setCategoryModalOpen(false)}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />

      <ExportModal
        isOpen={exportModalOpen}
        tasks={tasks}
        categories={categories}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  )
}
