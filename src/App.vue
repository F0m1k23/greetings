<template>
	<div class="min-h-screen bg-base-100 flex flex-col">
		<div class="flex-1">
			<router-view />
		</div>

		<BottomNav />
	</div>
</template>

<script setup>
import BottomNav from '@/components/BottomNav.vue'
</script>
