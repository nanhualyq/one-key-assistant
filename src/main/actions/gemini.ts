import { createBaseWindow, setWindowUrl } from "../mainWindow.js";

export default function () {
    const win = createBaseWindow({
        frame: false,
        // transparent: true,
        // alwaysOnTop: true,
        skipTaskbar: true,
    })
    // win.webContents.openDevTools()
    setWindowUrl(win, 'gemini')
}