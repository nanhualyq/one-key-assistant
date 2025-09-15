import { createBaseWindow, setWindowUrl } from './mainWindow.js'

export default function (hash: string = ''): void {
  const win = createBaseWindow({
    // frame: false,
    // transparent: true,
    // alwaysOnTop: true,
    skipTaskbar: true
  })
  // win.webContents.openDevTools()
  setWindowUrl(win, hash)
}
