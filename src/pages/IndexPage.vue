<template>
  <q-btn @click="openYoudao">youdao</q-btn>
  <q-btn @click="openGemini">gemini</q-btn>
  <q-btn @click="openTTS">TTS</q-btn>
</template>

<script setup lang="ts">
function openYoudao() {
  window.api.ipcRenderer.send('createWindow', {
    width: 480,
    // height: 640,
    url: 'https:/www.youdao.com/result?word={SELECTION_TET}&lang=en',
    headers: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
    }
  })
}
function openGemini() {
  window.api.ipcRenderer.send('createWindow', {
    url: '{APP_URL}#/gemini'
  })
}
function openTTS() {
  window.api.ipcRenderer.send('createWindow', {
    url: '{APP_URL}#/tts'
  })
}
</script>
