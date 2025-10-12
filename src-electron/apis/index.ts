import { clipboard, ipcRenderer } from "electron"

const sendKeys = new Set(['createWindow', 'resetActionsShortcut', 'openDict', 'dictTabChanged'])
const api = {
  clipboard,
  ipcRenderer: {
    send(key: string, ...args: unknown[]) {
      if (sendKeys.has(key)) {
        return ipcRenderer.send(key, ...args)
      }
    },
    invoke(key: string, ...args: unknown[]) {
      if (['loadSettings', 'saveSettings', 'parseTemplateString'].includes(key)) {
        return ipcRenderer.invoke(key, ...args)
      }
    },
  }
}

export default api
