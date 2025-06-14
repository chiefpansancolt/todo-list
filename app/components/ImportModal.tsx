import React, { useState } from 'react'
import { FaTimes, FaFileImport, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

import { ImportData, ImportResult } from '@/types/import'
import { ImportModalProps } from '@/types/props'
import { Task, Category } from '@/types/todo'

import { Button } from '@/ui/button'

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [generateNewIds, setGenerateNewIds] = useState(true)

  const validateImportData = (data: any): ImportResult => {
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid file format. Expected JSON data.' }
    }

    if (!data.version) {
      return { success: false, message: 'Missing version information in import file.' }
    }

    if (!data.tasks || !Array.isArray(data.tasks)) {
      return { success: false, message: 'Invalid or missing tasks data.' }
    }

    if (!data.categories || !Array.isArray(data.categories)) {
      return { success: false, message: 'Invalid or missing categories data.' }
    }

    return { success: true, message: 'Valid import data' }
  }

  const importV1_0_0 = (data: ImportData): ImportResult => {
    try {
      for (const task of data.tasks) {
        if (!task.id || !task.text || typeof task.completed !== 'boolean') {
          return { success: false, message: 'Invalid task structure in import data.' }
        }
      }

      for (const category of data.categories) {
        if (!category.id || !category.name || !category.color) {
          return { success: false, message: 'Invalid category structure in import data.' }
        }
      }

      let updatedCategories: Category[]
      let updatedTasks: Task[]
      const idMap = new Map<string, string>()

      if (generateNewIds) {
        updatedCategories = data.categories.map((category) => {
          const newId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          idMap.set(category.id, newId)
          return {
            ...category,
            id: newId,
          }
        })

        updatedTasks = data.tasks.map((task) => {
          const newCategoryId =
            task.categoryId && idMap.has(task.categoryId) ? idMap.get(task.categoryId) : task.categoryId

          return {
            ...task,
            id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            categoryId: newCategoryId,
            createdAt: task.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        })
      } else {
        updatedCategories = data.categories.map((category) => ({
          ...category,
          updatedAt: new Date().toISOString(),
        }))

        updatedTasks = data.tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
      }

      const actionText = generateNewIds ? 'imported' : 'imported/updated'
      return {
        success: true,
        message: `Successfully ${actionText} ${updatedTasks.length} tasks and ${updatedCategories.length} categories.`,
        data: {
          tasks: updatedTasks,
          categories: updatedCategories,
          shouldOverride: !generateNewIds,
        },
      }
    } catch (error) {
      return { success: false, message: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
  }

  const processImport = (data: ImportData): ImportResult => {
    const validation = validateImportData(data)
    if (!validation.success) {
      return validation
    }

    switch (data.version) {
      case '1.0.0':
        return importV1_0_0(data)
      default:
        return {
          success: false,
          message: `Unsupported version: ${data.version}. Please update the application to import this file.`,
        }
    }
  }

  const handleFileSelect = async (file: File) => {
    setImporting(true)
    setResult(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const result = processImport(data)

      setResult(result)

      if (result.success && result.data) {
        onImport(result.data.tasks, result.data.categories, result.data.shouldOverride || false)
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Failed to parse file: ${error instanceof Error ? error.message : 'Invalid JSON format'}`,
      })
    } finally {
      setImporting(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileSelect(file)
      } else {
        setResult({ success: false, message: 'Please select a valid JSON file.' })
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const resetModal = () => {
    setResult(null)
    setDragActive(false)
    setImporting(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Import Data</h2>
          <Button onClick={handleClose} variant="ghost" size="icon" className="size-6">
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Import tasks and categories from a previously exported JSON file.
              </p>

              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                  ${importing ? 'opacity-50 pointer-events-none' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FaFileImport className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {importing ? 'Processing...' : 'Drop your JSON file here or click to browse'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports Todo List export files (version 1.0.0 and later)
                </p>

                <input
                  id="file-input"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={importing}
                />
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">Import Options</h4>

                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="generate-new-ids"
                    checked={generateNewIds}
                    onChange={(e) => setGenerateNewIds(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-amber-300 focus:ring-amber-500"
                  />
                  <label htmlFor="generate-new-ids" className="text-sm text-amber-700 dark:text-amber-300">
                    Generate new IDs for imported items
                  </label>
                </div>

                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <li>
                    •{' '}
                    {generateNewIds
                      ? 'All items will get new IDs (safe, no conflicts)'
                      : 'Items keep original IDs (will override existing items with same ID)'}
                  </li>
                  <li>
                    • Categories will be {generateNewIds ? 'imported alongside tasks' : 'merged by ID or added if new'}
                  </li>
                  <li>
                    •{' '}
                    {generateNewIds
                      ? 'Existing data will not be affected'
                      : 'Matching IDs will be updated with imported data'}
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                {result.success ? (
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                ) : (
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                )}
                <div>
                  <h4
                    className={`font-semibold ${
                      result.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                    }`}
                  >
                    {result.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p
                    className={`text-sm ${
                      result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {result.success ? (
                  <Button onClick={handleClose}>Done</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={resetModal}>
                      Try Again
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
