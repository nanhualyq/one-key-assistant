import { Button, Flex, Form, Input, Modal, Select } from 'antd'
import JsonEditor from './JsonEditor'
import z from 'zod'
import { Action, actionSchema, actionTypes } from '@renderer/store/settings.slice'

interface Props {
  action: Action
  onClose: () => void
  onDelete: () => void
  onSave: (action: Action) => void
}

function ActionEditDialog(props: Props): React.JSX.Element {
  const [form] = Form.useForm()
  const footer = (
    <Flex gap="small">
      <Button color="danger" variant="solid" onClick={props.onDelete}>
        Delete
      </Button>
      <Button type="primary" onClick={form.submit}>
        Save
      </Button>
    </Flex>
  )
  async function checkShortcut(_rule, value): Promise<void> {
    if (!value) {
      return
    }
    const res = await window.electron.ipcRenderer.invoke(
      'main',
      'globalShortcut.isRegistered',
      value
    )
    if (res) {
      return Promise.reject(new Error(`${value} is already registered`))
    }
  }

  async function validator(rule, value): Promise<void> {
    try {
      actionSchema.pick({ [rule.field]: true }).parse({ [rule.field]: value })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Promise.reject(new Error(error.issues[0]?.message))
      }
    }
  }

  return (
    <Modal
      open={true}
      keyboard={false}
      maskClosable={false}
      footer={footer}
      onCancel={props.onClose}
    >
      <Form form={form} initialValues={props.action} onFinish={props.onSave}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              validator
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              validator
            }
          ]}
        >
          <Select>
            {actionTypes.map((type) => (
              <Select.Option value={type} key={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Shortcut"
          name="shortcut"
          validateTrigger="onBlur"
          rules={[
            {
              validator
            },
            {
              validator: checkShortcut
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Params"
          name="params"
          rules={[
            {
              validator
            }
          ]}
        >
          <JsonEditor />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ActionEditDialog
