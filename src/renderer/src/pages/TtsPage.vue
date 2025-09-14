<template>
    <a-flex vertical gap="small" style="height: 100vh;">
        <a-flex flex="1" vertical style="overflow: auto; padding: 1rem;">
            <p class="line" v-for="(text, i) in textChuncks" :key="i" :class="{ highlight: i === index }" @click="playIndex(i)">
                {{ text }}
            </p>
        </a-flex>
        <audio :src="audioSrc" controls autoplay @ended="playNext"></audio>
        <div>
            <a-select v-model:value="voice">
                <a-option value="zf_xiaobei">zf_xiaobei</a-option>
                <a-option value="zf_xiaoni">zf_xiaoni</a-option>
                <a-option value="zf_xiaoxiao">zf_xiaoxiao</a-option>
                <a-option value="zf_xiaoyi">zf_xiaoyi</a-option>
                <a-option value="zm_yunjian">zm_yunjian</a-option>
                <a-option value="zm_yunxi">zm_yunxi</a-option>
                <a-option value="zm_yunxia">zm_yunxia</a-option>
                <a-option value="zm_yunyang">zm_yunyang</a-option>
            </a-select>
            <!-- <a-button @click="start">Start</a-button> -->
        </div>
    </a-flex>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const voice = ref('zf_xiaoxiao')
const audioSrc = ref('')

let textChuncks: string[] = []
const index = ref(-1)

async function start() {
    const input = await window.api.clipboard.readText('selection')
    textChuncks = input.split('\n')
        .filter(s => s.trim())
    playNext()
}
start()
function playNext() {
    playIndex(index.value + 1)
}
function playIndex(i: number) {
    index.value = i
    const line = textChuncks[i]
    if (!line) return
    play(line)
}

async function play(input: string) {
    audioSrc.value = await fetch('http://localhost:8880/v1/audio/speech', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            input,
            voice: voice.value
        })
    })
        .then(r => r.blob())
        .then(blob => URL.createObjectURL(blob))

}
function scrollToHighlight() {
    nextTick(() => {
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
    URL.revokeObjectURL(audioSrc.value)
    scrollToHighlight()
})
</script>

<style scoped>
.highlight {
    color: darkblue;
    font-weight: bold;
}

.line {
    cursor: pointer;
    margin: 4px;
}
</style>