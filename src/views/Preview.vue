<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'
import { useFavorites } from '@/composables/useFavorites'
import readyCards from '@/data/readyCards'

// ===== route =====
const route = useRoute()
const isReadyCard = computed(() => route.query.type === 'ready')
const cardId = computed(() => route.query.cardId || route.query.imageId)

// ===== canvas =====
const canvasRef = ref(null)
const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

// ===== favorites =====
const { addCard } = useFavorites()

// ===== state =====
const image = ref(null)
const text = ref('С праздником!')
const fontSize = ref(36)
const loading = ref(false)
const message = ref('')
const readyCard = ref(null)

// ===== onMounted =====
onMounted(() => {
	if (isReadyCard.value) {
		readyCard.value = readyCards.find(card => card.id === cardId.value)
		if (readyCard.value) {
			image.value = {
				id: readyCard.value.id,
				src: readyCard.value.image,
			}
			// Для готовых открыток не рисуем текст, просто показываем изображение
			renderReady()
		}
	} else {
		// Prefer route.query.imageId when initializing selectedImage; otherwise pick first filtered image.
		const imageIdFromRoute = route?.query?.imageId
		if (imageIdFromRoute) {
			const found = images.find(i => String(i.id) === String(imageIdFromRoute))
			if (found) {
				image.value = found
				return
			}
		}

		if (filteredImages.value.length > 0) {
			image.value = filteredImages.value[0]
		}
		render()
	}
})

// ===== render =====
function render() {
	if (!image.value) return

	draw({
		imageSrc: image.value.src,
		text: text.value,
		fontSize: fontSize.value,
		textStyle: {
			color: '#ffffff',
			font: 'bold',
			shadow: {
				color: 'rgba(0,0,0,.7)',
				blur: 6,
				x: 2,
				y: 2,
			},
		},
		textPosition: 'bottom',
	})
}

function renderReady() {
	if (!image.value) return

	// Для готовых открыток просто рисуем изображение без текста
	draw({
		imageSrc: image.value.src,
		text: '',
		fontSize: 0,
	})
}

// ===== watchers =====
watch([text, fontSize], () => {
	if (!isReadyCard.value) render()
})

// ===== actions =====
async function download() {
	try {
		loading.value = true
		const blob = await toBlob()
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = 'greeting.png'
		a.click()

		URL.revokeObjectURL(url)
		show('Открытка скачана')
	} catch {
		show('Ошибка при скачивании')
	} finally {
		loading.value = false
	}
}

async function send() {
	try {
		loading.value = true
		const blob = await toBlob()

		if (window.Telegram?.WebApp) {
			// Конвертируем blob в base64
			const reader = new FileReader()
			reader.onload = function () {
				const base64 = reader.result
				// Отправляем данные в бота
				window.Telegram.WebApp.sendData(
					JSON.stringify({
						type: 'greeting_card',
						image: base64,
						timestamp: Date.now(),
					})
				)
				show('Открытка отправлена!')
			}
			reader.readAsDataURL(blob)
		} else {
			show('Откройте приложение через Telegram')
		}
	} catch (error) {
		console.error('Ошибка отправки:', error)
		show('Ошибка при отправке')
	} finally {
		loading.value = false
	}
}

function favorite() {
	addCard({
		image: image.value.src,
		text: text.value,
		fontSize: fontSize.value,
		createdAt: new Date().toISOString(),
	})
	show('Добавлено в избранное')
}

function favoriteReady() {
	if (readyCard.value) {
		addCard({
			image: readyCard.value.image,
			text: readyCard.value.title,
			fontSize: 36,
			createdAt: new Date().toISOString(),
		})
		show('Готовая открытка добавлена в избранное')
	}
}

function show(textMsg) {
	message.value = textMsg
	setTimeout(() => (message.value = ''), 2500)
}
</script>

<template>
	<div class="min-h-screen bg-gray-900 text-white p-4">
		<div class="max-w-md mx-auto space-y-6">
			<div class="flex items-center gap-4">
				<button
					@click="$router.back()"
					class="text-gray-400 hover:text-white transition-colors"
				>
					<i class="fas fa-arrow-left text-xl"></i>
				</button>
				<h1 class="text-xl font-semibold">
					{{
						isReadyCard
							? readyCard?.title || 'Готовая открытка'
							: 'Превью открытки'
					}}
				</h1>
			</div>
			<!-- preview -->
			<div class="rounded-xl overflow-hidden border border-gray-700">
				<canvas
					ref="canvasRef"
					width="1080"
					height="1350"
					class="w-full block"
				/>
			</div>

			<!-- text editing (only for editable cards) -->
			<template v-if="!isReadyCard">
				<!-- text -->
				<textarea
					v-model="text"
					class="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-lg"
					rows="3"
					placeholder="Введите поздравление"
				/>

				<!-- font size -->
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span>Размер текста</span>
						<span>{{ fontSize }} px</span>
					</div>
					<input
						type="range"
						min="24"
						max="72"
						v-model="fontSize"
						class="w-full"
					/>
				</div>
			</template>

			<!-- actions -->
			<div class="grid grid-cols-3 gap-3">
				<button
					v-if="!isReadyCard"
					@click="favorite"
					class="py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition-colors"
				>
					❤️ Избр.
				</button>
				<button
					v-else
					@click="favoriteReady"
					class="py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition-colors"
				>
					❤️ Избр.
				</button>

				<button
					@click="download"
					:disabled="loading"
					class="py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition-colors"
				>
					⬇ Скачать
				</button>

				<button
					@click="send"
					:disabled="loading"
					class="py-4 rounded-xl bg-green-600 hover:bg-green-700 font-semibold transition-colors"
				>
					📨 Отправить
				</button>
			</div>
		</div>

		<!-- message -->
		<div
			v-if="message"
			class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full"
		>
			{{ message }}
		</div>
	</div>
</template>
