import { defineBoot } from '#q-app/wrappers'
import { Dialog } from 'quasar'

const showError = (err: unknown) => {
  Dialog.create({
    class: 'dangous',
    persistent: true,
    title: 'Error!',
    message: String(err)
  })
}
export default defineBoot(({ app }) => {
  app.config.errorHandler = showError
  window.addEventListener('error', (event, ...rest) => {
    console.error(event, rest);
    // q-page 第一次出现滚动条的时候会报这个错，但是gemini聊天就是会超出视图区域，只能先跳过，避免频繁的显示错误对话框
    if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
      return
    }
    showError(event.error || event.message)
  })
  window.addEventListener('unhandledrejection', (event, ...rest) => {
    console.error(event, ...rest);
    showError(event.reason)
  })
})
