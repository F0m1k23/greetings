import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), tailwindcss()],
	server: {
		proxy: {
			// Backend (bot) API proxy for development
			'/api': 'http://localhost:3001',
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
