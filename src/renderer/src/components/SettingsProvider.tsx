/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import * as z from 'zod'

export const actionTypes = ['dict', 'gemini', 'tts'] as const

export const actionSchema = z.object({
  name: z.string().trim().nonempty({ message: 'Name is required' }),
  type: z.enum(actionTypes),
  shortcut: z.string().optional(),
  params: z.looseObject({}).optional()
})

export type Action = z.infer<typeof actionSchema>

export function createAction(): Action {
  return {
    name: `New Action ${Date.now()}`,
    type: 'dict',
    params: {}
  }
}

export const settingsSchema = z.object({
  actions: z.array(actionSchema).optional().default([])
})

export type Settings = z.infer<typeof settingsSchema>

interface SettingsContextType {
  settings: Settings
  saveSettings: (s: Settings) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

export function SettingsProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [settings, setSettings] = useState<Settings>({
    actions: []
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings(): Promise<void> {
    const o = await window.electron.ipcRenderer.invoke('main', 'settings.get')
    setSettings(settingsSchema.parse(o))
  }

  const saveSettings = async (newSettings: Settings): Promise<void> => {
    await window.electron.ipcRenderer.invoke('main', 'settings.set', newSettings)
    setSettings(newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
