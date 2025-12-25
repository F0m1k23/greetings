<template>
	<div class="min-h-screen bg-base-200">
		<!-- HEADER -->
		<div class="bg-base-100 shadow-sm p-4">
			<h1 class="text-xl font-bold text-center">🎨 Генератор открыток</h1>
		</div>

		<!-- PREVIEW -->
		<div class="p-4 bg-base-100">
			<div class="card bg-base-200 shadow-lg max-w-sm mx-auto">
				<figure class="p-4">
					<canvas
						ref="canvasRef"
						class="w-full rounded-xl bg-black/10"
					></canvas>
				</figure>
			</div>
		</div>

		<!-- SETTINGS TABS -->
		<div class="bg-base-100 min-h-[50vh] flex flex-col items-center">
			<div class="tabs tabs-boxed justify-center p-4">
				<a
					:class="['tab', activeTab === 'general' && 'tab-active']"
					@click="activeTab = 'general'"
				>
					Общее
				</a>
				<a
					:class="['tab', activeTab === 'text' && 'tab-active']"
					@click="activeTab = 'text'"
				>
					Текст
				</a>
				<a
					:class="['tab', activeTab === 'frame' && 'tab-active']"
					@click="activeTab = 'frame'"
				>
					Рамка
				</a>
			</div>

			<div class="p-4 space-y-6">
				<!-- GENERAL TAB -->
				<div v-if="activeTab === 'general'" class="space-y-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text font-medium">Праздник</span>
						</label>
						<select
							class="select select-bordered select-lg"
							v-model="holiday"
							@change="onHolidayChange"
						>
							<option value="newyear">🎄 Новый год</option>
							<option value="birthday">🎂 День рождения</option>
							<option value="universal">🎁 Универсальные</option>
						</select>
					</div>

					<div>
						<p class="font-medium mb-3">Картинка</p>
						<div
							class="carousel carousel-center space-x-4 p-4 bg-base-200 rounded-lg"
						>
							<div
								v-for="img in (images || []).filter(img => img && img.image)"
								:key="img.id"
								class="carousel-item"
							>
								<img
									:src="img.image"
									class="w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all hover:scale-105"
									:class="
										img.image === selectedImageSrc
											? 'border-primary scale-105 shadow-lg'
											: 'border-transparent'
									"
									@click="selectImage(img.image)"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- TEXT TAB -->
				<div v-if="activeTab === 'text'" class="space-y-4">
					<div>
						<p class="font-medium mb-3">Текст поздравления</p>
						<select
							class="select select-bordered mb-3"
							v-model="textMode"
							@change="draw"
						>
							<option value="preset">Готовый текст</option>
							<option value="custom">Свой текст</option>
						</select>

						<select
							v-if="textMode === 'preset'"
							class="select select-bordered"
							v-model="text"
							@change="draw"
						>
							<option v-for="t in texts" :key="t" :value="t">
								{{ t }}
							</option>
						</select>

						<textarea
							v-else
							class="textarea textarea-bordered textarea-lg w-full"
							placeholder="Введите свой текст"
							v-model="text"
							@input="draw"
						></textarea>
					</div>

					<div>
						<label class="label">
							<span class="label-text font-medium">Размер текста</span>
						</label>
						<input
							type="range"
							min="22"
							max="72"
							v-model="textSize"
							class="range range-primary"
							@input="draw"
						/>
						<div class="text-sm text-center mt-1">{{ textSizeNum }}px</div>
					</div>

					<div>
						<label class="label">
							<span class="label-text font-medium">Позиция текста</span>
						</label>
						<div class="btn-group w-full">
							<button
								class="btn btn-sm"
								:class="textPosition === 'top' && 'btn-active'"
								@click="setPosition('top')"
							>
								Верх
							</button>
							<button
								class="btn btn-sm"
								:class="textPosition === 'center' && 'btn-active'"
								@click="setPosition('center')"
							>
								Центр
							</button>
							<button
								class="btn btn-sm"
								:class="textPosition === 'bottom' && 'btn-active'"
								@click="setPosition('bottom')"
							>
								Низ
							</button>
						</div>
					</div>

					<div>
						<label class="label">
							<span class="label-text font-medium">Цвет текста</span>
						</label>
						<input
							type="color"
							v-model="textColor"
							class="w-full h-12 rounded-lg border-2 border-base-300"
							@input="draw"
						/>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="checkbox"
								class="toggle toggle-primary"
								v-model="textStroke"
								@change="draw"
							/>
							<span class="label-text font-medium">Мягкая обводка текста</span>
						</label>
					</div>

					<div>
						<label class="label">
							<span class="label-text font-medium">Оформление текста</span>
						</label>
						<div class="btn-group w-full">
							<button
								class="btn btn-sm"
								:class="textBox === 'none' && 'btn-active'"
								@click="setTextBox('none')"
							>
								Без
							</button>
							<button
								class="btn btn-sm"
								:class="textBox === 'soft' && 'btn-active'"
								@click="setTextBox('soft')"
							>
								Фон
							</button>
							<button
								class="btn btn-sm"
								:class="textBox === 'border' && 'btn-active'"
								@click="setTextBox('border')"
							>
								Рамка
							</button>
						</div>
					</div>
				</div>

				<!-- FRAME TAB -->
				<div v-if="activeTab === 'frame'" class="space-y-4">
					<div>
						<p class="font-medium mb-3">Выберите рамку</p>
						<div class="grid grid-cols-2 gap-3">
							<button
								v-for="frame in (frames || []).filter(
									frame => frame && frame.id
								)"
								:key="frame.id"
								:class="[
									'btn btn-outline h-auto py-3',
									selectedFrame.value &&
										selectedFrame.value.id === frame.id &&
										'btn-active',
								]"
								@click="selectFrame(frame)"
							>
								<div class="text-center">
									<div class="text-lg mb-1">{{ frame.title }}</div>
									<div class="text-xs opacity-70">
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
		<div class="bg-base-100 p-4 border-t">
			<div class="flex gap-3 max-w-sm mx-auto">
				<button class="btn btn-primary flex-1" @click="download">
					⬇️ Скачать
				</button>
				<button class="btn btn-secondary flex-1" @click="send">
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

function send() {
	toast.info('Отправка в Telegram будет доступна в следующей версии')
}
</script>
