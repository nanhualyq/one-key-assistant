import { app, ipcMain } from "electron";
import createWindow from "./actions/createWindow";

void app.whenReady().then(registerIpcMain)

function registerIpcMain() {
    ipcMain.on('createWindow', (_e, options) => void createWindow(options))
}