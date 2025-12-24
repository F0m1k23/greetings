<template>
	<!-- Главная страница с категориями открыток -->
	<div class="p-5 max-w-4xl mx-auto pb-20 space-y-5">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold text-gray-100">Открытки</h1>
			<p class="text-gray-400 text-sm">
				Выберите категорию и добавляйте картинки в избранное
			</p>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			<PostCard
				v-for="card in cards"
				:key="card.id"
				:card="card"
				@select="openGallery"
			/>
		</div>
	</div>
</template>

<script setup>
// Импорты Vue и компонентов
import { useRouter } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
import cards from '@/data/cards'

// Инициализация роутера
const router = useRouter()

// Функция для открытия галереи выбранной категории
function openGallery(card) {
	router.push({ name: 'gallery', params: { id: card.id } })
}
</script>
