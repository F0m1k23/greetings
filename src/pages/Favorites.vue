<template>
	<div class="p-4 pb-20">
		<h2 class="text-lg font-semibold mb-4">⭐ Избранное</h2>

		<Transition
			enter-from-class="opacity-0"
			enter-active-class="transition-opacity duration-150 ease-in-out"
			enter-to-class="opacity-100"
		>
			<div v-if="favoriteImages.length === 0" class="text-sm text-gray-500">
				Вы ещё ничего не добавили
			</div>
		</Transition>

		<div v-if="favoriteImages.length > 0">
			<TransitionGroup
				tag="div"
				class="grid grid-cols-2 gap-3"
				enter-from-class="opacity-0 translate-y-1"
				enter-active-class="transition-all duration-150 ease-in-out"
				enter-to-class="opacity-100 translate-y-0"
			>
				<div
					v-for="image in favoriteImages"
					:key="image.id"
					@click="openPreview(image)"
					class="card overflow-hidden cursor-pointer soft-transition transition-colors transition-transform duration-150 ease-in-out hover:shadow-lg active:scale-95"
				>
					<img
						:src="image.url"
						class="w-full h-40 object-cover transition-opacity duration-150"
					/>
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
</script>
