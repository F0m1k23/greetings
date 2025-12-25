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

	try {
		const res = await fetch(card.value.image)
		const blob = await res.blob()

		// Если в Telegram Web App
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.showPopup({
				title: 'Открытка готова!',
				message: 'Длинное нажатие на изображение для сохранения',
				buttons: [
					{
						type: 'default',
						text: 'OK',
					},
				],
			})
			setTimeout(() => {
				alert(
					'Изображение готово! Используйте функцию "Сохранить изображение" вашего браузера.'
				)
			}, 100)
		} else {
			// Для обычного браузера
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'postcard.jpg'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}

		toast.success('Открытка готова!')
	} catch (error) {
		toast.error('Ошибка скачивания: ' + error.message)
	}
}

const sendToTelegram = async () => {
	sending.value = true
	try {
		// 1. Получаем blob (ВАЖНО: без fetch внешнего URL)
		const blob = await new Promise((resolve, reject) => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = card.value.image
			img.onload = () => {
				const canvas = document.createElement('canvas')
				canvas.width = img.width
				canvas.height = img.height
				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0)
				canvas.toBlob(
					b => (b ? resolve(b) : reject(new Error('Blob error'))),
					'image/jpeg'
				)
			}
			img.onerror = () => reject(new Error('Image load error'))
		})

		// 2. Отправляем НА СЕРВЕР
		const formData = new FormData()
		formData.append('image', blob, 'postcard.jpg')

		const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
			method: 'POST',
			body: formData,
		})

		if (!uploadRes.ok) {
			throw new Error('Upload failed')
		}

		toast.success(
			'Открытка отправлена в бот. Вы можете переслать её кому угодно.'
		)
	} catch (e) {
		toast.error('Ошибка отправки: ' + e.message)
	} finally {
		sending.value = false
	}
}
</script>
