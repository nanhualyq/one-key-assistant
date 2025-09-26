import type api from './apis/'

type Action = {
  name: string
  shortcut?: string
  function: string
  params?: unknown
}

type Gemini = {
  apiKey: string
  chats?: {
    name: string
    model: string
    systemInstruction?: string
    thinkingBudget: number
    googleSearch: boolean
  }[]
}

declare global {
  interface Window {
    api: typeof api
  }
  type SettingsJson = {
    actions?: Action[]
    gemini?: Gemini
  }
}
