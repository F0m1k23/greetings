<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white"
	>
		<div
			class="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 md:space-y-8"
		>
			<!-- Header -->
			<header class="flex items-center gap-3 sm:gap-4">
				<!-- <button
					@click="goBack"
					class="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/90 flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm border border-gray-700"
				>
					<i class="fas fa-arrow-left text-sm"></i>
				</button> -->
				<div class="flex-1 min-w-0">
					<h1 class="text-xl sm:text-2xl font-semibold truncate">
						Редактор открытки
					</h1>
					<p class="text-xs sm:text-sm text-gray-400 truncate">
						Создайте персональную открытку за минуту
					</p>
				</div>
			</header>

			<!-- Main layout -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
				<!-- Preview -->
				<section class="lg:col-span-2">
					<div
						class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm"
					>
						<div
							class="aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 shadow-inner border border-gray-700/30"
						>
							<canvas
								ref="canvasRef"
								:width="canvasWidth"
								:height="canvasHeight"
								class="w-full h-full object-contain"
							/>
						</div>
						<div class="mt-4 sm:mt-6 text-center">
							<p class="text-xs sm:text-sm text-gray-400">
								Превью открытки • Качество сохранится в оригинальном размере
							</p>
						</div>
					</div>
				</section>

				<!-- Controls -->
				<aside class="space-y-6 md:space-y-8">
					<!-- Templates -->
					<div
						class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/30"
					>
						<h3
							class="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center"
						>
							<i class="fas fa-th-large mr-2 text-gray-400"></i>
							Шаблон
						</h3>
						<div class="grid grid-cols-4 gap-2 sm:gap-3">
							<div
								v-for="image in availableImages.slice(0, 8)"
								:key="image.id"
								@click="selectImage(image)"
								:class="[
									'group relative cursor-pointer transition-all duration-200',
									selectedImage?.id === image.id
										? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900 rounded-xl'
										: '',
								]"
							>
								<div
									class="aspect-square rounded-xl overflow-hidden bg-gray-800/50 border-2 border-transparent group-hover:border-gray-600 transition-all duration-200"
								>
									<img
										:src="image.src"
										:alt="image.title"
										class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<div
									v-if="selectedImage?.id === image.id"
									class="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
								></div>
							</div>
						</div>
					</div>

					<!-- Frame -->
					<div
						class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/30"
					>
						<h3
							class="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center"
						>
							<i class="fas fa-crop-alt mr-2 text-gray-400"></i>
							Рамка
						</h3>
						<div class="grid grid-cols-5 gap-2">
							<button
								v-for="(frame, key) in frames"
								:key="key"
								@click="selectedFrame = key"
								:class="[
									'aspect-square rounded-xl bg-gray-800/70 border border-gray-700/50 flex items-center justify-center transition-all duration-200 relative hover:bg-gray-700/80 hover:scale-105 active:scale-95',
									selectedFrame === key
										? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30'
										: '',
								]"
								:title="frame.name"
							>
								<span
									class="text-lg sm:text-xl transition-transform group-hover:scale-110"
								>
									{{ frame.icon }}
								</span>
								<span
									v-if="isProFeature(key)"
									class="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full"
									>PRO</span
								>
								<div
									class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 truncate w-full px-1 hidden group-hover:block"
								>
									{{ frame.name }}
								</div>
							</button>
						</div>
					</div>

					<!-- Text -->
					<div
						class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/30 space-y-4"
					>
						<h3 class="text-sm sm:text-base font-semibold flex items-center">
							<i class="fas fa-font mr-2 text-gray-400"></i>
							Текст
						</h3>

						<textarea
							v-model="customText"
							rows="3"
							placeholder="Введите ваше поздравление..."
							class="w-full rounded-xl bg-gray-800/70 border border-gray-700/50 p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base placeholder-gray-500"
						/>

						<div class="relative">
							<select
								v-model="selectedPresetText"
								@change="applyPresetText"
								class="w-full bg-gray-800/70 border border-gray-700/50 rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base"
							>
								<option value="">📝 Готовые поздравления</option>
								<option v-for="(text, i) in presetTexts" :key="i" :value="text">
									{{ text.slice(0, 40) }}…
								</option>
							</select>
							<div
								class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
							>
								<i class="fas fa-chevron-down text-gray-400"></i>
							</div>
						</div>

						<div class="space-y-2">
							<div class="flex justify-between items-center">
								<label class="text-sm text-gray-400">
									<i class="fas fa-text-height mr-2"></i>
									Размер текста
								</label>
								<span
									class="text-sm font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg"
								>
									{{ fontSize }}px
								</span>
							</div>
							<input
								type="range"
								min="20"
								max="80"
								v-model="fontSize"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-300 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-300"
							/>
						</div>

						<div class="space-y-2">
							<label class="text-sm text-gray-400 flex items-center">
								<i class="fas fa-align-center mr-2"></i>
								Расположение текста
							</label>
							<div class="grid grid-cols-3 gap-2">
								<button
									@click="textPosition = 'top'"
									:class="[
										'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
										textPosition === 'top'
											? 'bg-purple-500/20 border border-purple-500 text-purple-400'
											: 'bg-gray-800/70 border border-gray-700/50 text-gray-400 hover:bg-gray-700/80',
									]"
								>
									<i class="fas fa-arrow-up mr-1"></i>
									Вверху
								</button>
								<button
									@click="textPosition = 'middle'"
									:class="[
										'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
										textPosition === 'middle'
											? 'bg-purple-500/20 border border-purple-500 text-purple-400'
											: 'bg-gray-800/70 border border-gray-700/50 text-gray-400 hover:bg-gray-700/80',
									]"
								>
									<i class="fas fa-align-center mr-1"></i>
									По центру
								</button>
								<button
									@click="textPosition = 'bottom'"
									:class="[
										'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
										textPosition === 'bottom'
											? 'bg-purple-500/20 border border-purple-500 text-purple-400'
											: 'bg-gray-800/70 border border-gray-700/50 text-gray-400 hover:bg-gray-700/80',
									]"
								>
									<i class="fas fa-arrow-down mr-1"></i>
									Внизу
								</button>
							</div>
						</div>

						<div class="grid grid-cols-5 gap-2">
							<button
								v-for="(style, key) in textStyles"
								:key="key"
								@click="selectedTextStyle = key"
								:class="[
									'aspect-square rounded-xl bg-gray-800/70 border border-gray-700/50 flex items-center justify-center transition-all duration-200 relative hover:bg-gray-700/80 hover:scale-105 active:scale-95',
									selectedTextStyle === key
										? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30'
										: '',
								]"
								:title="style.name"
							>
								<span
									class="text-lg sm:text-xl transition-transform group-hover:scale-110"
								>
									{{ style.icon }}
								</span>
								<span
									v-if="isProFeature(key)"
									class="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full"
									>PRO</span
								>
								<div
									class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 truncate w-full px-1 hidden group-hover:block"
								>
									{{ style.name }}
								</div>
							</button>
						</div>
					</div>

					<!-- Text Color -->
					<div
						class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/30"
					>
						<h3
							class="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center"
						>
							<i class="fas fa-palette mr-2 text-gray-400"></i>
							Цвет текста
						</h3>
						<div class="grid grid-cols-5 gap-2">
							<button
								v-for="color in [
									'#FFFFFF',
									'#000000',
									'#EF4444',
									'#3B82F6',
									'#FBBF24',
									'#10B981',
									'#8B5CF6',
									'#F97316',
									'#EC4899',
									'#6B7280',
								]"
								:key="color"
								@click="textColor = color"
								:class="[
									'w-8 h-8 rounded-full border-2 transition-all duration-200',
									textColor === color
										? 'border-purple-500 scale-110'
										: 'border-gray-600 hover:border-gray-400',
								]"
								:style="{ backgroundColor: color }"
							></button>
						</div>
					</div>

					<!-- Text Outline -->
					<div
						class="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-700/30"
					>
						<h3
							class="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center"
						>
							<i class="fas fa-bold mr-2 text-gray-400"></i>
							Обводка текста
						</h3>
						<div class="flex items-center justify-between">
							<label class="text-sm text-gray-400">Включить обводку</label>
							<button
								@click="textOutline = !textOutline"
								:class="[
									'w-12 h-6 rounded-full transition-all duration-200 relative',
									textOutline ? 'bg-purple-500' : 'bg-gray-600',
								]"
							>
								<div
									:class="[
										'w-5 h-5 rounded-full bg-white transition-all duration-200 absolute top-0.5',
										textOutline ? 'left-6.5' : 'left-0.5',
									]"
								></div>
							</button>
						</div>
					</div>

					<!-- Actions -->
					<div class="space-y-3 pt-4 border-t border-gray-700/50">
						<button
							@click="addToFavorites"
							class="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 font-medium py-3 sm:py-4 rounded-xl transition-all duration-200 active:scale-95 border border-purple-500/30 flex items-center justify-center group"
						>
							<i
								class="fas fa-heart mr-2 transition-transform group-hover:scale-110"
							></i>
							<span>В избранное</span>
						</button>
						<button
							@click="saveImage"
							class="w-full bg-gray-800/70 hover:bg-gray-700/80 text-white font-medium py-3 sm:py-4 rounded-xl transition-all duration-200 active:scale-95 border border-gray-700/50 flex items-center justify-center group"
						>
							<i
								class="fas fa-download mr-2 transition-transform group-hover:scale-110"
							></i>
							<span>Сохранить</span>
						</button>
						<button
							@click="sendCard"
							class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 sm:py-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 group"
						>
							<i
								class="fas fa-paper-plane mr-2 transition-transform group-hover:scale-110"
							></i>
							<span>Отправить</span>
						</button>
					</div>
				</aside>
			</div>
		</div>

		<!-- Message -->
		<div
			v-if="message"
			class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full text-white"
		>
			{{ message }}
		</div>

		<!-- PRO Modal -->
		<div
			v-if="showProModal"
			class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
			@click.self="showProModal = false"
		>
			<div
				class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-gray-700/50 shadow-2xl animate-[scale-in_0.2s_ease-out]"
			>
				<div
					class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30"
				>
					<i class="fas fa-crown text-2xl text-purple-400"></i>
				</div>
				<h3 class="text-xl font-semibold">PRO версия</h3>
				<p class="text-gray-400 text-sm">
					Эта функция доступна только в PRO версии. Откройте все возможности
					редактора!
				</p>
				<div class="flex gap-3 pt-2">
					<button
						@click="showProModal = false"
						class="flex-1 bg-gray-800/70 hover:bg-gray-700/80 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95 border border-gray-700/50"
					>
						Позже
					</button>
					<button
						@click="showProModal = false"
						class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
					>
						Подробнее
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'
import { useFavorites } from '@/composables/useFavorites'
import images from '@/data/images'
import { frames } from '@/data/frames'
import { textStyles } from '@/data/textStyles'
import texts from '@/data/texts'

