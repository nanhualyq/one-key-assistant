import settingsSlice, { Settings, settingsSchema } from '@renderer/store/settings.slice'
import { useDispatch } from 'react-redux'

interface returnType {
  loadSettings: () => Promise<void>
  saveSettings: (newSettings: Settings) => Promise<void>
}

export default function useSettings(): returnType {
  const dispatch = useDispatch()
  async function loadSettings(): Promise<void> {
    const json = await window.electron.ipcRenderer.invoke('main', 'settings.get')
    dispatch(settingsSlice.actions.update(settingsSchema.parse(json)))
  }

  const saveSettings = async (newSettings: Settings): Promise<void> => {
    await window.electron.ipcRenderer.invoke('main', 'settings.set', newSettings)
    dispatch(settingsSlice.actions.update(newSettings))
  }
  return {
    loadSettings,
    saveSettings
  }
}
