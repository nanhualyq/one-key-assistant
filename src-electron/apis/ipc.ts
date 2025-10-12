import { app, ipcMain } from "electron";
import createWindow from "../main-functions/createWindow";
import { loadSettings, saveSettings } from "./settings";
import { parseTemplateString } from "../main-functions/utils";
import DictTabsWindow from "../actions/dict";

void app.whenReady().then(registerIpcMain)

function registerIpcMain() {
  ipcMain.on('createWindow', (_e, options) => void createWindow(options))
  ipcMain.on('openDict', (_e, options) => new DictTabsWindow(options))
  ipcMain.on('dictTabChanged', (_e, index) => ipcMain.emit('onDictShow', _e, index))
  ipcMain.handle('loadSettings', () => loadSettings())
  ipcMain.handle('saveSettings', (_e, str) => saveSettings(str))
  ipcMain.handle('parseTemplateString', (_e, str) => parseTemplateString(str))
}
