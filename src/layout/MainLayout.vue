<template>
	<div class="min-h-screen flex flex-col bg-gray-50">
		<!-- Content -->
		<main class="flex-1 overflow-y-auto">
			<router-view />
		</main>

		<!-- Bottom Navigation -->
		<BottomNav />
	</div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>
<style scoped></style>
