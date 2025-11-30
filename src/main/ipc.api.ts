import { globalShortcut, ipcMain } from 'electron'
import { loadSettings, saveSettings } from './settings'

function isRegistered(key: string): boolean {
  if (globalShortcut.register(key, () => {})) {
    globalShortcut.unregister(key)
    return false
  }
  return true
}

const mainMap = {
  'settings.get': loadSettings,
  'settings.set': saveSettings,
  'globalShortcut.isRegistered': isRegistered
}

ipcMain.handle('main', (_e, action, ...rest) => {
  return mainMap[action](...rest)
})
