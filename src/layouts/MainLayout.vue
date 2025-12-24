<template>
	<!-- Основной layout приложения -->
	<div class="min-h-screen flex flex-col">
		<!-- Основной контент с прокруткой -->
		<main class="flex-1 overflow-y-auto">
			<router-view />
		</main>

		<!-- Нижние вкладки навигации -->
		<BottomTabs />
	</div>
</template>

<script setup>
// Импорт компонента нижних вкладок
import BottomTabs from '@/components/BottomTabs.vue'
</script>
