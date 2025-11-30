import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SettingsPage from './pages/SettingsPage'
import { useEffect, useState } from 'react'
import useSettings from './hooks/useSettings'

function App(): React.JSX.Element {
  const [loaded, setLoaded] = useState(false)
  const { loadSettings } = useSettings()

  useEffect(() => {
    loadSettings()
      .then(() => {
        setLoaded(true)
      })
      .catch((error) => {
        alert(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loaded) {
    return <h1>Settings Loading...</h1>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/settings" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
