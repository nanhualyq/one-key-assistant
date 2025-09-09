import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { Modal } from 'ant-design-vue'

const app = createApp(App)

app.use(router)
    .mount('#app')

app.config.errorHandler = (err, _instance, _info) => {
    Modal.error({ keyboard: false, content: err + '' })
}

// 同步错误（例如普通函数里 throw）
window.onerror = (message, _source, _lineno, _colno, error) => {
    Modal.error({ keyboard: false, content: error?.stack || message + '' })
}

// 异步错误（未处理的 Promise.reject）
window.onunhandledrejection = (event) => {
    Modal.error({ keyboard: false, content: event.reason + '' })
}
