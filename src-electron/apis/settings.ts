import { app } from 'electron';
import path from 'path';
import fs from 'fs';

const settingsFilePath = path.join(app.getPath('userData'), 'settings.json');
// when developping, is ~/.config/Electron/

export function loadSettings() {
    try {
        if (fs.existsSync(settingsFilePath)) {
            const data = fs.readFileSync(settingsFilePath, 'utf8');
            return JSON.parse(data) as SettingsJson;
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return {};
}

export function saveSettings(settings: SettingsJson): void {
    try {
        fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}