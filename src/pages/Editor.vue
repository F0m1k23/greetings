<template>
	<div class="min-h-screen bg-gray-50">
		<!-- HEADER -->
		<header class="bg-white shadow-sm p-4 sticky top-0 z-10">
			<h1 class="text-xl font-bold text-center text-gray-800">
				🎨 Генератор открыток
			</h1>
		</header>

		<!-- PREVIEW -->
		<div class="p-4 bg-white">
			<div
				class="max-w-sm mx-auto bg-gray-100 rounded-2xl shadow-lg overflow-hidden"
			>
				<div class="p-4 bg-gray-200">
					<canvas
						ref="canvasRef"
						class="w-full rounded-xl bg-gray-300"
					></canvas>
				</div>
			</div>
		</div>

		<!-- SETTINGS TABS -->
		<div class="bg-white flex-1">
			<div class="flex justify-center p-2 border-b border-gray-200">
				<button
					:class="[
						'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
						activeTab === 'general'
							? 'text-blue-600 border-b-2 border-blue-600'
							: 'text-gray-500 hover:text-gray-700',
					]"
					@click="activeTab = 'general'"
				>
					Общее
				</button>
				<button
					:class="[
						'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
						activeTab === 'text'
							? 'text-blue-600 border-b-2 border-blue-600'
							: 'text-gray-500 hover:text-gray-700',
					]"
					@click="activeTab = 'text'"
				>
					Текст
				</button>
				<button
					:class="[
						'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
						activeTab === 'frame'
							? 'text-blue-600 border-b-2 border-blue-600'
							: 'text-gray-500 hover:text-gray-700',
					]"
					@click="activeTab = 'frame'"
				>
					Рамка
				</button>
			</div>

			<div class="p-4 space-y-6">
				<!-- GENERAL TAB -->
				<div v-if="activeTab === 'general'" class="space-y-6">
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Праздник
						</label>
						<select
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
							v-model="holiday"
							@change="onHolidayChange"
						>
							<option value="newyear">🎄 Новый год</option>
							<option value="birthday">🎂 День рождения</option>
							<option value="universal">🎁 Универсальные</option>
						</select>
					</div>

					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm font-medium text-gray-700 mb-3">Картинка</p>
						<div class="flex overflow-x-auto space-x-3 pb-2">
							<div
								v-for="img in (images || []).filter(img => img && img.image)"
								:key="img.id"
								class="flex-shrink-0"
							>
								<img
									:src="img.image"
									class="w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all"
									:class="
										img.image === selectedImageSrc
											? 'border-blue-500 scale-105 shadow-lg'
											: 'border-transparent hover:border-gray-300'
									"
									@click="selectImage(img.image)"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- TEXT TAB -->
				<div v-if="activeTab === 'text'" class="space-y-6">
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm font-medium text-gray-700 mb-3">
							Текст поздравления
						</p>
						<select
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer mb-3"
							v-model="textMode"
							@change="draw"
						>
							<option value="preset">Готовый текст</option>
							<option value="custom">Свой текст</option>
						</select>

						<select
							v-if="textMode === 'preset'"
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
							v-model="text"
							@change="draw"
						>
							<option v-for="t in texts" :key="t" :value="t">
								{{ t }}
							</option>
						</select>

						<textarea
							v-else
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							rows="4"
							placeholder="Введите свой текст"
							v-model="text"
							@input="draw"
						></textarea>
					</div>

					<div class="bg-white rounded-xl p-4 shadow-sm">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Размер текста
						</label>
						<input
							type="range"
							min="22"
							max="72"
							v-model="textSize"
							class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							@input="draw"
						/>
						<div class="text-sm text-center mt-1 text-gray-600">
							{{ textSizeNum }}px
						</div>
					</div>

					<div class="bg-white rounded-xl p-4 shadow-sm">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Позиция текста
						</label>
						<div class="flex space-x-2">
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textPosition === 'top'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setPosition('top')"
							>
								Верх
							</button>
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textPosition === 'center'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setPosition('center')"
							>
								Центр
							</button>
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textPosition === 'bottom'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setPosition('bottom')"
							>
								Низ
							</button>
						</div>
					</div>

					<div class="bg-white rounded-xl p-4 shadow-sm">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Цвет текста
						</label>
						<input
							type="color"
							v-model="textColor"
							class="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
							@input="draw"
						/>
					</div>

					<div
						class="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
					>
						<div class="flex items-center space-x-3">
							<input
								type="checkbox"
								class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
								v-model="textStroke"
								@change="draw"
							/>
							<span class="text-sm font-medium text-gray-700"
								>Мягкая обводка текста</span
							>
						</div>
					</div>

					<div class="bg-white rounded-xl p-4 shadow-sm">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Оформление текста
						</label>
						<div class="flex space-x-2">
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textBox === 'none'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setTextBox('none')"
							>
								Без
							</button>
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textBox === 'soft'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setTextBox('soft')"
							>
								Фон
							</button>
							<button
								:class="[
									'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
									textBox === 'border'
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
								]"
								@click="setTextBox('border')"
							>
								Рамка
							</button>
						</div>
					</div>
				</div>

				<!-- FRAME TAB -->
				<div v-if="activeTab === 'frame'" class="space-y-4">
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm font-medium text-gray-700 mb-3">Выберите рамку</p>
						<div class="grid grid-cols-2 gap-3">
							<button
								v-for="frame in (frames || []).filter(
									frame => frame && frame.id
								)"
								:key="frame.id"
								:class="[
									'p-4 rounded-xl border-2 transition-all',
									selectedFrame.value && selectedFrame.value.id === frame.id
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200 hover:border-gray-300',
								]"
								@click="selectFrame(frame)"
								cursor-pointer
							>
								<div class="text-center">
									<div class="font-medium mb-1">{{ frame.title }}</div>
									<div class="text-xs text-gray-500">
										{{ frame.pro ? 'PRO' : 'Бесплатно' }}
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ACTIONS -->
		<div class="bg-white p-4 border-t border-gray-200">
			<div class="flex space-x-3 max-w-sm mx-auto">
				<button
					@click="download"
					class="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
				>
					⬇️ Скачать
				</button>
				<button
					@click="openSendModal"
					class="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
				>
					📤 Отправить
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { templates } from '@/data/templates'
import { editorTexts } from '@/data/editorTexts'
import frames from '@/data/editorFrames'
import { toast } from 'vue3-toastify'

