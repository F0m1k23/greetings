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
			<h2 class="text-3xl font-bold text-gray-900">⭐ Избранное</h2>
		</div>

		<Transition
			enter-from-class="opacity-0"
			enter-active-class="transition-opacity duration-300 ease-in-out"
			enter-to-class="opacity-100"
		>
			<div
				v-if="favoriteImages.length === 0"
				class="flex flex-col items-center justify-center py-12"
			>
				<Star class="w-16 h-16 text-gray-300 mb-4" />
				<p class="text-gray-500 text-center text-lg">
					Вы ещё ничего не добавили в избранное
				</p>
				<p class="text-gray-400 text-sm mt-2">
					Отметьте звёздочкой понравившиеся открытки 💛
				</p>
			</div>
		</Transition>

		<div v-if="favoriteImages.length > 0">
			<p class="text-gray-600 mb-6">
				Всего открыток:
				<span class="font-bold text-gray-900">{{ favoriteImages.length }}</span>
			</p>

			<TransitionGroup
				tag="div"
				class="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl"
				enter-from-class="opacity-0 scale-95"
				enter-active-class="transition-all duration-300 ease-out"
				enter-to-class="opacity-100 scale-100"
			>
				<div
					v-for="image in favoriteImages"
					:key="image.id"
					@click="openPreview(image)"
					class="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95"
					style="aspect-ratio: 9 / 11.25"
				>
					<img
						:src="image.url"
						class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>

					<!-- Star icon -->
					<div class="absolute top-3 right-3">
						<Star class="w-6 h-6 text-yellow-400 fill-yellow-400" />
					</div>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { images } from '../data/images'
import { useFavorites } from '../composables/useFavorites'
import { ArrowLeft, Star } from 'lucide-vue-next'

const router = useRouter()
const { favorites } = useFavorites()

const favoriteImages = computed(() =>
	images.filter(img => favorites.value.includes(img.id))
)

const openPreview = image => {
	router.push({
		path: '/preview',
		query: { id: image.id },
	})
}

const goBack = () => {
	router.push('/')
}
</script>
