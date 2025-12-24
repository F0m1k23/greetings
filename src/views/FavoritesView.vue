<script setup>
// Импорты Vue и данных
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'

// Инициализация composable для избранного
const { favoriteCards, removeCard } = useFavorites()
const router = useRouter()

// Сообщение
const message = ref('')

// Функция для удаления открытки из избранного
function removeFromFavorites(index) {
	removeCard(index)
	show('Удалено из избранного')
}

// Функция для редактирования открытки
function editCard(card) {
	router.push({
		name: 'editor',
		query: {
			holiday: card.holiday,
			text: card.text,
			fontSize: card.fontSize,
			textStyle: card.textStyle,
			frame: card.frame,
			textPosition: card.textPosition,
			textColor: card.textColor,
			textOutline: card.textOutline,
			imageId: card.imageId,
			fromFavorites: true,
		},
	})
}

function show(textMsg) {
	message.value = textMsg
	setTimeout(() => (message.value = ''), 2500)
}
</script>

<template>
	<!-- Страница избранных открыток -->
	<div
		class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
	>
		<div class="max-w-6xl mx-auto p-4 pb-24">
			<div class="flex items-center gap-4 mb-6">
				<button
					@click="$router.back()"
					class="text-gray-400 hover:text-white transition-colors"
				>
					<i class="fas fa-arrow-left text-xl"></i>
				</button>
				<div></div>
			</div>
			<!-- Заголовок -->
			<div class="text-center mb-8">
				<h1
					class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
				>
					Избранные открытки
				</h1>
				<p class="text-gray-400 text-lg">Ваши сохраненные дизайны</p>
			</div>

			<!-- Сетка избранных открыток -->
			<div
				v-if="favoriteCards.length"
				class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
			>
				<div
					v-for="(card, index) in favoriteCards"
					:key="index"
					class="relative rounded-lg overflow-hidden shadow-lg"
				>
					<!-- Миниатюра открытки -->
					<div
						class="aspect-[3/4] bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
						@click="editCard(card)"
					>
						<img
							v-if="card.image"
							:src="card.image"
							:alt="card.text"
							class="w-full h-full object-cover"
						/>
						<div v-else class="text-gray-400 text-sm text-center p-4">
							Изображение не найдено
						</div>
					</div>
					<!-- Кнопка удаления -->
					<div class="absolute top-2 right-2">
						<button
							@click="removeFromFavorites(index)"
							class="w-8 h-8 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors hover:bg-white/10 rounded-full"
							aria-label="Удалить из избранного"
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
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Сообщение, если избранное пусто -->
			<div v-else class="text-center py-16">
				<div class="text-6xl mb-4">💝</div>
				<h2 class="text-2xl font-semibold text-gray-300 mb-2">
					Избранное пусто
				</h2>
				<p class="text-gray-400 mb-6">
					Создайте и сохраните свою первую открытку
				</p>
				<router-link
					to="/"
					class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
				>
					<i class="fas fa-plus mr-2"></i>
					Создать открытку
				</router-link>
			</div>
		</div>

		<!-- Сообщение -->
		<div
			v-if="message"
			class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full text-white"
		>
			{{ message }}
		</div>
	</div>
</template>
