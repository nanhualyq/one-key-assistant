import { createBaseWindow, setWindowUrl } from "./mainWindow.js";

export default function (hash: string = '') {
    const win = createBaseWindow({
        frame: false,
        // transparent: true,
        // alwaysOnTop: true,
        skipTaskbar: true,
    })
    // win.webContents.openDevTools()
    setWindowUrl(win, hash)
}