import { useState, useEffect, useCallback } from 'react'

import { Task, Category, TodoState } from '@/types/todo'

const defaultCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#3B82F6' },
  { id: 'work', name: 'Work', color: '#10B981' },
  { id: 'urgent', name: 'Urgent', color: '#EF4444' },
]

export function useTodoStore() {
  const [state, setState] = useState<TodoState>({
    tasks: [],
    categories: [],
    deleteMode: false,
    selectedForDelete: new Set(),
    completedCollapsed: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      if (!window.todoAPI) {
        console.error('todoAPI is not available on window object')
        setState({
          tasks: [],
          categories: defaultCategories,
          deleteMode: false,
          selectedForDelete: new Set(),
          completedCollapsed: false,
        })
        return
      }

      const [tasks, categories] = await Promise.all([window.todoAPI.loadTasks(), window.todoAPI.loadCategories()])

      const savedCategories = categories.length > 0 ? categories : defaultCategories
      const completedCollapsed = localStorage.getItem('completedCollapsed') === 'true'

      setState({
        tasks,
        categories: savedCategories,
        deleteMode: false,
        selectedForDelete: new Set(),
        completedCollapsed,
      })

      if (categories.length === 0) {
        await window.todoAPI.saveCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setState({
        tasks: [],
        categories: defaultCategories,
        deleteMode: false,
        selectedForDelete: new Set(),
        completedCollapsed: false,
      })
    }
  }

  const saveTasks = useCallback(async (tasks: Task[]) => {
    try {
      if (!window.todoAPI) {
        console.error('todoAPI is not available for saving tasks')
        return
      }

      await window.todoAPI.saveTasks(tasks)
      setState((prev) => ({ ...prev, tasks }))
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }, [])

  const saveCategories = useCallback(async (categories: Category[]) => {
    try {
      if (!window.todoAPI) {
        console.error('todoAPI is not available for saving categories')
        return
      }

      await window.todoAPI.saveCategories(categories)
      setState((prev) => ({ ...prev, categories }))
    } catch (error) {
      console.error('Error saving categories:', error)
    }
  }, [])

  const addTask = useCallback(
    (task: Task) => {
      const newTasks = [...state.tasks, task]
      saveTasks(newTasks)
    },
    [state.tasks, saveTasks]
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      )
      saveTasks(newTasks)
    },
    [state.tasks, saveTasks]
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId)
      saveTasks(newTasks)
    },
    [state.tasks, saveTasks]
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      const task = state.tasks.find((t) => t.id === taskId)
      if (task) {
        updateTask(taskId, {
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
        })
      }
    },
    [state.tasks, updateTask]
  )

  const reorderTasks = useCallback(
    (draggedId: string, droppedId: string) => {
      const draggedIndex = state.tasks.findIndex((t) => t.id === draggedId)
      const droppedIndex = state.tasks.findIndex((t) => t.id === droppedId)

      if (draggedIndex !== -1 && droppedIndex !== -1) {
        const newTasks = [...state.tasks]
        const [draggedTask] = newTasks.splice(draggedIndex, 1)
        newTasks.splice(droppedIndex, 0, draggedTask)
        saveTasks(newTasks)
      }
    },
    [state.tasks, saveTasks]
  )

  const toggleDeleteMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      deleteMode: !prev.deleteMode,
      selectedForDelete: new Set(),
    }))
  }, [])

  const toggleTaskSelection = useCallback((taskId: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedForDelete)
      if (newSelected.has(taskId)) {
        newSelected.delete(taskId)
      } else {
        newSelected.add(taskId)
      }
      return { ...prev, selectedForDelete: newSelected }
    })
  }, [])

  const deleteSelectedTasks = useCallback(() => {
    const newTasks = state.tasks.filter((task) => !state.selectedForDelete.has(task.id))
    saveTasks(newTasks)
    setState((prev) => ({
      ...prev,
      deleteMode: false,
      selectedForDelete: new Set(),
    }))
  }, [state.tasks, state.selectedForDelete, saveTasks])

  const toggleCompletedCollapse = useCallback(() => {
    const newCollapsed = !state.completedCollapsed
    localStorage.setItem('completedCollapsed', String(newCollapsed))
    setState((prev) => ({ ...prev, completedCollapsed: newCollapsed }))
  }, [state.completedCollapsed])

  const addCategory = useCallback(
    (category: Category) => {
      const newCategories = [...state.categories, category]
      saveCategories(newCategories)
    },
    [state.categories, saveCategories]
  )

  const updateCategory = useCallback(
    (categoryId: string, updates: Partial<Category>) => {
      const newCategories = state.categories.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat))
      saveCategories(newCategories)
    },
    [state.categories, saveCategories]
  )

  const deleteCategory = useCallback(
    (categoryId: string) => {
      if (['personal', 'work', 'urgent'].includes(categoryId)) return

      const newCategories = state.categories.filter((cat) => cat.id !== categoryId)

      const newTasks = state.tasks.map((task) =>
        task.categoryId === categoryId ? { ...task, categoryId: null } : task
      )

      saveCategories(newCategories)
      saveTasks(newTasks)
    },
    [state.categories, state.tasks, saveCategories, saveTasks]
  )

  return {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    toggleDeleteMode,
    toggleTaskSelection,
    deleteSelectedTasks,
    toggleCompletedCollapse,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
