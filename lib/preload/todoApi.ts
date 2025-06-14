export const todoAPI = {
  loadTasks: () => window.api.invoke('load-tasks'),
  saveTasks: (tasks: any[]) => window.api.invoke('save-tasks', tasks),
  loadCategories: () => window.api.invoke('load-categories'),
  saveCategories: (categories: any[]) => window.api.invoke('save-categories', categories),
}
