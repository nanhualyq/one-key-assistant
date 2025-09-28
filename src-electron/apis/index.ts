import { ipcRenderer } from "electron"

const api = {
    ipcRenderer: {
        send(key: string, ...args: unknown[]) {
            if (['createWindow', 'resetActionsShortcut'].includes(key)) {
                return ipcRenderer.send(key, ...args)
            }
        },
        invoke(key: string, ...args: unknown[]) {
            if (['loadSettings', 'saveSettings', 'replaceTemplate'].includes(key)) {
                return ipcRenderer.invoke(key, ...args)
            }
        },
    }
}

export default api