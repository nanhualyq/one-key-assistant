<script setup lang="ts">
import { Chat, GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { computed, onMounted, reactive, ref } from 'vue';

let config: GeminiConfig

onMounted(async () => {
    config = await window.electron.ipcRenderer.invoke('electron-store', 'get', 'gemini') as GeminiConfig
    config = reactive(config)
    resetInputForm()
    prompt.value = await window.api.clipboard.readText('selection')
    if (prompt.value) {
        prompt.value += '\n\n---\n\n'
    }
})

const prompt = ref('')

const getInitialForm = () => ({
    model: '',
    isThinking: false,
    isSearch: false,
    systemInstruction: ''
});
const inputForm = reactive(getInitialForm())
const response = ref('')

const html = computed(() => {
    return marked.parse(response.value)
})

function resetInputForm(index = 0) {
    Object.assign(inputForm, getInitialForm(), config.quickChatList[0])
    if (index > 0 && config.quickChatList[index]) {
        Object.assign(inputForm, config.quickChatList[index])
        handleSubmit()
    }
}

let chat: Chat | undefined
const loading = ref(false)

function newChat() {
    const ai = new GoogleGenAI({
        apiKey: config.apiKey
    })
    return ai.chats.create({
        model: inputForm.model
    })
}

async function handleSubmit() {
    loading.value = true
    if (!chat) {
        chat = await newChat()
    }

    // or generateContent
    const res = await chat.sendMessageStream({
        message: prompt.value,
        config: {
            thinkingConfig: {
                thinkingBudget: inputForm.isThinking ? -1 : 0,
            },
            tools: [
                {
                    // 搜索太慢，还不如chatgpt和grok
                    googleSearch: inputForm.isSearch ? {} : undefined
                }
            ],
            systemInstruction: inputForm.systemInstruction,
        }
    })
        .finally(() => {
            prompt.value = ''
            loading.value = false
        })
    if (response.value) {
        response.value += '\n\n---\n\n'
    }
    for await (const chunk of res) {
        response.value += chunk.text || ''
    }
}

const handleKeydown = (e) => {
    // 判断是否按下了 Ctrl 键
    if (e.ctrlKey) {
        // e.key 是字符串，比如 "1"、"2"...
        if (/^[0-9]$/.test(e.key)) {
            resetInputForm(parseInt(e.key))
        } else if (e.key === 'Enter') {
            handleSubmit()
        } else if (e.key === 's') {
            inputForm.isSearch = !inputForm.isSearch
        } else if (e.key === 't') {
            inputForm.isThinking = !inputForm.isThinking
        }
    };
}
</script>

<template>
    <div id="out-box" @keydown="handleKeydown">
        <div id="text" v-html="html">
        </div>
        <a-spin v-show="loading" />
        <div id="input-bar">
            <div class="tools">
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
                <button v-if="config?.quickChatList.length" v-for="(quickChat, i) in config.quickChatList.slice(1)"
                    :key="i" @click="resetInputForm(i + 1)">
                    <u>{{ i + 1 }}</u>
                    {{ quickChat.name }}
                </button>
            </div>
            <a-textarea v-model:value="prompt" autofocus accesskey="i" allowClear
                :autoSize="{ minRows: 2, maxRows: 10 }"></a-textarea>
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