const router = useRouter()
const route = useRoute()

const canvasRef = ref(null)
const canvasWidth = 1080
const canvasHeight = 1350

const selectedImage = ref(null)
const selectedFrame = ref('none')
const selectedTextStyle = ref('classic')
const customText = ref('С праздником!')
const fontSize = ref(64)
const selectedPresetText = ref('')
const textPosition = ref('middle')
const textColor = ref('#FFFFFF')
const textOutline = ref(false)
const isPro = ref(false)
const message = ref('')

const holidayId = route.query.holiday
const availableImages = computed(() =>
	images.filter(i => i.categoryId == holidayId)
)
const presetTexts = computed(() => texts[holidayId] || [])

const { draw, toBlob, toDataURL } = useGreetingCanvas(
	canvasRef,
	canvasWidth,
	canvasHeight
)

function isProFeature(key) {
	return ['golden', 'neon', 'romantic', 'elegant', 'festive'].includes(key)
}

function selectImage(image) {
	selectedImage.value = image
}

function applyPresetText() {
	customText.value = selectedPresetText.value
}

async function addToFavorites() {
	if (!selectedImage.value) return

	try {
		// Убедимся, что canvas обновлен
		await draw({
			imageSrc: selectedImage.value.src,
			text: customText.value,
			textStyle: {
				...textStyles[selectedTextStyle.value],
				color: textColor.value,
				outline: textOutline.value,
			},
			frame: frames[selectedFrame.value],
			fontSize: fontSize.value,
			textPosition: textPosition.value,
		})
		const dataUrl = toDataURL()
		const { addCard } = useFavorites()
		addCard({
			image: dataUrl, // Сохраняем data URL с текстом
			text: customText.value,
			fontSize: fontSize.value,
			textStyle: selectedTextStyle.value,
			frame: selectedFrame.value,
			textPosition: textPosition.value,
			textColor: textColor.value,
			textOutline: textOutline.value,
			holiday: holidayId.value,
			imageId: selectedImage.value.id,
			createdAt: new Date().toISOString(),
		})
		showMessage('Открытка добавлена в избранное!')
	} catch (error) {
		console.error('Ошибка при добавлении в избранное:', error)
		showMessage('Ошибка при добавлении')
	}
}

