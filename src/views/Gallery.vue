<template>
	<div class="page space-y-4">
		<button class="back-link" @click="$router.back()">← Назад</button>

		<div v-if="card">
			<h2 class="page-title">{{ card.title }}</h2>

			<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
				<div
					v-for="image in categoryImages"
					:key="image.id"
					class="image-tile h-64 cursor-pointer"
					@click="openPreview(image)"
				>
					<img :src="image.src" :alt="image.title" loading="lazy" />
					<div class="image-caption">
						<p>{{ image.title || 'Без названия' }}</p>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="muted">Категория не найдена</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import cards from '../data/cards'
import images from '../data/images'
import { useFavorites } from '../composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggle } = useFavorites()

const card = computed(() => cards.find(c => c.id === Number(route.params.id)))

const categoryImages = computed(() =>
	images.filter(img => img.categoryId === card.value?.id)
)

function openPreview(image) {
	router.push({
		name: 'preview',
		query: { image: JSON.stringify(image) },
	})
}
</script>
