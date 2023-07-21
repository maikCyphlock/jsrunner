import { contextBridge, ipcRenderer } from 'electron'
import { domReady, useLoading } from './utils'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { appendLoading, removeLoading } = useLoading()

domReady().then(appendLoading)

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-me'),
  maximizeApp: () => ipcRenderer.send('maximize'),
  unmaximizeApp: () => ipcRenderer.send('unmaximize'),
  showContextMenu: () => ipcRenderer.send('show-context-menu')
})

setTimeout(removeLoading, 1000)
