<template>
    <q-layout view="lHr LpR LFf">
        <q-header>
            <q-toolbar>
                <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
                <q-toolbar-title>Header</q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>
        <q-drawer side="left" v-model="drawerLeft" borderd>
            <h1>123</h1>
        </q-drawer>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawerLeft = ref(false)
</script>
