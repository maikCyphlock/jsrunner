import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']


function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'jsrunner.svg'),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      nodeIntegration: true,

    },

  })
  ipcMain.on('close-me', () => {

    app.quit();
  });
  ipcMain.on('maximize', () => {

    win?.maximize();
  });
  ipcMain.on('unmaximize', () => {

    win?.unmaximize();
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
})
app.whenReady().then(createWindow)
