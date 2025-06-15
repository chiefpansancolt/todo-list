import { promises as fs } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'

import { BrowserWindow, shell, app, protocol, net, Menu, ipcMain } from 'electron'

import { locales, type Locale } from '@/locales'
import appIcon from '@/resources/build/icon.png?asset'

let currentLanguage: Locale = 'en'

async function loadLanguagePreference(): Promise<Locale> {
  try {
    const userDataPath = app.getPath('userData')
    const languageFile = join(userDataPath, 'language.json')
    const data = await fs.readFile(languageFile, 'utf8')
    const { language } = JSON.parse(data)
    return language && locales[language as Locale] ? (language as Locale) : 'en'
  } catch {
    return 'en'
  }
}

async function saveLanguagePreference(language: Locale) {
  try {
    const userDataPath = app.getPath('userData')
    const languageFile = join(userDataPath, 'language.json')
    await fs.writeFile(languageFile, JSON.stringify({ language }, null, 2))
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
}

function createNativeMenu(mainWindow: BrowserWindow) {
  const isMac = process.platform === 'darwin'
  const t = locales[currentLanguage].menu

  const template: any[] = [
    ...(isMac
      ? [
          {
            label: t.title,
            submenu: [
              {
                label: t.about,
                click: () => mainWindow.webContents.send('show-about'),
              },
              { type: 'separator' },
              {
                label: t.hide,
                accelerator: 'Cmd+H',
                role: 'hide',
              },
              { type: 'separator' },
              {
                label: t.quit,
                accelerator: 'Cmd+Q',
                click: () => app.quit(),
              },
            ],
          },
        ]
      : []),
    {
      label: t.file,
      submenu: [
        {
          label: t.newTask,
          accelerator: isMac ? 'Cmd+N' : 'Ctrl+N',
          click: () => mainWindow.webContents.send('focus-new-task'),
        },
        {
          label: t.manageCategories,
          accelerator: isMac ? 'Cmd+T' : 'Ctrl+T',
          click: () => mainWindow.webContents.send('focus-new-category'),
        },
        {
          label: t.deleteMode,
          accelerator: isMac ? 'Cmd+Shift+D' : 'Ctrl+Shift+D',
          click: () => mainWindow.webContents.send('toggle-delete-mode'),
        },
        { type: 'separator' },
        {
          label: t.language,
          submenu: [
            {
              label: `🇺🇸 ${t.english}`,
              type: 'radio',
              checked: currentLanguage === 'en',
              click: () => changeLanguage(mainWindow, 'en'),
            },
            {
              label: `🇪🇸 ${t.spanish}`,
              type: 'radio',
              checked: currentLanguage === 'es',
              click: () => changeLanguage(mainWindow, 'es'),
            },
            {
              label: `🇫🇷 ${t.french}`,
              type: 'radio',
              checked: currentLanguage === 'fr',
              click: () => changeLanguage(mainWindow, 'fr'),
            },
            {
              label: `🇩🇪 ${t.german}`,
              type: 'radio',
              checked: currentLanguage === 'de',
              click: () => changeLanguage(mainWindow, 'de'),
            },
            {
              label: `🇧🇷 ${t.portuguese}`,
              type: 'radio',
              checked: currentLanguage === 'pt',
              click: () => changeLanguage(mainWindow, 'pt'),
            },
            {
              label: `🇯🇵 ${t.japanese}`,
              type: 'radio',
              checked: currentLanguage === 'ja',
              click: () => changeLanguage(mainWindow, 'ja'),
            },
            {
              label: `🇨🇳 ${t.chinese}`,
              type: 'radio',
              checked: currentLanguage === 'zh-CN',
              click: () => changeLanguage(mainWindow, 'zh-CN'),
            },
            {
              label: `🇰🇷 ${t.korean}`,
              type: 'radio',
              checked: currentLanguage === 'ko',
              click: () => changeLanguage(mainWindow, 'ko'),
            },
            {
              label: `🇮🇹 ${t.italian}`,
              type: 'radio',
              checked: currentLanguage === 'it',
              click: () => changeLanguage(mainWindow, 'it'),
            },
            {
              label: `🇳🇱 ${t.dutch}`,
              type: 'radio',
              checked: currentLanguage === 'nl',
              click: () => changeLanguage(mainWindow, 'nl'),
            },
          ],
        },
        { type: 'separator' },
        {
          label: t.import,
          submenu: [
            {
              label: t.importJson,
              accelerator: isMac ? 'Cmd+I' : 'Ctrl+I',
              click: () => mainWindow.webContents.send('import-data'),
            },
          ],
        },
        {
          label: t.export,
          submenu: [
            {
              label: t.exportAsJson,
              accelerator: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',
              click: () => mainWindow.webContents.send('export-json'),
            },
            {
              label: t.exportAsCsv,
              click: () => mainWindow.webContents.send('export-csv'),
            },
          ],
        },
        ...(!isMac
          ? [
              { type: 'separator' },
              {
                label: t.quit,
                accelerator: 'Ctrl+Q',
                click: () => app.quit(),
              },
            ]
          : []),
      ],
    },
    {
      label: t.edit,
      submenu: [
        {
          label: t.undo,
          accelerator: isMac ? 'Cmd+Z' : 'Ctrl+Z',
          role: 'undo',
        },
        {
          label: t.redo,
          accelerator: isMac ? 'Cmd+Shift+Z' : 'Ctrl+Y',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: t.cut,
          accelerator: isMac ? 'Cmd+X' : 'Ctrl+X',
          role: 'cut',
        },
        {
          label: t.copy,
          accelerator: isMac ? 'Cmd+C' : 'Ctrl+C',
          role: 'copy',
        },
        {
          label: t.paste,
          accelerator: isMac ? 'Cmd+V' : 'Ctrl+V',
          role: 'paste',
        },
        {
          label: t.selectAll,
          accelerator: isMac ? 'Cmd+A' : 'Ctrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: t.view,
      submenu: [
        {
          label: t.reload,
          accelerator: isMac ? 'Cmd+R' : 'Ctrl+R',
          role: 'reload',
        },
        {
          label: t.forceReload,
          accelerator: isMac ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
          role: 'forceReload',
        },
        { type: 'separator' },
        {
          label: t.actualSize,
          accelerator: isMac ? 'Cmd+0' : 'Ctrl+0',
          role: 'resetZoom',
        },
        {
          label: t.zoomIn,
          accelerator: isMac ? 'Cmd+Plus' : 'Ctrl+Plus',
          role: 'zoomIn',
        },
        {
          label: t.zoomOut,
          accelerator: isMac ? 'Cmd+-' : 'Ctrl+-',
          role: 'zoomOut',
        },
        { type: 'separator' },
        {
          label: t.toggleFullscreen,
          accelerator: isMac ? 'Ctrl+Cmd+F' : 'F11',
          role: 'togglefullscreen',
        },
        { type: 'separator' },
        {
          label: t.developerTools,
          accelerator: isMac ? 'Cmd+Option+I' : 'Ctrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
    {
      label: t.window,
      submenu: [
        {
          label: t.toggleDarkMode,
          accelerator: isMac ? 'Cmd+D' : 'Ctrl+D',
          click: () => mainWindow.webContents.send('handle-theme-toggle'),
        },
        { type: 'separator' },
        {
          label: t.minimize,
          accelerator: isMac ? 'Cmd+M' : 'Ctrl+M',
          role: 'minimize',
        },
        ...(isMac
          ? [
              {
                label: t.close,
                role: 'close',
              },
              { type: 'separator' },
              {
                label: t.bringAllToFront,
                role: 'front',
              },
            ]
          : [
              {
                label: t.close,
                accelerator: 'Ctrl+W',
                role: 'close',
              },
            ]),
      ],
    },
    {
      label: t.help,
      submenu: [
        {
          label: t.discordCommunity,
          click: () => {
            shell.openExternal('https://discord.gg/pPbe6wquEA')
          },
        },
        {
          label: t.githubRepository,
          click: () => {
            shell.openExternal('https://github.com/chiefpansancolt/todo-list')
          },
        },
        ...(!isMac
          ? [
              {
                label: t.about,
                click: () => {
                  mainWindow.webContents.send('show-about')
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

async function changeLanguage(mainWindow: BrowserWindow, language: Locale) {
  if (!locales[language]) {
    console.error(`Unsupported language: ${language}`)
    return
  }

  currentLanguage = language
  await saveLanguagePreference(language)
  mainWindow.webContents.send('change-language', language)
  createNativeMenu(mainWindow)
}

ipcMain.on('language-initialized', (_, language: string) => {
  if (locales[language as Locale]) {
    currentLanguage = language as Locale
  }
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    createNativeMenu(focusedWindow)
  }
})

export async function createAppWindow(): Promise<void> {
  registerResourcesProtocol()

  currentLanguage = await loadLanguagePreference()

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
    mainWindow.webContents.send('change-language', currentLanguage)
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