async function saveImage() {
	try {
		const blob = await toBlob()
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'greeting-card.png'
		a.click()
		URL.revokeObjectURL(url)
		showMessage('Изображение сохранено!')
	} catch (error) {
		showMessage('Ошибка при сохранении')
	}
}

async function sendCard() {
	try {
		const blob = await toBlob()

		if (window.Telegram?.WebApp) {
			// Отправляем изображение на backend
			const formData = new FormData()
			formData.append('file', blob, 'greeting-card.png')

			const uploadResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/upload`,
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!uploadResponse.ok) {
				throw new Error('Failed to upload image')
			}

			const { id: imageId } = await uploadResponse.json()

			// Отправляем метаданные через sendData
			window.Telegram.WebApp.sendData(
				JSON.stringify({
					type: 'send_greeting',
					image_id: imageId,
					text: customText.value,
					timestamp: Date.now(),
					user_id: window.Telegram.WebApp.initDataUnsafe?.user?.id,
				})
			)

			showMessage('Открытка отправлена!')
		} else {
			// Для обычного браузера - скачиваем
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'greeting-card.png'
			a.click()
			URL.revokeObjectURL(url)
			showMessage('Открытка скачана!')
		}
	} catch (error) {
		console.error('Ошибка отправки:', error)
		showMessage('Ошибка при отправке')
	}
}

function showMessage(text) {
	message.value = text
	setTimeout(() => (message.value = ''), 2500)
}

function goBack() {
	router.back()
}

watch(
	[
		selectedImage,
		selectedFrame,
		selectedTextStyle,
		customText,
		fontSize,
		textPosition,
		textColor,
		textOutline,
	],
	async () => {
		if (!selectedImage.value) return
		await draw({
			imageSrc: selectedImage.value.src,
			text: customText.value,
			textStyle: {
				...textStyles[selectedTextStyle.value],
				color: textColor.value,
				outline: textOutline.value,
			},
			frame: frames[selectedFrame.value],
			fontSize: fontSize.value,
			textPosition: textPosition.value,
		})
	},
	{ deep: true }
)

onMounted(async () => {
	// Загрузка настроек из избранного
	if (route.query.fromFavorites) {
		customText.value = route.query.text || ''
		fontSize.value = Number(route.query.fontSize) || 40
		selectedTextStyle.value = route.query.textStyle || 'classic'
		selectedFrame.value = route.query.frame || 'none'
		textPosition.value = route.query.textPosition || 'bottom'
		textColor.value = route.query.textColor || '#FFFFFF'
		textOutline.value = route.query.textOutline === 'true'
	}

	if (availableImages.value.length || route.query.fromFavorites) {
		// Выбор изображения: из избранного или первое
		if (route.query.imageId) {
			selectedImage.value =
				availableImages.value.find(img => img.id === route.query.imageId) ||
				images.find(img => img.id === route.query.imageId) ||
				availableImages.value[0] ||
				images[0]
		} else {
			selectedImage.value = availableImages.value[0] || images[0]
		}
		await draw({
			imageSrc: selectedImage.value.src,
			text: customText.value,
			textStyle: {
				...textStyles[selectedTextStyle.value],
				color: textColor.value,
				outline: textOutline.value,
			},
			frame: frames[selectedFrame.value],
			fontSize: fontSize.value,
			textPosition: textPosition.value,
		})
	}
})
</script>
