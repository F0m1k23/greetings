<template>
	<div class="min-h-screen bg-gray-900 text-gray-100">
		<div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
			<!-- Назад -->
			<button class="text-gray-400 hover:text-gray-200" @click="$router.back()">
				← Назад
			</button>

			<!-- Заголовок -->
			<div class="text-center">
				<h1 class="text-2xl font-bold">Создать открытку</h1>
				<p class="text-sm text-gray-400">Выберите текст, стиль и рамку</p>
			</div>

			<!-- Canvas -->
			<div class="flex justify-center">
				<canvas
					ref="canvasRef"
					:width="canvasWidth"
					:height="canvasHeight"
					class="rounded-lg border border-gray-700 shadow-lg w-full max-w-md"
				/>
			</div>

			<!-- Готовые тексты -->
			<div class="space-y-1">
				<label class="text-sm text-gray-300"> Готовый текст </label>

				<select
					v-model="selectedPresetText"
					class="w-full p-2 rounded bg-gray-800 border border-gray-700"
				>
					<option value="" disabled>Выберите вариант</option>

					<option
						v-for="(preset, index) in presetTexts"
						:key="index"
						:value="preset"
					>
						{{ preset.slice(0, 60) }}...
					</option>
				</select>
			</div>

			<!-- Редактирование текста -->
			<div class="space-y-1">
				<label class="text-sm text-gray-300"> Текст открытки </label>

				<textarea
					v-model="text"
					rows="3"
					class="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-gray-500"
					placeholder="Введите текст или выберите готовый"
				/>
			</div>

			<!-- Размер текста -->
			<div class="space-y-1">
				<label class="text-sm text-gray-300">
					Размер текста: {{ fontSize }}px
				</label>

				<input
					v-model.number="fontSize"
					type="range"
					min="20"
					max="60"
					class="w-full"
				/>
			</div>

			<!-- Стиль текста -->
			<div class="space-y-1">
				<label class="text-sm text-gray-300"> Стиль текста </label>

				<select
					v-model="selectedStyle"
					class="w-full p-2 rounded bg-gray-800 border border-gray-700"
				>
					<option v-for="(style, key) in textStyles" :key="key" :value="key">
						{{ style.label }}
					</option>
				</select>
			</div>

			<!-- Рамка -->
			<div class="space-y-1">
				<label class="text-sm text-gray-300"> Рамка </label>

				<select
					v-model="selectedFrame"
					class="w-full p-2 rounded bg-gray-800 border border-gray-700"
				>
					<option v-for="(frame, key) in frames" :key="key" :value="key">
						{{ frame.label }}
					</option>
				</select>
			</div>

			<!-- Кнопка -->
			<button
				@click="sendGreeting"
				:disabled="!text.trim()"
				class="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
			>
				Отправить открытку
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import images from '@/data/images'
import texts from '@/data/texts'
import { textStyles } from '@/data/textStyles'
import { frames } from '@/data/frames'
import { useGreetingCanvas } from '@/composables/useGreetingCanvas'

/* =====================
   Базовые данные
===================== */
const route = useRoute()
const canvasRef = ref(null)

const canvasWidth = 400
const canvasHeight = 600

const image = ref(null)

const text = ref('')
const selectedPresetText = ref('')

const fontSize = ref(32)
const selectedStyle = ref('classic')
const selectedFrame = ref('none')

/* =====================
   Canvas
===================== */
const { draw, toBlob } = useGreetingCanvas(canvasRef, canvasWidth, canvasHeight)

/* =====================
   Готовые тексты
===================== */
const presetTexts = computed(() => {
	if (!image.value) return []
	return texts[image.value.categoryId] || []
})

/* =====================
   Инициализация
===================== */
onMounted(() => {
	const imageId = route.query.imageId
	image.value = images.find(img => img.id === imageId)

	if (!image.value) return

	if (presetTexts.value.length) {
		selectedPresetText.value = presetTexts.value[0]
		text.value = presetTexts.value[0]
	}

	render()
})

/* =====================
   Реакции
===================== */
watch([text, fontSize, selectedStyle, selectedFrame], render)

watch(selectedPresetText, value => {
	if (value) {
		text.value = value
	}
})

function render() {
	if (!image.value) return

	draw({
		imageSrc: image.value.src,
		text: text.value,
		textStyle: textStyles[selectedStyle.value],
		frame: frames[selectedFrame.value],
		fontSize: fontSize.value,
	})
}

/* =====================
   Отправка
===================== */
async function sendGreeting() {
	// 1. Берём PNG из canvas
	const blob = await toBlob()

	// 2. Готовим FormData
	const formData = new FormData()
	formData.append('image', blob, 'greeting.png')

	// 3. Отправляем на сервер
	const response = await fetch('https://bot-645s.onrender.com', {
		method: 'POST',
		body: formData,
	})

	const { imageId } = await response.json()

	// 4. Сообщаем боту, что картинка готова
	if (window.Telegram?.WebApp) {
		window.Telegram.WebApp.sendData(
			JSON.stringify({
				type: 'image_uploaded',
				imageId,
			})
		)
	} else {
		alert('Открытка создана (не в Telegram)')
	}
}
</script>
