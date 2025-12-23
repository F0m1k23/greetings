<template>
	<nav class="bottom-tabs flex">
		<RouterLink
			v-for="tab in tabs"
			:key="tab.to"
			:to="tab.to"
			class="tab-link"
			:class="$route.path === tab.to ? 'tab-link--active' : ''"
		>
			<span class="text-lg">{{ tab.icon }}</span>
			{{ tab.label }}
		</RouterLink>
	</nav>
</template>

<script setup>
const tabs = [
	{ label: 'Домой', to: '/', icon: '🏠' },
	{ label: 'Избранное', to: '/favorites', icon: '⭐' },
]
</script>
