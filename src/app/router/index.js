import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Holidays from '@/pages/Holidays.vue'
import Gallery from '@/pages/Gallery.vue'
import Preview from '@/pages/Preview.vue'
import Editor from '@/pages/Editor.vue'
import Favorites from '@/pages/Favorites.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/holidays',
		name: 'Holidays',
		component: Holidays,
	},
	{
		path: '/gallery/:holiday',
		name: 'Gallery',
		component: Gallery,
		props: true,
	},
	{
		path: '/preview/:holiday/:id',
		name: 'Preview',
		component: Preview,
		props: true,
	},
	{
		path: '/editor',
		name: 'Editor',
		component: Editor,
	},
	{
		path: '/favorites',
		name: 'Favorites',
		component: Favorites,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
