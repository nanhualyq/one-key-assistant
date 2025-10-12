import { defineBoot } from '#q-app/wrappers'
import { useSettingsStore } from 'src/stores/settings'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async (/* { app, router, ... } */) => {
  const store = useSettingsStore()
  await store.loadSettings()
})
