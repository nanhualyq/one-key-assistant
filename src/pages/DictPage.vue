<template>
  <q-tabs v-model="tab" dense>
    <q-tab v-for="(item, index) in settings.dict" :key="item.name" :name="index" :label="item.name" />
  </q-tabs>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings';
import { computed, ref, watch } from 'vue';

const store = useSettingsStore()
const settings = computed(() => store.json)
const tab = ref(0)
watch(tab, () => {
  window.api.ipcRenderer.send('dictTabChanged', tab.value)
}, {
  immediate: true
})
</script>
