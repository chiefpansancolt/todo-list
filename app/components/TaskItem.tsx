import React from 'react'
import { FaArrowUp, FaArrowDown, FaCalendarAlt, FaEdit, FaInfoCircle } from 'react-icons/fa'

import { TaskItemProps } from '@/types/props'

import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

export function TaskItem({
  task,
  category,
  isDeleteMode,
  isSelected,
  onToggle,
  onEdit,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: TaskItemProps) {
  const isPastDue = () => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [year, month, day] = task.dueDate.split('-').map(Number)
    const dueDate = new Date(year, month - 1, day)
    return dueDate < today
  }

  const formatDueDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPriorityIcon = () => {
    if (!task.priority) return null
    switch (task.priority) {
      case 'high':
        return <FaArrowUp className="text-red-500" title="High priority" />
      case 'medium':
        return <FaArrowUp className="text-yellow-500" title="Medium priority" />
      case 'low':
        return <FaArrowDown className="text-blue-500" title="Low priority" />
    }
  }

  const handleClick = () => {
    if (isDeleteMode && !task.completed) {
      onSelect()
    }
  }

  return (
    <div
      className={cn(
        'task-item flex items-center p-3 rounded-lg shadow-sm transition-all duration-200 relative overflow-hidden',
        task.completed ? 'opacity-75 bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900',
        !task.completed && !isDeleteMode && 'hover:shadow-md cursor-move',
        isSelected && 'selected-for-delete',
        category && !task.completed && 'task-with-category'
      )}
      draggable={!task.completed && !isDeleteMode}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      style={{
        backgroundColor: category && !task.completed ? `${category.color}08` : undefined,
      }}
    >
      {category && !task.completed && (
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: category.color }} />
      )}

      {!isDeleteMode && (
        <Input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
        />
      )}

      <div className="flex-1 flex flex-col gap-1">
        <span
          className={cn(
            task.completed && 'line-through text-gray-500',
            !task.completed && 'text-gray-800 dark:text-gray-200'
          )}
        >
          {task.text}
        </span>

        <div className="flex items-center gap-3 text-sm">
          {getPriorityIcon()}

          {category && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}

          {task.dueDate && (
            <span
              className={cn(
                isPastDue() && 'text-red-500 font-semibold animate-pulse',
                !isPastDue() && 'text-gray-500',
                'flex items-center gap-1'
              )}
            >
              <FaCalendarAlt />
              {formatDueDate(task.dueDate)}
            </span>
          )}

          {task.extraDetails && task.extraDetails.trim() && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:text-blue-700 transition-colors size-5 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaInfoCircle className="text-sm" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Extra Details</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.extraDetails}</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {!isDeleteMode && !task.completed && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100 size-6"
        >
          <FaEdit />
        </Button>
      )}
    </div>
  )
}
