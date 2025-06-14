import { ElectronAPI } from '@electron-toolkit/preload'

import type api from './api'
import type { todoAPI } from './todoApi'

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
    todoAPI: typeof todoAPI
  }
}
