<template>
    <q-input :model-value="input" type="textarea" @update:model-value="onChange" :error="hasError"
        error-message="Invalid JSON" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const model = defineModel()
const hasError = ref(false)
const input = computed(() => JSON.stringify(model.value, undefined, 4))
function onChange(value: unknown) {
    hasError.value = false
    try {
        const json = JSON.parse(String(value))
        model.value = json
    } catch {
        hasError.value = true
    }
}
</script>