import { app, globalShortcut, ipcMain } from "electron";
import store from "./settings.js";
import youdao from "./actions/youdao.js";
import actionWindow from "./actionWindow.js";

const targetMap = {
    test: () => console.log('test'),
    youdao,
    gemini: () => actionWindow('gemini'),
    tts: () => actionWindow('tts')
}

app.whenReady().then(() => {
    ipcMain.on('resetActionsShortcut', loadConfigShortcut)
    loadConfigShortcut()
})

app.on('will-quit', () => {
    console.log('will-quit');
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})

function nullTarget() {
    console.log('this is a null target, please check your config.');
}

export function loadConfigShortcut() {
    globalShortcut.unregisterAll()
    store.get('actions').forEach((action) => {
        if (action.shortcut) {
            globalShortcut.register(action.shortcut, targetMap[action.target] || nullTarget)
        }
    })
}