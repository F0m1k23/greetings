<template>
	<div class="bg-black text-white min-h-screen">
		<div class="container mx-auto px-4 py-8 max-w-2xl">
			<button class="back-link mb-6" @click="$router.back()">← Назад</button>

			<div v-if="image" class="space-y-6">
				<div class="text-center">
					<h2
						class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
					>
						Создать открытку
					</h2>
					<p class="text-gray-400 text-sm">Выберите текст и настройте дизайн</p>
				</div>

				<div class="relative max-w-md mx-auto">
					<canvas
						ref="canvasRef"
						class="w-full rounded-2xl shadow-2xl border border-purple-500/20"
						:width="canvasWidth"
						:height="canvasHeight"
					></canvas>

					<div ref="buttonsRef" class="absolute top-2 right-2 flex gap-2 z-10">
						<button
							class="icon-btn"
							@click="toggle(image.id)"
							aria-label="Добавить в избранное"
						>
							<svg
								class="w-5 h-5"
								:class="
									isFavorite(image.id) ? 'text-yellow-400' : 'text-white/70'
								"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2 text-purple-300"
							>Выберите текст поздравления</label
						>
						<select
							v-model="text"
							class="modern-select w-full p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
						>
							<option value="" disabled>Выберите текст...</option>
							<option
								v-for="(txt, index) in categoryTexts"
								:key="index"
								:value="txt"
								class="bg-gray-800 text-white"
							>
								{{ txt.substring(0, 60) }}...
							</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2 text-purple-300"
							>Или введите свой текст</label
						>
						<textarea
							v-model="text"
							class="w-full p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 text-white placeholder-gray-400 resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
							rows="3"
							placeholder="Напишите свое поздравление..."
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<label class="block text-sm font-medium text-purple-300"
								>Размер текста</label
							>
							<input
								v-model.number="fontSize"
								type="range"
								min="20"
								max="60"
								class="custom-slider w-full"
							/>
							<div class="text-xs text-gray-400 text-center">
								{{ fontSize }}px
							</div>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-medium text-purple-300"
								>Цвет текста</label
							>
							<input
								v-model="textColor"
								type="color"
								class="custom-color w-full h-12 rounded-lg border-2 border-purple-500/30 cursor-pointer"
							/>
						</div>
					</div>

					<button
						@click="sendGreeting"
						class="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						:disabled="!text.trim()"
					>
						✨ Отправить открытку ✨
					</button>
				</div>
			</div>

			<div v-else class="muted">Изображение не найдено</div>
		</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import texts from '../data/texts'
import { useFavorites } from '../composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggle } = useFavorites()

const canvasRef = ref(null)
const buttonsRef = ref(null)
const image = ref(null)
const text = ref('')
const fontSize = ref(32)
const textColor = ref('#ffffff')

const canvasWidth = 400
const canvasHeight = 600

const categoryTexts = computed(() => {
	if (!image.value) return []
	return texts[image.value.categoryId] || []
})

onMounted(() => {
	try {
		image.value = JSON.parse(route.query.image)
		if (image.value) {
			// Set default text from category
			const defaultTexts = texts[image.value.categoryId] || []
			text.value = defaultTexts[0] || 'С праздником!'
			// Draw after text is set
			setTimeout(() => drawCanvas(), 100)
		}
	} catch (e) {
		console.error('Failed to parse image:', e)
	}
})

watch([text, fontSize, textColor], () => {
	if (image.value) drawCanvas()
})

function drawCanvas() {
	const canvas = canvasRef.value
	if (!canvas || !image.value) return

	const ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvasWidth, canvasHeight)

	// Draw background image
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = () => {
		ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

		// Draw text background (glass effect)
		ctx.font = `bold ${fontSize.value}px Inter, sans-serif`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'

		// Simple text wrapping
		const words = text.value.split(' ')
		const lines = []
		let currentLine = ''
		const maxWidth = canvasWidth - 40

		for (const word of words) {
			const testLine = currentLine + (currentLine ? ' ' : '') + word
			const metrics = ctx.measureText(testLine)
			if (metrics.width > maxWidth && currentLine) {
				lines.push(currentLine)
				currentLine = word
			} else {
				currentLine = testLine
			}
		}
		lines.push(currentLine)

		const lineHeight = fontSize.value * 1.2
		const totalHeight = lines.length * lineHeight
		const textY = (canvasHeight - totalHeight) / 2 + fontSize.value / 2

		// Calculate background rectangle
		const padding = 20
		const bgWidth =
			Math.max(...lines.map(line => ctx.measureText(line).width)) + padding * 2
		const bgHeight = totalHeight + padding * 2
		const bgX = (canvasWidth - bgWidth) / 2
		const bgY = textY - fontSize.value / 2 - padding

		// Draw glass background
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
		ctx.fillRect(bgX, bgY, bgWidth, bgHeight)

		// Draw text
		ctx.fillStyle = textColor.value
		let y = textY
		for (const line of lines) {
			ctx.fillText(line, canvasWidth / 2, y)
			y += lineHeight
		}
	}
	img.src = image.value.src
}

function sendGreeting() {
	if (window.Telegram?.WebApp) {
		window.Telegram.WebApp.sendData(
			JSON.stringify({
				type: 'send_greeting',
				imageId: image.value.id,
				caption: text.value,
				fontSize: fontSize.value,
				textColor: textColor.value,
			})
		)
	} else {
		alert('Открытка создана! В Telegram Mini App она будет отправлена.')
	}
}
</script>

<style scoped>
.custom-slider {
	-webkit-appearance: none;
	appearance: none;
	height: 8px;
	background: linear-gradient(90deg, #7c3aed, #a855f7);
	border-radius: 4px;
	outline: none;
	cursor: pointer;
}

.custom-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 20px;
	height: 20px;
	background: #ffffff;
	border: 2px solid #7c3aed;
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-slider::-moz-range-thumb {
	width: 20px;
	height: 20px;
	background: #ffffff;
	border: 2px solid #7c3aed;
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

select {
	background: linear-gradient(135deg, #1a1a2e, #16213e);
	border: 1px solid rgba(147, 51, 234, 0.3);
	color: #ffffff;
	padding: 0.75rem;
	border-radius: 8px;
	font-size: 0.875rem;
	cursor: pointer;
	transition: border-color 0.2s;
}

select:focus {
	outline: none;
	border-color: #7c3aed;
	box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

select option {
	background: #1a1a2e;
	color: #ffffff;
}

.modern-select {
	background-image: linear-gradient(45deg, transparent 50%, #7c3aed 50%),
		linear-gradient(135deg, #7c3aed 50%, transparent 50%);
	background-position: calc(100% - 20px) calc(1em + 2px),
		calc(100% - 15px) calc(1em + 2px);
	background-size: 5px 5px, 5px 5px;
	background-repeat: no-repeat;
	appearance: none;
	cursor: pointer;
}
</style>
