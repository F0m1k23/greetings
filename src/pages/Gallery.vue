<template>
	<div class="min-h-screen bg-white p-6 pb-24">
		<!-- Header with back button -->
		<div class="mb-8">
			<button
				@click="goBack"
				class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
			>
				<ArrowLeft class="w-5 h-5" />
				<span class="text-sm font-medium">Назад</span>
			</button>

			<!-- Title with counter on new line -->
			<h2 class="text-3xl font-bold text-gray-900 mb-3">
				{{ holidayTitle }}
			</h2>

			<!-- Transparent counter badge -->
			<div
				class="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
						clip-rule="evenodd"
					/>
				</svg>
				{{ filteredImages.length }} открыток
			</div>

			<p class="text-gray-500 text-base mt-4">Выберите открытку</p>
		</div>

		<!-- Gallery -->
		<TransitionGroup
			tag="div"
			class="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl"
			enter-from-class="opacity-0 scale-95"
			enter-active-class="transition-all duration-300 ease-out"
			enter-to-class="opacity-100 scale-100"
		>
			<div
				v-for="image in filteredImages"
				:key="image.id"
				@click="openPreview(image)"
				class="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95"
				style="aspect-ratio: 9 / 11.25"
			>
				<img
					:src="image.url"
					alt=""
					class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				<!-- Favorite button -->
				<button
					@click.stop="toggleFavorite(image.id)"
					aria-label="Избранное"
					class="absolute top-3 right-3 bg-white rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
				>
					<Star
						:class="[
							'w-5 h-5 transition-all duration-300',
							isFavorite(image.id)
								? 'text-yellow-400 fill-yellow-400'
								: 'text-gray-400',
						]"
					/>
				</button>
			</div>
		</TransitionGroup>

		<!-- Empty state -->
		<div
			v-if="filteredImages.length === 0"
			class="flex flex-col items-center justify-center py-12"
		>
			<div class="text-6xl mb-4">📭</div>
			<p class="text-gray-500 text-center">
				В этой категории пока нет открыток
			</p>
		</div>
	</div>
</template>

<script setup>
import { useFavorites } from '../composables/useFavorites'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, ArrowLeft } from 'lucide-vue-next'
import { images } from '../data/images'

const { isFavorite, toggleFavorite } = useFavorites()
const route = useRoute()
const router = useRouter()

// Получаем праздник из query
const holiday = route.query.holiday || 'universal'

// Человекочитаемые названия
const holidayMap = {
	'new-year': '🎄 Новый год',
	birthday: '🎂 День рождения',
	'march-8': '🌸 8 марта',
	easter: '🥚 Пасха',
	universal: '💝 Универсальные',
}

const holidayTitle = holidayMap[holiday] || 'Открытки'

// Фильтрация
const filteredImages = computed(() =>
	images.filter(img => img.holiday === holiday)
)

// Переход к просмотру
const openPreview = image => {
	router.push({
		path: '/preview',
		query: {
			id: image.id,
		},
	})
}

// Кнопка назад
const goBack = () => {
	router.push('/')
}
</script>
