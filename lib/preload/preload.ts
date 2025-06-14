import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

import api from '@/lib/preload/api'

const todoAPI = {
  loadTasks: () => {
    return ipcRenderer.invoke('load-tasks')
  },
  saveTasks: (tasks: any[]) => {
    return ipcRenderer.invoke('save-tasks', tasks)
  },
  loadCategories: () => {
    return ipcRenderer.invoke('load-categories')
  },
  saveCategories: (categories: any[]) => {
    return ipcRenderer.invoke('save-categories', categories)
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('todoAPI', todoAPI)
  } catch (error) {
    console.error('❌ Error exposing APIs:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.todoAPI = todoAPI
}
