import Store from 'electron-store'

type StoreType = {
    plugins: string[]
}

const store = new Store<StoreType>({
    name: process.env.NODE_ENV === 'development' ? 'config.dev' : 'config'
})

store.set('plugins', ['plugin1', 'plugin2'])

export default store