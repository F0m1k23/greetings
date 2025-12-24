<script setup>
// Импорты Vue и данных
import { computed } from 'vue'
import images from '@/data/images'
import { useFavorites } from '@/composables/useFavorites'

// Инициализация composable для избранного
const { favorites, remove } = useFavorites()

// Вычисляемый список избранных изображений
const favoriteImages = computed(() =>
	images.filter(img => favorites.value.includes(img.id))
)

// Функция для удаления изображения из избранного
function removeFromFavorites(id) {
	remove(id)
}
</script>

<template>
	<!-- Страница избранных изображений -->
	<div class="p-5 max-w-4xl mx-auto pb-20 space-y-4">
		<h1 class="text-2xl font-semibold text-gray-100">Избранное</h1>

		<!-- Сетка избранных изображений -->
		<div
			v-if="favoriteImages.length"
			class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4"
		>
			<div
				v-for="image in favoriteImages"
				:key="image.id"
				class="relative overflow-hidden rounded-lg border border-gray-600 h-64"
			>
				<img
					:src="image.src"
					:alt="image.title"
					class="w-full h-full object-cover"
				/>
				<!-- Кнопка удаления из избранного -->
				<div class="absolute top-2 right-2">
					<button
						class="w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700 flex items-center justify-center"
						@click="removeFromFavorites(image.id)"
						aria-label="Удалить из избранного"
					>
						<svg
							class="w-4 h-4 text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
				<!-- Подпись изображения -->
				<div
					class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"
				>
					<p class="text-white text-sm text-center">{{ image.title }}</p>
				</div>
			</div>
		</div>

		<!-- Сообщение, если избранное пусто -->
		<div v-else class="text-center text-gray-400">Избранное пусто</div>
	</div>
</template>
