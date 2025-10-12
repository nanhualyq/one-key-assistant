<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <p class="line" v-for="(text, i) in readTextList" :key="i" :class="{ highlight: i === index }"
          @click="playIndex(i)">
          {{ text }}
        </p>
      </q-page>
    </q-page-container>
    <q-footer elevated bordered class="row q-gutter-sm bg-white">
      <audio :src="audioSrc" controls @ended="onPlayed" autoplay></audio>
      <q-btn color="primary" icon="input" label="Input" @click="showInput = true" />
      <q-select v-model="voice" :options="voices" label="voice" />
    </q-footer>
  </q-layout>
  <q-dialog v-model="showInput" persistent>
    <q-card>
      <q-card-section>
        <q-input v-model="inputText" type="textarea" autofocus />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Input" color="primary" @click="handleInputText" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSettingsStore } from "src/stores/settings";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const audioSrc = ref('')
const voice = ref('zf_xiaoxiao')
let voices = reactive([])
const showInput = ref(false)
const inputText = ref('')
const readTextList = ref<string[]>([])
const index = ref(-1)
const store = useSettingsStore()
const settings = computed(() => store.json)
const route = useRoute()

onMounted(() => {
  void getVoices()
  void handleUrlQuery()
})

function fetchKokoroTts(url: string, options?: RequestInit) {
  if (options && options.method === 'POST') {
    options.headers = {
      ...options.headers,
      'content-type': 'application/json'
    }
  }
  const api = settings?.value.tts?.kokoroApi || 'http://localhost:8880'
  return fetch(`${api.replace(/\/$/, '')}${url}`, options)
}

async function play(input: string) {
  audioSrc.value = await fetchKokoroTts('/v1/audio/speech', {
    method: 'POST',
    body: JSON.stringify({
      input,
      voice: voice.value
    })
  })
    .then(r => r.blob())
    .then(blob => URL.createObjectURL(blob))
}
function onPlayed() {
  playIndex(index.value + 1)
}

async function getVoices() {
  voices = await fetchKokoroTts('/v1/audio/voices')
    .then(r => r.json())
    .then(j => j.voices)
}
function handleInputText() {
  showInput.value = false
  startText(inputText.value)
  inputText.value = ''
}
function startText(input: string) {
  readTextList.value = input.split('\n')
    .filter(s => s.trim())
  playIndex(0)
}
function playIndex(i: number) {
  URL.revokeObjectURL(audioSrc.value)
  audioSrc.value = ''
  index.value = i
  if (!readTextList.value[i]) {
    return
  }
  void play(readTextList.value[i])
}
function scrollToHighlight() {
  void nextTick(() => {
    const el = document.querySelector('.highlight')
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'center'     // 滚动到视口中间
      })
    }
  })
}
watch(index, () => {
  scrollToHighlight()
})
async function handleUrlQuery() {
  const { input_selection_text } = route.query
  if (input_selection_text) {
    const text = await window.api.ipcRenderer.invoke('parseTemplateString', '${SELECTION_TEXT}')
    startText(text)
  }
}
</script>

<style scoped lang="scss">
.highlight {
  color: darkblue;
  font-weight: bold;
}

.line {
  cursor: pointer;
  margin: 4px;
}
</style>
