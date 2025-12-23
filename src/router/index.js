import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Home from '../views/Home.vue'
import FavoritesView from '../views/FavoritesView.vue'
import Gallery from '../views/Gallery.vue'
import Preview from '../views/Preview.vue'
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: MainLayout,
			children: [
				{
					path: '',
					name: 'Home',
					component: Home,
				},
				{
					path: '/favorites',
					name: 'Favorites',
					component: FavoritesView,
				},
				{
					path: '/gallery/:id',
					name: 'gallery',
					component: Gallery,
				},
				{
					path: '/preview',
					name: 'preview',
					component: Preview,
				},
			],
		},
	],
})
export default router
