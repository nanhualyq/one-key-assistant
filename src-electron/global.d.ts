import type api from './apis/'

type Action = {
  name: string
  shortcut?: string
  function: string
  params?: unknown
}

declare global {
  interface Window {
    api: typeof api
  }
  type SettingsJson = {
    actions?: Action[]
  }
}
