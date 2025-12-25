import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './app/router/index.js'
import App from './App.vue'
import './style.css'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

createApp(App).use(createPinia()).use(router).use(Toast).mount('#app')
