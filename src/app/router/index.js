import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/pages/Home.vue'),
	},
	{
		path: '/holidays',
		name: 'Holidays',
		component: () => import('@/pages/Holidays.vue'),
	},
	{
		path: '/gallery/:holiday',
		name: 'Gallery',
		component: () => import('@/pages/Gallery.vue'),
		props: true,
	},
	{
		path: '/preview/:holiday/:id',
		name: 'Preview',
		component: () => import('@/pages/Preview.vue'),
		props: true,
	},
	{
		path: '/editor',
		name: 'Editor',
		component: () => import('@/pages/Editor.vue'),
	},
	{
		path: '/favorites',
		name: 'Favorites',
		component: () => import('@/pages/Favorites.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
