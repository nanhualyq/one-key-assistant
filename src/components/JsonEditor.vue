<template>
  <q-input :model-value="internalInput" type="textarea" @update:model-value="onInternalChange" :error="hasError"
    error-message="Invalid JSON" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const model = defineModel()
const hasError = ref(false)
const internalInput = ref('')

watch(model, (newValue) => {
  internalInput.value = JSON.stringify(newValue, undefined, 4);
}, { immediate: true, deep: true });

function onInternalChange(value: unknown) {
  const stringValue = String(value);
  internalInput.value = stringValue;

  hasError.value = false;
  try {
    const json = JSON.parse(stringValue);
    model.value = json;

  } catch {
    hasError.value = true;
  }
}
</script>
