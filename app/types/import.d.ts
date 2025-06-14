export interface ImportData {
  version: string
  exportDate: string
  tasks: Task[]
  categories: Category[]
  stats?: {
		totalTasks: number
		activeTasks: number
		completedTasks: number
  }
}

export interface ImportResult {
  success: boolean
  message: string
  data?: {
    tasks: Task[]
    categories: Category[]
    shouldOverride?: boolean
  }
}
