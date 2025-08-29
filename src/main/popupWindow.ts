import { BrowserWindow, clipboard, screen } from "electron"

export default function () {
    const popupWin = new BrowserWindow({
        width: 480,
        height: 640,
        frame: false,             // 无边框
        transparent: true,        // 透明背景（可选）
        alwaysOnTop: true,        // 总在最前
        skipTaskbar: true,        // 不显示在任务栏
        // resizable: false,
        movable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    popupWin.loadURL(`https://m.youdao.com/result?word=${clipboard.readText('selection')}&lang=en`, {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
    })

    popupWin.setBounds(calcXY(popupWin.getBounds().width, popupWin.getBounds().height))

    popupWin.show()

    // 失去焦点时关闭
    popupWin.on('blur', () => {
        if (popupWin) {
            popupWin.close()
        }
    })

    // 注入一段脚本，监听 Escape
    popupWin.webContents.executeJavaScript(`
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          window.close()
        }
      })
    `)
}

// 根据鼠标位置计算更空的一侧坐标
// issue: linux上，坐标超出主窗口就不会变化
// https://github.com/electron/electron/issues/42519
function calcXY(popupWidth: number, popupHeight: number) {
    const cursorPos = screen.getCursorScreenPoint()

    const display = screen.getDisplayNearestPoint(cursorPos)
    const workArea = display.workArea

    // 计算四个方向剩余空间
    const spaceLeft = cursorPos.x - workArea.x
    const spaceRight = (workArea.x + workArea.width) - cursorPos.x
    const spaceTop = cursorPos.y - workArea.y
    const spaceBottom = (workArea.y + workArea.height) - cursorPos.y

    // 选择空间最大的一侧
    const maxSpace = Math.max(spaceLeft, spaceRight, spaceTop, spaceBottom)
    let x, y

    if (maxSpace === spaceRight) {
        // 显示在鼠标右边
        x = cursorPos.x + 10
        y = cursorPos.y - popupHeight / 2
    } else if (maxSpace === spaceLeft) {
        // 显示在鼠标左边
        x = cursorPos.x - popupWidth - 10
        y = cursorPos.y - popupHeight / 2
    } else if (maxSpace === spaceBottom) {
        // 显示在鼠标下方
        x = cursorPos.x - popupWidth / 2
        y = cursorPos.y + 10
    } else {
        // 显示在鼠标上方
        x = cursorPos.x - popupWidth / 2
        y = cursorPos.y - popupHeight - 10
    }

    // 防止超出屏幕范围
    if (x < workArea.x) x = workArea.x
    if (x + popupWidth > workArea.x + workArea.width) x = workArea.x + workArea.width - popupWidth
    if (y < workArea.y) y = workArea.y
    if (y + popupHeight > workArea.y + workArea.height) y = workArea.y + workArea.height - popupHeight

    return {
        x, y
    }
}