import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../../dist')

let window: BrowserWindow

async function createWindow() {
    const preload = join(__dirname, '../preload/index.js')

    // Set the desired width and height for your window
    const windowWidth = 800 // Adjust to the desired width
    const windowHeight = 600 // Adjust to the desired height

    window = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        minWidth: windowWidth,
        minHeight: windowHeight,
        maxWidth: windowWidth,
        maxHeight: windowHeight,
        frame: false,
        transparent: false,
        show: true,
        webPreferences: {
            devTools: true,
            preload,
            sandbox: false,
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: app.isPackaged,
        },
        autoHideMenuBar: true,
    })

    /**
     * Disable GPU acceleration for devices using Windows 7
     */
    if (release().startsWith('6.1')) app.disableHardwareAcceleration()

    const htmlFile = join(__dirname, process.env.DIST_ELECTRON + 'index.html')

    /**
     * If running a development server, use that; if not, load a static HTML file.
     */
    if (process.env.SERVER_URL) {
        window.loadURL(process.env.SERVER_URL)
        window.webContents.openDevTools()
    } else {
        window.loadFile(join(htmlFile))
    }
}

app.whenReady().then(createWindow)
