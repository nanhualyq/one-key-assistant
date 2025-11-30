import { createSlice } from '@reduxjs/toolkit'
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

export default createSlice({
  name: 'settings',
  initialState: {} as Settings,
  reducers: {
    update(_state, action) {
      return action.payload
    }
  }
})
