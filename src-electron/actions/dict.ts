import { BaseWindow, ipcMain, WebContentsView } from "electron";
import { APP_URL } from "../mainDir";
import { getWebPreferences } from "../main-functions/createWindow";
import { loadSettings } from "../apis/settings";
import { parseTemplateString } from "../main-functions/utils";
import { type Dict } from "../global";

export default class DictTabsWindow extends BaseWindow {
  topView: WebContentsView | undefined
  bottomView: WebContentsView | undefined
  dictList: Dict[] = []

  constructor(options?: Electron.BaseWindowConstructorOptions) {
    super(options)
    this.initFrameWork()
    this.initSettings()
    ipcMain.on('onDictShow', (_e, index) => this.onDictShow(index))
  }
  initSettings() {
    const settings = loadSettings()
    for (const dict of settings.dict || []) {
      dict.url = parseTemplateString(dict.url)
    }
    this.dictList = settings.dict || []
  }
  onDictShow(index: number) {
    const dict = this.dictList[index]
    if (!dict) {
      return
    }
    void this.bottomView?.webContents.loadURL(dict.url)
  }
  initFrameWork() {
    const topView = new WebContentsView({
      webPreferences: getWebPreferences()
    })
    void topView.webContents.loadURL(`${APP_URL}/#/dict`)
    this.contentView.addChildView(topView)

    const bottomView = new WebContentsView()
    this.contentView.addChildView(bottomView)

    const bounds = this.getBounds()
    const topHeight = 50

    topView.setBounds({ x: 0, y: 0, width: bounds.width, height: topHeight })
    bottomView.setBounds({ x: 0, y: topHeight, width: bounds.width, height: bounds.height - topHeight })

    this.topView = topView
    this.bottomView = bottomView
  }
}
