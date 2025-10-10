import { app, ipcMain, Menu, nativeImage, Tray } from 'electron'
import path from 'path';
import { mainDir } from '../mainDir';

let tray: Tray
void app.whenReady().then(() => {
  const img = nativeImage.createFromPath(path.resolve(mainDir, 'icons/icon.png'))
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