const canvasRef = ref(null)
let ctx

// ===== STATE =====
const holiday = ref('newyear')
const images = ref([])
const texts = ref([])

const selectedImageSrc = ref('')
const image = ref(null)

const textMode = ref('preset')
const text = ref('')
const textSize = ref(36)
const textSizeNum = computed(() => Number(textSize.value))
const textPosition = ref('bottom')
const textColor = ref('#ffffff')
const textStroke = ref(true)
const textBox = ref('soft')
const selectedFrame = ref(null)
const activeTab = ref('general')
const showSendModal = ref(false)
const recipient = ref('')
const sending = ref(false)

// ===== INIT =====
onMounted(() => {
	const canvas = canvasRef.value
	canvas.width = 800
	canvas.height = 1000
	ctx = canvas.getContext('2d')
	onHolidayChange()
})

// ===== WATCH =====
watch([textSize, textPosition], draw)

// ===== HELPERS =====
function calculateLines(ctx, text, maxWidth) {
	const words = text.split(' ')
	let line = ''
	const lines = []

	for (let w of words) {
		const test = line + w + ' '
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line.trim())
			line = w + ' '
		} else {
			line = test
		}
	}

	if (line) lines.push(line.trim())
	return lines
}

// ===== DRAW =====
function draw() {
	if (!image.value) return

	ctx.clearRect(0, 0, 800, 1000)
	ctx.drawImage(image.value, 0, 0, 800, 1000)

	ctx.font = `bold ${textSizeNum.value}px sans-serif`
	ctx.textAlign = 'center'
	ctx.textBaseline = 'top'

	const padding = 60
	const maxWidth = 800 - padding * 2
	const lineHeight = textSizeNum.value + 12

	const lines = calculateLines(ctx, text.value, maxWidth)
	const blockHeight = lines.length * lineHeight

	let startY = 1000 - blockHeight - 80
	if (textPosition.value === 'top') startY = 80
	if (textPosition.value === 'center') startY = (1000 - blockHeight) / 2

	// TEXT BOX
	if (textBox.value !== 'none') {
		const boxPad = 28
		const boxX = padding - boxPad
		const boxY = startY - boxPad
		const boxW = maxWidth + boxPad * 2
		const boxH = blockHeight + boxPad * 2

		if (textBox.value === 'soft') {
			ctx.fillStyle = 'rgba(0,0,0,0.35)'
			ctx.fillRect(boxX, boxY, boxW, boxH)
		}

		if (textBox.value === 'border') {
			ctx.strokeStyle = 'rgba(255,255,255,0.6)'
			ctx.lineWidth = 2
			ctx.strokeRect(boxX, boxY, boxW, boxH)
		}
	}

	// TEXT
	ctx.fillStyle = textColor.value

	if (textStroke.value) {
		ctx.strokeStyle = 'rgba(0,0,0,0.45)'
		ctx.lineWidth = Math.max(2, textSizeNum.value / 14)
	}

	lines.forEach((line, i) => {
		const y = startY + i * lineHeight
		if (textStroke.value) ctx.strokeText(line, 400, y)
		ctx.fillText(line, 400, y)
	})

	// FRAME
	if (selectedFrame.value) {
		selectedFrame.value.draw(ctx)
	}
}

