<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
	>
		<div class="max-w-6xl mx-auto px-6 py-8 pb-24">
			<!-- Header -->
			<div class="flex items-center gap-4 mb-8">
				<button
					@click="goBack"
					class="w-12 h-12 rounded-2xl bg-gray-800/80 hover:bg-gray-700/90 flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm border border-gray-700"
				>
					<i class="fas fa-arrow-left text-lg"></i>
				</button>
				<div class="flex-1">
					<h1 class="text-3xl font-bold text-white mb-2">Категории открыток</h1>
					<p class="text-gray-400 text-lg">
						Выберите праздник и найдите идеальную открытку
					</p>
				</div>
			</div>

			<!-- Categories Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					v-for="card in cards"
					:key="card.id"
					@click="openGallery(card)"
					class="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div class="relative z-10">
						<div class="flex items-center justify-between mb-4">
							<div
								class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
							>
								<span class="text-2xl">{{ card.icon }}</span>
							</div>
							<div
								class="text-gray-400 group-hover:text-white transition-colors"
							>
								<i
									class="fas fa-arrow-right text-xl group-hover:translate-x-2 transition-transform duration-300"
								></i>
							</div>
						</div>
						<h3 class="text-xl font-bold text-white mb-2">{{ card.title }}</h3>
						<p class="text-gray-400 text-sm leading-relaxed mb-4">
							{{ card.tags.join(', ') }}
						</p>
						<div class="flex items-center text-blue-400 font-medium">
							<span>Посмотреть открытки</span>
							<i class="fas fa-chevron-right ml-2 text-sm"></i>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="mt-12 text-center">
				<div
					class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 max-w-md mx-auto"
				>
					<div class="text-3xl mb-2">🎨</div>
					<h3 class="text-lg font-semibold text-white mb-2">
						Готовая коллекция
					</h3>
					<p class="text-gray-400 text-sm">
						Более {{ cards.length }} категорий праздников с сотнями уникальных
						дизайнов
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
// Импорты Vue и компонентов
import { useRouter } from 'vue-router'
import cards from '@/data/cards'

// Инициализация роутера
const router = useRouter()

// Функция для открытия галереи выбранной категории
function openGallery(card) {
	router.push({ name: 'gallery', params: { id: card.id } })
}

function goBack() {
	router.go(-1)
}
</script>
