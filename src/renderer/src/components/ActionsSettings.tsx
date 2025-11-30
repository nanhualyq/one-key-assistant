import { Button, notification, Space } from 'antd'
import { Action, createAction, useSettings } from './SettingsProvider'
import { useEffect, useReducer, useState } from 'react'
import ActionEditDialog from './ActionEditDialog'
import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'actions',
  initialState: [] as Action[],
  reducers: {
    add(state) {
      state.push(createAction())
    },
    delete(state, action) {
      state.splice(action.payload, 1)
    },
    save(state, action) {
      state[action.payload.index] = action.payload.item
    },
    init(_state, action) {
      return action.payload
    }
  }
})

function ActionsSettins(): React.JSX.Element {
  const { settings, saveSettings } = useSettings()

  const [actions, dispatch] = useReducer(slice.reducer, settings.actions)

  useEffect(() => {
    dispatch(slice.actions.init(settings.actions))
  }, [settings.actions])

  const [editIndex, setEditIndex] = useState(-1)

  function deleteAction(): void {
    dispatch(slice.actions.delete(editIndex))
    closeDialog()
  }

  function saveAction(action: Action): void {
    dispatch(slice.actions.save({ index: editIndex, item: action }))
    closeDialog()
  }

  function saveActions(): void {
    saveSettings({ ...settings, actions: actions })
    notification.success({ title: 'Actions saved' })
  }

  function closeDialog(): void {
    setEditIndex(-1)
  }

  return (
    <>
      <ul>
        {actions.map((action, index) => (
          <li key={index}>
            <a onClick={() => setEditIndex(index)}>{action.name}</a>
          </li>
        ))}
      </ul>
      <Space>
        <Button onClick={() => dispatch(slice.actions.add())}>+ Add</Button>
        <Button type="primary" onClick={saveActions}>
          Save
        </Button>
      </Space>
      {editIndex >= 0 && (
        <ActionEditDialog
          action={actions[editIndex]}
          onClose={closeDialog}
          onDelete={deleteAction}
          onSave={saveAction}
        />
      )}
    </>
  )
}

export default ActionsSettins
