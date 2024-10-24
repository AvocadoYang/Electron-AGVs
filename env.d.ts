/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_MISSION_CONTROL_URL: string
  readonly MAIN_VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
