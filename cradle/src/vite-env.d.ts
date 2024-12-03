/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly CRADLE_API_URL: string
}
interface ImportMeta {
	readonly env: ImportMetaEnv
}
