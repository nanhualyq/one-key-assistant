<script lang="ts" setup>
import ActionEditor from '@renderer/components/ActionEditor.vue';
import { onMounted, ref, toRaw } from 'vue';

const list = ref<Action[]>([])
const editIndex = ref(-1)

onMounted(async () => {
    const actions = await window.electron.ipcRenderer.invoke('electron-store', 'get', 'actions') as Action[]
    list.value = actions || []
})

function cancelEdit() {
    editIndex.value = -1
}
function saveEdit(index, newAction) {
    list.value[index] = newAction
    cancelEdit()
    saveAll()
}
async function saveAll() {
    await window.electron.ipcRenderer.invoke('electron-store', 'set', 'actions', toRaw(list.value))
    window.electron.ipcRenderer.send('resetActionsShortcut')
}
function deleteOne(index: number) {
    list.value.splice(index, 1)
    saveAll()
}
</script>

<template>
    <button @click="list.push({ name: '', target: '' })">+ Add</button>
    <ul>
        <li v-for="(item, index) in list" :key="index">
            <ActionEditor v-if="editIndex === index" :action="item" @save="saveEdit(index, $event)"
                @cancel="cancelEdit" />
            <div v-else>
                {{ item.name }}
                <button @click="editIndex = index">Edit</button>
                <button @click="deleteOne(index)">Delete</button>
            </div>
        </li>
    </ul>
</template>