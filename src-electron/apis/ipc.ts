import { app, ipcMain } from "electron";
import createWindow from "../createWindow";
import { loadSettings, saveSettings } from "./settings";
import { replaceTemplate } from "../utils";

void app.whenReady().then(registerIpcMain)

function registerIpcMain() {
    ipcMain.on('createWindow', (_e, options) => void createWindow(options))
    ipcMain.handle('loadSettings', () => loadSettings())
    ipcMain.handle('saveSettings', (_e, str) => saveSettings(str))
    ipcMain.handle('replaceTemplate', (_e, str) => replaceTemplate(str))
}