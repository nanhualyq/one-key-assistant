import { clipboard } from "electron";
import { APP_URL } from "../mainDir";
import { template } from "lodash-es";

export function parseTemplateString(str: string) {
  return template(str || '')({ SELECTION_TEXT: clipboard.readText('selection'), APP_URL })
}
