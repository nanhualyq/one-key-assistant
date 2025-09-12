import { app, globalShortcut, ipcMain } from "electron";
import store from "./settings.js";
import gemini from "./actions/gemini.js";
import youdao from "./actions/youdao.js";

const targetMap = {
    test: () => console.log('test'),
    youdao,
    gemini
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