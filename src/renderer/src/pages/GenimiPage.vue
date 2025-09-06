<script setup lang="ts">
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { computed, onMounted, reactive, ref } from 'vue';

let config:GeminiConfig

onMounted(async () => {
    config = await window.electron.ipcRenderer.invoke('electron-store', 'get', 'gemini') as GeminiConfig
})

const getInitialForm = () => ({
    model: 'gemini-2.5-flash',
    prompt: '',
    isSearch: false,
    isThinking: false
});
const inputForm = reactive(getInitialForm())
const response = ref('')

const html = computed(() => {
    return marked.parse(response.value)
})

async function handleSubmit() {
    response.value = '......'
    const ai = new GoogleGenAI({
        apiKey: config.apiKey
    })
    // or generateContent
    const res = await ai.models.generateContentStream({
        model: inputForm.model,
        contents: inputForm.prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: inputForm.isThinking ? -1 : 0,
            },
            tools: [
                {
                    // 搜索太慢，还不如chatgpt和grok
                    googleSearch: inputForm.isSearch ? {} : undefined
                }
            ]
            // systemInstruction: "You are a cat. Your name is Neko.",
        }
    })
        .finally(() => {
            Object.assign(inputForm, getInitialForm())
        })
    response.value = ''
    for await (const chunk of res) {
        response.value += chunk.text || ''
    }
}

function openSettings() {
    window.electron.ipcRenderer.invoke('electron-store', 'openInEditor')
}
</script>

<template>
    <div id="out-box" @keydown.ctrl.enter="handleSubmit" @keydown.ctrl.s="inputForm.isSearch = !inputForm.isSearch"
        @keydown.ctrl.t="inputForm.isThinking = !inputForm.isThinking">
        <div id="text" v-html="html">
        </div>
        <div id="input-bar">
            <div class="tools">
                <button @click="openSettings">Settings</button>
                <label accesskey="m"><u>M</u>odel
                    <select v-model="inputForm.model">
                        <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                        <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                        <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
                        <!-- <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                        <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option> -->
                    </select>
                </label>
                <label>
                    <input type="checkbox" v-model="inputForm.isSearch">
                    <u>S</u>earch
                </label>
                <label>
                    <input type="checkbox" v-model="inputForm.isThinking">
                    <u>T</u>hinking
                </label>
            </div>
            <textarea v-model="inputForm.prompt" autofocus accesskey="i"></textarea>
            <button @click="handleSubmit">Send<br>(Ctrl + Enter)</button>
        </div>
    </div>
</template>

<style scoped>
#out-box {
    display: flex;
    flex-direction: column;
    height: 100vh;
    border: 2px solid #333;
    box-sizing: border-box;
}

#text {
    flex: 1;
    padding: 1rem;
    overflow: auto;
}

:global(pre) {
    background-color: #eee;
    padding: 1rem;
}

#input-bar {
    display: grid;
    grid-template-rows: auto auto;
    /* 两行，高度自适应 */
    grid-template-columns: 1fr max-content;
    /* 两列平分 */
    grid-template-areas:
        "item1 item1";
    /* 第二行平分两列 */
    gap: 4px;
    padding: 8px;
}

#input-bar>.tools {
    grid-area: item1;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    align-items: center;
}
</style>