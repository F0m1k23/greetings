<template>
	<nav class="h-14 nav-glass border-t flex justify-around items-center">
		<!-- Home -->
		<RouterLink
			to="/"
			class="group flex flex-col items-center text-xs"
			:class="isActive('/')"
		>
			<Home
				class="w-5 h-5 mb-0.5 transition-transform duration-150 group-hover:scale-110"
			/>
			<span>Главная</span>
		</RouterLink>

		<!-- Favorites -->
		<RouterLink
			to="/favorites"
			class="group flex flex-col items-center text-xs"
			:class="isActive('/favorites')"
		>
			<Star
				class="w-5 h-5 mb-0.5 transition-transform duration-150 group-hover:scale-110"
			/>
			<span>Избранное</span>
		</RouterLink>
	</nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, Star } from 'lucide-vue-next'

const route = useRoute()

const isActive = path =>
	route.path === path ? 'text-blue-600' : 'text-gray-400'
</script>
