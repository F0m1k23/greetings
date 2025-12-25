<template>
	<div class="btm-nav flex justify-around bg-base-200 shadow-lg py-2">
		<button :class="{ active: isActive('/') }" @click="go('/')">
			<span class="text-2xl">🏠</span>
			<span class="btm-nav-label">Главная</span>
		</button>

		<button
			:class="{ active: isActive('/favorites') }"
			@click="go('/favorites')"
		>
			<span class="text-2xl">⭐</span>
			<span class="btm-nav-label">Избранное</span>
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
