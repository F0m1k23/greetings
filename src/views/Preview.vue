<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import images from '@/data/images'
import texts from '@/data/texts'
import { textStyles } from '@/data/textStyles'
import { frames } from '@/data/frames'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'

const canvasRef = ref(null)
const uiState = ref('editor') // editor | sending | done
const loading = ref(false)
const error = ref('')

const selectedImage = ref(images[0])
const selectedText = ref('')
const selectedStyle = ref('classic')
const selectedFrame = ref('none')
const fontSize = ref(36)

const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

const presetTexts = computed(() => {
	return texts[selectedImage.value.categoryId] || []
})

onMounted(() => {
	selectedText.value = presetTexts.value[0] || ''
	render()
})

watch(
	[selectedImage, selectedText, selectedStyle, selectedFrame, fontSize],
	render
)

function render() {
	draw({
		imageSrc: selectedImage.value.src,
		text: selectedText.value,
		textStyle: textStyles[selectedStyle.value],
		frame: frames[selectedFrame.value],
		fontSize: fontSize.value,
	})
}

async function sendGreeting() {
	error.value = ''

	if (!window.Telegram?.WebApp) {
		error.value = 'Откройте через Telegram'
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
		if (!imageId) throw new Error('Invalid response')

		window.Telegram.WebApp.sendData(
			JSON.stringify({ type: 'image_uploaded', imageId })
		)

		uiState.value = 'done'
		setTimeout(() => window.Telegram.WebApp.close(), 1200)
	} catch (e) {
		error.value = e.message
		uiState.value = 'editor'
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen bg-gray-900 text-white p-4">
		<div v-if="uiState === 'editor'" class="space-y-4">
			<canvas
				ref="canvasRef"
				width="1080"
				height="1350"
				class="w-full rounded-lg border border-gray-700"
			/>

			<select v-model="selectedImage" class="w-full p-2 bg-gray-800 rounded">
				<option v-for="img in images" :key="img.id" :value="img">
					{{ img.title }}
				</option>
			</select>

			<select v-model="selectedText" class="w-full p-2 bg-gray-800 rounded">
				<option v-for="(t, i) in presetTexts" :key="i" :value="t">
					{{ t }}
				</option>
			</select>

			<select v-model="selectedStyle" class="w-full p-2 bg-gray-800 rounded">
				<option v-for="(s, key) in textStyles" :key="key" :value="key">
					{{ s.label }}
				</option>
			</select>

			<select v-model="selectedFrame" class="w-full p-2 bg-gray-800 rounded">
				<option v-for="(f, key) in frames" :key="key" :value="key">
					{{ f.label }}
				</option>
			</select>

			<input type="range" min="20" max="64" v-model.number="fontSize" />

			<button
				class="w-full bg-indigo-600 py-3 rounded"
				:disabled="loading"
				@click="sendGreeting"
			>
				{{ loading ? 'Отправляем…' : 'Отправить открытку' }}
			</button>

			<p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
		</div>

		<div v-if="uiState === 'done'" class="text-center py-24">
			<div class="text-5xl mb-4">✅</div>
			<p class="text-lg font-semibold">Открытка создана</p>
			<p class="text-sm text-gray-400 mt-2">Выберите получателя в чате бота</p>
		</div>
	</div>
</template>
