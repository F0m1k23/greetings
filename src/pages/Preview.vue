<template>
	<div class="min-h-screen bg-white p-6 pb-24 flex flex-col gap-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<button
				@click="goBack"
				class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
			>
				<ArrowLeft class="w-5 h-5" />
				<span class="text-sm font-medium">Назад</span>
			</button>

			<!-- Favorite -->
			<button
				v-if="image"
				@click="toggleFavorite(image.id)"
				:aria-pressed="isFavorite(image.id)"
				aria-label="Добавить в избранное"
				class="bg-yellow-100 rounded-full w-11 h-11 flex items-center justify-center transition hover:scale-110 active:scale-95"
			>
				<Star
					:class="[
						'w-6 h-6 transition-all duration-300',
						isFavorite(image.id)
							? 'text-yellow-500 fill-yellow-500'
							: 'text-yellow-400',
					]"
				/>
			</button>
		</div>

		<!-- Beautiful Image with decorative frame -->
		<div
			class="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full"
		>
			<Transition
				enter-from-class="opacity-0 scale-95"
				enter-active-class="transition-all duration-500 ease-out"
				enter-to-class="opacity-100 scale-100"
			>
				<div v-if="image" class="relative w-full">
					<div
						class="relative rounded-3xl overflow-hidden shadow-2xl"
						style="aspect-ratio: 9 / 11.25"
					>
						<img
							:src="image.url"
							:alt="`Greeting image #${image.id}`"
							class="w-full h-full object-cover"
						/>

						<!-- Beautiful Caption Overlay -->
						<div
							class="absolute inset-0 flex items-center justify-center pointer-events-none"
						>
							<div class="caption-glass p-8 rounded-2xl text-center max-w-xs">
								<div :style="captionCss" class="drop-shadow-lg">
									{{ caption }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-3 mt-4 max-w-4xl mx-auto w-full">
			<!-- Style selection -->
			<div class="flex gap-2 flex-wrap">
				<button
					@click="showTextStyleModal = true"
					class="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
				>
					<svg
						class="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
					Стиль текста
				</button>
				<button
					@click="showFontStyleModal = true"
					class="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20H6a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v4m4-4v8m0 0l-3-3m3 3l3-3"
						/>
					</svg>
					Шрифт
				</button>
			</div>

			<!-- Change caption -->
			<button
				@click="showCaptionModal = true"
				class="py-3 px-4 rounded-lg bg-blue-500 text-white font-medium transition-all hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
			>
				<Edit3 class="w-5 h-5" />
				Изменить текст
			</button>

			<!-- Send button -->
			<button
				@click="sendToTelegram"
				class="py-4 px-6 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold text-lg transition-all hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 w-full"
			>
				<Send class="w-6 h-6" />
				Отправить в Telegram
			</button>
		</div>

		<!-- Caption modal -->
		<Transition name="fade">
			<div
				v-if="showCaptionModal"
				class="fixed inset-0 bg-black/50 flex items-end z-50 backdrop-blur-sm"
				@click.self="showCaptionModal = false"
			>
				<div
					class="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
				>
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl font-bold text-gray-900">
							Выберите текст поздравления
						</h3>
						<button
							@click="showCaptionModal = false"
							class="text-gray-400 hover:text-gray-600 transition"
						>
							<X class="w-6 h-6" />
						</button>
					</div>

					<div class="space-y-4">
						<div v-for="(list, type) in captions" :key="type">
							<div
								class="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider"
							>
								{{ type }}
							</div>

							<div class="space-y-2">
								<button
									v-for="text in list"
									:key="text"
									@click="selectCaption(text)"
									class="block w-full text-left p-4 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 active:scale-95 transition border border-gray-200"
								>
									{{ text }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Text Style Modal -->
		<Transition name="fade">
			<div
				v-if="showTextStyleModal"
				class="fixed inset-0 bg-black/50 flex items-end z-50 backdrop-blur-sm"
				@click.self="showTextStyleModal = false"
			>
				<div
					class="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
				>
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl font-bold text-gray-900">
							<span class="inline-flex items-center gap-2">
								<svg
									class="w-6 h-6 text-purple-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 21H4a2 2 0 01-2-2V9.414a1 1 0 00-.293-.707l5.414-5.414a1 1 0 011.414 0L17 9.414a1 1 0 00.293.707V19a2 2 0 01-2 2h-3"
									/>
								</svg>
								Выберите стиль текста
							</span>
						</h3>
						<button
							@click="showTextStyleModal = false"
							class="text-gray-400 hover:text-gray-600 transition"
						>
							<X class="w-6 h-6" />
						</button>
					</div>

					<div class="space-y-3">
						<button
							v-for="(style, key) in TEXT_STYLES"
							:key="key"
							@click="setTextStyle(key); showTextStyleModal = false"
							class="block w-full p-4 rounded-lg text-left text-sm font-medium transition border-2"
							:class="[
								textStyle === key
									? 'border-purple-500 bg-purple-50'
									: 'border-gray-200 bg-gray-50 hover:border-purple-300',
							]"
						>
							<div class="flex items-center gap-3">
								<div class="text-3xl">{{ getIconEmoji(style.icon) }}</div>
								<div>
									<div class="font-bold text-gray-900">{{ style.name }}</div>
									<div class="text-xs text-gray-500">Premium стиль</div>
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Font Style Modal -->
		<Transition name="fade">
			<div
				v-if="showFontStyleModal"
				class="fixed inset-0 bg-black/50 flex items-end z-50 backdrop-blur-sm"
				@click.self="showFontStyleModal = false"
			>
				<div
					class="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
				>
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl font-bold text-gray-900">
							<span class="inline-flex items-center gap-2">
								<svg
									class="w-6 h-6 text-blue-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 20c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM11 3h8a1 1 0 011 1v12a1 1 0 01-1 1h-8a1 1 0 01-1-1V4a1 1 0 011-1zM3 14h8"
									/>
								</svg>
								Выберите шрифт
							</span>
						</h3>
						<button
							@click="showFontStyleModal = false"
							class="text-gray-400 hover:text-gray-600 transition"
						>
							<X class="w-6 h-6" />
						</button>
					</div>

					<div class="space-y-3">
						<button
							v-for="(font, key) in FONT_STYLES"
							:key="key"
							@click="setFontStyle(key); showFontStyleModal = false"
							class="block w-full p-4 rounded-lg text-left text-sm font-medium transition border-2"
							:class="[
								fontStyle === key
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 bg-gray-50 hover:border-blue-300',
							]"
						>
							<div class="font-bold text-gray-900">{{ font.name }}</div>
							<div class="text-xs text-gray-500 mt-1">
								Пример текста поздравления
							</div>
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, ArrowLeft, Edit3, Send, X } from 'lucide-vue-next'

