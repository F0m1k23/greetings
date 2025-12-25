<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
				⭐ Избранные открытки
			</h1>

			<div
				v-if="favorites.length === 0"
				class="text-center py-12 text-gray-500"
			>
				<p class="text-lg">У вас пока нет избранных открыток</p>
				<p class="text-sm mt-2">
					Добавьте открытки в избранное, чтобы они отображались здесь
				</p>
			</div>

			<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					v-for="item in favorites"
					:key="`${item.holiday}-${item.id}`"
					class="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg"
				>
					<div class="aspect-[3/4] bg-gray-100">
						<img
							:src="item.image"
							alt="Открытка"
							class="w-full h-full object-cover"
						/>
					</div>

					<div class="p-4">
						<div class="flex space-x-3">
							<button
								@click="remove(item)"
								class="flex-1 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
							>
								Удалить
							</button>

							<router-link
								:to="`/preview/${item.holiday}/${item.id}`"
								class="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg text-center hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
							>
								Посмотреть
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useFavoritesStore } from '@/app/store/favorites'

const favoritesStore = useFavoritesStore()

// ⚠️ ВАЖНО: БЕЗ computed
const favorites = favoritesStore.allFavorites

function remove(item) {
	favoritesStore.toggle(item)
}
</script>
