export interface Task {
  id: string
  text: string
  extraDetails: string
  completed: boolean
  createdAt: string
  updatedAt?: string
  completedAt?: string | null
  dueDate?: string | null
  categoryId?: string | null
  priority?: 'high' | 'medium' | 'low' | null
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface TodoState {
  tasks: Task[]
  categories: Category[]
  deleteMode: boolean
  selectedForDelete: Set<string>
  completedCollapsed: boolean
}
