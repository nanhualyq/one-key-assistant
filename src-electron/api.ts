import { ipcRenderer } from "electron"

const api = {
    ipcRenderer: {
        send(key: string, ...args: unknown[]) {
            if (['createWindow'].includes(key)) {
                return ipcRenderer.send(key, ...args)
            }
        }
    }
}

export default api