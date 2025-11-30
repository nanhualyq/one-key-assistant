import ActionsSettins from '@renderer/components/ActionsSettings'
import { Tabs, TabsProps } from 'antd'

function SettingsPage(): React.JSX.Element {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Actions',
      children: <ActionsSettins />
    },
    {
      key: '2',
      label: 'Dict',
      children: 'content of tab 2'
    },
    {
      key: '3',
      label: 'Gemini',
      children: 'content of tab 3'
    },
    {
      key: '4',
      label: 'TTS',
      children: 'content of tab 4'
    }
  ]

  return <Tabs items={items} />
}

export default SettingsPage