import { images } from '../data/images'
import { captions } from '../data/captions'

import { useFavorites } from '../composables/useFavorites'
import { useTelegram } from '../composables/useTelegram'
import { useCaption } from '../composables/useCaption'
import {
	useTextStyle,
	TEXT_STYLES,
	FONT_STYLES,
} from '../composables/useTextStyle'

const route = useRoute()
const router = useRouter()

const { isFavorite, toggleFavorite } = useFavorites()
const { caption, setCaption } = useCaption()
const { textStyle, fontStyle, setTextStyle, setFontStyle } = useTextStyle()

const captionCss = computed(() => {
	const s = TEXT_STYLES[textStyle.value] || TEXT_STYLES.white
	const f = FONT_STYLES[fontStyle.value] || FONT_STYLES.bold

	// base style
	const css = {
		font: f.font || 'bold 48px Arial, sans-serif',
		lineHeight: '1.15',
		textAlign: 'center',
		padding: '0 4px',
	}

	if (s.color === 'gradient') {
		css.background =
			'linear-gradient(90deg, #ff4d4d, #ffb84d, #ffee4d, #8cff4d, #4ddcff, #9b4dff)'
		css.WebkitBackgroundClip = 'text'
		css.backgroundClip = 'text'
		css.color = 'transparent'
	} else {
		css.color = s.color
	}

	return css
})

const showCaptionModal = ref(false)
const showTextStyleModal = ref(false)
const showFontStyleModal = ref(false)

const imageId = Number(route.query.id)
const image = computed(() => images.find(img => img.id === imageId))

// Автоподстановка подписи
onMounted(() => {
	if (!caption.value) {
		setCaption(captions['Тёплые'][0])
	}
})

const selectCaption = text => {
	setCaption(text)
	showCaptionModal.value = false
}

const getIconEmoji = iconName => {
	const iconMap = {
		Sparkles: '✨',
		Zap: '⚡',
		Palette: '🎨',
		Heart: '❤️',
	}
	return iconMap[iconName] || '✨'
}

const { sendGreeting } = useTelegram()

const sendToTelegram = () => {
	if (!image.value) return

	sendGreeting({
		imageUrl: image.value.url,
		caption: caption.value,
		textStyle: textStyle.value,
		fontStyle: fontStyle.value,
	})
}

const goBack = () => router.back()
</script>
