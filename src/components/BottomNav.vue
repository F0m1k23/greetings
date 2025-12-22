<template>
	<nav
		class="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex justify-around items-center z-10"
	>
		<!-- Home -->
		<RouterLink
			to="/"
			class="group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105"
			:class="
				isActive('/') === 'text-blue-600' ? 'text-blue-600' : 'text-gray-500'
			"
		>
			<HomeIcon class="w-6 h-6 transition-all duration-300" />
			<span class="text-xs font-medium">Главная</span>
		</RouterLink>

		<!-- Favorites -->
		<RouterLink
			to="/favorites"
			class="group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105"
			:class="
				isActive('/favorites') === 'text-yellow-500'
					? 'text-yellow-500'
					: 'text-gray-500'
			"
		>
			<StarIcon class="w-6 h-6 transition-all duration-300" />
			<span class="text-xs font-medium">Избранное</span>
		</RouterLink>
	</nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { HomeIcon, StarIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const isActive = path => {
	if (path === '/') {
		return route.path === '/' ? 'text-blue-600' : 'text-gray-500'
	}
	if (path === '/favorites') {
		return route.path === '/favorites' ? 'text-yellow-500' : 'text-gray-500'
	}
	return 'text-gray-500'
}
</script>
