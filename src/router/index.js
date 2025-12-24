import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import FavoritesView from '../views/FavoritesView.vue'
import Gallery from '../views/Gallery.vue'
import Preview from '../views/Preview.vue'
import HolidaySelection from '../views/HolidaySelection.vue'
import Editor from '../views/Editor.vue'
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
					path: '/categories',
					name: 'categories',
					component: Categories,
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
				{
					path: '/holiday-selection',
					name: 'holiday-selection',
					component: HolidaySelection,
				},
				{
					path: '/editor',
					name: 'editor',
					component: Editor,
				},
			],
		},
	],
})
export default router
