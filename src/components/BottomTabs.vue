<template>
	<!-- Нижняя навигационная панель с вкладками -->
	<nav class="h-16 bg-gray-900 border-t border-gray-600 flex pb-safe">
		<RouterLink
			v-for="tab in tabs"
			:key="tab.to"
			:to="tab.to"
			class="flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors"
			:class="$route.path === tab.to ? 'text-gray-100' : 'text-gray-500'"
		>
			<span class="text-lg">{{ tab.icon }}</span>
			{{ tab.label }}
		</RouterLink>
	</nav>
</template>

<script setup>
// Массив вкладок для навигации
const tabs = [
	{ label: 'Домой', to: '/', icon: '🏠' },
	{ label: 'Избранное', to: '/favorites', icon: '⭐' },
]
</script>
