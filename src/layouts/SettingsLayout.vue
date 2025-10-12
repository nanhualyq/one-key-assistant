<template>
  <q-layout view="lHr LpR LFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-drawer side="left" :model-value="true" borderd :breakpoint="0">
      <q-list bordered>
        <q-item clickable v-ripple to="/settings/action">
          <q-item-section avatar>
            <q-icon color="primary" name="list" />
          </q-item-section>
          <q-item-section>Actions</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple to="/settings/dict">
          <q-item-section avatar>
            <q-icon color="primary" name="search" />
          </q-item-section>
          <q-item-section>Dict</q-item-section>
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
</script>
