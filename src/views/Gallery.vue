<template>
	<!-- Страница галереи изображений категории -->
	<div
		class="min-h-screen bg-gray-900 text-white p-5 max-w-4xl mx-auto pb-20 space-y-4"
	>
		<div class="flex items-center gap-4 mb-6">
			<button
				@click="$router.back()"
				class="text-gray-400 hover:text-white transition-colors"
			>
				<i class="fas fa-arrow-left text-xl"></i>
			</button>
		</div>

		<!-- Контент категории -->
		<div v-if="card">
			<h2 class="text-2xl font-semibold text-gray-100 mb-4">
				{{ card.title }}
			</h2>

			<!-- Сетка изображений -->
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
				<div
					v-for="image in categoryImages"
					:key="image.id"
					class="relative overflow-hidden rounded-lg border border-gray-600 cursor-pointer h-64 hover:border-gray-400 transition-colors"
					@click="openPreview(image.id)"
				>
					<img
						:src="image.preview || image.src"
						:alt="image.title"
						class="w-full h-full object-cover hover:scale-105 transition-transform"
						loading="lazy"
					/>
					<div
						class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"
					>
						<p class="text-white text-sm text-center">
							{{ image.title || 'Без названия' }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Сообщение, если категория не найдена -->
		<div v-else class="text-gray-400">Категория не найдена</div>
	</div>
</template>

<script setup>
// Импорты Vue и роутера
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

// Импорты данных и composables
import cards from '@/data/cards'
import readyCards from '@/data/readyCards'
import { useFavorites } from '@/composables/useFavorites'

// Инициализация роутера и избранного
const route = useRoute()
const router = useRouter()
const { isFavorite, toggle } = useFavorites()

// Вычисляемая текущая категория на основе ID из параметров роута
const card = computed(() => cards.find(c => c.id === Number(route.params.id)))

// Вычисляемый список готовых открыток для текущей категории
const categoryImages = computed(() =>
	readyCards.filter(item => item.categoryId === card.value?.id)
)

// Функция для открытия превью готовой открытки
function openPreview(cardId) {
	router.push({
		name: 'preview',
		query: { cardId, type: 'ready' },
	})
}
</script>
