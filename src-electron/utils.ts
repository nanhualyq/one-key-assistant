import { clipboard } from "electron";
import { APP_URL } from "./createWindow";

export function replaceTemplate(raw: string) {
    return raw.replaceAll('{SELECTION_TEXT}', clipboard.readText('selection'))
        .replaceAll('{APP_URL}', APP_URL)
}
