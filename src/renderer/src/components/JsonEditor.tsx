import { Input } from 'antd'
import { useState } from 'react'

interface Props {
  value?: string
  onChange?: (value: unknown) => void
}

function JsonEditor(props: Props): React.JSX.Element {
  let initValue
  try {
    initValue = JSON.stringify(props.value, null, 2)
  } catch (e) {
    initValue = e
  }
  const [json, setJson] = useState(initValue)
  const [error, setError] = useState(false)

  function onChange(): void {
    try {
      props.onChange?.(JSON.parse(json))
      setError(false)
    } catch (e) {
      setError(!!e)
    }
  }
  return (
    <Input.TextArea
      value={json}
      onChange={(e) => setJson(e.target.value)}
      onBlur={() => onChange()}
      status={error ? 'error' : ''}
    />
  )
}

export default JsonEditor
