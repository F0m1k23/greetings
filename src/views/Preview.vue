<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'

// ===== canvas =====
const canvasRef = ref(null)
const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

// ===== UI state =====
const loading = ref(false)
const error = ref('')
const activeTab = ref('presets') // presets | custom

// ===== images =====
const images = [
	{ id: 1, src: '/demo/1.jpg', title: 'Новый год' },
	{ id: 2, src: '/demo/2.jpg', title: 'День рождения' },
	{ id: 3, src: '/demo/3.jpg', title: 'Универсальная' },
]
const selectedImage = ref(images[0])

// ===== texts =====
const presetTexts = [
	'С Новым годом! Пусть сбудутся все мечты 🎄',
	'Счастья, здоровья и успехов в новом году ✨',
	'Пусть этот год будет лучше предыдущего 💫',
	'Тепла, радости и уюта тебе ❤️',
]
const selectedPreset = ref(presetTexts[0])
const customText = ref('')

// ===== styles =====
const textStyles = {
	classic: {
		label: 'Классический',
		font: s => `bold ${s}px serif`,
		color: '#ffffff',
	},
	modern: {
		label: 'Современный',
		font: s => `600 ${s}px Inter, sans-serif`,
		color: '#ffffff',
	},
	italic: {
		label: 'Курсив',
		font: s => `italic ${s}px Georgia`,
		color: '#ffffff',
	},
	accent: {
		label: 'Акцент',
		font: s => `bold ${s}px sans-serif`,
		color: '#ffd700',
	},
}
const selectedStyle = ref('classic')

// ===== frame =====
const frames = {
	none: {
		label: 'Без рамки',
		draw: () => {},
	},
	white: {
		label: 'Белая',
		draw: (ctx, w, h) => {
			ctx.strokeStyle = '#ffffff'
			ctx.lineWidth = 16
			ctx.strokeRect(8, 8, w - 16, h - 16)
		},
	},
	dark: {
		label: 'Тёмная',
		draw: (ctx, w, h) => {
			ctx.strokeStyle = 'rgba(0,0,0,.6)'
			ctx.lineWidth = 20
			ctx.strokeRect(10, 10, w - 20, h - 20)
		},
	},
}
const selectedFrame = ref('none')

// ===== font size =====
const fontSize = ref(36)

// ===== computed text =====
const finalText = computed(() =>
	activeTab.value === 'custom' ? customText.value : selectedPreset.value
)

// ===== render =====
function render() {
	draw({
		imageSrc: selectedImage.value.src,
		text: finalText.value,
		textStyle: {
			...textStyles[selectedStyle.value],
			shadow: {
				color: 'rgba(0,0,0,.7)',
				blur: 6,
				x: 2,
				y: 2,
			},
		},
		frame: frames[selectedFrame.value],
		fontSize: fontSize.value,
	})
}

onMounted(render)
watch(
	[
		selectedImage,
		selectedPreset,
		customText,
		selectedStyle,
		selectedFrame,
		fontSize,
		activeTab,
	],
	render
)

// ===== send =====
async function sendGreeting() {
	error.value = ''

	try {
		loading.value = true

		const blob = await toBlob()
		if (!blob) throw new Error('Canvas empty')

		// upload
		const fd = new FormData()
		fd.append('image', blob, 'greeting.png')

		const uploadRes = await fetch('https://bot-645s.onrender.com/upload', {
			method: 'POST',
			body: fd,
		})
		const { imageId } = await uploadRes.json()

		const chatId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
		if (!chatId) throw new Error('Откройте приложение через Telegram')

		// send
		await fetch('https://bot-645s.onrender.com/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chatId, imageId }),
		})

		window.Telegram.WebApp.close()
	} catch (e) {
		error.value = e.message
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen bg-gray-900 text-white p-4 space-y-4">
		<!-- preview -->
		<canvas
			ref="canvasRef"
			width="1080"
			height="1350"
			class="w-full rounded-xl border border-gray-700"
		/>

		<!-- image -->
		<select v-model="selectedImage" class="w-full p-2 bg-gray-800 rounded">
			<option v-for="img in images" :key="img.id" :value="img">
				{{ img.title }}
			</option>
		</select>

		<!-- text tabs -->
		<div class="flex gap-2">
			<button
				class="flex-1 py-2 rounded"
				:class="activeTab === 'presets' ? 'bg-indigo-600' : 'bg-gray-700'"
				@click="activeTab = 'presets'"
			>
				Готовый текст
			</button>
			<button
				class="flex-1 py-2 rounded"
				:class="activeTab === 'custom' ? 'bg-indigo-600' : 'bg-gray-700'"
				@click="activeTab = 'custom'"
			>
				Свой текст
			</button>
		</div>

		<select
			v-if="activeTab === 'presets'"
			v-model="selectedPreset"
			class="w-full p-2 bg-gray-800 rounded"
		>
			<option v-for="(t, i) in presetTexts" :key="i" :value="t">
				{{ t }}
			</option>
		</select>

		<textarea
			v-else
			v-model="customText"
			placeholder="Введите текст поздравления"
			class="w-full p-2 bg-gray-800 rounded"
		/>

		<!-- style -->
		<select v-model="selectedStyle" class="w-full p-2 bg-gray-800 rounded">
			<option v-for="(s, key) in textStyles" :key="key" :value="key">
				{{ s.label }}
			</option>
		</select>

		<!-- frame -->
		<select v-model="selectedFrame" class="w-full p-2 bg-gray-800 rounded">
			<option v-for="(f, key) in frames" :key="key" :value="key">
				{{ f.label }}
			</option>
		</select>

		<!-- font size -->
		<input type="range" min="24" max="60" v-model="fontSize" />

		<!-- send -->
		<button
			class="w-full bg-indigo-600 py-3 rounded-xl disabled:opacity-50"
			:disabled="loading"
			@click="sendGreeting"
		>
			{{ loading ? 'Отправка…' : 'Отправить открытку' }}
		</button>

		<p v-if="error" class="text-red-400 text-sm text-center">
			{{ error }}
		</p>
	</div>
</template>
