import { BrowserWindow } from "electron";
import path from "path";
import { mainDir } from "../mainDir";
import { replaceTemplate } from "./utils";

type Options = Electron.BrowserWindowConstructorOptions & {
  url?: string,
  headers?: Electron.LoadURLOptions
}

export const APP_URL = process.env.DEV ? process.env.APP_URL : `file://${mainDir}/index.html`

export default async function (options: Options) {
  options.webPreferences = {
    contextIsolation: true,
    // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
    preload: path.resolve(
      mainDir,
      path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
    ),
  }
  options.icon = path.resolve(mainDir, 'icons/icon.png') // tray icon
  const win = new BrowserWindow(options)
  if (options.url) {
    const url = replaceTemplate(options.url)
    await win.loadURL(url, options.headers)
  }
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    win.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    win.webContents.on('devtools-opened', () => {
      win?.webContents.closeDevTools();
    });
  }
  return win
}
