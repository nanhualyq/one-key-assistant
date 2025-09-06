import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

const app = createApp(App)

app.use(router)
    .mount('#app')

app.config.errorHandler = (err, _instance, _info) => {
    // handle error, e.g. report to a service
    alert(err)
}