import { Button, notification, Space } from 'antd'
import { Action, createAction, useSettings } from './SettingsProvider'
import { useEffect, useReducer, useState } from 'react'
import ActionEditDialog from './ActionEditDialog'

function ActionsSettins(): React.JSX.Element {
  const { settings, saveSettings } = useSettings()

  const [actions, dispatchActions] = useReducer((state, action): typeof settings.actions => {
    if (action.type === 'add') {
      return [...state, createAction()]
    } else if (action.type === 'delete') {
      return state.filter((_, index) => index !== action.index)
    } else if (action.type === 'save') {
      return state.map((item, index) => (index === action.index ? action.item : item))
    } else if (action.type === 'init') {
      return action.actions
    }
    return state
  }, settings.actions)

  useEffect(() => {
    dispatchActions({ type: 'init', actions: settings.actions })
  }, [settings.actions])

  const [editIndex, setEditIndex] = useState(-1)

  function deleteAction(): void {
    dispatchActions({ type: 'delete', index: editIndex })
    closeDialog()
  }

  function saveAction(action: Action): void {
    dispatchActions({ type: 'save', item: action, index: editIndex })
    closeDialog()
  }

  function saveActions(): void {
    saveSettings({ ...settings, actions })
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
        <Button onClick={() => dispatchActions({ type: 'add' })}>+ Add</Button>
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
