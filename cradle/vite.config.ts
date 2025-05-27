import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-swc"
import path from "node:path"
import { type PluginOption, defineConfig } from "vite"

export default defineConfig({
	envPrefix: "CRADLE_",
	plugins: [react(), TanStackRouterVite() as PluginOption],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
})
