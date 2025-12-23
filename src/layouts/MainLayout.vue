<template>
	<div class="app-shell">
		<main class="flex-1 overflow-y-auto">
			<router-view />
		</main>

		<BottomTabs />
	</div>
</template>

<script setup>
import BottomTabs from '../components/BottomTabs.vue'
</script>
