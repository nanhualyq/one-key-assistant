import { defineStore, acceptHMRUpdate } from 'pinia';
import { Notify } from 'quasar';
import { toRaw } from 'vue';

export const useSettingsStore = defineStore('settings', {
  state: (): { json: SettingsJson } => ({
    json: {}
  }),
  getters: {},
  actions: {
    async loadSettings() {
      try {
        this.json = await window.api.ipcRenderer.invoke('loadSettings')
      } catch (error) {
        console.error(error)
      }
    },
    async saveSettings() {
      await window.api.ipcRenderer.invoke('saveSettings', toRaw(this.json))
      Notify.create({
        type: 'positive',
        message: 'Settings is saved.'
      })
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
