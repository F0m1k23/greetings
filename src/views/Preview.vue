<script setup>
import { ref, watch, onMounted } from 'vue'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'

const canvasRef = ref(null)
const loading = ref(false)
const error = ref('')
const uiState = ref('editor') // editor | sending | done

const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

// пример данных (у тебя они уже есть)
const imageSrc = ref('/demo.jpg')
const text = ref('С Новым годом!')
const fontSize = ref(36)

onMounted(render)
watch([text, fontSize], render)

function render() {
	draw({
		imageSrc: imageSrc.value,
		text: text.value,
		textStyle: {
			font: size => `bold ${size}px serif`,
			color: '#ffffff',
			shadow: { color: 'rgba(0,0,0,.6)', blur: 6, x: 2, y: 2 },
		},
		frame: null,
		fontSize: fontSize.value,
	})
}

async function sendGreeting() {
	error.value = ''

	if (!window.Telegram?.WebApp) {
		error.value = 'Откройте приложение через Telegram'
		return
	}

	try {
		loading.value = true
		uiState.value = 'sending'

		const blob = await toBlob()
		if (!blob) throw new Error('Canvas empty')

		const formData = new FormData()
		formData.append('image', blob, 'greeting.png')

		const response = await fetch('https://bot-645s.onrender.com/upload', {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) throw new Error('Upload failed')

		const { imageId } = await response.json()
		if (!imageId) throw new Error('Invalid server response')

		window.Telegram.WebApp.sendData(
			JSON.stringify({ type: 'image_uploaded', imageId })
		)

		uiState.value = 'done'

		setTimeout(() => {
			window.Telegram.WebApp.close()
		}, 1200)
	} catch (e) {
		error.value = e.message || 'Ошибка отправки'
		uiState.value = 'editor'
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen bg-gray-900 text-white p-4">
		<!-- EDITOR -->
		<div v-if="uiState === 'editor'" class="space-y-4">
			<canvas
				ref="canvasRef"
				width="1080"
				height="1350"
				class="w-full rounded-lg border border-gray-700"
			/>

			<textarea v-model="text" class="w-full p-2 bg-gray-800 rounded" />

			<button
				class="w-full bg-indigo-600 py-3 rounded disabled:opacity-50"
				:disabled="loading"
				@click="sendGreeting"
			>
				{{ loading ? 'Отправляем…' : 'Отправить открытку' }}
			</button>

			<p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
		</div>

		<!-- DONE -->
		<div v-if="uiState === 'done'" class="text-center py-24">
			<div class="text-5xl mb-4">✅</div>
			<p class="text-lg font-semibold">Открытка создана</p>
			<p class="text-sm text-gray-400 mt-2">Выберите получателя в чате бота</p>
		</div>
	</div>
</template>
