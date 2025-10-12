import { defineBoot } from '#q-app/wrappers'
import { Dialog } from 'quasar'

const showError = (err: unknown) => Dialog.create({
  class: 'dangous',
  persistent: true,
  title: 'Error!',
  message: String(err)
})
export default defineBoot(({ app }) => {
  app.config.errorHandler = showError
  window.addEventListener('error', (event) => {
    showError(event.error || event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    showError(event.reason)
  })
})
