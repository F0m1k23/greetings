<template>
	<div class="page space-y-4">
		<button class="back-link" @click="$router.back()">← Назад</button>

		<div v-if="card">
			<h2 class="page-title">{{ card.title }}</h2>

			<div v-if="loading" class="text-center muted mt-8">Загрузка...</div>
			<div v-else-if="error" class="text-center muted mt-8">{{ error }}</div>
			<div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
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
import { computed, ref, onMounted } from 'vue'
import cards from '../data/cards'
import { useFavorites } from '../composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggle } = useFavorites()

const card = computed(() => cards.find(c => c.id === Number(route.params.id)))

const categoryImages = ref([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
	if (!card.value) return
	loading.value = true
	error.value = ''

	// First, load local images as fallback
	try {
		const imagesModule = await import('../data/images.js')
		categoryImages.value = imagesModule.default.filter(
			img => img.categoryId === card.value.id
		)
	} catch (e) {
		console.error('Local images load error:', e)
		categoryImages.value = []
	}

	// Then try to load from API if available
	try {
		const r = await fetch(
			`/api/unsplash/search?query=${encodeURIComponent(
				card.value.title
			)}&perPage=12`
		)
		if (r.ok) {
			const json = await r.json()
			if (json.results && json.results.length > 0) {
				categoryImages.value = json.results
				error.value = ''
			}
		}
	} catch (e) {
		console.error('API load error:', e)
		// Keep local images, no error message
	} finally {
		loading.value = false
	}
})

function openPreview(image) {
	router.push({
		name: 'preview',
		query: { image: JSON.stringify(image) },
	})
}

function shareImage(image) {
	if (window.Telegram?.WebApp) {
		window.Telegram.WebApp.sendData(
			JSON.stringify({
				type: 'share_image',
				image: {
					src: image.src,
					title: image.title,
					author: image.author,
					unsplashUrl: image.unsplashUrl,
				},
			})
		)
	} else {
		navigator.clipboard?.writeText(image.src)
		alert('Ссылка на изображение скопирована в буфер обмена')
	}
}
</script>
