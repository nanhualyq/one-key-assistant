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
            <p>something</p>
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
import { onMounted, reactive, ref } from 'vue'
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

onMounted(newChat)

function newChat() {
    const ai = new GoogleGenAI({
        apiKey: 'AIzaSyDQo70DSr8DHK2CwVkF2o0BIg8yMYFlJCE'
    })
    chat = ai.chats.create({
        model: 'gemini-2.5-flash'
    })
}

async function sendMessage() {
    messageLoading.value = true
    messages.push(prompt.value)
    prompt.value = ''
    const input = messages[messages.length - 1]
    messages.push('')
    const res = await chat
        .sendMessageStream({
            message: input!,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0
                },
                tools: [
                    {
                        // 搜索太慢，还不如chatgpt和grok
                        // googleSearch: inputForm.isSearch ? {} : undefined
                    }
                ],
                // systemInstruction: inputForm.systemInstruction
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