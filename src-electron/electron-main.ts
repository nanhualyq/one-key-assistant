import { app, dialog, ipcMain, type BrowserWindow } from 'electron';
import os from 'os';
import { APP_URL } from './mainDir';
import createWindow from './main-functions/createWindow';
import './apis/ipc'
import './main-functions/globalShortcuts'
import './main-functions/tray'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

async function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = await createWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    url: APP_URL
  });

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  if (!process.env.DEBUGGING) {
    // 监听窗口的 'close' 事件，而不是 'closed'
    // 'close' 事件在窗口实际关闭之前触发，我们可以阻止它
    mainWindow.on('close', (event) => {
      // 阻止窗口默认的关闭行为（即销毁窗口）
      event.preventDefault()

      // 隐藏窗口
      mainWindow?.hide()
    })
  }
}

ipcMain.on('toggleWindow', () => {
  if (!mainWindow) {
    return
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
})

ipcMain.on('appQuit', () => {
  mainWindow?.destroy()
  app.quit()
})

void app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    void createMainWindow();
  }
});


// main.js
process.on('uncaughtException', (error) => {
  dialog.showErrorBox('Error!', error.stack || error.message);
});

process.on('unhandledRejection', (reason) => {
  dialog.showErrorBox('Error!', String(reason));
});
