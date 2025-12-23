<script setup>
import { computed } from 'vue'
import images from '../data/images'
import { useFavorites } from '../composables/useFavorites'

const { favorites, remove } = useFavorites()

const favoriteImages = computed(() =>
	images.filter(img => favorites.value.includes(img.id))
)

function removeFromFavorites(id) {
	remove(id)
}
</script>

<template>
	<div class="page space-y-4">
		<h1 class="page-title">Избранное</h1>

		<div
			v-if="favoriteImages.length"
			class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4"
		>
			<div
				v-for="image in favoriteImages"
				:key="image.id"
				class="image-tile h-64"
			>
				<img :src="`/images/${image.src}`" :alt="image.title" />
				<div class="absolute top-2 right-2 flex gap-1">
					<button
						class="icon-btn"
						@click="shareImage(image)"
						aria-label="Поделиться"
					>
						<svg
							class="w-4 h-4 text-white/70"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							></path>
						</svg>
					</button>
					<button
						class="icon-btn icon-btn--danger"
						@click="removeFromFavorites(image.id)"
						aria-label="Удалить из избранного"
					>
						<svg
							class="w-4 h-4 text-white"
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
				<div class="image-caption">
					<p>{{ image.title }}</p>
				</div>
			</div>
		</div>

		<div v-else class="text-center muted">Избранное пусто</div>
	</div>
</template>
