<script lang="ts" setup>
import { reactive } from 'vue';

const props = defineProps<{
    action: Action
}>()

const emit = defineEmits<{
    save: [Action],
    cancel: []
}>()

const formData = reactive<Action>({ ...props.action })
</script>

<template>
    <form @submit.prevent="emit('save', formData)">
        <label>
            <span>name:</span>
            <input type="text" v-model="formData.name" autofocus />
        </label>
        <label>
            <span>shortcut:</span>
            <input type="text" v-model="formData.shortcut" />
        </label>
        <label>
            <span>target:</span>
            <input type="text" v-model="formData.target" />
        </label>
        <button type="submit">Save</button>
        <button type="button" @click="emit('cancel')">Cancel</button>
    </form>
</template>

<style scoped>
label {
    display: block;
    padding: 0.2rem;
}

label>span {
    display: inline-block;
    min-width: 4rem;
    font-weight: bold;
}
</style>