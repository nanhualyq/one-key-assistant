<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="q-pa-md column">
                <q-chat-message v-for="(m, i) in messages" :key="i" :name="isMe(i) ? 'me' : 'Gemini'"
                    :avatar="isMe(i) ? 'https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg' : 'https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png'"
                    :sent="isMe(i)" :class="{ 'self-end': isMe(i) }" bg-color="grey-1">
                    <div :class="{ inputting: isInputting(i) }" v-html="marked.parse(m)">
                    </div>
                </q-chat-message>
            </q-page>
        </q-page-container>
        <q-footer bordered class="bg-white text-dark">
            <p>
                <q-select v-model="currentChatConfig" :options="chatIndexList" :option-label="getChatName"
                    label="Chat Config" />
            </p>
            <q-input v-model="prompt" @keydown.ctrl.enter="prompt && sendMessage()" type="textarea" autogrow clearable
                outlined autofocus style="max-height: 80vh; overflow: auto;">
                <template #append>
                    <q-btn color="primary" icon="send" @click="sendMessage" :disable="!prompt"></q-btn>
                </template>
            </q-input>
        </q-footer>
    </q-layout>
</template>

<script setup lang="ts">
import { type Chat, GoogleGenAI } from '@google/genai';
import { computed, inject, onMounted, reactive, type Ref, ref, watch } from 'vue'
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const prompt = ref('')
let chat: Chat
const messages = reactive<string[]>([])
const messageLoading = ref(false)
const settings = inject<Ref<SettingsJson>>('settings')
const currentChatConfig = ref(0)
const chatIndexList = computed(() => {
    return Object.keys(settings?.value.gemini?.chats || []).map(Number)
})

onMounted(() => {
    console.log('onMounted');
})

watch(currentChatConfig, newChat)
const chatConfig = computed(() => {
    return settings?.value.gemini?.chats?.[currentChatConfig.value]
})

function newChat() {
    const ai = new GoogleGenAI({
        apiKey: settings?.value.gemini?.apiKey || ''
    })
    chat = ai.chats.create({
        model: chatConfig.value?.model || 'gemini-2.5-flash'
    })
}

async function sendMessage() {
    if (!chat) {
        newChat()
    }
    messageLoading.value = true
    messages.push(prompt.value)
    prompt.value = ''
    const input = messages[messages.length - 1]
    messages.push('')
    const tools = []
    if (chatConfig.value?.googleSearch) {
        tools.push({
            googleSearch: {}
        })
    }
    const res = await chat
        .sendMessageStream({
            message: input!,
            config: {
                tools,
                thinkingConfig: {
                    thinkingBudget: chatConfig.value?.thinkingBudget ?? 0
                },
                systemInstruction: chatConfig.value?.systemInstruction || ''
            }
        })
        .finally(() => {
            prompt.value = ''
            messageLoading.value = false
        })
    for await (const chunk of res) {
        messages[messages.length - 1] += chunk.text || ''
    }
}

function isMe(i: number) {
    return i % 2 === 0
}
function isInputting(i: number) {
    return messageLoading.value && i === messages.length - 1
}
function getChatName(index: number) {
    return settings?.value.gemini?.chats?.[index]?.name || ''
}
</script>

<style scoped lang="scss">
.inputting::after {
    content: '⬛';
    animation: blink .75s infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>