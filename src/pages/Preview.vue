<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<div class="max-w-md mx-auto">
			<!-- КАРТИНКА -->
			<div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
				<div v-if="card" class="aspect-[3/4] bg-gray-100">
					<img
						:src="card.image"
						alt="Открытка"
						class="w-full h-full object-cover"
					/>
				</div>

				<div v-else class="p-8 text-center text-gray-500 bg-gray-50">
					<p class="text-lg">Открытка не найдена</p>
				</div>
			</div>

			<!-- КНОПКИ -->
			<div class="space-y-3">
				<button
					@click="sendToTelegram"
					:disabled="!card || sending"
					class="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ sending ? 'Отправка...' : '📤 Отправить' }}
				</button>

				<button
					@click="download"
					:disabled="!card"
					class="w-full py-4 px-6 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					⬇️ Скачать
				</button>

				<button
					@click="toggleFavorite"
					:disabled="!card"
					class="w-full py-4 px-6 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ isFav ? '⭐ Убрать из избранного' : '⭐ В избранное' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { templates } from '@/data/templates'
import { useFavoritesStore } from '@/app/store/favorites'
import { toast } from 'vue3-toastify'

const route = useRoute()
const favorites = useFavoritesStore()
const sending = ref(false)

const holiday = route.params.holiday
const cardId = route.params.id

const card = computed(() => {
	const list = templates[holiday]
	if (!list) return null
	return list.find(item => item.id === cardId) || null
})

const isFav = computed(() =>
	card.value
		? favorites.isFavorite({
				id: card.value.id,
				holiday,
		  })
		: false
)

const toggleFavorite = () => {
	if (!card.value) return
	const wasFav = isFav.value
	favorites.toggle({
		id: card.value.id,
		holiday,
		image: card.value.image,
	})
	if (wasFav) {
		toast.success('Удалено из избранного')
	} else {
		toast.success('Добавлено в избранное')
	}
}

const download = async () => {
	if (!card.value) return

	const res = await fetch(card.value.image)
	const blob = await res.blob()
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = 'postcard.jpg'
	a.click()

	URL.revokeObjectURL(url)

	toast.success('Открытка скачана')
}

const sendToTelegram = async () => {
	sending.value = true
	try {
		const res = await fetch(card.value.image)
		const blob = await res.blob()
		const formData = new FormData()
		formData.append('image', blob, 'postcard.jpg')
		const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
			method: 'POST',
			body: formData,
		})
		if (!uploadRes.ok) {
			throw new Error('Ошибка загрузки изображения')
		}
		const { imageId } = await uploadRes.json()
		const sendRes = await fetch(`${import.meta.env.VITE_API_URL}/send`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chatId: import.meta.env.VITE_BOT_CHAT_ID,
				imageId,
			}),
		})
		if (!sendRes.ok) {
			throw new Error('Ошибка отправки')
		}
		toast.success(
			'Изображение добавлено в бот! Перешлите его кому угодно из бота.'
		)
	} catch (error) {
		toast.error('Ошибка отправки: ' + error.message)
	} finally {
		sending.value = false
	}
}
</script>
