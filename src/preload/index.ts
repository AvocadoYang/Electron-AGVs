import { contextBridge } from 'electron'

import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('env', {
      ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL,
      NODE_ENV: process.env.NODE_ENV,
      VITE_REACT_APP_MISSION_CONTROL_URL: process.env.VITE_REACT_APP_MISSION_CONTROL_URL
    })

    contextBridge.exposeInMainWorld('versions', {
      node: () => process.versions.node,
      chrome: () => process.versions.chrome,
      electron: () => process.versions.electron
    })
    contextBridge.exposeInMainWorld('electron', electronAPI)

    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
