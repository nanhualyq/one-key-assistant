import { app, globalShortcut, ipcMain } from 'electron'
import { loadSettings } from '../apis/settings.js'
import { type Action } from '../global.js'

void app.whenReady().then(() => {
  ipcMain.on('resetActionsShortcut', loadConfigShortcut)
  loadConfigShortcut()
})

app.on('will-quit', () => {
  console.log('will-quit')
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

function nullTarget(): void {
  console.log('this is a null target, please check your config.')
}

function callback(action: Action) {
  if (!action.function) {
    nullTarget()
  }
  ipcMain.emit(action.function, {}, action.params)
}

export function loadConfigShortcut(): void {
  globalShortcut.unregisterAll()
  const settings = loadSettings()
  settings.actions?.forEach((action) => {
    if (action.shortcut) {
      globalShortcut.register(action.shortcut, () => callback(action))
    }
  })
}
