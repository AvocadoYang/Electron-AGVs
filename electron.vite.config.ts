import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as os from 'os'

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address // 回傳第一個非內部網路的 IPv4
      }
    }
  }
  return '127.0.0.1' // 預設回傳 localhost
}

const localIP = getLocalIP()
dotenv.config()

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env': process.env
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      host: localIP,
      port: 3000,
      https: {
        key: fs.readFileSync('certs/server.key'),
        cert: fs.readFileSync('certs/server.crt')
      }
      // headers: {
      //   'Content-Security-Policy': `default-src 'self' data: blob: https://${localIP}:4000 https://localhost:4000`
      // }
    },
    plugins: [react()]
  }
})
