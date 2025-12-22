<template>
	<div class="p-4 pb-20">
		<!-- Header -->
		<div class="mb-4">
			<h2 class="text-lg font-semibold">
				{{ holidayTitle }}
			</h2>
			<p class="text-sm text-gray-500">Выберите открытку</p>
		</div>

		<!-- Gallery -->
		<TransitionGroup
			tag="div"
			class="grid grid-cols-2 gap-3"
			enter-from-class="opacity-0 translate-y-1"
			enter-active-class="transition-all duration-150 ease-in-out"
			enter-to-class="opacity-100 translate-y-0"
		>
			<div
				v-for="image in filteredImages"
				:key="image.id"
				@click="openPreview(image)"
				class="relative card overflow-hidden cursor-pointer soft-transition transition-colors transition-transform duration-150 ease-in-out hover:shadow-lg active:scale-95"
			>
				<img
					:src="image.url"
					alt=""
					class="w-full h-40 object-cover transition-opacity duration-150"
				/>

				<!-- Favorite button -->
				<button
					@click.stop="toggleFavorite(image.id)"
					aria-label="Избранное"
					class="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-2"
				>
					<Star
						:class="[
							'w-5 h-5 transition-transform transition-colors duration-150 ease-in-out hover:scale-110 active:scale-95',
							isFavorite(image.id)
								? 'text-yellow-500 fill-yellow-500'
								: 'text-gray-500',
						]"
					/>
				</button>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup>
import { useFavorites } from '../composables/useFavorites'

import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star } from 'lucide-vue-next'
import { images } from '../data/images'
const { isFavorite, toggleFavorite } = useFavorites()

const route = useRoute()
const router = useRouter()

// 1️⃣ Получаем праздник из query
const holiday = route.query.holiday || 'universal'

// 2️⃣ Человекочитаемые названия
const holidayMap = {
	'new-year': 'Новый год',
	birthday: 'День рождения',
	'march-8': '8 марта',
	easter: 'Пасха',
	universal: 'Универсальные',
}

const holidayTitle = holidayMap[holiday] || 'Открытки'

// 4️⃣ Фильтрация
const filteredImages = computed(() =>
	images.filter(img => img.holiday === holiday)
)

// ⭐ Избранное (пока локально)
const favorites = ref([])

// 5️⃣ Переход к просмотру
const openPreview = image => {
	router.push({
		path: '/preview',
		query: {
			id: image.id,
		},
	})
}
</script>
