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
import { inject, ref, type Ref } from 'vue';

const settings = inject<Ref<SettingsJson>>('settings')
const saveSettings = inject<() => void>('saveSettings')

const DEFAULT_JSON = {
    kokoroApi: 'http://localhost:8880'
}
const json = ref<Tts>(DEFAULT_JSON)
onReset()
function onSubmit() {
    if (!settings) return
    settings.value.tts = json.value
    if (saveSettings) {
        saveSettings()
    }
}
function onReset() {
    json.value = cloneDeep(settings?.value.tts || DEFAULT_JSON)
}
</script>