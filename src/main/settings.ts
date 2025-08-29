import Store from 'electron-store'

type Action = {
    name: string,
    shortcut?: string,
    target: string
}

type StoreType = {
    actions: Action[]
}

const store = new Store<StoreType>({
    name: process.env.NODE_ENV === 'development' ? 'config.dev' : 'config'
})

store.set('actions', [{ name: 'plugin1' }, { name: 'plugin2' }])

export default store