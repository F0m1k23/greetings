<script setup>
import { ref } from 'vue'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'

const canvasRef = ref(null)
const loading = ref(false)
const error = ref('')

const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

async function sendGreeting() {
	error.value = ''

	// ✅ Проверка Telegram-контекста
	if (!window.Telegram?.WebApp) {
		error.value = 'Откройте приложение через Telegram'
		return
	}

	try {
		loading.value = true

		const blob = await toBlob()
		if (!blob) throw new Error('Canvas empty')

		const formData = new FormData()
		formData.append('image', blob, 'greeting.png')

		const response = await fetch('https://bot-645s.onrender.com/upload', {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			throw new Error('Upload failed')
		}

		const data = await response.json()

		if (!data.imageId) {
			throw new Error('Invalid server response')
		}

		// ✅ Отправка данных в Telegram
		window.Telegram.WebApp.sendData(
			JSON.stringify({
				type: 'image_uploaded',
				imageId: data.imageId,
			})
		)
	} catch (e) {
		error.value = e.message || 'Ошибка отправки'
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="p-4">
		<canvas ref="canvasRef" width="1080" height="1350" />

		<button
			class="mt-4 w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
			:disabled="loading"
			@click="sendGreeting"
		>
			{{ loading ? 'Отправляем…' : 'Отправить открытку' }}
		</button>

		<p v-if="error" class="mt-2 text-red-500 text-sm">
			{{ error }}
		</p>
	</div>
</template>
