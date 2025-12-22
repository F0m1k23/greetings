import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

import Home from '../pages/HomeView.vue'
import Gallery from '../pages/Gallery.vue'
import Favorites from '../pages/Favorites.vue'
import Preview from '../pages/Preview.vue'

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', component: Home },
			{ path: 'gallery', component: Gallery },
			{ path: 'favorites', component: Favorites },
			{ path: 'preview', component: Preview },
		],
	},
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
