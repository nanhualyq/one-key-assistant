import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

const userDataPath = app.getPath('userData')
const settingsPath = path.join(userDataPath, 'settings.json')

export function loadSettings(): unknown {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
  return {} // 返回空对象作为默认设置
}

export function saveSettings(newSettings: unknown): void {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), 'utf8')
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}
