<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input v-model="json.kokoroApi" type="text" label="kokoroApi" />
    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { type Tts } from 'app/src-electron/global';
import { cloneDeep } from 'lodash-es';
import { useSettingsStore } from 'src/stores/settings';
import { computed, ref } from 'vue';

const store = useSettingsStore()
const settings = computed(() => store.json)

const DEFAULT_JSON = {
  kokoroApi: 'http://localhost:8880'
}
const json = ref<Tts>(DEFAULT_JSON)
onReset()
function onSubmit() {
  settings.value.tts = json.value
  void store.saveSettings()
}
function onReset() {
  json.value = cloneDeep(settings?.value.tts || DEFAULT_JSON)
}
</script>
