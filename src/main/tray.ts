const { app, Menu, Tray } = require('electron')
import icon from '../../resources/icon.png?asset'

let tray
app.whenReady().then(() => {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Item1', type: 'radio' },
    // { label: 'Item2', type: 'radio' },
    // { label: 'Item3', type: 'radio', checked: true },
    // { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('ONE-KEY-ASSISTANT')
  tray.setContextMenu(contextMenu)
})