<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
	>
		<div class="max-w-6xl mx-auto px-6 py-8 pb-24">
			<!-- Hero Section -->
			<div class="text-center mb-12">
				<div
					class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
				>
					<i class="fas fa-gift text-white text-3xl"></i>
				</div>
				<h1
					class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4"
				>
					GreetingCard Pro
				</h1>
				<p class="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
					Создавайте персональные открытки за минуты. Выберите готовый дизайн
					или настройте свой уникальный.
				</p>
			</div>

			<!-- Action Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<!-- Create Card -->
				<div
					@click="goToCreate"
					class="group relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div class="relative z-10">
						<div class="flex items-center justify-between mb-6">
							<div
								class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
							>
								<i class="fas fa-palette text-white text-2xl"></i>
							</div>
							<div class="text-purple-300">
								<i
									class="fas fa-arrow-right text-xl group-hover:translate-x-2 transition-transform duration-300"
								></i>
							</div>
						</div>
						<h3 class="text-2xl font-bold text-white mb-3">Создать открытку</h3>
						<p class="text-purple-200 leading-relaxed">
							Полностью настройте дизайн: выберите фон, добавьте текст, рамки и
							эффекты. Создайте что-то уникальное для любого случая.
						</p>
						<div class="mt-6 flex items-center text-purple-300 font-medium">
							<span>Начать создание</span>
							<i class="fas fa-chevron-right ml-2 text-sm"></i>
						</div>
					</div>
				</div>

				<!-- Select Card -->
				<div
					@click="goToSelect"
					class="group relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-teal-600/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div class="relative z-10">
						<div class="flex items-center justify-between mb-6">
							<div
								class="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
							>
								<i class="fas fa-images text-white text-2xl"></i>
							</div>
							<div class="text-blue-300">
								<i
									class="fas fa-arrow-right text-xl group-hover:translate-x-2 transition-transform duration-300"
								></i>
							</div>
						</div>
						<h3 class="text-2xl font-bold text-white mb-3">
							Готовая коллекция
						</h3>
						<p class="text-blue-200 leading-relaxed">
							Выберите из нашей тщательно подобранной коллекции открыток.
							Качественные дизайны для любого праздника и события.
						</p>
						<div class="mt-6 flex items-center text-blue-300 font-medium">
							<span>Посмотреть коллекцию</span>
							<i class="fas fa-chevron-right ml-2 text-sm"></i>
						</div>
					</div>
				</div>
			</div>

			<!-- Features -->
			<div class="mt-16 text-center">
				<h2 class="text-2xl font-bold text-gray-200 mb-8">
					Почему выбирают нас
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					<div
						class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
					>
						<div
							class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4"
						>
							<i class="fas fa-bolt text-white"></i>
						</div>
						<h4 class="text-lg font-semibold text-white mb-2">
							Быстро и просто
						</h4>
						<p class="text-gray-400 text-sm">
							Создайте открытку за считанные минуты без специальных навыков
						</p>
					</div>
					<div
						class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
					>
						<div
							class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4"
						>
							<i class="fas fa-star text-white"></i>
						</div>
						<h4 class="text-lg font-semibold text-white mb-2">
							Высокое качество
						</h4>
						<p class="text-gray-400 text-sm">
							Профессиональные дизайны с высоким разрешением для печати
						</p>
					</div>
					<div
						class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
					>
						<div
							class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4"
						>
							<i class="fas fa-heart text-white"></i>
						</div>
						<h4 class="text-lg font-semibold text-white mb-2">
							Для любого случая
						</h4>
						<p class="text-gray-400 text-sm">
							Широкая коллекция открыток для праздников, дней рождения и особых
							моментов
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCreate() {
	router.push('/holiday-selection')
}

function goToSelect() {
	router.push('/categories')
}
</script>
