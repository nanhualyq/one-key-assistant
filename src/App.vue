<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, provide, ref, toRaw } from 'vue';

const settings = ref<SettingsJson>()

provide('settings', settings)
provide('saveSettings', saveSettings)

onMounted(loadSettings)
async function loadSettings() {
  settings.value = await window.api.ipcRenderer.invoke('loadSettings')
}
async function saveSettings() {
  await window.api.ipcRenderer.invoke('saveSettings', toRaw(settings.value))
}
</script>
