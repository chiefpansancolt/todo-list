import { format } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { LuCalendar } from 'react-icons/lu'

import { TaskModalProps } from '@/types/props'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'


export function TaskModal({ isOpen, task, categories, onClose, onSave }: TaskModalProps) {
  const [showSelect, setShowSelect] = useState(false)
  const [formData, setFormData] = useState<{
    text: string
    extraDetails: string
    priority: 'high' | 'medium' | 'low' | null
    categoryId: string | null
    dueDate: string | null
  }>({
    text: '',
    extraDetails: '',
    priority: null,
    categoryId: null,
    dueDate: null,
  })

  const parseDateString = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  useEffect(() => {
    if (task) {
      setFormData({
        text: task.text,
        extraDetails: task.extraDetails,
        priority: task.priority || null,
        categoryId: task.categoryId || null,
        dueDate: task.dueDate || null,
      })
      setTimeout(() => setShowSelect(true), 50)
    } else {
      setFormData({
        text: '',
        extraDetails: '',
        priority: null,
        categoryId: null,
        dueDate: null,
      })
      setShowSelect(true)
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.text.trim()) return

    onSave({
      text: formData.text.trim(),
      extraDetails: formData.extraDetails.trim(),
      priority: formData.priority,
      categoryId: formData.categoryId,
      dueDate: formData.dueDate,
    })

    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setShowSelect(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{task ? 'Edit Task' : 'New Task'}</h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="size-6">
            <FaTimes />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="text" className="mb-2">
                Task
              </Label>
              <Input
                type="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enter task description"
                autoFocus
                required
              />
            </div>

            <div>
              <Label className="mb-2">Extra Details</Label>
              <Textarea
                value={formData.extraDetails}
                onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
                placeholder="Enter extra details"
              />
            </div>

            {showSelect && (
              <div>
                <Label className="mb-2">Priority</Label>
                <Select
                  value={formData.priority ?? 'none'}
                  onValueChange={(value) => {
                    const priority = value === 'none' ? null : (value as 'high' | 'medium' | 'low')
                    setFormData({ ...formData, priority })
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showSelect && (
              <div>
                <Label className="mb-2">Category</Label>
                <Select
                  defaultValue={formData.categoryId ?? 'none'}
                  onValueChange={(value) => {
                    const categoryId = value === 'none' ? null : value
                    setFormData({ ...formData, categoryId })
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="mb-2">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'w-full inline-flex items-center justify-start cursor-pointer p-1',
                      'selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
                    )}
                  >
                    <LuCalendar className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(parseDateString(formData.dueDate)!, 'PPP') : <span>Pick a date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDateString(formData.dueDate)}
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        setFormData({ ...formData, dueDate: `${year}-${month}-${day}` })
                      } else {
                        setFormData({ ...formData, dueDate: null })
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
