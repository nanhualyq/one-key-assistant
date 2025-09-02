import { app, ipcMain } from 'electron'
import Store from 'electron-store'

type StoreType = {
    actions: Action[]
}

const store = new Store<StoreType>({
    name: process.env.NODE_ENV === 'development' ? 'config.dev' : 'config'
})

app.whenReady().then(() => {
    ipcMain.handle('electron-store', (_event, arg1, ...args) => {
        return store[arg1](...args)
    })
})


export default store