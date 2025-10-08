<template>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input v-model="json.apiKey" type="text" label="apiKey" />
        <q-list bordered>
            <q-expansion-item v-for="(chat, index) in json.chats" :key="index" expand-separator icon="chat"
                :label="chat.name">
                <q-input v-model="chat.name" type="text" label="Name" />
                <q-select v-model="chat.model" :options="models" label="model" :rules="[v => !!v || 'required']" />
                <q-input v-model="chat.systemInstruction" type="textarea" label="systemInstruction" />
                <q-toggle v-model="chat.thinkingBudget" label="thinkingBudget" :true-value="-1" :false-value="0" />
                <q-toggle v-model="chat.googleSearch" label="googleSearch" />
            </q-expansion-item>
        </q-list>
        <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            <q-btn icon="add" label="Add Chat" @click="pushChat" />
        </div>
    </q-form>
</template>

<script setup lang="ts">
import { type Gemini } from 'app/src-electron/global';
import { cloneDeep } from 'lodash-es';
import { inject, ref, type Ref } from 'vue';

const settings = inject<Ref<SettingsJson>>('settings')
const saveSettings = inject<() => void>('saveSettings')
const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite']

const DEFAULT_JSON = {
    apiKey: '',
    chats: []
}
const json = ref<Gemini>(DEFAULT_JSON)
onReset()
function onSubmit() {
    if (!settings) return
    settings.value.gemini = json.value
    if (saveSettings) {
        saveSettings()
    }
}
function onReset() {
    json.value = cloneDeep(settings?.value.gemini || DEFAULT_JSON)
}
function pushChat() {
    if (!json.value.chats) {
        json.value.chats = []
    }
    json.value.chats?.push({
        name: `new-chat-${Date.now()}`,
        model: '',
        systemInstruction: '',
        thinkingBudget: 0,
        googleSearch: false
    })
}
</script>