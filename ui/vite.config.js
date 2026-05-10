import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	plugins: [
		preact()
	],
	assetsInclude: ["**/*.md"],
	server: {
		open: true,
		port: 3000,
		proxy: undefined,
	},
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat",
			'react/jsx-runtime': 'preact/jsx-runtime',
			"src": path.resolve(__dirname, "src"),
		}
	},
	build: {
		outDir: "./build",
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendor"
					}
				}
			}
		}
	}
});
