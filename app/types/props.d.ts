import { Category, Task } from '@/types/todo'

export interface CategoryModalProps {
  isOpen: boolean
  categories: Category[]
  onClose: () => void
  onAdd: (category: Category) => void
  onUpdate: (categoryId: string, updates: Partial<Category>) => void
  onDelete: (categoryId: string) => void
}

export interface ExportModalProps {
  isOpen: boolean
  tasks: Task[]
  categories: Category[]
  onClose: () => void
}

export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (tasks: Task[], categories: Category[], shouldOverride?: boolean) => void
}

export interface TaskItemProps {
  task: Task
  category?: Category
  isDeleteMode: boolean
  isSelected: boolean
  onToggle: () => void
  onEdit: () => void
  onSelect: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export interface TaskModalProps {
  isOpen: boolean
  task?: Task | null
  categories: Category[]
  onClose: () => void
  onSave: (taskData: Partial<Task>) => void
}

export interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}
