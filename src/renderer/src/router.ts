import { createMemoryHistory, createRouter } from 'vue-router'
import ActionPage from './pages/ActionPage.vue'

const routes = [
    { path: '/', component: ActionPage },
    // { path: '/about', component: AboutView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router