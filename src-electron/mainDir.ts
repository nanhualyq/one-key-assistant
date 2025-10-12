import { fileURLToPath } from 'url';
export const mainDir = fileURLToPath(new URL('.', import.meta.url));
export const APP_URL = process.env.DEV ? process.env.APP_URL : `file://${mainDir}index.html`
