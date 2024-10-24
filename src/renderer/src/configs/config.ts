console.log(import.meta.env.RENDERER_VITE_MISSION_CONTROL_URL)

export const MISSION_CONTROL_URL =
  import.meta.env.RENDERER_VITE_MISSION_CONTROL_URL || 'https://localhost'

export const MISSION_CONTROL_WS_URL =
  process.env.RENDERER_VITE_MISSION_CONTROL_WS_URL || 'wss://localhost'
