<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'
import imagesData from '@/data/images.js'

// ===== canvas =====
const canvasRef = ref(null)
const { draw, toBlob } = useGreetingCanvas(canvasRef, 1080, 1350)

// ===== UI state =====
const loading = ref(false)
const error = ref('')
const activeTab = ref('presets') // presets | custom

// ===== images and categories =====
const categories = [
	{ id: 1, label: 'Новый год' },
	{ id: 2, label: 'День рождения' },
	{ id: 3, label: 'Свадьба' },
	{ id: 4, label: 'Спасибо' },
	{ id: 5, label: 'Рождество' },
	{ id: 6, label: '8 Марта' },
]

const selectedCategory = ref(1)
const images = imagesData
const filteredImages = computed(() =>
	images.filter(i => i.categoryId === selectedCategory.value)
)
const selectedImage = ref(filteredImages.value[0] || images[0])

// keep selectedImage in sync when category changes
watch(selectedCategory, () => {
	selectedImage.value = filteredImages.value[0] || images[0]
})

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
// fixed preview display width for no-scroll, standard postcard size (~500px)
const previewWidth = ref(540)
const previewHeight = computed(() =>
	Math.round((1350 * previewWidth.value) / 1080)
)

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

async function downloadPreview() {
	error.value = ''

	try {
		loading.value = true
		const blob = await toBlob()
		if (!blob) throw new Error('Canvas empty')
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'greeting.png'
		a.click()
		URL.revokeObjectURL(url)
	} catch (e) {
		error.value = e.message
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen bg-[#0d1117] text-slate-200 p-6">
		<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- canvas column -->
			<div class="lg:col-span-2">
				<div
					class="bg-[#010409] border border-gray-800 rounded-xl p-4 shadow-lg"
				>
					<div class="flex items-center justify-between mb-3">
						<h2 class="text-lg font-semibold">Предпросмотр открытки</h2>
						<div class="flex gap-2 items-center">
							<button
								class="ml-2 px-3 py-1 bg-slate-700 rounded text-sm"
								@click="downloadPreview"
							>
								Скачать
							</button>
						</div>
					</div>

					<div
						class="rounded-lg border border-gray-800 bg-black p-3 flex justify-center"
					>
						<div
							:style="{
								width: previewWidth + 'px',
								height: previewHeight + 'px',
							}"
							class="overflow-hidden rounded-md border border-gray-700 bg-black"
						>
							<canvas
								ref="canvasRef"
								width="1080"
								height="1350"
								:style="{
									width: previewWidth + 'px',
									height: previewHeight + 'px',
									display: 'block',
								}"
							/>
						</div>
					</div>
				</div>

				<div class="mt-4">
					<div class="mb-2 flex items-center gap-2">
						<label class="text-sm text-slate-400">Категория:</label>
						<select
							v-model="selectedCategory"
							class="p-1 bg-slate-800 rounded text-sm"
						>
							<option v-for="c in categories" :key="c.id" :value="c.id">
								{{ c.label }}
							</option>
						</select>
					</div>

					<div class="grid grid-cols-3 gap-3">
						<div
							v-for="img in filteredImages"
							:key="img.id"
							class="cursor-pointer"
							@click="selectedImage = img"
						>
							<div
								class="h-24 w-full rounded-md overflow-hidden border border-gray-800"
								:class="
									selectedImage.id === img.id ? 'ring-2 ring-indigo-500' : ''
								"
							>
								<img
									:src="img.src"
									:alt="img.title"
									class="object-cover h-full w-full"
								/>
							</div>
							<div class="text-xs text-slate-400 mt-1 text-center">
								{{ img.title }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- controls column -->
			<aside class="space-y-4">
				<div
					class="bg-[#010409] border border-gray-800 rounded-xl p-4 shadow-sm"
				>
					<h3 class="text-sm font-medium text-slate-300 mb-2">Текст</h3>
					<div class="flex gap-2 mb-3">
						<button
							:class="
								activeTab === 'presets'
									? 'bg-indigo-600 text-white'
									: 'bg-slate-700 text-slate-300'
							"
							class="flex-1 py-2 rounded"
							@click="activeTab = 'presets'"
						>
							Готовый
						</button>
						<button
							:class="
								activeTab === 'custom'
									? 'bg-indigo-600 text-white'
									: 'bg-slate-700 text-slate-300'
							"
							class="flex-1 py-2 rounded"
							@click="activeTab = 'custom'"
						>
							Свой
						</button>
					</div>

					<div v-if="activeTab === 'presets'" class="space-y-2">
						<div
							v-for="(t, i) in presetTexts"
							:key="i"
							class="p-2 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer"
							@click="selectedPreset = t"
						>
							<div class="text-sm">{{ t }}</div>
						</div>
					</div>

					<textarea
						v-else
						v-model="customText"
						placeholder="Введите текст"
						class="w-full mt-2 p-2 bg-slate-900 rounded h-28 text-sm"
					/>
				</div>

				<div
					class="bg-[#010409] border border-gray-800 rounded-xl p-4 shadow-sm"
				>
					<h3 class="text-sm font-medium text-slate-300 mb-2">Стиль и рамка</h3>
					<select
						v-model="selectedStyle"
						class="w-full p-2 bg-slate-800 rounded mb-2"
					>
						<option v-for="(s, key) in textStyles" :key="key" :value="key">
							{{ s.label }}
						</option>
					</select>

					<select
						v-model="selectedFrame"
						class="w-full p-2 bg-slate-800 rounded mb-2"
					>
						<option v-for="(f, key) in frames" :key="key" :value="key">
							{{ f.label }}
						</option>
					</select>

					<div class="mt-2">
						<label class="text-sm text-slate-400"
							>Размер шрифта: {{ fontSize }}</label
						>
						<input
							type="range"
							min="24"
							max="60"
							v-model="fontSize"
							class="w-full mt-1"
						/>
					</div>
				</div>

				<div
					class="bg-[#010409] border border-gray-800 rounded-xl p-4 shadow-sm"
				>
					<h3 class="text-sm font-medium text-slate-300 mb-2">Действия</h3>
					<button
						class="w-full bg-indigo-600 py-2 rounded mb-2"
						:disabled="loading"
						@click="sendGreeting"
					>
						{{ loading ? 'Отправка…' : 'Отправить в Telegram' }}
					</button>
					<button
						class="w-full bg-slate-700 py-2 rounded"
						@click="downloadPreview"
					>
						Скачать PNG
					</button>

					<p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>
				</div>
			</aside>
		</div>
	</div>
</template>
