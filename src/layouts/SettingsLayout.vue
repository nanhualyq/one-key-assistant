<template>
    <q-layout view="lHr LpR LFf">
        <q-header>
            <q-toolbar>
                <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
                <q-toolbar-title>Settings</q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>
        <q-drawer side="left" v-model="drawerLeft" borderd>
            <q-list bordered>
                <q-item clickable v-ripple to="/settings/action">
                    <q-item-section avatar>
                        <q-icon color="primary" name="list" />
                    </q-item-section>
                    <q-item-section>Actions</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/settings/gemini">
                    <q-item-section avatar>
                        <q-icon color="primary" name="chat" />
                    </q-item-section>
                    <q-item-section>Gemini</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/settings/tts">
                    <q-item-section avatar>
                        <q-icon color="primary" name="speaker" />
                    </q-item-section>
                    <q-item-section>Tts</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawerLeft = ref(false)
</script>