// ===== ACTIONS =====
function onHolidayChange() {
	images.value = (templates[holiday.value] || templates.universal || []).filter(
		Boolean
	)
	texts.value = editorTexts[holiday.value] || editorTexts.universal || []
	text.value = texts.value[0] || ''
	selectImage(images.value[0]?.image)

	// Initialize selectedFrame if not set
	if (!selectedFrame.value && frames.length > 0) {
		selectedFrame.value = frames[0]
	}
}

function selectImage(src) {
	if (!src) return
	selectedImageSrc.value = src
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.src = src
	img.onload = () => {
		image.value = img
		draw()
	}
}

function setPosition(pos) {
	textPosition.value = pos
	draw()
}

function setTextBox(type) {
	textBox.value = type
	draw()
}

function selectFrame(frame) {
	selectedFrame.value = frame
	draw()
}

function download() {
	const link = document.createElement('a')
	link.href = canvasRef.value.toDataURL('image/png')
	link.download = 'postcard.png'
	link.click()
	toast.success('Открытка успешно скачана!')
}

function openSendModal() {
	console.log('openSendModal called')
	showSendModal.value = true
	recipient.value = ''
}

async function sendToTelegram() {
	console.log('API URL:', import.meta.env.VITE_API_URL)

	if (!recipient.value.trim()) return

	sending.value = true

	try {
		const blob = await new Promise((resolve, reject) => {
			canvasRef.value.toBlob(
				b => (b ? resolve(b) : reject(new Error('Blob generation failed'))),
				'image/png'
			)
		})

		const formData = new FormData()
		formData.append('image', blob, 'postcard.png')

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
				chatId: recipient.value,
				imageId,
			}),
		})

		if (!sendRes.ok) {
			throw new Error('Ошибка отправки')
		}

		toast.success('Открытка отправлена!')
		showSendModal.value = false
	} catch (error) {
		toast.error('Ошибка отправки: ' + error.message)
	} finally {
		sending.value = false
	}
}
</script>
