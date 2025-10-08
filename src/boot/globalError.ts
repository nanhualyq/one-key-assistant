import { defineBoot } from '#q-app/wrappers'
import { Dialog } from 'quasar'
export default defineBoot(({ app }) => {
    app.config.errorHandler = err => Dialog.create({
        class: 'dangous',
        persistent: true,
        title: 'Error!',
        message: String(err)
    })
})