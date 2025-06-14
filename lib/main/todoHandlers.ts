import { promises as fs } from 'fs'
import { join } from 'path'

import { ipcMain, app } from 'electron'

const userDataPath = app.getPath('userData')
const tasksFile = join(userDataPath, 'tasks.json')
const categoriesFile = join(userDataPath, 'categories.json')

export function registerTodoHandlers() {
  ipcMain.handle('load-tasks', async () => {
    try {
      const data = await fs.readFile(tasksFile, 'utf8')
      return JSON.parse(data)
    } catch (e) {
      console.error('Error loading tasks: ', e)
      return []
    }
  })

  ipcMain.handle('save-tasks', async (_, tasks) => {
    try {
      await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2))
      return { success: true }
    } catch (e) {
      console.error('Error saving tasks:', e)
      return { success: false, error: e instanceof Error ? e.message : String(e) }
    }
  })

  ipcMain.handle('load-categories', async () => {
    try {
      const data = await fs.readFile(categoriesFile, 'utf8')
      return JSON.parse(data)
    } catch (e) {
      console.error('Error loading categories', e)
      return []
    }
  })

  ipcMain.handle('save-categories', async (_, categories) => {
    try {
      await fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2))
      return { success: true }
    } catch (e) {
      console.error('Error saving categories:', e)
      return { success: false, error: e instanceof Error ? e.message : String(e) }
    }
  })
}
