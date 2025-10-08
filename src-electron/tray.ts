import { app, ipcMain, Menu, nativeImage, Tray } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
const currentDir = fileURLToPath(new URL('.', import.meta.url));

// quasar dev can't load
let img = nativeImage.createFromPath(path.resolve(currentDir, 'icons/icon.png'))
if (process.env.DEBUGGING) {
    img = img.resize({ width: 4, height: 4 })
}

let tray: Tray
void app.whenReady().then(() => {
    tray = new Tray(img)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                ipcMain.emit('appQuit')
            }
        }
    ])
    tray.setToolTip('ONE-KEY-ASSISTANT')
    tray.setContextMenu(contextMenu)
    // app toggle show/hide when tray is clicked
    tray.on('click', () => {
        ipcMain.emit('toggleWindow')
    })
})