<template>
  <q-page>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn label="Save" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        <q-btn label="Add Action" icon="add" @click="addAction" />
      </div>
      <q-list>
        <q-expansion-item v-for="(action, index) in actions" :key="index" :label="action.name">
          <q-input v-model="action.name" type="text" label="name" />
          <q-input v-model="action.shortcut" type="text" label="shortcut" />
          <q-input v-model="action.function" type="text" label="function" />
          <JsonEditor :model-value="action.params" @update:model-value="actions[index]!.params = $event"
            label="params" />
          <q-btn icon="play" label="Test" @click="testAction(action)" />
          <q-btn icon="delete" label="Delete" @click="actions.splice(index, 1)" />
          <q-btn icon="up" label="Up" @click="swapIndex(index, -1)" :disable="index === 0" />
          <q-btn icon="down" label="Down" @click="swapIndex(index, +1)" :disable="index === actions.length - 1" />
        </q-expansion-item>
      </q-list>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { type Action } from 'app/src-electron/global'
import { cloneDeep } from 'lodash-es'
import JsonEditor from 'src/components/JsonEditor.vue'
import { inject, type Ref, ref, toRaw } from 'vue'

const settings = inject<Ref<SettingsJson>>('settings')

const actions = ref<Action[]>([])
onReset()
const saveSettings = inject<() => void>('saveSettings')

function testAction(action: Action) {
  window.api.ipcRenderer.send(action.function, toRaw(action.params))
}
function onSubmit() {
  if (!settings) return
  settings.value.actions = actions.value
  if (saveSettings) {
    saveSettings()
  }
}
function onReset() {
  actions.value = cloneDeep(settings?.value.actions) || []
}

function addAction() {
  actions.value.push({
    name: `new-${Date.now()}`,
    function: 'createWindow'
  })
}
function swapIndex(index: number, offset: number) {
  const newIndex = index + offset
  if (newIndex >= 0 && newIndex < actions.value.length) {
    const temp = actions.value[index] as Action
    actions.value[index] = actions.value[newIndex] as Action
    actions.value[newIndex] = temp
  }
}
</script>
