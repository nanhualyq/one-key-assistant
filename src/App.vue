<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, provide, ref, toRaw } from 'vue';

const settings = ref<SettingsJson>()
const $q = useQuasar()

provide('settings', settings)
provide('saveSettings', saveSettings)

onMounted(loadSettings)
async function loadSettings() {
  settings.value = await window.api.ipcRenderer.invoke('loadSettings')
}
async function saveSettings() {
  await window.api.ipcRenderer.invoke('saveSettings', toRaw(settings.value))
  $q.notify({
    type: 'positive',
    message: 'Settings is saved.'
  })
}
</script>
