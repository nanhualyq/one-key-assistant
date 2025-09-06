import icon from '../../resources/icon.png?asset'
import { fileURLToPath } from 'url'
import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

export let mainWindow: BrowserWindow

export function createBaseWindow(options?: Electron.BrowserWindowConstructorOptions) {
    return new BrowserWindow({
        ...options,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
            sandbox: false
        }
    })
}

export function createWindow(): void {
    // Create the browser window.
    mainWindow = createBaseWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
    })
    setWindowUrl(mainWindow, '')
}

export function setWindowUrl(window: BrowserWindow, hash: string) {
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'] + `#/${hash}`)
    } else {
        window.loadFile(fileURLToPath(new URL('../renderer/index.html' + `#/${hash}`, import.meta.url)))
    }
}