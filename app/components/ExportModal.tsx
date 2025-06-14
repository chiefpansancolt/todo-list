import React from 'react'
import { FaTimes, FaFileCode, FaFileCsv } from 'react-icons/fa'

import { ExportModalProps } from '@/types/props'

import { Button } from '@/ui/button'

export function ExportModal({ isOpen, tasks, categories, onClose }: ExportModalProps) {
  const getDateString = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  const exportJSON = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tasks,
      categories,
      stats: {
        totalTasks: tasks.length,
        activeTasks: tasks.filter((t) => !t.completed).length,
        completedTasks: tasks.filter((t) => t.completed).length,
      },
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    downloadFile(blob, `todo-backup-${getDateString()}.json`)
    onClose()
  }

  const exportCSV = () => {
    const headers = ['Task', 'Status', 'Priority', 'Category', 'Due Date', 'Created Date', 'Completed Date']

    const rows = tasks.map((task) => {
      const category = categories.find((c) => c.id === task.categoryId)
      return [
        escapeCSV(task.text),
        task.completed ? 'Completed' : 'Active',
        task.priority || '',
        category ? escapeCSV(category.name) : '',
        task.dueDate || '',
        new Date(task.createdAt).toLocaleDateString(),
        task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '',
      ]
    })

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadFile(blob, `todo-tasks-${getDateString()}.csv`)
    onClose()
  }

  const downloadFile = (blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const escapeCSV = (str: string) => {
    if (!str) return ''
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Export Data</h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="size-6">
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Choose a format to export your tasks and categories.</p>

          <div className="space-y-3">
            <button
              onClick={exportJSON}
              className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center">
                <FaFileCode className="text-blue-600 dark:text-blue-400 text-2xl mr-4" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">JSON Format</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Complete backup with all task details</p>
                </div>
              </div>
            </button>

            <button
              onClick={exportCSV}
              className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center">
                <FaFileCsv className="text-green-600 dark:text-green-400 text-2xl mr-4" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">CSV Format</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Spreadsheet compatible for analysis</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
