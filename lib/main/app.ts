import { join } from 'path'
import { pathToFileURL } from 'url'

import { BrowserWindow, shell, app, protocol, net, Menu } from 'electron'

import appIcon from '@/resources/build/icon.png?asset'

function createNativeMenu(mainWindow: BrowserWindow) {
  const isMac = process.platform === 'darwin'

  const template: any[] = [
    ...(isMac
      ? [
          {
            label: 'Todo List',
            submenu: [
              {
                label: 'About Todo List',
                click: () => {
                  // You could show an about dialog here
                },
              },
              { type: 'separator' },
              {
                label: 'Quit',
                accelerator: 'Cmd+Q',
                click: () => app.quit(),
              },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: isMac ? 'Cmd+N' : 'Ctrl+N',
          click: () => {
            mainWindow.webContents.send('focus-new-task')
          },
        },
        {
          label: 'Manage Categories',
          accelerator: isMac ? 'Cmd+T' : 'Ctrl+T',
          click: () => {
            mainWindow.webContents.send('focus-new-category')
          },
        },
        {
          label: 'Delete Mode',
          accelerator: isMac ? 'Cmd+Shift+D' : 'Ctrl+Shift+D',
          click: () => {
            mainWindow.webContents.send('toggle-delete-mode')
          },
        },
        { type: 'separator' },
        {
          label: 'Export as JSON',
          accelerator: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',
          click: () => {
            mainWindow.webContents.send('export-json')
          },
        },
        {
          label: 'Export as CSV',
          click: () => {
            mainWindow.webContents.send('export-csv')
          },
        },
        ...(!isMac
          ? [
              { type: 'separator' },
              {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click: () => app.quit(),
              },
            ]
          : []),
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: isMac ? 'Cmd+Z' : 'Ctrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: isMac ? 'Cmd+Shift+Z' : 'Ctrl+Y',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: isMac ? 'Cmd+X' : 'Ctrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: isMac ? 'Cmd+C' : 'Ctrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: isMac ? 'Cmd+V' : 'Ctrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: isMac ? 'Cmd+A' : 'Ctrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: isMac ? 'Cmd+R' : 'Ctrl+R',
          role: 'reload',
        },
        {
          label: 'Force Reload',
          accelerator: isMac ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
          role: 'forceReload',
        },
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: isMac ? 'Cmd+0' : 'Ctrl+0',
          role: 'resetZoom',
        },
        {
          label: 'Zoom In',
          accelerator: isMac ? 'Cmd+Plus' : 'Ctrl+Plus',
          role: 'zoomIn',
        },
        {
          label: 'Zoom Out',
          accelerator: isMac ? 'Cmd+-' : 'Ctrl+-',
          role: 'zoomOut',
        },
        { type: 'separator' },
        {
          label: 'Toggle Fullscreen',
          accelerator: isMac ? 'Ctrl+Cmd+F' : 'F11',
          role: 'togglefullscreen',
        },
        { type: 'separator' },
        {
          label: 'Developer Tools',
          accelerator: isMac ? 'Cmd+Option+I' : 'Ctrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Toggle Dark Mode',
          accelerator: isMac ? 'Cmd+D' : 'Ctrl+D',
          click: () => {
            mainWindow.webContents.send('handle-theme-toggle')
          },
        },
        { type: 'separator' },
        {
          label: 'Minimize',
          accelerator: isMac ? 'Cmd+M' : 'Ctrl+M',
          role: 'minimize',
        },
        ...(isMac
          ? [{ role: 'close' }]
          : [
              {
                label: 'Close',
                accelerator: 'Ctrl+W',
                role: 'close',
              },
            ]),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Discord Community',
          click: () => {
            shell.openExternal('https://discord.gg/pPbe6wquEA')
          },
        },
        {
          label: 'GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/chiefpansancolt/todo-list')
          },
        },
        ...(!isMac
          ? [
              {
                label: 'About Todo List',
                click: () => {
                  // You could show an about dialog here
                },
              },
            ]
          : []),
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

export function createAppWindow(): void {
  registerResourcesProtocol()

  const mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    minWidth: 450,
    minHeight: 650,
    show: true,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: true,
    title: 'Todo List',
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  createNativeMenu(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerResourcesProtocol() {
  protocol.handle('res', async (request) => {
    try {
      const url = new URL(request.url)
      const fullPath = join(url.hostname, url.pathname.slice(1))
      const filePath = join(__dirname, '../../resources', fullPath)
      return net.fetch(pathToFileURL(filePath).toString())
    } catch (error) {
      console.error('Protocol error:', error)
      return new Response('Resource not found', { status: 404 })
    }
  })
}
