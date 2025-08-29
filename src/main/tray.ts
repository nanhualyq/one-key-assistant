import { app, ipcMain, Menu, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'

let tray
app.whenReady().then(() => {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', click: () => { app.quit(); } }
  ]);
  tray.setToolTip('ONE-KEY-ASSISTANT')
  tray.setContextMenu(contextMenu)
  // app toggle show/hide when tray is clicked
  tray.on('click', () => {
    ipcMain.emit('tray-click')
  })
})