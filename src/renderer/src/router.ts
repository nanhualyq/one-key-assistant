import { createRouter, createWebHashHistory } from 'vue-router'
import ActionPage from './pages/ActionPage.vue'
import GenimiPage from './pages/GenimiPage.vue'

const routes = [
    { path: '/', component: ActionPage },
    { path: '/gemini', component: GenimiPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router