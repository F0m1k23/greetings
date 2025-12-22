<template>
	<div class="p-4 pb-24 flex flex-col gap-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<button @click="goBack" class="text-gray-500 text-sm">← Назад</button>

			<!-- Favorite -->
			<button
				v-if="image"
				@click="toggleFavorite(image.id)"
				:aria-pressed="isFavorite(image.id)"
				aria-label="Добавить в избранное"
				class="bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center transition hover:scale-105 active:scale-95"
			>
				<Star
					:class="[
						'w-5 h-5 transition-colors',
						isFavorite(image.id)
							? 'text-yellow-500 fill-yellow-500'
							: 'text-gray-500',
					]"
				/>
			</button>
		</div>

		<!-- Image with caption overlay -->
		<div class="flex-1 flex items-center justify-center">
			<Transition
				enter-from-class="opacity-0"
				enter-active-class="transition-opacity duration-150 ease-in-out"
				enter-to-class="opacity-100"
			>
				<div v-if="image" class="relative w-full">
					<img
						:src="image.url"
						:alt="`Greeting image #${image.id}`"
						class="max-h-[70vh] w-full object-contain rounded-xl bg-gray-100"
					/>

					<!-- Caption overlay -->
					<div
						class="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur text-white text-sm rounded-lg px-3 py-2"
					>
						{{ caption }}
					</div>
				</div>
			</Transition>
		</div>

		<!-- Change caption -->
		<button
			@click="showCaptionModal = true"
			class="self-center text-sm text-gray-500 underline underline-offset-4 hover:text-blue-600 transition"
		>
			Изменить текст
		</button>

		<!-- Actions -->
		<div class="flex flex-col gap-3">
			<button
				@click="sendToTelegram"
				class="w-full bg-blue-600 text-white rounded-xl py-3 font-medium active:scale-95 transition"
			>
				Отправить в Telegram
			</button>
		</div>
	</div>

	<!-- Caption modal -->
	<Transition name="fade">
		<div
			v-if="showCaptionModal"
			class="fixed inset-0 bg-black/30 flex items-end z-50"
			@click.self="showCaptionModal = false"
		>
			<div class="bg-white w-full rounded-t-2xl p-4">
				<h3 class="font-medium mb-4 text-center">
					Выберите текст поздравления
				</h3>

				<div class="space-y-4 max-h-[60vh] overflow-y-auto">
					<div v-for="(list, type) in captions" :key="type">
						<div class="text-xs text-gray-400 mb-2">
							{{ type }}
						</div>

						<div class="space-y-2">
							<button
								v-for="text in list"
								:key="text"
								@click="selectCaption(text)"
								class="block w-full text-left p-3 rounded-xl text-sm bg-gray-50 hover:bg-gray-100 active:scale-95 transition"
							>
								{{ text }}
							</button>
						</div>
					</div>
				</div>

				<button
					@click="showCaptionModal = false"
					class="mt-4 w-full text-center text-sm text-gray-400"
				>
					Закрыть
				</button>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star } from 'lucide-vue-next'

import { images } from '../data/images'
import { captions } from '../data/captions'

import { useFavorites } from '../composables/useFavorites'
import { useTelegram } from '../composables/useTelegram'
import { useCaption } from '../composables/useCaption'

const route = useRoute()
const router = useRouter()

const { sendPhoto } = useTelegram()
const { isFavorite, toggleFavorite } = useFavorites()
const { caption, setCaption } = useCaption()

const showCaptionModal = ref(false)

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

const { sendGreeting } = useTelegram()

const sendToTelegram = () => {
	if (!image.value) return

	sendGreeting({
		imageUrl: image.value.url,
		caption: caption.value,
	})
}

const goBack = () => router.back()
</script>
