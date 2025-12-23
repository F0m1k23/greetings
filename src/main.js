import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

// Initialize Telegram WebApp
if (window.Telegram?.WebApp) {
	window.Telegram.WebApp.ready()
	window.Telegram.WebApp.expand()
}

createApp(App).use(router).mount('#app')
