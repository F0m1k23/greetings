<template>
	<div class="min-h-screen flex flex-col bg-white">
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
