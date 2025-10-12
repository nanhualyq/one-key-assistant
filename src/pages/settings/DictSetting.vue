<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-list bordered separator v-if="json">
      <q-item v-for="(item, i) in json" :key="i">
        <q-item-section>
          <q-input v-model="item.name" type="text" label="Name" :rules="[v => !!v || 'required']" />
          <q-input v-model="item.url" type="text" label="Url" :rules="[v => !!v || 'required']" />
          <div class="row q-gutter-md">
            <q-btn icon="arrow_circle_up" label="Up" @click="swapIndex(i, -1)" :disable="i === 0" />
            <q-btn icon="arrow_circle_down" label="Down" @click="swapIndex(i, 1)" :disable="i === json.length - 1" />
            <q-btn color="negative" icon="delete" label="Delete" @click="json?.splice(i, 1)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row q-gutter-md">
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      <q-btn icon="add" label="Add Dict" @click="json?.push({ name: '', url: '' })" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { useSettingsStore } from 'src/stores/settings';
import { computed, ref } from 'vue';

const store = useSettingsStore()
const settings = computed(() => store.json)

const json = ref<typeof settings.value.dict>([])

onReset()
function onSubmit() {
  settings.value.dict = json.value || []
  void store.saveSettings()
}
function onReset() {
  json.value = cloneDeep(settings.value.dict || [])
}
function swapIndex(index: number, offset: number) {
  const newIndex = index + offset
  if (json.value && newIndex >= 0 && newIndex < json.value.length) {
    const temp = json.value[index]
    json.value[index] = json.value[newIndex]!
    json.value[newIndex] = temp!
  }
}
</script>
