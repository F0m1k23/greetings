<template>
	<!-- Основной layout приложения -->
	<div class="min-h-screen flex flex-col bg-gray-900">
		<!-- Шапка приложения -->
		<header class="app-header bg-gray-900 border-b border-gray-700 px-4 py-3">
			<div class="flex items-center justify-center">
				<div class="logo flex items-center gap-3">
					<div
						class="logo-icon p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
					>
						<i class="fas fa-gift text-white text-lg"></i>
					</div>
					<div>
						<h1
							class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
						>
							GreetingCard Pro
						</h1>
					</div>
				</div>
			</div>
		</header>

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
