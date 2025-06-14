import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain } from 'electron'

import { createAppWindow } from '@/lib/main/app'
import { registerTodoHandlers } from '@/lib/main/todoHandlers'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  registerTodoHandlers()

  const registeredChannels = ['load-tasks', 'save-tasks', 'load-categories', 'save-categories']

  registeredChannels.forEach((channel) => {
    ipcMain.listenerCount(channel)
  })

  createAppWindow()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    if (!app.isPackaged) {
      window.webContents.openDevTools()
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
