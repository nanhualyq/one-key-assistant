import { createRouter, createWebHashHistory } from 'vue-router'
import ActionPage from './pages/ActionPage.vue'
import GenimiPage from './pages/GenimiPage.vue'
import TtsPage from './pages/TtsPage.vue'

const routes = [
    { path: '/', component: ActionPage },
    { path: '/gemini', component: GenimiPage },
    { path: '/tts', component: TtsPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router