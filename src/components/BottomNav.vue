<template>
	<div
		class="btm-nav flex justify-around bg-gradient-to-r from-slate-100 to-slate-200 shadow-xl py-3 px-2 rounded-t-2xl backdrop-blur-sm"
	>
		<button :class="{ active: isActive('/') }" @click="go('/')">
			<span class="text-2xl transition-all duration-300">🏠</span>
			<span class="btm-nav-label transition-all duration-300">Главная</span>
		</button>

		<button
			:class="{ active: isActive('/favorites') }"
			@click="go('/favorites')"
		>
			<span class="text-2xl transition-all duration-300">⭐</span>
			<span class="btm-nav-label transition-all duration-300">Избранное</span>
		</button>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const go = path => router.push(path)
const isActive = path => route.path === path
</script>
