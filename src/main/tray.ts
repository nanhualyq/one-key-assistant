import { app, Menu, nativeImage, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'
import { mainWindow } from './mainWindow.js'
import store from './settings.js'

let img = nativeImage.createFromPath(icon)
if (process.env.NODE_ENV === 'development') {
  img = img.resize({ width: 4, height: 4 })
}

let tray: Tray
app.whenReady().then(() => {
  tray = new Tray(img)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        store.openInEditor()
      }
    },
    {
      label: 'Restart',
      click: () => {
        app.relaunch()
        app.exit()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('ONE-KEY-ASSISTANT')
  tray.setContextMenu(contextMenu)
  // app toggle show/hide when tray is clicked
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
})
