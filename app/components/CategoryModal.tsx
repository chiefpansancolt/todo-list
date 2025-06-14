import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa'

import { CategoryModalProps } from '@/types/props'
import { Category } from '@/types/todo'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

export function CategoryModal({ isOpen, categories, onClose, onAdd, onUpdate, onDelete }: CategoryModalProps) {
  const { t } = useTranslation()
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState({ name: '', color: '' })

  const handleAdd = () => {
    if (!newCategory.name.trim()) return

    onAdd({
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      color: newCategory.color,
    })

    setNewCategory({ name: '', color: '#3B82F6' })
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingData({ name: category.name, color: category.color })
  }

  const saveEdit = () => {
    if (!editingData.name.trim() || !editingId) return

    onUpdate(editingId, {
      name: editingData.name.trim(),
      color: editingData.color,
    })

    setEditingId(null)
  }

  const isDefaultCategory = (id: string) => {
    return ['personal', 'work', 'urgent'].includes(id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('category.manageCategories')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('category.addNewCategory')}
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={t('category.categoryName')}
                maxLength={20}
              />
              <Input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-12 p-0 cursor-pointer"
              />
              <Button onClick={handleAdd}>{t('actions.add')}</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('category.existingCategories')}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id}>
                  {editingId === category.id ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="color"
                          value={editingData.color}
                          onChange={(e) => setEditingData({ ...editingData, color: e.target.value })}
                          className="w-8 h-8 cursor-pointer p-0"
                        />
                        <Input
                          type="text"
                          value={editingData.name}
                          onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          maxLength={20}
                        />
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          onClick={saveEdit}
                          size="icon"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 transition-colors size-6"
                        >
                          <FaCheck />
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          size="icon"
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 transition-colors size-6"
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDefaultCategory(category.id) && (
                          <span className="text-xs text-gray-400">{t('category.default')}</span>
                        )}
                        <Button
                          onClick={() => startEdit(category)}
                          size="icon"
                          variant="ghost"
                          className="text-blue-500 hover:text-blue-700 transition-colors size-6"
                        >
                          <FaEdit className="text-sm" />
                        </Button>
                        {!isDefaultCategory(category.id) && (
                          <Button
                            onClick={() => onDelete(category.id)}
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 transition-colors size-6"
                          >
                            <FaTrash className="text-sm" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
